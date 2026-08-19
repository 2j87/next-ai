import styles from './SearchBar.module.css';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className={styles.field}>
      <label htmlFor="search-keyword" className={styles.srOnly}>
        Konu veya anahtar kelime
      </label>
      <span className={`material-symbols-outlined ${styles.searchIcon}`} aria-hidden="true">
        search
      </span>
      <input
        id="search-keyword"
        type="text"
        className={styles.input}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Ne hakkında bilgi almak istersin?"
        aria-label="Konu veya anahtar kelime ara"
        required
      />
      <button type="submit" className={styles.submitButton} aria-label="Aramayı başlat">
        <span className="material-symbols-outlined fill" aria-hidden="true">
          arrow_forward
        </span>
      </button>
    </div>
  );
}

export default SearchBar;
