import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Results from './pages/Results'
import History from './pages/History'
import styles from './App.module.css'

function App() {
  return (
    <>
      <nav className={styles.nav} aria-label="Ana menü">
        <Link to="/" className={styles.logo} aria-label="NextAI ana sayfa">
          NextAI
        </Link>
        <div className={styles.links}>
          <Link to="/" className={styles.link}>Ara</Link>
          <Link to="/gecmis" className={styles.link} aria-label="Arama geçmişi">
            Geçmiş
          </Link>
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
