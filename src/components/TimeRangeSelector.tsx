import type { TimeRangeOption } from '../types';

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
    <fieldset>
      <legend>Zaman aralığı</legend>
      {options.map((option) => (
        <label key={option.value}>
          <input
            type="radio"
            name="time-range"
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
          />
          {option.label}
        </label>
      ))}

      {value === 'custom' && (
        <div>
          <label htmlFor="start-date">Başlangıç</label>
          <input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            aria-label="Başlangıç tarihi"
          />
          <label htmlFor="end-date">Bitiş</label>
          <input
            id="end-date"
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            aria-label="Bitiş tarihi"
          />
        </div>
      )}
    </fieldset>
  );
}

export default TimeRangeSelector;
