import React from 'react'
import { useAppContext } from '../context/AppContext'
import Login from './adminComponents/Login'


const ProtectedRoute = ({children}) => {
    const {admin , loading } = useAppContext()
  if (loading) {
    return <div>loading....</div>
  }


  if (!admin.email) {
   return <Login/>
  }

  return children
}

export default ProtectedRoute
