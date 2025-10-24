import React from 'react'
import { Navigate } from 'react-router'
import Cookies from 'js-cookie'
import NavbarPage from '../header'

function ProtectedRoute({children}) {
  const jwtToken = Cookies.get("jwt_token")
    if (jwtToken===undefined) {
      return <Navigate to="/login" />
    }
  return (
    <>
      <NavbarPage />
      {children}
    </>
  )
}

export default ProtectedRoute
