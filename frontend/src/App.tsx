import { Routes, useLocation } from "react-router";
import { BrowserRouter, Route } from "react-router-dom";
import { Register } from "./pages/sign-up";
import { Login } from "./pages/sign-in";
import { Dashboard } from "./pages/dashboard";
import { ForgotPassword } from "./pages/forgot-password";
import { Toaster } from "sonner";
import { ResetPassword } from "./pages/reset-password";
import { ValidateEmail } from "./pages/validate-email";

function AppRoutes() {
  const location = useLocation();
  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/sign-in" element={<Login />} />
      <Route path="/sign-up" element={<Register />} />
      <Route path="/sign-in/forgot-password" element={<ForgotPassword />} />
      <Route path="/sign-in/reset-password" element={<ResetPassword />} />
      <Route path="/sign-up/validate-email" element={<ValidateEmail />} />
      <Route path="/" element={<Dashboard />} />
      <Route path="*" element={<div>404</div>} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
