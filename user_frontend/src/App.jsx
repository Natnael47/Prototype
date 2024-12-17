import React, { useContext } from 'react'
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { Context } from './context/context'
import Home from './pages/Home'
import Login from './pages/Login'

export const backendUrl = import.meta.env.VITE_BACKEND_URL;

const App = () => {

  const { token } = useContext(Context);

  return token ? (
    <div className='mx-4 sm:mx-[10%]'>
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Home />} />
      </Routes>
    </div>
  ) : (
    <>
      <Login />
      <ToastContainer />
    </>
  )
}

export default App