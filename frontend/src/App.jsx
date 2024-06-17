// import { BrowserRouter, Route, Routes } from 'react-router-dom';
// import HomePage from './components/Home';
// import { Signin } from './pages/Login';
// import { Register } from './pages/Register';
// import ResetPassword from './components/PasswordReset';
// // import { OTP } from './components/ResetPasswordRequest';
// // import { OTPInput } from './components/OtpInput';
// import UserProfile  from './pages/UserProfile';
// import UpdateProfile from './pages/UpdateProfile';
// import UploadContent from './components/UploadContent';
// import AdminDashboard from './pages/admin-dashboard/AdminDashboard';
// import PurchaseContent from './pages/PurchaseContent';
// import UserDashboard from './pages/user-dashboard/UserDashboard';
// import ProtectedRoute from './components/ProtectedRoute';
// import AuthHandler from './components/AuthHandler';
// import AuthForm from './components/AuthForm';
// import Layout from './components/Layout';
// import LazyLoader from './loader/loader';
// import { useEffect } from 'react';
// import { useDispatch } from 'react-redux';
// import { setUser } from './services/authSlice';
// import ForgotPassword from './components/ForgotPassword';


// function App() {
//   const dispatch = useDispatch();

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       dispatch(setUser({ token }));
//     }
//   }, [dispatch]);

//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route element={<Layout />}>
//           <Route path="/" element={<HomePage />} />
//           <Route path="home" element={<HomePage />} />
//           <Route path="user-dashboard" element={<AuthHandler><ProtectedRoute element={<UserDashboard />} /></AuthHandler>} />
//           <Route path="profile" element={<AuthHandler><ProtectedRoute element={<UserProfile />} /></AuthHandler>} />
//           <Route path="creator_dashboard" element={<AuthHandler><ProtectedRoute element={<UploadContent />} /></AuthHandler>} />
//           <Route path="consumer_dashboard" element={<AuthHandler><ProtectedRoute element={<PurchaseContent />} /></AuthHandler>} />
//           <Route path="admin-dashboard" element={<AuthHandler><ProtectedRoute element={<AdminDashboard />} /></AuthHandler>} />
//           <Route path="update-profile" element={<AuthHandler><ProtectedRoute element={<UpdateProfile />} /></AuthHandler>} />
//         </Route>

//         <Route path="signin" element={<Signin />} />
//         <Route path="register" element={<Register />} />
//         <Route path="forgot-password" element={<ForgotPassword />} />
//         {/* <Route path="verify-otp" element={<OTPInput />} /> */}
//         <Route path="/passwordreset/:resetToken" element={<ResetPassword />} />
//         <Route path="admin-login" element={<AuthForm mode="signin" />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;

import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import AuthHandler from './components/AuthHandler';
import ProtectedRoute from './components/ProtectedRoute';
import LazyLoader from './loader/loader';
import { useDispatch } from 'react-redux';
import { setUser } from './services/authSlice';
// import ResetPassword from './components/PasswordReset';
import { Signin } from './pages/Login';const HomePage = lazy(() => import('./components/Home'));
// import { Register } from './pages/Register';
// const UserProfile = lazy(() => import('./pages/UserProfile'));
const UpdateProfile = lazy(() => import('./pages/UpdateProfile'));
const UploadContent = lazy(() => import('./components/UploadContent'));
const AdminDashboard = lazy(() => import('./pages/admin-dashboard/AdminDashboard'));
const PurchaseContent = lazy(() => import('./pages/PurchaseContent'));
const UserDashboard = lazy(() => import('./pages/user-dashboard/UserDashboard'));
const AuthForm = lazy(() => import('./components/AuthForm'));
const ForgotPassword = lazy(() => import('./components/ForgotPassword'));
const Register = lazy(() => import('./pages/Register'));
const ResetPassword = lazy(() => import('./components/PasswordReset'));
function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(setUser({ token }));
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Suspense fallback={<LazyLoader />}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="home" element={<HomePage />} />
            <Route path="user-dashboard" element={<AuthHandler><ProtectedRoute element={<UserDashboard />} /></AuthHandler>} />
            {/* <Route path="profile" element={<AuthHandler><ProtectedRoute element={<UserProfile />} /></AuthHandler>} /> */}
            <Route path="creator_dashboard" element={<AuthHandler><ProtectedRoute element={<UploadContent />} /></AuthHandler>} />
            <Route path="consumer_dashboard" element={<AuthHandler><ProtectedRoute element={<PurchaseContent />} /></AuthHandler>} />
            <Route path="admin-dashboard" element={<AuthHandler><ProtectedRoute element={<AdminDashboard />} /></AuthHandler>} />
            <Route path="update-profile" element={<AuthHandler><ProtectedRoute element={<UpdateProfile />} /></AuthHandler>} />
          </Route>

          <Route path="signin" element={<Signin />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />          {/* <Route path="verify-otp" element={<OTPInput />} /> */}
          <Route path="/passwordreset/:resetToken" element={<ResetPassword />} />
          <Route path="admin-login" element={<AuthForm mode="signin" />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
