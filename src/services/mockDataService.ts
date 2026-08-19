import mockPosts from '../data/mockPosts.json';
import mockSummary from '../data/mockSummary.json';
import type { Post, SearchQuery, SummaryResult } from '../types';

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchRelevantPosts(_query: SearchQuery): Promise<Post[]> {
  await wait(1200);

  const referencedIds = mockSummary.references.map((ref) => ref.postId);
  return mockPosts.filter((post) => referencedIds.includes(post.id));
}

export async function generateSummary(_query: SearchQuery): Promise<SummaryResult> {
  await wait(1500);

  const referencedIds = mockSummary.references.map((ref) => ref.postId);
  const posts = mockPosts.filter((post) => referencedIds.includes(post.id));

  return {
    text: mockSummary.text,
    references: mockSummary.references,
    posts,
  };
}
