import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/login'

const App = () => {
  return (
    <div className='mx-4 sm:mx-[10%]'>
      <Login />
      <Routes>
        <Route path='/' element={<Login />} />
      </Routes>
    </div>
  )
}

export default App