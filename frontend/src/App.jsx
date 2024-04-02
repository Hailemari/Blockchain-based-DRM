import Home from './components/Home'
import { Signin } from './pages/Login'
import { Register } from './pages/Register'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { NewUserScreen } from './pages/newUser'
import { Header } from './components/Header'
import { Profile } from './components/userProfile'
import ResetPassword from './components/passwordReset'
import { OTP } from './components/resetPasswordRequest'
import { OTPInput } from './components/OtpInput'


function App() {


  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<NewUserScreen />} />
          <Route path="signin" element={<Signin />} />
          <Route path="register" element={<Register />} />
          <Route path="/request-password-reset" element ={<OTP/>} />
          <Route path="/verify-otp" element ={<OTPInput/>} />
          <Route path='/reset-password' element ={<ResetPassword/>} />
          <Route path="profile" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
