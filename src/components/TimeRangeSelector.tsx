import { TIME_RANGE_LABELS, type TimeRangeOption } from '../types';
import styles from './TimeRangeSelector.module.css';

interface TimeRangeSelectorProps {
    value: TimeRangeOption;
    onChange: (value: TimeRangeOption) => void;
    startDate: string;
    endDate: string;
    onStartDateChange: (value: string) => void;
    onEndDateChange: (value: string) => void;
}

const optionOrder: TimeRangeOption[] = ['today', '3days', 'week', 'custom'];

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
                {optionOrder.map((option) => (
                    <label key={option} className={styles.option}>
                        <input
                            type="radio"
                            name="time-range"
                            className={styles.radio}
                            value={option}
                            checked={value === option}
                            onChange={() => onChange(option)}
                            aria-label={TIME_RANGE_LABELS[option]}
                        />
                        {option === 'custom' && (
                            <span className={`material-symbols-outlined ${styles.optionIcon}`} aria-hidden="true">
                                calendar_today
                            </span>
                        )}
                        {TIME_RANGE_LABELS[option]}
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
                            required
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
                            required
                        />
                    </div>
                </div>
            )}
        </fieldset>
    );
}

export default TimeRangeSelector;
