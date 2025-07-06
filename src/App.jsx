import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import{Routes,Route} from 'react-router-dom'
import StartOrder from './pages/StartOrder'
import FoodListPage from './pages/FoodListPage'
import AddFoodPage from './pages/AddFoodPage'
import AdminPage from './pages/AdminPage'
import ThankYouPage from './pages/ThankYouPage'

const App = () => {
  return (
    <Routes>
      <Route path="/start" element={<StartOrder />} />
      <Route path="/foods" element={<FoodListPage />} />
      <Route path="/add-foods" element={<AddFoodPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/thank-you" element={<ThankYouPage />} />
    </Routes>
  );
}

export default App
