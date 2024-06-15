// import React, { useState } from 'react'
// import { Triangle } from 'react-loader-spinner'
// import { useDispatch, useSelector } from 'react-redux'
// import { useNavigate } from 'react-router-dom'
// import LoadingBar from 'react-top-loading-bar'
// import {
//   userAfterLoginResetPasswordUpdate,
//   userAfterLoginResetPasswordUpdateCancel,
//   userAfterLoginResetPasswordUpdateFailure
// } from '../../redux/userState'
// import { Alert, Stack } from '@mui/material'
// import UpdationSuccess from '../popup/UpdationSuccess'

// export default function UpdatePassword() {
//   const user = useSelector((state) => state.user)
//   const navigate = useNavigate()
//   const dispatch = useDispatch()
//   const [currentPassword, setCurrentPassword] = useState('')
//   const [newPassword, setNewPassword] = useState('')
//   const [confirmNewPassword, setConfirmNewPassword] = useState('')
//   const [fieldCheck, setFieldCheck] = useState(false)

//   const eyeBtn = () => {
//     let password = document.getElementById('password')
//     let eye = document.getElementById('eye')
//     let eye2 = document.getElementById('eye2')
//     if (password.type === 'password') {
//       password.type = 'text'
//     } else {
//       password.type = 'password'
//     }
//     eye2.classList.toggle('d-block')
//     eye.classList.toggle('d-none')
//   }

//   const eyeBtn2 = () => {
//     let password = document.getElementById('password2')
//     let eye3 = document.getElementById('eye3')
//     let eye4 = document.getElementById('eye4')
//     if (password.type === 'password') {
//       password.type = 'text'
//     } else {
//       password.type = 'password'
//     }
//     eye4.classList.toggle('d-block')
//     eye3.classList.toggle('d-none')
//   }

//   const eyeBtn3 = () => {
//     let password = document.getElementById('password3')
//     let eye5 = document.getElementById('eye5')
//     let eye6 = document.getElementById('eye6')
//     if (password.type === 'password') {
//       password.type = 'text'
//     } else {
//       password.type = 'password'
//     }
//     eye6.classList.toggle('d-block')
//     eye5.classList.toggle('d-none')
//   }

//   const submitPassword = (e) => {
//     e.preventDefault()
//     if (
//       currentPassword.length === 0 ||
//       newPassword.length === 0 ||
//       confirmNewPassword.length === 0
//     ) {
//       dispatch(
//         userAfterLoginResetPasswordUpdateFailure({
//           status: false,
//           inValidPassword: true,
//           message: 'all field are required'
//         })
//       )
//       setFieldCheck(true)
//     } else {
//       const json = {
//         currentPassword,
//         newPassword,
//         confirmNewPassword,
//         access_token: localStorage.getItem('access_token')
//       }

//       dispatch(userAfterLoginResetPasswordUpdate(json))
//     }
//   }

//   function returnToHomeHandler() {
//     dispatch(userAfterLoginResetPasswordUpdateCancel())
//     navigate('/')
//   }

//   return (
//     <header className="min-vh-100 d-flex flex-column position-relative">
//       <LoadingBar color="#FDA400" progress={user.progress} />

//       {user?.isLoginPasswordUpdated && (
//         <UpdationSuccess onClick={returnToHomeHandler} type="password" />
//       )}

//       {!user?.isLoginPasswordUpdated && (
//         <>
//           <div className="d-flex gap-4 align-items-center justify-content-start">
//             <div
//               className={`${user?.isLoading ? 'disabled cursor-not-allowed' : 'cursor-pointer '}`}
//               onClick={() => {
//                 if (!user?.isLoading) {
//                   navigate(-1)
//                 }
//               }}
//             >
//               <img src="/Assets/Img/svg/left-forward_icon.svg" alt="Key_icon" />
//             </div>
//             <p className="fs-22 fw-600 color-blue-black">Change password</p>
//           </div>

//           {user.isError && user.error.message ? (
//             <Stack className="fs_lg fw_xtr_bold ff_inter color_blue_black text-center mt-3">
//               <Alert severity="error">{user.error.message}</Alert>
//             </Stack>
//           ) : (
//             ''
//           )}
//           <form action="">
//             <div className="d-flex flex-column mt-4 pt-2">
//               <div
//                 style={
//                   (user.isError && user?.error?.PasswordField === 'old') || fieldCheck
//                     ? { border: '1px solid #E71D36' }
//                     : {}
//                 }
//                 className="d-flex align-items-center input_border"
//               >
//                 <img src="/Assets/Img/svg/Key_icon.svg" alt="Key_icon" />
//                 <input
//                   className="fs_sm fw_normal ff_inter w-100 ps-2"
//                   type="password"
//                   placeholder="Current Password"
//                   id="password"
//                   onChange={(e) => {
//                     setCurrentPassword(e.target.value)
//                     setFieldCheck(false)
//                     // dispatch(userInputErrorHandle())
//                   }}
//                 />
//                 <img
//                   onClick={eyeBtn}
//                   style={{ cursor: 'pointer' }}
//                   className="ms-3"
//                   src="/Assets/Img/svg/eye_off_icon.svg"
//                   alt="eye_off_icon"
//                   id="eye"
//                 />
//                 <img
//                   onClick={eyeBtn}
//                   style={{ cursor: 'pointer' }}
//                   className="ms-3"
//                   src="/Assets/Img/svg/eye_on_icon.svg"
//                   alt="eye_off_icon"
//                   id="eye2"
//                 />
//               </div>
//               <div
//                 style={
//                   (user.isError && user?.error?.PasswordField === 'new') || fieldCheck
//                     ? { border: '1px solid #E71D36' }
//                     : {}
//                 }
//                 className="d-flex align-items-center input_border mt-3"
//               >
//                 <div className="d-flex align-items-center w-100">
//                   <img src="/Assets/Img/svg/Key_icon.svg" alt="Key_icon" />
//                   <input
//                     className="fs_sm fw_normal ff_inter w-100 ps-2"
//                     type="password"
//                     placeholder="Create New Password"
//                     id="password2"
//                     onChange={(e) => {
//                       setNewPassword(e.target.value)
//                       setFieldCheck(false)
//                       // dispatch(userInputErrorHandle())
//                     }}
//                   />
//                   <img
//                     onClick={eyeBtn2}
//                     style={{ cursor: 'pointer' }}
//                     className="ms-3"
//                     src="/Assets/Img/svg/eye_off_icon.svg"
//                     alt="eye_off_icon"
//                     id="eye3"
//                   />
//                   <img
//                     onClick={eyeBtn2}
//                     style={{ cursor: 'pointer' }}
//                     className="ms-3"
//                     src="/Assets/Img/svg/eye_on_icon.svg"
//                     alt="eye_off_icon"
//                     id="eye4"
//                   />
//                 </div>
//               </div>
//               <div
//                 style={
//                   (user.isError && user?.error?.PasswordField === 'new') || fieldCheck
//                     ? { border: '1px solid #E71D36' }
//                     : {}
//                 }
//                 className="d-flex align-items-center input_border mt-3"
//               >
//                 <div className="d-flex align-items-center w-100">
//                   <img src="/Assets/Img/svg/Key_icon.svg" alt="Key_icon" />
//                   <input
//                     className="fs_sm fw_normal ff_inter w-100 ps-2"
//                     type="password"
//                     placeholder="Confirm New Password"
//                     id="password3"
//                     onChange={(e) => {
//                       setConfirmNewPassword(e.target.value)
//                       setFieldCheck(false)
//                       // dispatch(userInputErrorHandle())
//                     }}
//                   />
//                   <img
//                     onClick={eyeBtn3}
//                     style={{ cursor: 'pointer' }}
//                     className="ms-3"
//                     src="/Assets/Img/svg/eye_off_icon.svg"
//                     alt="eye_off_icon"
//                     id="eye5"
//                   />
//                   <img
//                     onClick={eyeBtn3}
//                     style={{ cursor: 'pointer' }}
//                     className="ms-3"
//                     src="/Assets/Img/svg/eye_on_icon.svg"
//                     alt="eye_off_icon"
//                     id="eye6"
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="d-flex mt-4">
//               <button
//                 className="login_btn fs_sm fw_bold w-100 ff_inter color_white"
//                 disabled={user.isLoading}
//                 onClick={submitPassword}
//               >
//                 {user.isLoading ? (
//                   <Triangle
//                     height="30"
//                     width="30"
//                     color="#FDA400"
//                     ariaLabel="triangle-loading"
//                     wrapperStyle={{ justifyContent: 'space-around' }}
//                     wrapperClassName=""
//                     visible={true}
//                   />
//                 ) : (
//                   'Update password'
//                 )}
//               </button>
//             </div>
//           </form>
//         </>
//       )}
//     </header>
//   )
// }