import React, { useEffect } from 'react'
import Login from '../Users/Forms/Login'
import { useDispatch, useSelector } from 'react-redux'
import { getUserProfileAction } from '../../redux/slices/users/userSlice';
import AdminOnly from '../NotAuthorised/AdminOnly';
const AdminRoute = ({children}) => {
  // dispatch
  const dispatch = useDispatch();
  useEffect(() => {
  dispatch(getUserProfileAction())
  }, [dispatch]);

  // get data from store
  const {userAuth} = useSelector((state) => state.users)
  console.log(userAuth?.userInfo?.userFound?.isAdmin);
     // get user from localStorage
    const user = JSON.parse(localStorage.getItem("userInfo"))
    const isAdmin = user?.userFound?.isAdmin ? true : false
    // const isAdmin = !!user?.userFound?.isAdmin;


    if(!isAdmin) return <AdminOnly/>
  return (
    <>
      {children}  
    </>
  )
}

export default AdminRoute
