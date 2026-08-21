import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import SearchBar from '../components/SearchBar';
import TimeRangeSelector from '../components/TimeRangeSelector';
import { addHistoryEntry } from '../services/historyService';
import type { SearchQuery, TimeRangeOption } from '../types';
import styles from './Home.module.css';

function Home() {
    const [keyword, setKeyword] = useState('');
    const [timeRange, setTimeRange] = useState<TimeRangeOption>('today');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const navigate = useNavigate();

    function handleSubmit(event: FormEvent) {
        event.preventDefault();

        const query: SearchQuery = { keyword, timeRange };
        if (timeRange === 'custom') {
            query.startDate = startDate;
            query.endDate = endDate;
        }

        addHistoryEntry(query);

        const params = new URLSearchParams({ keyword, timeRange });
        if (timeRange === 'custom') {
            params.set('startDate', startDate);
            params.set('endDate', endDate);
        }

        navigate(`/sonuclar?${params.toString()}`);
    }

    return (
        <main className={styles.page}>
            <div className={styles.hero}>
                <Logo className={styles.heroLogo} />
                <p className={styles.tagline}>Gündemi yakala</p>
            </div>

            <form className={styles.panel} onSubmit={handleSubmit}>
                <SearchBar value={keyword} onChange={setKeyword} />
                <TimeRangeSelector
                    value={timeRange}
                    onChange={setTimeRange}
                    startDate={startDate}
                    endDate={endDate}
                    onStartDateChange={setStartDate}
                    onEndDateChange={setEndDate}
                />
                <p className={styles.footerNote}>
                    NextAI, yalnızca gerçek sosyal paylaşımlarını kaynak alır
                </p>
            </form>
        </main>
    );
}

export default Home;
