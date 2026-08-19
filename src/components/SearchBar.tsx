import styles from './SearchBar.module.css';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className={styles.field}>
      <label htmlFor="search-keyword" className={styles.label}>
        Konu veya anahtar kelime
      </label>
      <input
        id="search-keyword"
        type="text"
        className={styles.input}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Örn: gündem, teknoloji, transfer haberleri"
        aria-label="Konu veya anahtar kelime ara"
      />
    </div>
  );
}

export default SearchBar;
