import Home from './components/Home'
import { Signin } from './pages/Login'
import { Register } from './pages/Register'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { NewUserScreen } from './pages/NewUser'
import { Header } from './components/Header'
import ResetPassword from './components/PasswordReset'
import { OTP } from './components/ResetPasswordRequest'
import { OTPInput } from './components/OtpInput'
import { UserProfile } from './pages/UserProfile'
import UserDashboard from './pages/user-dashboard/UserDashboard'
import { CreatorDashboard } from './pages/creator-dashboard/CreatorDashboard'
import { UploadBook } from './components/UploadBook'

function App() {

  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="home" element={<Home />} />
          <Route path="/" element={<NewUserScreen />} />
          <Route path="signin" element={<Signin />} />
          <Route path="register" element={<Register />} />
          <Route path="user-dashboard" element={<UserDashboard />} />
          <Route path="creator-dashboard" element={<CreatorDashboard/>} />
          <Route path="request-password-reset" element ={<OTP/>} />
          <Route path="verify-otp" element ={<OTPInput/>} />
          <Route path="reset-password" element ={<ResetPassword/>} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="uploadbook" element={<UploadBook/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
