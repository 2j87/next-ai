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
              <span className={styles.navIconWrap}>
                <span className="material-symbols-outlined" aria-hidden="true">search</span>
              </span>
              <span className={styles.navLabel}>Ara</span>
            </NavLink>
            <NavLink
              to="/gecmis"
              className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
              aria-label="Arama geçmişi"
            >
              <span className={styles.navIconWrap}>
                <span className="material-symbols-outlined" aria-hidden="true">history</span>
              </span>
              <span className={styles.navLabel}>Geçmiş</span>
            </NavLink>
          </div>

          <button
            type="button"
            className={styles.themeToggle}
            onClick={toggleTheme}
            aria-label={theme === 'light' ? 'Karanlık moda geç' : 'Aydınlık moda geç'}
          >
            <span className={styles.navIconWrap}>
              <span className="material-symbols-outlined" aria-hidden="true">
                {theme === 'light' ? 'dark_mode' : 'light_mode'}
              </span>
            </span>
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
