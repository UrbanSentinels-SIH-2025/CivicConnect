import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layouts/Layout";
import CivicConnectLinkTree from "./pages/CivicConnectLinkTree";
import Home from "./pages/Home";
import Login from "./pages/Login";
import UserApplicationLayout from "./components/layouts/UserApplicationLayout";
import Dashboard from "./pages/users/Dashboard";
import ProtectedRoute from "./middleware/protectedRoute";
import LandingGuard from "./middleware/LandingGuard";
import ReportIssue from "./pages/users/ReportIssue";
import AdminLayout from "./components/layouts/AdminLayout";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import Issues from "./pages/Admin/Issues";
import MyReports from "./pages/users/MyReports";
import Verification from "./pages/users/Verification";
import Settings from "./pages/users/Settings";
import Rewards from "./pages/users/Rewards";
import Departments from "./pages/Admin/Departments";
import AnalyticsDashboard from "./pages/Admin/AnalyticsDashboard";
import UserManagement from "./pages/Admin/UserManagment";
import StreetDepartmentDashboard from "./pages/Departements/StreetDepartmentDashboard";
import OpenInGoogleMaps from "./pages/Departements/OpenGoogleMaps";
import DepartmentsLayout from "./components/layouts/DepartmentsLayout";
import Departements from "./pages/Departements/Departements";
import Progress from "./pages/Departements/Progress";
import IssueDetail from "./pages/Departements/IssueDetail";
import VideoTranscriber from "./components/DepartmentDashboard.jsx/VideoTranscriber";
import TaskComplete from "./pages/Departements/TaskComplete";
import Resolved from "./pages/Departements/Resolved";
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
          <Route path="report" element={<ReportIssue />} />
          <Route path="my-issues" element={<MyReports />} />
          <Route path="community-reports" element={<Verification />} />
          <Route path="settings" element={<Settings />} />
          <Route path="rewards" element={<Rewards />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          {/* This matches exactly /admin */}
          <Route index element={<AdminDashboard />} />
          {/* Explicit path for /admin/dashboard */}
          <Route path="dashboard" element={<AdminDashboard />} />
          {/* Explicit path for /admin/profile */}
          <Route path="issues" element={<Issues />} />
          <Route path="departments" element={<Departments />} />
          <Route path="analytics" element={<AnalyticsDashboard />} />
          <Route path="issue-detail/:id" element={<IssueDetail/>}/>
          <Route path="user-management" element={<UserManagement />} />
          <Route
            path="department/:departmentName"
            element={<StreetDepartmentDashboard />}
          />
        </Route>

        <Route
          path="/department/:departmentName"
          element={<DepartmentsLayout />}
        >
          <Route index element={<Departements />} />
          <Route path="progress" element={<Progress />} />
          <Route path="resolved" element={<Resolved />} />
          <Route path="issue/:issueId" element={<IssueDetail />} />{" "}
          <Route path="mark-as-complete/:issueId" element={<TaskComplete/>} />
          {/* New page */}
        </Route>

        <Route
          path="/google"
          element={<OpenInGoogleMaps lat={28.6129} lng={77.2295} />}
        />
        <Route path="/linktree" element={<CivicConnectLinkTree />} />
         {/* <VideoTranscriber /> */}
      <Route path="/transcriber" element={<VideoTranscriber videoUrl={"https://res.cloudinary.com/dbe3m3hcw/video/upload/v1758477119/report-videos/ybe0ahljvw1uizyqctlt.webm"} />} />
      </Routes>
     
    </Router>
  );
};

export default App;
