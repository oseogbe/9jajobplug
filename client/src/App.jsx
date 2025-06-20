import React from 'react'
import { Route, Routes } from 'react-router-dom'

import RootLayout from '@/layouts/RootLayout'
import AuthLayout from '@/layouts/AuthLayout'
import Home from '@/pages/Home'
import ApplyJob from '@/pages/ApplyJob'
import Applications from '@/pages/Applications'
import Register from '@/pages/Auth/Register'
import Login from '@/pages/Auth/Login'

const App = () => {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path='/' element={<Home />} />
        <Route path='/apply-job/:id' element={<ApplyJob />} />
        <Route path='/applications' element={<Applications />} />
      </Route>
      <Route element={<AuthLayout />}>
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
      </Route>
    </Routes>
  )
}

export default App