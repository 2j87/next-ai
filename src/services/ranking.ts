import type { Post } from '../types';

const MIN_MEANINGFUL_WORDS = 8;
const BM25_K1 = 1.5;
const BM25_B = 0.75;

function turkishLower(text: string): string {
    return text.replace(/İ/g, 'i').replace(/I/g, 'ı').toLowerCase();
}

function stripUrls(text: string): string {
    return text.replace(/https?:\/\/\S+/g, ' ');
}

function stripHashtagsAndMentions(text: string): string {
    return text.replace(/[#@]\S+/g, ' ');
}

function tokenize(text: string): string[] {
    return turkishLower(stripUrls(text)).match(/[\p{L}\p{N}]+/gu) ?? [];
}

// A syndicated headline ("X gençleri – Erdoğan X gençlerine" + link) can be
// long enough in characters to pass a length check while still being just a
// title fragment with no real sentence. Counting actual words left after
// stripping urls/hashtags catches these even when the char count looks fine.
function meaningfulWordCount(content: string): number {
    return tokenize(stripHashtagsAndMentions(content)).length;
}

function coarseFilter(posts: Post[], queryTokens: string[]): Post[] {
    const queryTermSet = new Set(queryTokens);

    return posts.filter((post) => {
        if (meaningfulWordCount(post.content) < MIN_MEANINGFUL_WORDS) return false;
        return tokenize(post.content).some((token) => queryTermSet.has(token));
    });
}

interface ScoredPost {
    post: Post;
    score: number;
}

function bm25Rank(posts: Post[], queryTokens: string[]): ScoredPost[] {
    const docs = posts.map((post) => tokenize(post.content));
    const docLengths = docs.map((tokens) => tokens.length);
    const avgDocLength = docLengths.reduce((sum, len) => sum + len, 0) / (docs.length || 1);
    const totalDocs = docs.length;

    const docFrequency = new Map<string, number>();
    for (const term of new Set(queryTokens)) {
        const count = docs.filter((tokens) => tokens.includes(term)).length;
        docFrequency.set(term, count);
    }

    return posts
        .map((post, index) => {
            const tokens = docs[index];
            const docLength = docLengths[index];
            let score = 0;

            for (const term of queryTokens) {
                const df = docFrequency.get(term) ?? 0;
                if (df === 0) continue;

                const idf = Math.log((totalDocs - df + 0.5) / (df + 0.5) + 1);
                const termFrequency = tokens.filter((token) => token === term).length;
                const numerator = termFrequency * (BM25_K1 + 1);
                const denominator = termFrequency + BM25_K1 * (1 - BM25_B + (BM25_B * docLength) / avgDocLength);
                score += idf * (numerator / denominator);
            }

            return { post, score };
        })
        .sort((a, b) => b.score - a.score);
}

const MAX_PER_ACCOUNT = 2;

// A single automated news account can flood the results with near-identical
// posts that all score well (they repeat the keyword in every headline).
// Capping how many posts from one account can appear keeps the source list
// diverse instead of letting one bot account take every slot.
function withAccountDiversity(ranked: ScoredPost[], limit: number): Post[] {
    const perAccountCount = new Map<string, number>();
    const selected: Post[] = [];

    for (const { post } of ranked) {
        const count = perAccountCount.get(post.username) ?? 0;
        if (count >= MAX_PER_ACCOUNT) continue;

        selected.push(post);
        perAccountCount.set(post.username, count + 1);
        if (selected.length >= limit) break;
    }

    return selected;
}

export function rankPosts(posts: Post[], keyword: string, limit = 8): Post[] {
    const queryTokens = tokenize(keyword);
    if (queryTokens.length === 0 || posts.length === 0) {
        return posts.slice(0, limit);
    }

    const filtered = coarseFilter(posts, queryTokens);
    const candidates = filtered.length > 0 ? filtered : posts;

    const ranked = bm25Rank(candidates, queryTokens);
    return withAccountDiversity(ranked, limit);
}
