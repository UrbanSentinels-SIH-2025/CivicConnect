import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingLayout from "./components/layouts/LandingLayout";

const App = () => {
  return (
    <Router>
      <Routes>
          <Route path="/" element={<LandingLayout/>} />
          

      </Routes>
    </Router>
  );
};

export default App;
