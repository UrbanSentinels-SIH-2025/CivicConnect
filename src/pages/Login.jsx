import React, { useState } from "react";
import { motion } from "framer-motion";
import { RiLoginCircleLine, RiCloseLine } from "react-icons/ri";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  };

   

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };

  return (
    <div className="min-h-screen flex   justify-center items-center bg-gradient-to-b from-blue-50 via-white to-indigo-50

 relative overflow-hidden px-4">
      {/* Decorative gradient blobs */}
      <div className="absolute top-10 left-10 w-56 md:w-72 h-56 md:h-72 bg-blue-400/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 right-10 w-56 md:w-72 h-56 md:h-72 bg-indigo-400/30 rounded-full blur-3xl animate-pulse" />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl flex flex-col md:flex-row border border-white/20 max-w-5xl w-full overflow-hidden"
      >
        {/* LEFT SECTION - Content */}
        <div className="flex-1 flex flex-col justify-center p-6 sm:p-10 md:p-14">
          <motion.div
            initial={fadeInUp.initial}
            animate={fadeInUp.animate}
            transition={fadeInUp.transition}
            className="mb-6 inline-flex items-center px-5 py-2 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 font-semibold shadow-sm"
          >
            <RiLoginCircleLine className="mr-2 text-lg" /> CivicConnect Portal
          </motion.div>

          <motion.h2
            initial={fadeInUp.initial}
            animate={fadeInUp.animate}
            transition={{ ...fadeInUp.transition, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4"
          >
            Welcome Back <span role="img" aria-label="wave">👋</span>
          </motion.h2>

          <motion.p
            initial={fadeInUp.initial}
            animate={fadeInUp.animate}
            transition={{ ...fadeInUp.transition, delay: 0.15 }}
            className="text-gray-600 mb-8 sm:mb-10 leading-relaxed max-w-md"
          >
            Today is a fresh start 🌟 <br />
            Sign in and begin managing your community with ease.
          </motion.p>

          {/* Google Login Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full bg-white border border-gray-200 py-3 sm:py-4 rounded-xl font-semibold flex items-center justify-center gap-3 shadow-md hover:shadow-lg transition disabled:opacity-75 text-base sm:text-lg"
          >
            {isLoading ? (
              <div className="flex items-center">
               <div className="animate-spin rounded-full h-5 w-5 border-4 border-t-transparent border-blue-500 mr-3"></div>

                Connecting...
              </div>
            ) : (
              <>
                <img
                  className="h-5 w-5 sm:h-6 sm:w-6"
                  src="./images/search.png"
                  alt="Google logo"
                />
                Continue with Google
              </>
            )}
          </motion.button>
        </div>

        {/* RIGHT SECTION - Illustration */}
        <div className="md:flex hidden justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6 sm:p-10 w-full md:w-[420px]">
          <motion.img
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            src="./images/login.png"
            alt="Illustration"
            className=" sm:w-72 md:w-80 drop-shadow-xl object-contain"
          />
        </div>
      </motion.div>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">✅ Success!</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <RiCloseLine className="text-2xl" />
              </button>
            </div>
            <p className="text-gray-700 mb-8">
              You’ve successfully signed in to CivicConnect. Redirecting you to
              your dashboard...
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition"
            >
              Continue to Dashboard
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
