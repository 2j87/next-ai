import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Results from './pages/Results'
import History from './pages/History'

function App() {
  return (
    <>
      <nav aria-label="Ana menü">
        <Link to="/" aria-label="NextAI ana sayfa">NextAI</Link>
        <Link to="/gecmis" aria-label="Arama geçmişi">Geçmiş</Link>
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
