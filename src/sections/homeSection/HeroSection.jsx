import { motion } from "framer-motion";
import {
  RiMapPinLine,
  RiCameraLine,
  RiNotificationLine,
  RiDashboardLine,
  RiGovernmentLine,
  RiTimeLine,
  RiUserSettingsLine,
  RiBarChartBoxLine,
  RiLightbulbFill,
} from "react-icons/ri";
import {
  SiMongodb,
  SiExpress,
  SiReact,
  SiNodedotjs,
  SiTailwindcss,
  SiJavascript,
  SiLightburn,
} from "react-icons/si";
import { memo } from "react";

const HeroSection = memo(() => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  };

  const techStack = [
    { icon: <SiMongodb className="text-green-500 text-xl mr-2" />, name: "MongoDB" },
    { icon: <SiExpress className="text-gray-800 text-xl mr-2" />, name: "Express.js" },
    { icon: <SiReact className="text-blue-500 text-xl mr-2" />, name: "React" },
    { icon: <SiNodedotjs className="text-green-600 text-xl mr-2" />, name: "Node.js" },
    { icon: <SiTailwindcss className="text-cyan-500 text-xl mr-2" />, name: "Tailwind CSS" },
    { icon: <RiMapPinLine className="text-red-500 text-xl mr-2" />, name: "Map Integration" },
    { icon: <RiNotificationLine className="text-purple-500 text-xl mr-2" />, name: "Push Notifications" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Decorative blurred blobs */}
      <div className="absolute top-20 -left-10 w-72 h-72 bg-blue-300/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 -right-10 w-72 h-72 bg-indigo-300/30 rounded-full blur-3xl animate-pulse" />

      <div className="mx-auto max-w-7xl relative z-10 px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
          {/* LEFT SECTION */}
          <div className="lg:w-1/2">
            <motion.div
              {...fadeInUp}
              className="mb-6 inline-flex items-center px-5 py-2 rounded-full bg-white/70 backdrop-blur-md text-blue-700 font-medium shadow-md border border-blue-100"
            >
              <RiGovernmentLine className="mr-2" /> Community-Driven Civic Solutions
            </motion.div>

            <motion.h1
              {...fadeInUp}
              transition={{ delay: 0.2 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-5 tracking-tight"
            >
              Report, Track, and Resolve Issues with{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Real-Time Efficiency
              </span>
            </motion.h1>

            <motion.p
              {...fadeInUp}
              transition={{ delay: 0.3 }}
              className="text-lg text-gray-700 mb-8 leading-relaxed max-w-xl"
            >
              CivicConnect empowers communities to report local issues with photo
              evidence and automatic location tagging. Municipalities get prioritized
              alerts for faster resolution and improved transparency.
            </motion.p>

            {/* Tech Stack */}
            <motion.div {...fadeInUp} transition={{ delay: 0.4 }} className="mb-10">
              <div className="text-sm font-semibold text-gray-600 mb-3">
                POWERED BY MODERN TECHNOLOGY
              </div>
              <div className="flex flex-wrap gap-3">
                {techStack.map((tech, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.1 }}
                    className="flex items-center bg-white/80 backdrop-blur-md px-4 py-2 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all"
                  >
                    {tech.icon}
                    <span className="text-sm font-medium text-gray-800">{tech.name}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              {...fadeInUp}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <motion.a
                href="#demo"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-full font-semibold text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.95 }}
              >
                <RiDashboardLine className="mr-2" /> Login
              </motion.a>
              <motion.a
                href="#code"
                className="bg-white/90 backdrop-blur-md text-gray-900 px-6 py-3 rounded-full font-semibold text-base border border-gray-200 shadow-md hover:shadow-lg transition-all flex items-center justify-center"
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.95 }}
              >
                <RiLightbulbFill className="mr-2 text-blue-500" /> lets Make our city Smart
              </motion.a>
            </motion.div>

            {/* Feature Highlights */}
            <motion.div
              {...fadeInUp}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-6"
            >
              {[
                { icon: <RiCameraLine className="text-blue-600 text-xl" />, title: "Photo", desc: "Evidence Capture" },
                { icon: <RiMapPinLine className="text-indigo-600 text-xl" />, title: "Auto", desc: "Geo Tagging" },
                { icon: <RiNotificationLine className="text-green-600 text-xl" />, title: "Live", desc: "Status Updates" },
                { icon: <RiBarChartBoxLine className="text-purple-600 text-xl" />, title: "Smart", desc: "Issue Routing" },
              ].map((f, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -4, scale: 1.05 }}
                  className="flex items-center bg-white/80 backdrop-blur-sm p-3 rounded-xl shadow border border-gray-100 hover:shadow-md"
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-50 mr-3 shadow-sm">
                    {f.icon}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-sm">{f.title}</div>
                    <div className="text-xs text-gray-600">{f.desc}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT SECTION - Dashboard Preview */}
          <div className="lg:w-1/2 relative flex justify-center">
            <motion.img
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              src="/images/hero1.png"
              alt="Dashboard Preview"
              className="relative z-10 drop-shadow-2xl rounded-2xl"
            />

            {/* Floating Stats */}
            {[
              { icon: <RiTimeLine className="text-green-600" />, title: "68%", desc: "Faster Resolution", pos: "-top-8 left-6" },
              { icon: <RiUserSettingsLine className="text-purple-600 z-1000" />, title: "All Depts", desc: "Connected", pos: "bottom-3 right-6" },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 + i * 0.2 }}
                whileHover={{ y: -5 }}
                className={`absolute ${f.pos} z-1000 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-gray-100`}
              >
                <div className="flex items-center">
                  <div className="w-9 h-9 bg-gray-50 z-1000 rounded-lg flex items-center justify-center mr-2 shadow-sm">
                    {f.icon}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-sm">{f.title}</div>
                    <div className="text-xs text-gray-600">{f.desc}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

export default HeroSection;
