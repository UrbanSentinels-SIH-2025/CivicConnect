import { motion } from "framer-motion";
import {
  RiCommunityLine,
  RiMailLine,
  RiPhoneLine,
  RiMapPinLine,
  RiGithubLine,
  RiLinkedinLine,
  RiTwitterLine,
  RiHeartLine,
} from "react-icons/ri";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-gray-300 relative overflow-hidden">
      {/* Glow Accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-3xl" />

      {/* Main Footer Content */}
      <div className="relative container mx-auto px-6 md:px-12 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-blue-500/20">
                <RiCommunityLine className="text-white text-xl" />
              </div>
              <span className="text-2xl font-bold text-white">CivicConnect</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed text-sm">
              A crowdsourced civic issue reporting and resolution system
              empowering citizens and enabling{" "}
              <span className="text-indigo-400">transparent governance</span> &
              <span className="text-blue-400"> smarter cities</span>.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com/"
                className="w-10 h-10 bg-gray-800/70 backdrop-blur-md rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors shadow-md"
                aria-label="GitHub"
              >
                <RiGithubLine className="text-xl" />
              </a>
              <a
                href="https://linkedin.com/"
                className="w-10 h-10 bg-gray-800/70 backdrop-blur-md rounded-lg flex items-center justify-center hover:bg-indigo-600 transition-colors shadow-md"
                aria-label="LinkedIn"
              >
                <RiLinkedinLine className="text-xl" />
              </a>
              <a
                href="https://twitter.com/"
                className="w-10 h-10 bg-gray-800/70 backdrop-blur-md rounded-lg flex items-center justify-center hover:bg-sky-500 transition-colors shadow-md"
                aria-label="Twitter"
              >
                <RiTwitterLine className="text-xl" />
              </a>
            </div>
          </motion.div>

          {/* Features Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-6 text-white">Platform</h3>
            <ul className="space-y-3 text-sm">
              {[
                "Citizen App",
                "Admin Dashboard",
                "AI Insights",
                "CSR & NGO",
                "Transparency Hub",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Resources Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-6 text-white">Resources</h3>
            <ul className="space-y-3 text-sm">
              {[
                "Documentation",
                "API Reference",
                "Community",
                "Case Studies",
                "Support",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-indigo-400 transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-6 text-white">Contact</h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-center">
                <RiMailLine className="text-blue-400 mr-3" />
                <a
                  href="mailto:urban.sentinels@sih2025.gov.in"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  urban.sentinels@sih2025.gov.in
                </a>
              </div>
              <div className="flex items-center">
                <RiPhoneLine className="text-blue-400 mr-3" />
                <span className="text-gray-400">+91-98765-43210</span>
              </div>
              <div className="flex items-start">
                <RiMapPinLine className="text-blue-400 mr-3 mt-1" />
                <span className="text-gray-400">
                  Government of Jharkhand <br /> Ranchi, India
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-700/70">
        <div className="container mx-auto px-6 md:px-12 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="flex items-center text-gray-500 text-sm mb-4 md:mb-0"
            >
              <span>© {currentYear} CivicConnect | Built with</span>
              <RiHeartLine className="text-red-500 mx-1" />
              <span>by Team Urban Sentinels (SIH 2025)</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex space-x-6 text-sm text-gray-400"
            >
              <a href="#" className="hover:text-blue-400 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                Cookie Policy
              </a>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <motion.button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed z-1000 bottom-6 right-6 w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-lg flex items-center justify-center hover:shadow-blue-500/40 transition-all"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Back to top"
      >
        <svg
          className="w-5 h-5 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </motion.button>
    </footer>
  );
};

export default Footer;
