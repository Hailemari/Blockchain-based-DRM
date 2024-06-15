// import React from 'react'
// import propTypes from 'prop-types'
// export default function UpdationSuccess({ onClick, type }) {
//   const text = {
//     password: {
//       MainText: 'Password Changed!',
//       p1: 'Your password has been changed successfully! ',
//       p2: 'Use your new password to log in.'
//     },
//     email: {
//       MainText: 'Email Address Updated!',
//       p1: 'Your email address has been changed successfully! ',
//       p2: 'Use your new email to log in.'
//     },
//     emailVerify: {
//       MainText: 'Email Address Verified!',
//       p1: 'Your email address has been Verified successfully! ',
//       p2: 'You can now continue Browsing...'
//     }
//   }

//   return (
//     <div>
//       <div className="verification-mail text-center">
//         <img
//           alt="Sucess Icon"
//           style={{ marginBottom: '25px' }}
//           width="156px"
//           height="156px"
//           src="/Assets/Img/png/passSucess.png"
//         />
//         <div style={{ textAlign: 'center' }}>
//           <h1 style={{ fontSize: '28px', fontWeight: '600' }}>{text[type].MainText}</h1>
//           <p className="confirm-mail-p" style={{ fontSize: '16px' }}>
//             {text[type].p1} <br /> {text[type].p2}
//           </p>
//         </div>

//         <div className="mt-4 w-100 ">
//           <button
//             className="login_btn fs_sm w-50 fw_bold text-center ff_inter color_white"
//             onClick={onClick}
//           >
//             Return To Home
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }


// UpdationSuccess.propTypes = {
//     onClick: propTypes.func.isRequired,
//     type: propTypes.string.isRequired
//     }
    