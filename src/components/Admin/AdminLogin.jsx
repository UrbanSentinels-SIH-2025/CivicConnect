import React, { useState } from "react";
import { motion } from "framer-motion";
import { RiLoginCircleLine, RiCloseLine, RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import api from "../../api/axios";
import Header from "../Header";

export default function AdminLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API call - replace with actual authentication
      const response = await api.post('/admin/auth/login', formData);
      
      if (response.data.success) {
        setShowModal(true);
        // Store token and redirect to admin dashboard
        localStorage.setItem('adminToken', response.data.token);
        setTimeout(() => {
          window.location.href = '/admin/dashboard';
        }, 2000);
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen flex pt-20 justify-center items-start bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden px-4 font-rozha">
        {/* Decorative gradient blobs */}
        <div className="absolute top-10 left-10 w-56 md:w-72 h-56 md:h-72 bg-blue-400/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-56 md:w-72 h-56 md:h-72 bg-indigo-400/30 rounded-full blur-3xl animate-pulse" />

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl flex flex-col md:flex-row border border-white/20 max-w-5xl w-full overflow-hidden my-4"
        >
          {/* LEFT SECTION - Content */}
          <div className="flex-1 flex flex-col justify-center p-6 sm:p-8 md:p-10">
            <motion.div
              initial={fadeInUp.initial}
              animate={fadeInUp.animate}
              transition={fadeInUp.transition}
              className="mb-4 inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 font-semibold shadow-sm font-rozha"
            >
              <RiLoginCircleLine className="mr-2 text-lg" /> CivicConnect Admin Portal
            </motion.div>

            <motion.h2
              initial={fadeInUp.initial}
              animate={fadeInUp.animate}
              transition={{ ...fadeInUp.transition, delay: 0.1 }}
              className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3 font-iceberg tracking-tight"
            >
              Admin Access <span role="img" aria-label="shield">🛡️</span>
            </motion.h2>

            <motion.p
              initial={fadeInUp.initial}
              animate={fadeInUp.animate}
              transition={{ ...fadeInUp.transition, delay: 0.15 }}
              className="text-gray-600 mb-6 leading-relaxed max-w-md font-rozha"
            >
              Secure access to the Municipal Dashboard <br />
              Manage civic issues and oversee resolution workflows.
            </motion.p>

            {/* Email & Password Login Form */}
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <motion.div
                initial={fadeInUp.initial}
                animate={fadeInUp.animate}
                transition={{ ...fadeInUp.transition, delay: 0.2 }}
              >
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 font-rozha">
                  Official Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none font-rozha"
                  placeholder="admin@civicconnect.gov.in"
                />
              </motion.div>

              <motion.div
                initial={fadeInUp.initial}
                animate={fadeInUp.animate}
                transition={{ ...fadeInUp.transition, delay: 0.25 }}
              >
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1 font-rozha">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none pr-12 font-rozha"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <RiEyeOffLine size={20} /> : <RiEyeLine size={20} />}
                  </button>
                </div>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-3 shadow-md hover:shadow-lg transition disabled:opacity-75 text-base font-rozha"
              >
                {isLoading ? (
                  <div className="flex items-center font-rozha">
                    <div className="animate-spin rounded-full h-5 w-5 border-4 border-t-transparent border-white mr-3"></div>
                    Authenticating...
                  </div>
                ) : (
                  <>
                    <RiLoginCircleLine className="text-xl" />
                    Sign In to Dashboard
                  </>
                )}
              </motion.button>
            </form>
          </div>

          {/* RIGHT SECTION - Illustration */}
          <div className="md:flex hidden justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6 sm:p-8 w-full md:w-[380px]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <img
                src="/images/_9abc0d9b-3b7a-47f9-aaff-f550a7256b6e.jpg"
                alt="Admin Dashboard Illustration"
                className="w-64 md:w-72 drop-shadow-xl object-contain mx-auto mb-4"
              />
              <h3 className="text-lg font-bold text-gray-800 mb-1 font-iceberg">Municipal Control Center</h3>
              <p className="text-gray-600 text-xs font-rozha">
                Access real-time analytics, issue tracking, and department management tools.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Success Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl font-rozha"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900 font-iceberg">✅ Authentication Successful!</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <RiCloseLine className="text-2xl" />
                </button>
              </div>
              <p className="text-gray-700 mb-6 font-rozha">
                Welcome to CivicConnect Admin Portal. You're being redirected to the municipal dashboard...
              </p>
              <button
                onClick={() => setShowModal(false)}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition font-rozha"
              >
                Continue to Dashboard
              </button>
            </motion.div>
          </div>
        )}
      </div>
    </>
  );
}