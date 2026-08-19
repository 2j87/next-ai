import type { Post, SearchQuery, SummaryReference, SummaryResult } from '../types';

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

function toHashtag(keyword: string): string {
  return keyword
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[^\p{L}\p{N}]/gu, '');
}

function stripHtml(html: string): string {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent?.trim() || '(içerik yok)';
}

export async function fetchRelevantPosts(query: SearchQuery): Promise<Post[]> {
  const hashtag = toHashtag(query.keyword);
  if (!hashtag) return [];

  const response = await fetch(`${HASHTAG_TIMELINE_URL}/${encodeURIComponent(hashtag)}?limit=10`);
  if (!response.ok) {
    throw new Error('Gönderiler alınamadı');
  }

  const statuses: MastodonStatus[] = await response.json();

  return statuses.map((status) => ({
    id: status.id,
    username: `@${status.account.username}`,
    content: stripHtml(status.content),
    timestamp: status.created_at,
    isVerified: status.account.fields.some((field) => field.verified_at !== null),
    url: status.url,
  }));
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
