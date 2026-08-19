import type { HistoryEntry, SearchQuery } from '../types';

const STORAGE_KEY = 'nextai-search-history';

export function getHistory(): HistoryEntry[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as HistoryEntry[];
  } catch {
    return [];
  }
}

export function addHistoryEntry(query: SearchQuery): void {
  const entry: HistoryEntry = {
    id: crypto.randomUUID(),
    query,
    searchedAt: new Date().toISOString(),
  };

  const updated = [entry, ...getHistory()].slice(0, 20);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}
