import { TIME_RANGE_LABELS, type HistoryEntry } from '../types';
import styles from './HistoryList.module.css';

interface HistoryListProps {
    entries: HistoryEntry[];
    onSelect: (entry: HistoryEntry) => void;
    onDelete: (id: string) => void;
}

function HistoryList({ entries, onSelect, onDelete }: HistoryListProps) {
    if (entries.length === 0) {
        return <p className={styles.empty}>Henüz bir arama geçmişin yok.</p>;
    }

    return (
        <ul className={styles.list}>
            {entries.map((entry) => (
                <li key={entry.id} className={styles.item}>
                    <button
                        type="button"
                        className={styles.itemButton}
                        onClick={() => onSelect(entry)}
                        aria-label={`"${entry.query.keyword}" aramasını tekrar yap`}
                    >
                        <span className={styles.icon} aria-hidden="true">
                            <span className="material-symbols-outlined">history</span>
                        </span>
                        <span className={styles.text}>
                            <span className={styles.keyword}>
                                {entry.query.keyword || '(anahtar kelime yok)'}
                            </span>
                            <span className={styles.meta}>
                                {TIME_RANGE_LABELS[entry.query.timeRange]} ·{' '}
                                {new Date(entry.searchedAt).toLocaleString('tr-TR')}
                            </span>
                        </span>
                    </button>
                    <button
                        type="button"
                        className={styles.deleteButton}
                        onClick={() => onDelete(entry.id)}
                        aria-label={`"${entry.query.keyword}" kaydını sil`}
                    >
                        <span className="material-symbols-outlined" aria-hidden="true">
                            delete
                        </span>
                    </button>
                </li>
            ))}
        </ul>
    );
}

export default HistoryList;
