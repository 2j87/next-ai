interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div>
      <label htmlFor="search-keyword">Konu veya anahtar kelime</label>
      <input
        id="search-keyword"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Örn: gündem, teknoloji, transfer haberleri"
        aria-label="Konu veya anahtar kelime ara"
      />
    </div>
  );
}

export default SearchBar;
