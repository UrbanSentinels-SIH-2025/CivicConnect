import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  RiUserLine,
  RiUserSettingsLine,
  RiUserHeartLine,
  RiCheckboxCircleLine,
  RiSearchLine,
  RiBarChartBoxLine,
  RiTimeLine,
  RiTeamLine,
  RiNotification3Line,
  RiDashboardLine,
  RiMapPinLine,
  RiCameraLine,
  RiThumbUpLine,
  RiEyeLine,
  RiGovernmentLine,
  RiArrowRightLine,
} from "react-icons/ri";
import Stats from "../../components/Stats";

const RoleDashboards = () => {
  const [activeRole, setActiveRole] = useState(0);
  const [hoveredFeature, setHoveredFeature] = useState(null);

  const statsarr = [
    { number: "3", label: "User Roles" },
    { number: "70%", label: "Faster Resolution" },
    { number: "90%", label: "Accuracy Rate" },
    { number: "24/7", label: "Availability" },
  ];

  const roles = [
    {
      icon: <RiUserLine className="text-xl md:text-2xl" />,
      title: "Citizen",
      description:
        "Report civic issues, track resolution progress, engage with community reports, and earn trust points.",
      color: "blue",
      features: [
        {
          name: "Quick Issue Reporting",
          icon: <RiCameraLine />,
          detail:
            "Submit issues with photos, voice notes, and automatic location tagging in under 60 seconds.",
        },
        {
          name: "Real-time Tracking",
          icon: <RiTimeLine />,
          detail:
            "Monitor your reported issues from submission to resolution with live status updates.",
        },
        {
          name: "Community Validation",
          icon: <RiThumbUpLine />,
          detail:
            "Verify and upvote/downvote issues reported by others in your neighborhood.",
        },
        {
          name: "Trust Score System",
          icon: <RiBarChartBoxLine />,
          detail:
            "Build your credibility score through accurate reporting and helpful validations.",
        },
      ],
    },
    {
      icon: <RiUserSettingsLine className="text-xl md:text-2xl" />,
      title: "Municipal Worker",
      description:
        "Receive assigned tasks, update issue status, and coordinate with teams in the field.",
      color: "purple",
      features: [
        {
          name: "Task Assignment",
          icon: <RiNotification3Line />,
          detail:
            "Receive prioritized tasks based on location, expertise, and current workload.",
        },
        {
          name: "Field Updates",
          icon: <RiCameraLine />,
          detail:
            "Provide visual proof of work completion directly from the field.",
        },
        {
          name: "Route Optimization",
          icon: <RiMapPinLine />,
          detail:
            "Get AI-optimized routes to handle multiple issues efficiently.",
        },
        {
          name: "Inventory Management",
          icon: <RiTeamLine />,
          detail:
            "Track resources and request supplies needed for issue resolution.",
        },
      ],
    },
    {
      icon: <RiUserHeartLine className="text-xl md:text-2xl" />,
      title: "Department Head",
      description:
        "Oversee department operations, allocate resources, and monitor team performance.",
      color: "orange",
      features: [
        {
          name: "Department Dashboard",
          icon: <RiDashboardLine />,
          detail:
            "Monitor all issues, team performance, and resource allocation in real-time.",
        },
        {
          name: "Resource Allocation",
          icon: <RiTeamLine />,
          detail:
            "Assign personnel and resources based on issue priority and location.",
        },
        {
          name: "Performance Analytics",
          icon: <RiBarChartBoxLine />,
          detail:
            "Track departmental KPIs, response times, and resolution rates.",
        },
        {
          name: "Budget Monitoring",
          icon: <RiBarChartBoxLine />,
          detail:
            "Oversee departmental spending and resource utilization efficiency.",
        },
      ],
    },
  ];

  const getColorClasses = (color) => {
    switch (color) {
      case "blue":
        return {
          bg: "bg-blue-500/10",
          text: "text-blue-600",
          border: "border-blue-200",
          gradient: "from-blue-500 to-blue-600",
          hover: "hover:from-blue-600 hover:to-blue-700",
          light: "bg-blue-50",
          dark: "bg-blue-600",
          shine: "from-blue-500 to-cyan-500"
        };
      case "purple":
        return {
          bg: "bg-purple-500/10",
          text: "text-purple-600",
          border: "border-purple-200",
          gradient: "from-purple-500 to-purple-600",
          hover: "hover:from-purple-600 hover:to-purple-700",
          light: "bg-purple-50",
          dark: "bg-purple-600",
          shine: "from-purple-500 to-violet-500"
        };
      case "orange":
        return {
          bg: "bg-orange-500/10",
          text: "text-orange-600",
          border: "border-orange-200",
          gradient: "from-orange-500 to-orange-600",
          hover: "hover:from-orange-600 hover:to-orange-700",
          light: "bg-orange-50",
          dark: "bg-orange-600",
          shine: "from-orange-500 to-amber-500"
        };
      default:
        return {
          bg: "bg-gray-500/10",
          text: "text-gray-600",
          border: "border-gray-200",
          gradient: "from-gray-500 to-gray-600",
          hover: "hover:from-gray-600 hover:to-gray-700",
          light: "bg-gray-50",
          dark: "bg-gray-600",
          shine: "from-gray-500 to-gray-400"
        };
    }
  };

  const currentRole = roles[activeRole];
  const color = getColorClasses(currentRole.color);

  return (
    <section id="roles" className="py-16 md:py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 overflow-hidden relative">
      {/* Background Elements */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2 }}
        className="absolute top-10 left-10 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, delay: 0.3 }}
        className="absolute bottom-10 right-10 w-72 h-72 bg-purple-200/20 rounded-full blur-3xl"
      />

      <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, margin: "-50px" }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.9, rotate: -5 }}
            whileInView={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg mb-5 relative overflow-hidden"
          >
            {/* Header icon shine effect */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-white/30 rounded-full blur-sm" />
            <RiGovernmentLine className="text-white text-2xl relative z-10" />
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-5 leading-tight font-bbh">
            Role-Specific Dashboards for{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Every Stakeholder
            </span>
          </h2>
          <p className="text-base md:text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed font-agu">
            Customized interfaces designed to streamline civic issue reporting and resolution for each participant in the ecosystem.
          </p>
        </motion.div>

        {/* Enhanced Interactive Role Selector */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-12 flex flex-wrap justify-center gap-3 md:gap-4"
        >
          {roles.map((role, index) => {
            const roleColor = getColorClasses(role.color);
            return (
              <motion.button
                key={index}
                onClick={() => setActiveRole(index)}
                whileHover={{ y: -4, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative px-6 py-3 rounded-xl font-medium text-sm flex items-center transition-all duration-300 font-bbh overflow-hidden group ${
                  index === activeRole 
                    ? `bg-gradient-to-r ${roleColor.gradient} text-white shadow-lg` 
                    : `${roleColor.bg} ${roleColor.text} ${roleColor.border} border shadow-sm hover:shadow-md`
                }`}
              >
                {/* Button shine effect */}
                {index === activeRole && (
                  <motion.div
                    initial={{ x: -100 }}
                    animate={{ x: 400 }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.5 }}
                    className="absolute top-0 left-0 w-20 h-full bg-white/20 skew-x-12"
                  />
                )}
                {role.icon}
                <span className="ml-2">{role.title}</span>
                
                {/* Active indicator */}
                {index === activeRole && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-2 w-2 h-2 bg-white rounded-full"
                  />
                )}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Enhanced Main Content Area */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Enhanced Role Details Card */}
          <motion.div 
            key={activeRole}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full lg:w-2/5 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 relative"
          >
            {/* Card shine effects */}
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-bl from-blue-100/40 to-transparent rounded-full blur-xl" />
            <div className="absolute -bottom-12 -left-12 w-24 h-24 bg-gradient-to-tr from-indigo-100/30 to-transparent rounded-full blur-xl" />

            <div className={`p-6 ${color.light} border-b ${color.border} relative z-10`}>
              <div className="flex items-center mb-4">
                <div className={`w-14 h-14 ${color.bg} rounded-xl flex items-center justify-center mr-4 shadow-sm border ${color.border} group-hover:scale-110 transition-transform duration-300`}>
                  {currentRole.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 font-bbh">{currentRole.title}</h3>
                  <p className="text-gray-600 text-sm mt-1 font-agu">{currentRole.description}</p>
                </div>
              </div>
            </div>

            <div className="p-6 relative z-10">
              <h4 className="font-semibold text-gray-800 mb-4 flex items-center font-bbh">
                <RiCheckboxCircleLine className={`mr-2 ${color.text}`} />
                Key Features
              </h4>
              <div className="space-y-4">
                {currentRole.features.map((feature, idx) => (
                  <motion.div 
                    key={idx}
                    onMouseEnter={() => setHoveredFeature(idx)}
                    onMouseLeave={() => setHoveredFeature(null)}
                    className={`p-4 rounded-xl border ${color.border} transition-all duration-300 group relative overflow-hidden ${
                      hoveredFeature === idx 
                        ? `shadow-lg ${color.light} scale-[1.02]` 
                        : 'bg-white hover:shadow-md'
                    }`}
                  >
                    {/* Feature card shine */}
                    <div className={`absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-bl ${color.shine} opacity-0 group-hover:opacity-20 rounded-full blur-sm transition-opacity duration-300`} />
                    
                    <div className="flex items-start relative z-10">
                      <div className={`p-2 rounded-lg ${color.bg} ${color.text} mr-3 border ${color.border} group-hover:scale-110 transition-transform duration-300`}>
                        {feature.icon}
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-800 font-bbh group-hover:text-gray-900 transition-colors duration-300">
                          {feature.name}
                        </h5>
                        <AnimatePresence>
                          {hoveredFeature === idx && (
                            <motion.p 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="text-sm text-gray-600 mt-2 font-agu"
                            >
                              {feature.detail}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                      <RiArrowRightLine className={`text-gray-400 group-hover:${color.text} transition-colors duration-300`} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Enhanced Visual Dashboard Representation */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full lg:w-3/5"
          >
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden h-full border border-gray-100 relative">
              {/* Dashboard shine effects */}
              <div className="absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-bl from-blue-100/30 to-transparent rounded-full blur-2xl" />
              
              <div className={`p-4 ${color.dark} text-white flex items-center font-bbh relative z-10`}>
                <RiDashboardLine className="mr-2" />
                <span className="font-medium">{currentRole.title} Dashboard</span>
                <div className="ml-auto flex space-x-1">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
              </div>
              
              <div className="p-6 relative z-10">
                {/* Enhanced Dashboard Preview */}
                <div className="grid grid-cols-12 gap-4 mb-6">
                  {/* Stats Cards with shine effects */}
                  {[
                    { icon: <RiEyeLine className="text-blue-600" />, label: "Reports Viewed", value: "42", color: "blue" },
                    { icon: <RiCheckboxCircleLine className="text-green-600" />, label: "Issues Resolved", value: "28", color: "green" },
                    { icon: <RiThumbUpLine className="text-purple-600" />, label: "Community Score", value: "92%", color: "purple" },
                  ].map((stat, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                      className="col-span-12 md:col-span-6 lg:col-span-4 bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group"
                    >
                      {/* Stat card shine */}
                      <div className={`absolute -top-4 -right-4 w-8 h-8 bg-${stat.color}-100/40 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                      
                      <div className="flex items-center relative z-10">
                        <div className={`w-10 h-10 bg-${stat.color}-100 rounded-lg flex items-center justify-center mr-3 border border-${stat.color}-200 group-hover:scale-110 transition-transform duration-300`}>
                          {stat.icon}
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 font-agu">{stat.label}</p>
                          <p className="text-lg font-bold text-gray-800 font-bbh">{stat.value}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {/* Enhanced Main Content Area */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="col-span-12 bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-200 shadow-sm relative overflow-hidden"
                  >
                    {/* Content area shine */}
                    <div className="absolute -top-8 -right-8 w-16 h-16 bg-gray-100/30 rounded-full blur-lg" />
                    
                    <div className="flex items-center mb-4 relative z-10">
                      <h4 className="font-semibold text-gray-800 font-bbh">Recent Reports</h4>
                      <div className="ml-auto flex bg-white rounded-lg px-3 py-1.5 text-sm border border-gray-200 shadow-sm">
                        <RiSearchLine className="text-gray-400 mr-2" />
                        <input 
                          type="text" 
                          placeholder="Search..." 
                          className="outline-none bg-transparent w-32 font-agu placeholder-gray-400"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-3 relative z-10">
                      {[1, 2, 3].map((item) => (
                        <motion.div 
                          key={item}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.7 + (item * 0.1) }}
                          className="bg-white rounded-lg p-3 flex items-center border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group"
                        >
                          <div className={`w-3 h-3 rounded-full ${color.bg} mr-3 border ${color.border}`}></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800 font-bbh group-hover:text-gray-900">
                              Issue Report #{item}
                            </p>
                            <p className="text-xs text-gray-500 font-agu">2 days ago</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs ${color.bg} ${color.text} font-medium font-bbh border ${color.border}`}>
                            In Progress
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>
                
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                  className="flex justify-center"
                >
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4].map((dot) => (
                      <div key={dot} className={`w-2 h-2 rounded-full ${dot === 1 ? color.dark : 'bg-gray-300'}`}></div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        
      </div>
    </section>
  );
};

export default RoleDashboards;