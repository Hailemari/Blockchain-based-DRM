// import React, { useEffect, useState } from 'react'
// import { useSelector, useDispatch } from 'react-redux'
// import {
//   userInputErrorHandle,
//   userPasswordUpdateFailure,
//   userPasswordUpdate
// } from '../../redux/userState'
// import LoadingBar from 'react-top-loading-bar'
// import { Triangle } from 'react-loader-spinner'
// import { useNavigate } from 'react-router-dom'
// import { Link } from 'react-router-dom'
// // error and success messages
// import Alert from '@mui/material/Alert'
// import Stack from '@mui/material/Stack'

// function UpdatePasswordPage(props) {
//   const query = new URLSearchParams(window.location.search)
//   const navigate = useNavigate()
//   const [userId, setUserId] = useState('')
//   const [resetString, setResetString] = useState('')
//   const user = useSelector((state) => state.user)
//   const dispatch = useDispatch()
//   const [userPassword, setUserPassword] = useState({
//     password: '',
//     confirm_password: ''
//   })
//   const handlePassword = (e) => {
//     dispatch(userInputErrorHandle())
//     setUserPassword({ ...userPassword, [e.target.name]: e.target.value })
//   }
//   const submitPassword = (e) => {
//     e.preventDefault()
//     if (userPassword.password.length === 0) {
//       dispatch(
//         userPasswordUpdateFailure({
//           status: false,
//           inValidPassword: true,
//           message: 'Password is required'
//         })
//       )
//     } else if (userPassword.password.length < 6) {
//       dispatch(
//         userPasswordUpdateFailure({
//           status: false,
//           inValidPassword: true,
//           message: 'Passwords must have at least 6 characters long'
//         })
//       )
//     } else if (userPassword.password !== userPassword.confirm_password) {
//       dispatch(
//         userPasswordUpdateFailure({
//           status: false,
//           inValidConfirmPass: true,
//           message: `Passwords don't match`
//         })
//       )
//     } else {
//       const json = {
//         userId: userId,
//         resetString: resetString,
//         newPassword: userPassword.confirm_password
//       }
//       dispatch(userPasswordUpdate(json))
//     }
//   }
//   const eyeBtn = () => {
//     let password = document.getElementById('password')
//     let password2 = document.getElementById('password2')
//     let eye = document.getElementById('eye')
//     let eye2 = document.getElementById('eye2')
//     if (password.type == 'password') {
//       password.type = 'text'
//       password2.type = 'text'
//     } else {
//       password.type = 'password'
//       password2.type = 'password'
//     }
//     eye2.classList.toggle('d-block')
//     eye.classList.toggle('d-none')
//   }
//   useEffect(() => {
//     if (
//       query.get('userId') &&
//       query.get('userId').length &&
//       query.get('resetString') &&
//       query.get('resetString').length
//     ) {
//       setUserId(query.get('userId'))
//       setResetString(query.get('resetString'))
//     } else {
//       navigate('/login')
//     }
//     if (user.isPasswordUpdated) {
//       setTimeout(() => {
//         navigate('/login')
//       }, 2000)
//     }
//   }, [dispatch, user])
//   return (
//     <header className="min-vh-100 d-flex flex-column color_light_white position-relative">
//       <LoadingBar color="#FDA400" progress={user.progress} />
//       <img
//         className="position-absolute bottom-0 start-0 w-100"
//         src="/Assets/Img/svg/bottom_wave.svg"
//         alt="bottom_wave"
//       />
//       <nav className="border_bottom bg_color_white">
//         <div className="container py-4 py_xsm_20">
//           <div className="d-flex justify-content-between align-items-center">
//             <Link to={'/login'}>
//               <a>
//                 <img className="nav_logo" src="/Assets/Img/svg/Explrar Logo.svg" alt="nav_logo" />
//               </a>
//             </Link>
//             <ul className="d-flex m-0 p-0">
//               <li>
//                 <a className="fs_base fw_medium color_blue_black ff_inter" href="#">
//                   Help
//                 </a>
//               </li>
//               <li className="ms-2">
//                 <a href="#">
//                   <img
//                     className="w_xsm_18"
//                     src="/Assets/Img/svg/Question_icon.svg"
//                     alt="Question_icon"
//                   />
//                 </a>
//               </li>
//             </ul>
//           </div>
//         </div>
//       </nav>
//       {user.isError && user.error.message ? (
//         <Stack className="fs_lg fw_xtr_bold ff_inter color_blue_black text-center">
//           <Alert severity="error">{user.error.message}</Alert>
//         </Stack>
//       ) : user.isPasswordUpdated ? (
//         <Alert severity="success">{user.userOTP.message}</Alert>
//       ) : (
//         ''
//       )}
//       <div className="d-flex justify-content-center align-items-center flex-grow-1 position-relative z-1">
//         <div className="mini_container">
//           <h1 className="fs_lg fw_xtr_bold ff_inter color_blue_black text-center">
//             Change Password
//           </h1>
//           <form action="">
//             <div className="d-flex flex-column mt-4 pt-2">
//               <div className="d-flex align-items-center input_border mt-3">
//                 <div className="d-flex align-items-center w-100">
//                   <img src="/Assets/Img/svg/Key_icon.svg" alt="Key_icon" />
//                   <input
//                     name="password"
//                     className="fs_sm fw_normal ff_inter w-100 ps-2"
//                     type="password"
//                     placeholder="Create Password"
//                     id="password"
//                     onChange={handlePassword}
//                   />
//                 </div>
//               </div>
//               <div className="d-flex align-items-center input_border mt-3">
//                 <div className="d-flex align-items-center w-100">
//                   <img src="/Assets/Img/svg/Key_icon.svg" alt="Key_icon" />
//                   <input
//                     name="confirm_password"
//                     className="fs_sm fw_normal ff_inter w-100 ps-2"
//                     type="password"
//                     placeholder="Confirm Password"
//                     id="password2"
//                     onChange={handlePassword}
//                   />
//                   <img
//                     onClick={eyeBtn}
//                     className="ms-3"
//                     src="/Assets/Img/svg/eye_off_icon.svg"
//                     alt="eye_off_icon"
//                     id="eye"
//                   />
//                   <img
//                     onClick={eyeBtn}
//                     className="ms-3"
//                     src="/Assets/Img/svg/eye_on_icon.svg"
//                     alt="eye_off_icon"
//                     id="eye2"
//                   />
//                 </div>
//               </div>
//             </div>
//             <button
//               className="login_btn w-100 fs_sm fw_bold ff_inter color_white mt-4"
//               onClick={submitPassword}
//             >
//               {user.isLoading ? (
//                 <Triangle
//                   height="30"
//                   width="30"
//                   color="#FDA400"
//                   ariaLabel="triangle-loading"
//                   wrapperStyle={{ justifyContent: 'space-around' }}
//                   wrapperClassName=""
//                   visible={true}
//                 />
//               ) : (
//                 'Update password'
//               )}
//             </button>
//           </form>
//         </div>
//       </div>
//     </header>
//   )
// }

// export default UpdatePasswordPage