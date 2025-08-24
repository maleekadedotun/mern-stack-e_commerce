import React from 'react'
import Login from '../Users/Forms/Login'
const AdminRoute = ({children}) => {
     // get user from localStorage
    const user = JSON.parse(localStorage.getItem("userInfo"))
    const isAdmin = user?.data?.userFound?.isAdmin ? true : false

    if(!isAdmin) return <h1>Access denied, Admin only..</h1>
  return (
    <>
      {children}  
    </>
  )
}

export default AdminRoute
