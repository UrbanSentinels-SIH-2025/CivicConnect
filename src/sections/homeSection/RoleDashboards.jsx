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
          bg: "bg-blue-100",
          text: "text-blue-600",
          border: "border-blue-200",
          gradient: "from-blue-500 to-blue-600",
          hover: "hover:from-blue-600 hover:to-blue-700",
          light: "bg-blue-50",
          dark: "bg-blue-600"
        };
      case "purple":
        return {
          bg: "bg-purple-100",
          text: "text-purple-600",
          border: "border-purple-200",
          gradient: "from-purple-500 to-purple-600",
          hover: "hover:from-purple-600 hover:to-purple-700",
          light: "bg-purple-50",
          dark: "bg-purple-600"
        };
      case "orange":
        return {
          bg: "bg-orange-100",
          text: "text-orange-600",
          border: "border-orange-200",
          gradient: "from-orange-500 to-orange-600",
          hover: "hover:from-orange-600 hover:to-orange-700",
          light: "bg-orange-50",
          dark: "bg-orange-600"
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-600",
          border: "border-gray-200",
          gradient: "from-gray-500 to-gray-600",
          hover: "hover:from-gray-600 hover:to-gray-700",
          light: "bg-gray-50",
          dark: "bg-gray-600"
        };
    }
  };

  const currentRole = roles[activeRole];
  const color = getColorClasses(currentRole.color);

  return (
    <section id="roles" className="py-16 md:py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50 overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
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
            className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-5"
          >
            <RiGovernmentLine className="text-blue-600 text-2xl" />
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-5 leading-tight">
            Role-Specific Dashboards for{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Every Stakeholder
            </span>
          </h2>
          <p className="text-base md:text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Customized interfaces designed to streamline civic issue reporting and resolution for each participant in the ecosystem.
          </p>
        </motion.div>

        {/* Interactive Role Selector */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-12 flex flex-wrap justify-center gap-2 md:gap-3"
        >
          {roles.map((role, index) => {
            const roleColor = getColorClasses(role.color);
            return (
              <motion.button
                key={index}
                onClick={() => setActiveRole(index)}
                whileHover={{ y: -3, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2.5 rounded-lg ${index === activeRole ? `${roleColor.dark} text-white shadow-md` : `${roleColor.bg} ${roleColor.text}`} font-medium text-sm flex items-center transition-all duration-300`}
              >
                {role.icon}
                <span className="ml-2">{role.title}</span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Main Content Area */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Role Details Card */}
          <motion.div 
            key={activeRole}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full lg:w-2/5 bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <div className={`p-6 ${color.light} border-b ${color.border}`}>
              <div className="flex items-center mb-4">
                <div className={`w-14 h-14 ${color.bg} rounded-xl flex items-center justify-center mr-4 shadow-sm`}>
                  {currentRole.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{currentRole.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">{currentRole.description}</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                <RiCheckboxCircleLine className={`mr-2 ${color.text}`} />
                Key Features
              </h4>
              <div className="space-y-4">
                {currentRole.features.map((feature, idx) => (
                  <motion.div 
                    key={idx}
                    onMouseEnter={() => setHoveredFeature(idx)}
                    onMouseLeave={() => setHoveredFeature(null)}
                    className={`p-4 rounded-xl border ${color.border} transition-all duration-300 ${hoveredFeature === idx ? 'shadow-md ' + color.light : 'bg-white'}`}
                  >
                    <div className="flex items-start">
                      <div className={`p-2 rounded-lg ${color.bg} ${color.text} mr-3`}>
                        {feature.icon}
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-800">{feature.name}</h5>
                        <AnimatePresence>
                          {hoveredFeature === idx && (
                            <motion.p 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="text-sm text-gray-600 mt-2"
                            >
                              {feature.detail}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Visual Dashboard Representation */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full lg:w-3/5"
          >
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-full">
              <div className={`p-4 ${color.dark} text-white flex items-center`}>
                <RiDashboardLine className="mr-2" />
                <span className="font-medium">{currentRole.title} Dashboard</span>
                <div className="ml-auto flex space-x-1">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
              </div>
              
              <div className="p-6">
                {/* Dashboard Preview */}
                <div className="grid grid-cols-12 gap-4 mb-6">
                  {/* Stats Cards */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="col-span-12 md:col-span-6 lg:col-span-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4"
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-200 rounded-lg flex items-center justify-center mr-3">
                        <RiEyeLine className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Reports Viewed</p>
                        <p className="text-lg font-bold text-gray-800">42</p>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                    className="col-span-12 md:col-span-6 lg:col-span-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4"
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-green-200 rounded-lg flex items-center justify-center mr-3">
                        <RiCheckboxCircleLine className="text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Issues Resolved</p>
                        <p className="text-lg font-bold text-gray-800">28</p>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 }}
                    className="col-span-12 lg:col-span-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4"
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-purple-200 rounded-lg flex items-center justify-center mr-3">
                        <RiThumbUpLine className="text-purple-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Community Score</p>
                        <p className="text-lg font-bold text-gray-800">92%</p>
                      </div>
                    </div>
                  </motion.div>
                  
                  {/* Main Content Area */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="col-span-12 bg-gray-50 rounded-xl p-4"
                  >
                    <div className="flex items-center mb-4">
                      <h4 className="font-semibold text-gray-800">Recent Reports</h4>
                      <div className="ml-auto flex bg-white rounded-lg px-3 py-1.5 text-sm">
                        <RiSearchLine className="text-gray-400 mr-2" />
                        <input 
                          type="text" 
                          placeholder="Search..." 
                          className="outline-none bg-transparent w-32"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {[1, 2, 3].map((item) => (
                        <motion.div 
                          key={item}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.7 + (item * 0.1) }}
                          className="bg-white rounded-lg p-3 flex items-center border border-gray-200"
                        >
                          <div className={`w-3 h-3 rounded-full ${color.bg} mr-3`}></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800">Issue Report #{item}</p>
                            <p className="text-xs text-gray-500">2 days ago</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs ${color.bg} ${color.text} font-medium`}>
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

        {/* Stats Bar */}
      <div className="mt-16">
         <Stats statsarr={statsarr}/>
      </div>
      </div>
    </section>
  );
};

export default RoleDashboards;