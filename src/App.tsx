import { useEffect, useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Results from './pages/Results'
import History from './pages/History'
import styles from './App.module.css'

type Theme = 'light' | 'dark';

const THEME_KEY = 'nextai-theme';

function getStoredTheme(): Theme | null {
  const stored = localStorage.getItem(THEME_KEY);
  return stored === 'light' || stored === 'dark' ? stored : null;
}

function App() {
  const [theme, setTheme] = useState<Theme | null>(getStoredTheme);

  useEffect(() => {
    if (theme) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem(THEME_KEY, theme);
    }
  }, [theme]);

  function toggleTheme() {
    setTheme((current) => {
      if (current) return current === 'dark' ? 'light' : 'dark';
      const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
      return prefersLight ? 'dark' : 'light';
    });
  }

  return (
    <>
      <nav className={styles.nav} aria-label="Ana menü">
        <Link to="/" className={styles.logo} aria-label="NextAI ana sayfa">
          <svg
            viewBox="278.76 259.15 367.27 122.12"
            className={styles.logoImg}
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="navLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: 'var(--gradient-logo-from)' }} />
                <stop offset="100%" style={{ stopColor: 'var(--gradient-logo-to)' }} />
              </linearGradient>
            </defs>
            <path
              d="M341.29 264.93 L379.50 264.93 L419.74 375.50 L394.91 375.50 A19.102 19.102 0 0 1 376.96 362.93 L341.29 264.93 Z M333.65 264.93 L295.45 264.93 L295.45 375.72 L333.65 375.72 L333.65 264.93 Z M446.49 264.71 L408.28 264.71 L408.28 321.67 L426.92 372.89 L427.87 375.50 A19.102 19.102 0 0 0 446.49 356.40 L446.49 264.71 Z M453.41 375.50 L480.15 375.50 L495.68 342.21 L508.69 342.21 L552.68 342.21 L568.21 375.50 L594.95 375.50 L543.28 264.70 L505.08 264.70 L453.41 375.50 Z M504.58 323.11 L524.18 281.09 L543.78 323.11 L524.18 323.11 L504.58 323.11 Z M602.59 375.50 L602.59 264.71 L629.33 264.71 L629.33 375.50 L602.59 375.50 Z"
              fill="url(#navLogoGradient)"
              fillRule="evenodd"
            />
          </svg>
        </Link>
        <div className={styles.links}>
          <Link to="/" className={styles.link} aria-label="Arama sayfasına git">
            Ara
          </Link>
          <Link to="/gecmis" className={styles.link} aria-label="Arama geçmişi">
            Geçmiş
          </Link>
          <button
            type="button"
            className={styles.themeToggle}
            onClick={toggleTheme}
            aria-label={theme === 'light' ? 'Karanlık moda geç' : 'Aydınlık moda geç'}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sonuclar" element={<Results />} />
        <Route path="/gecmis" element={<History />} />
      </Routes>
    </>
  )
}

export default App
