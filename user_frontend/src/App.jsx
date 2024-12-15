import React from 'react'
import { Route, Routes } from 'react-router-dom'

const App = () => {
  return (
    <div className='mx-4 sm:mx-[10%]'>
      <Routes>
        <Route path='/' element={<login />} />
      </Routes>
    </div>
  )
}

export default App