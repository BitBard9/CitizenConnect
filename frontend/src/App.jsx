import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import LoginForm from "./components/LoginForm.jsx";
import RegisterForm from "./components/RegisterForm.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResidentDashboard from "./pages/ResidentDashboard.jsx";
import CommitteeDashboard from "./pages/CommitteeDashboard.jsx";
import TechnicianDashboard from "./pages/TechnicianDashboard.jsx";
import { ProtectedRoute, GuestRoute } from "./components/ProtectedRoute.jsx";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <GuestRoute>
            <LandingPage />
          </GuestRoute>
        }
      />
      <Route
        path="/login"
        element={
          <GuestRoute>
            <LoginForm />
          </GuestRoute>
        }
      />
      <Route
        path="/register"
        element={
          <GuestRoute>
            <RegisterForm />
          </GuestRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <GuestRoute>
            <ForgotPassword />
          </GuestRoute>
        }
      />
      <Route
        path="/resident"
        element={
          <ProtectedRoute roles={["resident"]}>
            <ResidentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/committee"
        element={
          <ProtectedRoute roles={["committee"]}>
            <CommitteeDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/technician"
        element={
          <ProtectedRoute roles={["technician"]}>
            <TechnicianDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
