import React from 'react'
import { useAppContext } from '../context/appContext'
import { Navigate } from 'react-router'


const ProtectedRoute = ({children}) => {
    const {admin , loading } = useAppContext()
  if (loading) {
    return <div>loading....</div>
  }

  if (!admin) {
   return <Navigate to="/login" replace/>
  }

  return children
}

export default ProtectedRoute
