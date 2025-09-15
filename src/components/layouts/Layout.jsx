import { Outlet, useLocation } from "react-router-dom";
import Header from "../Header";
import Footer from "../Footer";

const Layout = () => {
  const location = useLocation();

  return (
    <div>
      <Header />
      <main>
        <Outlet />
      </main>
      {/* Show Footer only if path is "/" */}
      {location.pathname === "/" && <Footer />}
    </div>
  );
};

export default Layout;
