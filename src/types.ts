export interface Post {
  id: string;
  username: string;
  content: string;
  timestamp: string;
  isVerified: boolean;
  url: string;
}

export type TimeRangeOption = 'today' | '3days' | 'week' | 'custom';

export const TIME_RANGE_LABELS: Record<TimeRangeOption, string> = {
  today: 'Bugün',
  '3days': 'Son 3 Gün',
  week: 'Son 1 Hafta',
  custom: 'Özel Tarih Aralığı',
};

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
