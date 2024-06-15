import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React, {Suspense} from 'react';
import ProtectedRoute from './components/ProtectedRoute';
import AuthHandler from './components/AuthHandler';
import LazyLoader from './components/loader/loader';
import Header from './components/Header'
import Footer from './components/footer';
import Profile from './components/profileInfo';
// import Landing from './pages/landing_page/landing';
// import ResetPasswordPage from './components/resetpassword/resetPassword';
const Landing = React.lazy(() => import('./pages/landing_page/landing'));
// const Home = React.lazy(() => import('./components/Home'));
const Signin = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const NewUserScreen = React.lazy(() => import('./pages/newUser'));
const ResetPasswordPage = React.lazy(() => import('./components/resetpassword/resetPassword'));
const UploadContent = React.lazy(() => import('./components/UploadContent'));
const AdminDashboard = React.lazy(() => import('./pages/admin-dashboard/admin-dashboard'));
const PurchaseContent = React.lazy(() => import('./pages/PurchaseContent'));
const UserDashboard = React.lazy(() => import('./pages/user-dashboard/userDashboard'));

function App() {
  return (
    <BrowserRouter>
    <Suspense fallback={<LazyLoader />}>
      <Header />
      <Routes>
      <Route path="/" element={<Landing />} />
        <Route path="/newUser" element={<NewUserScreen />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="user-dashboard" element={<AuthHandler><ProtectedRoute element={<UserDashboard />} /></AuthHandler>} />
        <Route path="/profile" element={<AuthHandler><ProtectedRoute element={<Profile />} /></AuthHandler>} />
        <Route path="upload" element={<AuthHandler><ProtectedRoute element={<UploadContent />} /></AuthHandler>} />
        <Route path="purchase" element={<AuthHandler><ProtectedRoute element={<PurchaseContent />} /></AuthHandler>} />
        <Route path="admin-dashboard" element={<AuthHandler><ProtectedRoute element={<AdminDashboard />} /></AuthHandler>} />
      </Routes>
      <Footer />
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
