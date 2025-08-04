import { useState } from 'react'
import { Route, Routes } from 'react-router'
import MainLayout from './components/Layout'
import HomePage from './pages/Home'


function App() {
  const [count, setCount] = useState(0)

  return (
    <Routes>
      <Route path='/' element={<MainLayout />}>
      <Route index element={<HomePage />} />
      </Route>
    </Routes>
  )
}

export default App
