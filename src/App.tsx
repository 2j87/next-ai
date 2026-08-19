import { useEffect, useState } from 'react'
import { Routes, Route, Link, NavLink } from 'react-router-dom'
import Home from './pages/Home'
import Results from './pages/Results'
import History from './pages/History'
import Logo from './components/Logo'
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
    <div className={styles.shell}>
      <nav className={styles.sidebar} aria-label="Ana menü">
        <Link to="/" className={styles.logo} aria-label="NextAI ana sayfa">
          <Logo className={styles.logoImg} />
        </Link>

        <div className={styles.navBottomGroup}>
          <div className={styles.navItems}>
            <NavLink
              to="/"
              end
              className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
              aria-label="Arama sayfasına git"
            >
              <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span className={styles.navLabel}>Ara</span>
            </NavLink>
            <NavLink
              to="/gecmis"
              className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
              aria-label="Arama geçmişi"
            >
              <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                <polyline points="12 7 12 12 16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className={styles.navLabel}>Geçmiş</span>
            </NavLink>
          </div>

          <button
            type="button"
            className={styles.themeToggle}
            onClick={toggleTheme}
            aria-label={theme === 'light' ? 'Karanlık moda geç' : 'Aydınlık moda geç'}
          >
            <span aria-hidden="true">{theme === 'light' ? '🌙' : '☀️'}</span>
            <span className={styles.navLabel}>
              {theme === 'light' ? 'Karanlık mod' : 'Aydınlık mod'}
            </span>
          </button>
        </div>
      </nav>

      <div className={styles.content}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sonuclar" element={<Results />} />
          <Route path="/gecmis" element={<History />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
