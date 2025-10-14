import { motion } from "framer-motion";
import {
  RiMapPinLine,
  RiCameraLine,
  RiNotificationLine,
  RiDashboardLine,
  RiGovernmentLine,
  RiBarChartBoxLine,
  RiLightbulbFill,
} from "react-icons/ri";
import {
  SiMongodb,
  SiExpress,
  SiReact,
  SiNodedotjs,
  SiTailwindcss,
} from "react-icons/si";
import { memo } from "react";
import { NavLink } from "react-router-dom";

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
    <div className="min-h-screen bg-gradient-to-br mt-12 from-blue-600 via-blue-50 to-blue-600 relative overflow-hidden">
      {/* Decorative blurred blobs */}
      <div className="absolute top-20 -left-10 w-72 h-72 bg-blue-300/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 -right-10 w-72 h-72 bg-indigo-300/30 rounded-full blur-3xl animate-pulse" />

      <div className="mx-auto  relative z-10 px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* LEFT SECTION CENTERED */}
        <div className="flex flex-col items-center gap-10 text-center">
          <motion.div
            {...fadeInUp}
            className=" inline-flex items-center font-iceberg px-5 py-2 rounded-full bg-white/70 backdrop-blur-md text-blue-700 font-medium shadow-md border border-blue-100"
          >
            <RiGovernmentLine className="mr-2 " /> Community-Driven Civic Solutions
          </motion.div>

          <motion.h1
            {...fadeInUp}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bbh sm:text-5xl lg:text-6xl  text-gray-900 mb-2 "
          >
            Report, Track, and Resolve Issues with{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Real-Time Efficiency
            </span>
          </motion.h1>

          <motion.p
            {...fadeInUp}
            transition={{ delay: 0.3 }}
            className="text-lg font-agu-display text-gray-700 font-bold mb-8 leading-relaxed max-w-4xl"
          >
            CivicConnect empowers communities to report local issues with photo
            evidence and automatic location tagging. Municipalities instant 
            alerts for faster resolution and improved transparency.
          </motion.p>


          {/* CTA Buttons */}
          <motion.div
            {...fadeInUp}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 mb-12 justify-center"
          >
            <NavLink
              to="/login"
              className="bg-gradient-to-r font-rozha from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-full font-semibold text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
            >
              <RiDashboardLine className="mr-2" /> Login
            </NavLink>

            <motion.a
              href="#code"
              className="bg-white/90 backdrop-blur-md text-gray-900 font-rozha px-6 py-3 rounded-full font-semibold text-base border border-gray-200 shadow-md hover:shadow-lg transition-all flex items-center justify-center"
            >
              <RiLightbulbFill className="mr-2 text-blue-500 " /> Let's Make our City Smart
            </motion.a>
          </motion.div>

         
        </div>
      </div>
    </div>
  );
});

export default HeroSection;
