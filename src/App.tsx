import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Results from './pages/Results'
import History from './pages/History'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sonuclar" element={<Results />} />
      <Route path="/gecmis" element={<History />} />
    </Routes>
  )
}

export default App
