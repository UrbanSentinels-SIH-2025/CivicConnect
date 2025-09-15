import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layouts/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import UserApplicationLayout from "./components/layouts/UserApplicationLayout";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./middleware/protectedRoute";
import LandingGuard from "./middleware/LandingGuard";
import ReportIssue from "./pages/ReportIssue";
const App = () => {
  return (
    <Router>
      <Routes>
        {/* Layout route wraps all pages that share header/footer */}
        <Route
          path="/"
          element={
            <LandingGuard>
              <Layout />
            </LandingGuard>
          }
        >
          {/* Child routes */}
          <Route index element={<Home />} /> {/* / */}
          <Route path="login" element={<Login />} /> {/* /login */}
        </Route>

        {/* Protected User Area */}
        {/* Protected User Area */}
        <Route
          path="/user"
          element={
            <ProtectedRoute>
              <UserApplicationLayout />
            </ProtectedRoute>
          }
        >
          {/* This matches exactly /user */}
          <Route index element={<Dashboard />} />

          {/* Explicit path for /user/dashboard */}
          <Route path="dashboard" element={<Dashboard />} />

          {/* Explicit path for /user/profile */}
          <Route path="report" element={<ReportIssue/>} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
