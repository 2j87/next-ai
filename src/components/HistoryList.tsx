import type { HistoryEntry } from '../types';
import styles from './HistoryList.module.css';

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
    return <p className={styles.empty}>Henüz bir arama geçmişin yok.</p>;
  }

  return (
    <ul className={styles.list}>
      {entries.map((entry) => (
        <li key={entry.id} className={styles.item}>
          <button
            type="button"
            className={styles.button}
            onClick={() => onSelect(entry)}
            aria-label={`"${entry.query.keyword}" aramasını tekrar yap`}
          >
            <span className={styles.keyword}>
              {entry.query.keyword || '(anahtar kelime yok)'}
            </span>
            <span className={styles.meta}>
              {timeRangeLabels[entry.query.timeRange]} ·{' '}
              {new Date(entry.searchedAt).toLocaleString('tr-TR')}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}

export default HistoryList;
