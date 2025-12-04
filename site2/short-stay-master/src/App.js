import './App.css';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';
import OtpVerification from './pages/auth/OtpVerification';
import ResetPassword from './pages/auth/ResetPassword';
import Congrats from './pages/auth/Congrats';
import Register from './pages/auth/Register';
import { isAuthenticated } from './services/auth';
import { ProtectedRoutes } from './routes/ProtectedRoutes';
import HowWeAreDifferent from './pages/how-we-are-different';
import Contact from './pages/contact';
import TermsOfService from './pages/terms-of-service';
import PrivacyPolicy from './pages/privacy-policy';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route
          path="/"
          element={
            !isAuthenticated() ? <Home /> : <Navigate to="/" />
          }
        />
        <Route path="/" element={<Home />} />
        <Route path="/how-we-are-different" element={<HowWeAreDifferent />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/contact-us" element={<Contact />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/otp-verification" element={<OtpVerification />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/congrats" element={<Congrats />} />
      </Routes>
      <ProtectedRoutes />
    </HashRouter>
  );
}

export default App;
