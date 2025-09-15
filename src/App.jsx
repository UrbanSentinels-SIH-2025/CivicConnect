import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layouts/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Layout route wraps all pages that share header/footer */}
        <Route path="/" element={<Layout />}>
          {/* Child routes */}
          <Route index element={<Home />} />     {/* / */}
          <Route path="login" element={<Login />} />  {/* /login */}
        </Route>

        
      </Routes>
    </Router>
  );
};

export default App;
