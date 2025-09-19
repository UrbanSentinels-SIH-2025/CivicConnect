import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layouts/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import UserApplicationLayout from "./components/layouts/UserApplicationLayout";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./middleware/protectedRoute";
import LandingGuard from "./middleware/LandingGuard";
import ReportIssue from "./pages/ReportIssue";
import AdminLayout from "./components/layouts/AdminLayout";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import Issues from "./pages/Admin/Issues";
import MyReports from "./pages/MyReports";
import Verification from "./pages/Verification";
import Settings from "./pages/Settings";
import Rewards from "./pages/Rewards";
import Departments from "./pages/Admin/Departments";
import AnalyticsDashboard from "./pages/Admin/AnalyticsDashboard";
import UserManagement from "./pages/Admin/UserManagment";
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
            <Route path="my-issues" element={<MyReports/>} />
            <Route path="community-reports" element={<Verification/>} />
            <Route path="settings" element={<Settings/>} />
            <Route path="rewards" element={<Rewards/>} />
        </Route>


        <Route
          path="/admin"
          element={
            
              <AdminLayout />
      
          }
        >
          {/* This matches exactly /admin */}
          <Route index element={<AdminDashboard />} />
          {/* Explicit path for /admin/dashboard */}
          <Route path="dashboard" element={<AdminDashboard />} />
          {/* Explicit path for /admin/profile */}
          <Route path="issues" element={<Issues/>} />
          <Route path="departments" element={<Departments/>} />
          <Route path="analytics" element={<AnalyticsDashboard/>} />
          <Route path="user-management" element={<UserManagement/>} />
        
        </Route>



      </Routes>
    </Router>
  );
};

export default App;
