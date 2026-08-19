import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HistoryList from '../components/HistoryList';
import { clearHistory, deleteHistoryEntry, getHistory } from '../services/historyService';
import type { HistoryEntry } from '../types';
import styles from './History.module.css';

function History() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<HistoryEntry[]>(() => getHistory());

  function handleSelect(entry: HistoryEntry) {
    const params = new URLSearchParams({
      keyword: entry.query.keyword,
      timeRange: entry.query.timeRange,
    });
    if (entry.query.startDate) params.set('startDate', entry.query.startDate);
    if (entry.query.endDate) params.set('endDate', entry.query.endDate);

    navigate(`/sonuclar?${params.toString()}`);
  }

  function handleDelete(id: string) {
    deleteHistoryEntry(id);
    setEntries(getHistory());
  }

  function handleClearAll() {
    clearHistory();
    setEntries([]);
  }

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Geçmiş</h1>
        {entries.length > 0 && (
          <button
            type="button"
            className={styles.clearButton}
            onClick={handleClearAll}
            aria-label="Tüm arama geçmişini temizle"
          >
            <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: '18px' }}>
              delete_sweep
            </span>
            Tümünü Temizle
          </button>
        )}
      </div>
      <HistoryList entries={entries} onSelect={handleSelect} onDelete={handleDelete} />
    </main>
  );
}

export default History;
