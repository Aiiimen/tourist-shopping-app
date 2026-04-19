import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ListPage from './pages/ListPage'
import MapPage from './pages/MapPage'
import StoreDiscoveryPage from './pages/StoreDiscoveryPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ListPage />} />
        <Route path="/stores" element={<StoreDiscoveryPage />} />
        <Route path="/map" element={<MapPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
