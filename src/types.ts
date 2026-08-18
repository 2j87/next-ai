export interface Post {
  id: string;
  username: string;
  content: string;
  timestamp: string;
  isVerified: boolean;
  url: string;
}

export type TimeRangeOption = 'today' | '3days' | 'week' | 'custom';

export interface SearchQuery {
  keyword: string;
  timeRange: TimeRangeOption;
  startDate?: string;
  endDate?: string;
}

export interface SummaryReference {
  number: number;
  postId: string;
}

export interface SummaryResult {
  text: string;
  references: SummaryReference[];
  posts: Post[];
}

export interface HistoryEntry {
  id: string;
  query: SearchQuery;
  searchedAt: string;
}
