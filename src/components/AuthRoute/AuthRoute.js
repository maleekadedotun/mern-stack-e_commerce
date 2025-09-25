import React from 'react'
import Login from '../Users/Forms/Login'
const AuthRoute = ({children}) => {
     // get user from localStorage
    const user = JSON.parse(localStorage.getItem("userInfo"))
    const isLoggedIn = user?.token ? true : false

    if(!isLoggedIn) return <Login />
  return (
    <>
        {children}  
    </>
  )
}

export default AuthRoute


// import { Navigate } from "react-router-dom";

// const AuthRoute = ({ children }) => {
//   const user = JSON.parse(localStorage.getItem("userInfo"));
//   const isLoggedIn = user?.token ? true : false;

//   if (!isLoggedIn) {
//     // If not logged in → redirect to login
//     return <Navigate to="/login" replace />;
//   }

//   return children;
// };

// export default AuthRoute;
