import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import { Signin } from './pages/Login';
import { Register } from './pages/Register';
import { NewUserScreen } from './pages/newUser';
import { Header } from './components/Header';
import ResetPassword from './components/passwordReset';
import { OTP } from './components/resetPasswordRequest';
import { OTPInput } from './components/OtpInput';
import { UserProfile } from './pages/userProfile';
import UploadContent from './components/UploadContent';
import AdminDashboard from './pages/admin-dashboard/admin-dashboard';
import PurchaseContent from './pages/PurchaseContent';
import UserDashboard from './pages/user-dashboard/userDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import AuthHandler from './components/AuthHandler';
import AuthForm from './components/AuthForm';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="" element={<NewUserScreen />} />
        <Route path="home" element={<Home />} />
        <Route path="signin" element={<Signin />} />
        <Route path="register" element={<Register />} />
        <Route path="request-password-reset" element={<OTP />} />
        <Route path="verify-otp" element={<OTPInput />} />
        <Route path="reset-password" element={<ResetPassword />} />

        <Route path="user-dashboard" element={<AuthHandler><ProtectedRoute element={<UserDashboard />} /></AuthHandler>} />
        <Route path="profile" element={<AuthHandler><ProtectedRoute element={<UserProfile />} /></AuthHandler>} />
        <Route path="upload" element={<AuthHandler><ProtectedRoute element={<UploadContent />} /></AuthHandler>} />
        <Route path="purchase" element={<AuthHandler><ProtectedRoute element={<PurchaseContent />} /></AuthHandler>} />
        <Route path="admin-dashboard" element={<AuthHandler><ProtectedRoute element={<AdminDashboard />} /></AuthHandler>} />

        <Route path="admin-login" element={<AuthForm mode="signin" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
