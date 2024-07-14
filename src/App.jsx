import Home from './components/home/Home'
import CoinDetails from './components/coinDetails/CoinDetails'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
function App() {


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/coin/:coinId' element={<CoinDetails />} />
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
