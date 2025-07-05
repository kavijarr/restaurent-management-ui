import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import{Routes,Route} from 'react-router-dom'
import StartOrder from './pages/StartOrder'
import FoodListPage from './pages/FoodListPage'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<StartOrder />} />
      <Route path="/foods" element={<FoodListPage />} />
    </Routes>
  );
}

export default App
