import type { Post, SearchQuery, SummaryReference, SummaryResult } from '../types';
import { buildLlmInput } from './llmInput';
import { rankPosts } from './ranking';
import { toAsciiLower } from './textUtils';

const HASHTAG_TIMELINE_URL = 'https://mastodon.social/api/v1/timelines/tag';

interface MastodonAccountField {
    verified_at: string | null;
}

interface MastodonStatus {
    id: string;
    content: string;
    created_at: string;
    url: string;
    account: {
        username: string;
        fields: MastodonAccountField[];
    };
}

function toHashtag(word: string): string {
    return word
        .trim()
        .toLowerCase()
        .replace(/[^\p{L}\p{N}]/gu, '');
}

function hashtagCandidates(keyword: string): string[] {
    const words = keyword.trim().split(/\s+/).filter(Boolean);
    const whole = toHashtag(words.join(''));
    const individual = words.map(toHashtag).filter(Boolean);

    const candidates = [whole, ...individual].filter(Boolean);
    return Array.from(new Set(candidates)).slice(0, 5);
}

function stripHtml(html: string): string {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent?.trim() || '(içerik yok)';
}

function toPost(status: MastodonStatus): Post {
    return {
        id: status.id,
        username: `@${status.account.username}`,
        content: stripHtml(status.content),
        timestamp: status.created_at,
        isVerified: status.account.fields.some((field) => field.verified_at !== null),
        url: status.url,
    };
}

async function fetchHashtagTimeline(hashtag: string): Promise<Post[]> {
    const response = await fetch(`${HASHTAG_TIMELINE_URL}/${encodeURIComponent(hashtag)}?limit=40`);
    if (!response.ok) return [];

    const statuses: MastodonStatus[] = await response.json();
    return statuses.map(toPost);
}

function isSameCalendarDay(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isWithinTimeRange(post: Post, query: SearchQuery): boolean {
    const postDate = new Date(post.timestamp);
    const now = new Date();

    if (query.timeRange === 'custom') {
        if (!query.startDate || !query.endDate) return true;
        const start = new Date(query.startDate);
        const end = new Date(query.endDate);
        end.setHours(23, 59, 59, 999);
        return postDate >= start && postDate <= end;
    }

    if (query.timeRange === 'today') {
        return isSameCalendarDay(postDate, now);
    }

    const rangeDays = query.timeRange === '3days' ? 3 : 7;
    const cutoff = new Date(now);
    cutoff.setDate(cutoff.getDate() - rangeDays);
    return postDate >= cutoff;
}

export async function fetchRelevantPosts(query: SearchQuery): Promise<Post[]> {
    const candidates = hashtagCandidates(query.keyword);
    if (candidates.length === 0) return [];

    const results = await Promise.allSettled(candidates.map(fetchHashtagTimeline));

    if (results.every((result) => result.status === 'rejected')) {
        throw new Error('Gönderiler alınamadı');
    }

    const seen = new Set<string>();
    const merged: Post[] = [];

    for (const result of results) {
        if (result.status !== 'fulfilled') continue;
        for (const post of result.value) {
            if (seen.has(post.id)) continue;
            seen.add(post.id);
            merged.push(post);
        }
    }

    const withinRange = merged.filter((post) => isWithinTimeRange(post, query));
    return rankPosts(withinRange, query.keyword, 8);
}

function slugifyKeyword(keyword: string): string {
    return toAsciiLower(keyword)
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 60);
}

// Saves the normalized document the summarization LLM will read once real
// AI summarization replaces the placeholder text below, via the dev-server-
// only /api/save-llm-input endpoint (see vite.config.ts). Runs for every
// search, including zero-result ones, so the saved files reliably mirror
// what was searched. Failing silently keeps this from breaking the summary
// flow in production, where the endpoint doesn't exist.
async function saveLlmInput(query: SearchQuery, posts: Post[]): Promise<void> {
    const llmInput = posts.length > 0 ? buildLlmInput(posts) : '(gönderi bulunamadı)';
    const slug = slugifyKeyword(query.keyword);

    try {
        const response = await fetch(`/api/save-llm-input?keyword=${encodeURIComponent(slug)}`, {
            method: 'POST',
            body: llmInput,
        });
        if (response.ok) {
            const { path } = await response.json();
            console.info('[llmInput] saved to', path);
        }
    } catch {
        // Dev server not running this middleware (e.g. production build).
    }
}

// akasha-core is fine-tuned on "User: ...\nAssistant:"-shaped conversations
// (see github.com/superroket169/akasha-core/src/main.rs) - the summarization instruction has to be
// framed the same way for the model to recognize it as a turn to respond to.
// English, not Turkish: there's no Turkish fine-tuning data yet, so an
// English instruction matches its training distribution better.
//
// NOTE: akasha-core's context window is 512 tokens total (prompt +
// generation). main.rs truncates an over-long prompt from the front rather
// than failing, but that means when a search returns many/long posts, most
// of buildLlmInput's content never reaches the model at all - only the
// last ~300 tokens survive.
// map-reduce/hierarchical summarization (summarize posts individually or in
// small batches, then summarize those summaries)
function buildSummaryPrompt(llmInput: string): string {
    return `User: Summarize the following posts briefly:\n\n${llmInput}\nAssistant:`;
}

async function requestLlmSummary(llmInput: string): Promise<string> {
    const response = await fetch('/api/llm-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: buildSummaryPrompt(llmInput) }),
    });

    if (!response.ok) {
        throw new Error('Özet oluşturulamadı');
    }

    const { text } = await response.json();
    return text;
}

export async function generateSummary(query: SearchQuery, posts: Post[]): Promise<SummaryResult> {
    await saveLlmInput(query, posts);

    if (posts.length === 0) {
        return {
            text: `"${query.keyword}" ile ilgili gönderi bulunamadı.`,
            references: [],
            posts: [],
        };
    }

    const references: SummaryReference[] = posts.map((post, index) => ({
        number: index + 1,
        postId: post.id,
    }));

    const text = await requestLlmSummary(buildLlmInput(posts));

    return { text, references, posts };
}
