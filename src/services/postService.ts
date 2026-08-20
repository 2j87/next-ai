import type { Post, SearchQuery, SummaryReference, SummaryResult } from '../types';
import { rankPosts } from './ranking';

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

function wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
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

export async function generateSummary(query: SearchQuery, posts: Post[]): Promise<SummaryResult> {
    await wait(800);

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

    const marks = references.map((ref) => `[${ref.number}]`).join('');
    const text = `"${query.keyword}" konusuyla ilgili ${posts.length} gönderi bulundu ${marks}. Özet çıkarma özelliği yakında eklenecek, şimdilik gönderiler bulundukları sırayla listeleniyor.`;

    return { text, references, posts };
}
