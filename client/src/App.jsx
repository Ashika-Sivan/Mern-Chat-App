import React from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'

const App = () => {
  return (
    <div className="bg-[url('./src/assets/bgImage.svg')] bg-contain">
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/Login' element={<LoginPage/>}/>
        <Route path='/Profile' element={<ProfilePage/>}/>
      </Routes>
      
    </div>
  )
}

export default App
