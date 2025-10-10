import { useState, useEffect } from "react";
import { RiLeafLine, RiCloseLine, RiMenuLine, RiArrowRightUpLine } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink, useLocation } from "react-router-dom";
import { FaCity } from "react-icons/fa";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);

  const location = useLocation();
  const isHome = location.pathname === "/"; // ✅ show nav only on "/"

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Features", href: "#features" },
    { name: "WorkFlow", href: "#workflow" },
    { name: "Roles", href: "#roles" },
  ];

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-black backdrop-blur-xl shadow-lg py-3 border-b border-black"
          : "bg-black py-3"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
        {/* Logo */}
        <motion.div
          className="flex items-center space-x-3 cursor-pointer group"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div
            className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 relative overflow-hidden group-hover:shadow-xl transition-all duration-300"
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 30px -10px rgba(79, 70, 229, 0.4)",
            }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
  <FaCity className="text-white text-xl" />
</div>

          </motion.div>
          <span className=" text-2xl bg-gradient-to-r font-bbh from-blue-500 to-indigo-400 bg-clip-text text-transparent">
            CivicConnect
          </span>
        </motion.div>

        {/* Desktop Navigation - only show on "/" */}
        {isHome && (
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <motion.div
                key={item.name}
                className="relative"
                onMouseEnter={() => setActiveItem(item.name)}
                onMouseLeave={() => setActiveItem(null)}
              >
                <motion.a
                  href={item.href}
                  className={`px-4 py-2 font-bbh font-medium transition-all duration-300 rounded-lg relative ${
                    activeItem === item.name
                      ? "text-indigo-400"
                      : "text-white hover:text-indigo-200"
                  }`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                >
                  {item.name}
                  {activeItem === item.name && (
                    <motion.div
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-full"
                      layoutId="navIndicator"
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    />
                  )}
                </motion.a>
              </motion.div>
            ))}

            <motion.button
              className="ml-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-xl font-medium shadow-lg relative overflow-hidden group"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 1.0 }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 30px -10px rgba(79, 70, 229, 0.5)",
              }}
              whileTap={{ scale: 0.98 }}
            >
              <NavLink to="/login" className="relative font-bbh z-10 flex items-center">
                Login <RiArrowRightUpLine className="ml-1" />
              </NavLink>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.button>
          </nav>
        )}

        {/* Mobile Menu Button */}
        <motion.button
          className="md:hidden p-3 rounded-xl text-blue-800 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-300"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.7 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <RiCloseLine size={24} /> : <RiMenuLine size={24} />}
        </motion.button>
      </div>

      {/* Mobile Navigation - only show on "/" */}
      {isHome && (
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="md:hidden fixed inset-0 top-[72px] bg-black z-40 shadow-lg"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div className="container mx-auto px-4 py-6 flex flex-col space-y-1 bg-black">
                {navItems.map((item, index) => (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    className="text-blue-800 font-agu font-extrabold text-lg py-4 px-4 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-300  relative z-10"
                    onClick={() => setMobileMenuOpen(false)}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.1 }}
                  >
                    {item.name}
                  </motion.a>
                ))}

                <NavLink
  to="/login"
  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-xl font-medium shadow-lg mt-4 flex items-center justify-center relative z-10"
>
  Login <RiArrowRightUpLine className="ml-1" />
</NavLink>
               
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.header>
  );
};

export default Header;
