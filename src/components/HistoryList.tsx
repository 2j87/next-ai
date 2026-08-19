import type { HistoryEntry } from '../types';

interface HistoryListProps {
  entries: HistoryEntry[];
  onSelect: (entry: HistoryEntry) => void;
}

const timeRangeLabels: Record<string, string> = {
  today: 'Bugün',
  '3days': 'Son 3 Gün',
  week: 'Son 1 Hafta',
  custom: 'Özel Tarih Aralığı',
};

function HistoryList({ entries, onSelect }: HistoryListProps) {
  if (entries.length === 0) {
    return <p>Henüz bir arama geçmişin yok.</p>;
  }

  return (
    <ul>
      {entries.map((entry) => (
        <li key={entry.id}>
          <button
            type="button"
            onClick={() => onSelect(entry)}
            aria-label={`"${entry.query.keyword}" aramasını tekrar yap`}
          >
            <span>{entry.query.keyword || '(anahtar kelime yok)'}</span>
            <span>{timeRangeLabels[entry.query.timeRange]}</span>
            <span>{new Date(entry.searchedAt).toLocaleString('tr-TR')}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

export default HistoryList;
