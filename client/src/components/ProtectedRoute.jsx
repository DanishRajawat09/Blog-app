import React from 'react'
import { useAppContext } from '../context/appContext'
import Login from './adminComponents/Login'


const ProtectedRoute = ({children}) => {
    const {admin , loading } = useAppContext()
  if (loading) {
    return <div>loading....</div>
  }


  if (!admin.length > 0) {
   return <Login/>
  }

  return children
}

export default ProtectedRoute
