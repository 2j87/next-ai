import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import TimeRangeSelector from '../components/TimeRangeSelector';
import type { TimeRangeOption } from '../types';

function Home() {
  const [keyword, setKeyword] = useState('');
  const [timeRange, setTimeRange] = useState<TimeRangeOption>('today');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const navigate = useNavigate();

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const params = new URLSearchParams({ keyword, timeRange });
    if (timeRange === 'custom') {
      params.set('startDate', startDate);
      params.set('endDate', endDate);
    }

    navigate(`/sonuclar?${params.toString()}`);
  }

  return (
    <main>
      <h1>NextAI</h1>
      <form onSubmit={handleSubmit}>
        <SearchBar value={keyword} onChange={setKeyword} />
        <TimeRangeSelector
          value={timeRange}
          onChange={setTimeRange}
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />
        <button type="submit">Ara</button>
      </form>
    </main>
  );
}

export default Home;
