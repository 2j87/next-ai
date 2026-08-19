import { useNavigate } from 'react-router-dom';
import HistoryList from '../components/HistoryList';
import { getHistory } from '../services/historyService';
import type { HistoryEntry } from '../types';
import styles from './History.module.css';

function History() {
  const navigate = useNavigate();
  const entries = getHistory();

  function handleSelect(entry: HistoryEntry) {
    const params = new URLSearchParams({
      keyword: entry.query.keyword,
      timeRange: entry.query.timeRange,
    });
    if (entry.query.startDate) params.set('startDate', entry.query.startDate);
    if (entry.query.endDate) params.set('endDate', entry.query.endDate);

    navigate(`/sonuclar?${params.toString()}`);
  }

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Geçmiş</h1>
      <HistoryList entries={entries} onSelect={handleSelect} />
    </main>
  );
}

export default History;
