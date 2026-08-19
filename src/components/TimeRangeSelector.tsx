import type { TimeRangeOption } from '../types';
import styles from './TimeRangeSelector.module.css';

interface TimeRangeSelectorProps {
  value: TimeRangeOption;
  onChange: (value: TimeRangeOption) => void;
  startDate: string;
  endDate: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
}

const options: { value: TimeRangeOption; label: string }[] = [
  { value: 'today', label: 'Bugün' },
  { value: '3days', label: 'Son 3 Gün' },
  { value: 'week', label: 'Son 1 Hafta' },
  { value: 'custom', label: 'Özel Tarih Aralığı' },
];

function TimeRangeSelector({
  value,
  onChange,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: TimeRangeSelectorProps) {
  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.legend}>Zaman aralığı</legend>
      <div className={styles.options}>
        {options.map((option) => (
          <label key={option.value} className={styles.option}>
            <input
              type="radio"
              name="time-range"
              className={styles.radio}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
            />
            {option.label}
          </label>
        ))}
      </div>

      {value === 'custom' && (
        <div className={styles.customRange}>
          <div className={styles.dateField}>
            <label htmlFor="start-date">Başlangıç</label>
            <input
              id="start-date"
              type="date"
              className={styles.dateInput}
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              aria-label="Başlangıç tarihi"
            />
          </div>
          <div className={styles.dateField}>
            <label htmlFor="end-date">Bitiş</label>
            <input
              id="end-date"
              type="date"
              className={styles.dateInput}
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              aria-label="Bitiş tarihi"
            />
          </div>
        </div>
      )}
    </fieldset>
  );
}

export default TimeRangeSelector;
