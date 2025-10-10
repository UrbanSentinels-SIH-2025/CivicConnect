import { motion } from "framer-motion";
import {
  RiCameraLine,
  RiUserSearchLine,
  RiGovernmentLine,
  RiToolsLine,
  RiArrowRightLine,
  RiCheckboxCircleLine
} from "react-icons/ri";

const WorkFlowSection = () => {
  const steps = [
    {
      number: "01",
      title: "Smart Issue Reporting",
      description: "Multi-format reporting with AI-assisted documentation and automatic geotagging.",
      icon: <RiCameraLine />,
      color: "from-blue-500 to-cyan-500",
      bgGradient: "bg-gradient-to-br from-blue-50 to-cyan-50",
      borderColor: "border-blue-200"
    },
    {
      number: "02",
      title: "Community Verification",
      description: "Crowd-verified credibility scoring with proximity-based validation.",
      icon: <RiUserSearchLine />,
      color: "from-emerald-500 to-green-500",
      bgGradient: "bg-gradient-to-br from-emerald-50 to-green-50",
      borderColor: "border-emerald-200"
    },
    {
      number: "03",
      title: "Automated Resolution",
      description: "Intelligent task assignment with optimized routing and real-time tracking.",
      icon: <RiGovernmentLine />,
      color: "from-purple-500 to-indigo-500",
      bgGradient: "bg-gradient-to-br from-purple-50 to-indigo-50",
      borderColor: "border-purple-200"
    },
    {
      number: "04",
      title: "Analytics & Insights",
      description: "Comprehensive analytics with predictive modeling and performance insights.",
      icon: <RiToolsLine />,
      color: "from-orange-500 to-rose-500",
      bgGradient: "bg-gradient-to-br from-orange-50 to-rose-50",
      borderColor: "border-orange-200"
    },
  ];

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i = 1) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
    }),
  };

  const circleContainer = {
    hidden: { scale: 0 },
    visible: {
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.34, 1.56, 0.64, 1],
        staggerChildren: 0.1
      }
    }
  };

  const circleAnimation = {
    hidden: { 
      scale: 0,
      rotate: -180,
      opacity: 0
    },
    visible: {
      scale: 1,
      rotate: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.34, 1.56, 0.64, 1]
      }
    }
  };

  const ringAnimation = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 1,
        ease: "easeOut",
        delay: 0.3
      }
    }
  };

  const pulseAnimation = {
    initial: { scale: 1, opacity: 0.7 },
    animate: {
      scale: [1, 1.1, 1],
      opacity: [0.7, 0.4, 0.7],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const floatAnimation = {
    initial: { y: 0 },
    animate: {
      y: [-8, 8, -8],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 relative overflow-hidden">
      {/* Animated Background Elements */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute top-10 left-10 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.3 }}
        className="absolute bottom-10 right-10 w-72 h-72 bg-emerald-200/20 rounded-full blur-3xl"
      />
      
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        {/* Header Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeUp}
          className="text-center mb-20"
        >
          <motion.div
            variants={circleAnimation}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-2xl mb-6 relative"
          >
            <RiCheckboxCircleLine className="text-white text-2xl" />
            {/* Animated rings around header icon */}
            <motion.div
              variants={ringAnimation}
              className="absolute inset-0 rounded-full border-2 border-blue-300/30"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-bbh tracking-tight">
            Intelligent Workflow{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Process
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-agu">
            A sophisticated, automated workflow that ensures efficient civic issue resolution 
            through cutting-edge technology and community collaboration.
          </p>
        </motion.div>

        {/* Circular Workflow Steps */}
        <motion.div
          variants={circleContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 px-6"
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={fadeUp}
              custom={index}
              className="flex flex-col items-center text-center relative"
            >
              {/* Connecting Line for Desktop */}
              {index < steps.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, scaleX: 0 }}
                  whileInView={{ opacity: 1, scaleX: 1 }}
                  transition={{ delay: index * 0.2 + 0.5, duration: 0.6 }}
                  className="hidden lg:block absolute top-24 -right-6 w-12 h-0.5 bg-gradient-to-r from-gray-300 to-gray-200"
                />
              )}

              {/* Animated Circular Step */}
              <motion.div
                variants={circleAnimation}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
                className="relative w-44 h-44 mb-8 group cursor-pointer"
              >
                {/* Outer Animated Gradient Ring */}
                <motion.div
                  variants={ringAnimation}
                  animate={{ rotate: 360 }}
                  transition={{ 
                    duration: 12, 
                    repeat: Infinity, 
                    ease: "linear",
                    delay: index * 0.5
                  }}
                  className={`absolute inset-0 rounded-full bg-gradient-to-r ${step.color} p-[3px] opacity-80 group-hover:opacity-100 transition-opacity duration-500`}
                >
                  <div className="w-full h-full bg-white rounded-full" />
                </motion.div>

                {/* Middle Pulse Ring */}
                <motion.div
                  variants={pulseAnimation}
                  className={`absolute inset-3 rounded-full bg-gradient-to-r ${step.color} opacity-20`}
                />

                {/* Floating Inner Circle */}
                <motion.div
                  variants={floatAnimation}
                  className={`relative z-10 w-36 h-36 rounded-full ${step.bgGradient} flex flex-col items-center justify-center shadow-xl border ${step.borderColor} group-hover:shadow-2xl transition-all duration-500 mx-auto mt-1`}
                >
                  {/* Animated Step Number Badge */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center"
                  >
                    <span className="text-xs font-bold text-gray-700 font-bbh">
                      {step.number}
                    </span>
                  </motion.div>
                  
                  {/* Animated Icon Container */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className={`w-16 h-16 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center mb-2 shadow-lg`}
                  >
                    <motion.div 
                      className="text-white text-xl"
                      whileHover={{ scale: 1.2 }}
                    >
                      {step.icon}
                    </motion.div>
                  </motion.div>
                  
                  {/* Step Label */}
                  <motion.span 
                    className="text-xs font-semibold text-gray-500 uppercase tracking-wider font-bbh"
                    whileHover={{ color: "#4B5563" }}
                  >
                    Step
                  </motion.span>
                </motion.div>

                {/* Subtle Glow Effect */}
                <motion.div
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.7
                  }}
                  className={`absolute inset-0 rounded-full bg-gradient-to-r ${step.color} opacity-30 blur-sm`}
                />
              </motion.div>

              {/* Content with Staggered Animation */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 + 0.4 }}
                viewport={{ once: true }}
                className="space-y-4"
              >
                <motion.h3 
                  className="text-xl font-bold text-gray-900 font-bbh leading-tight"
                  whileHover={{ color: "#1E40AF" }}
                >
                  {step.title}
                </motion.h3>
                <motion.p 
                  className="text-gray-600 leading-relaxed font-agu text-sm"
                  whileHover={{ color: "#4B5563" }}
                >
                  {step.description}
                </motion.p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced Mobile Progress */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 lg:hidden"
        >
          <div className="flex justify-center items-center space-x-6">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.3
                  }}
                  className={`w-4 h-4 rounded-full bg-gradient-to-r ${step.color}`}
                />
                {index < steps.length - 1 && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ delay: index * 0.1 + 0.5 }}
                    className="w-8 h-0.5 bg-gradient-to-r from-gray-300 to-gray-200"
                  />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Enhanced CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1, duration: 0.6 }}
          className="text-center mt-16"
        >
        
        </motion.div>
      </div>
    </section>
  );
};

export default WorkFlowSection;