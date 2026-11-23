import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Home from './pages/Home/Home'
import About from './pages/About/About'
import Tetris from './pages/Tetris/Tetris'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/tetris" element={<Tetris />} />
      </Routes>
    </Layout>
  )
}

export default App