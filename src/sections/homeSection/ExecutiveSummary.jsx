import { motion } from "framer-motion";
import {
  MapPin,
  Building2,
  Search,
  Lightbulb,
  Shield,
  Bot,
  Heart,
  Route,
  BarChart3,
  Globe
} from "lucide-react";
import Stats from "../../components/Stats";

const ExecutiveSummary = () => {

  const statsarr=[{
  number: "70%", label: "Faster Resolution"
},
{ number: "90%", label: "Reduced False Reports"
},
{ number: "360°", label: "Transparency"
},
{ number: "24/7", label: "Accessibility"
}]

  return (
    <section
      id="features"
      className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50  pt-16 md:pt-24 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden relative"
    >
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        {/* Section Header - Left Aligned */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.6,
            ease: "easeOut"
          }}
          viewport={{ once: true, margin: "-50px" }}
          className="text-left mb-16 md:mb-20"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 rounded-2xl shadow-md mb-5">
            <Building2 className="text-blue-600 text-2xl" />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-5 md:mb-6 leading-tight">
            Transforming Civic Engagement with{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Community-Powered Technology
            </span>
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-4xl leading-relaxed">
            CivicConnect replaces outdated reporting methods with a modern, AI-powered platform that connects citizens with municipal services through real-time issue reporting, intelligent routing, and transparent resolution tracking.
          </p>
        </motion.div>

        {/* Challenge & Innovation - Stacked Vertically */}
        <div className="space-y-8 md:space-y-12">
          {/* The Challenge We Solve */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.6,
              ease: "easeOut",
              delay: 0.1
            }}
            viewport={{ once: true, margin: "-50px" }}
            className="bg-white rounded-2xl p-6 md:p-8 lg:p-10 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center mb-6 md:mb-8">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-red-100 rounded-xl flex items-center justify-center mr-4 shadow-sm">
                <Search className="text-red-600 text-xl md:text-2xl" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                The Civic Engagement Gap
              </h3>
            </div>

            <p className="text-gray-600 mb-6 md:mb-8 text-base md:text-lg leading-relaxed">
              Traditional civic issue reporting suffers from systemic inefficiencies that hinder community development:
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              {[
                "No centralized platform for reporting and tracking civic issues",
                "Lack of transparency in municipal response and resolution processes",
                "Inefficient manual workflows for assigning issues to departments",
                "No mechanism for community validation or prioritization of problems",
                "Limited accessibility for non-technical or elderly citizens",
                "Inability to anticipate and prevent recurring civic issues",
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ 
                    duration: 0.4, 
                    delay: 0.05 * index,
                    ease: "easeOut"
                  }}
                  viewport={{ once: true, margin: "-20px" }}
                  className="flex items-start"
                >
                  <div className="w-5 h-5 md:w-6 md:h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mr-3 mt-1">
                    <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-red-600 rounded-full"></div>
                  </div>
                  <span className="text-gray-700 text-sm md:text-base">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Our Innovation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.6,
              ease: "easeOut",
              delay: 0.1
            }}
            viewport={{ once: true, margin: "-50px" }}
            className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 md:p-8 lg:p-10 shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center mb-6 md:mb-8">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-100 rounded-xl flex items-center justify-center mr-4 shadow-sm">
                <Lightbulb className="text-blue-600 text-xl md:text-2xl" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900">Our Innovation</h3>
            </div>

            <p className="text-gray-600 mb-6 md:mb-8 text-base md:text-lg leading-relaxed">
              CivicConnect delivers a comprehensive platform that transforms civic issue reporting into a collaborative, efficient process:
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {[
                {
                  icon: <MapPin className="text-green-600 text-lg md:text-xl" />,
                  bg: "bg-green-100",
                  title: "Geo-Tagged Reporting",
                  description: "Automatic location tagging with photo and voice documentation",
                },
                {
                  icon: <Bot className="text-purple-600 text-lg md:text-xl" />,
                  bg: "bg-purple-100",
                  title: "AI-Priority Assessment",
                  description: "Intelligent severity evaluation for optimal resource allocation",
                },
                {
                  icon: <Heart className="text-orange-600 text-lg md:text-xl" />,
                  bg: "bg-orange-100",
                  title: "Community Verification",
                  description: "Local validation through upvotes and comments on reports",
                },
                {
                  icon: <Route className="text-blue-600 text-lg md:text-xl" />,
                  bg: "bg-blue-100",
                  title: "Smart Municipal Routing",
                  description: "Automated task delegation to appropriate departments",
                },
                {
                  icon: <BarChart3 className="text-indigo-600 text-lg md:text-xl" />,
                  bg: "bg-indigo-100",
                  title: "Predictive Civic Analytics",
                  description: "AI forecasting of recurring issues for preventive action",
                },
                {
                  icon: <Globe className="text-red-600 text-lg md:text-xl" />,
                  bg: "bg-red-100",
                  title: "Multi-Language Support",
                  description: "Voice reporting in local languages with auto-transcription",
                },
                {
                  icon: <Shield className="text-teal-600 text-lg md:text-xl" />,
                  bg: "bg-teal-100",
                  title: "Citizen Trust System",
                  description: "Reputation scoring for accurate reporting and validation",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.4, 
                    delay: 0.05 * index,
                    ease: "easeOut"
                  }}
                  viewport={{ once: true, margin: "-20px" }}
                  className="flex flex-col items-center text-center p-4 md:p-5 rounded-xl bg-white/80 backdrop-blur-sm border border-white/60 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div
                    className={`w-12 h-12 md:w-14 md:h-14 ${item.bg} rounded-lg flex items-center justify-center flex-shrink-0 mb-3`}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm md:text-base mb-2">
                      {item.title}
                    </h4>
                    <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Stats Banner - Centered with different layout */}
       <motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
  viewport={{ once: true, margin: "-50px" }}
  className="mt-16 md:mt-20 lg:mt-24"
>
  <div className="text-center mb-8">
    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
      Measurable Impact
    </h3>
    <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
      Our platform delivers quantifiable improvements in civic engagement and municipal efficiency
    </p>
  </div>

  {/* Stylish Gradient Background */}
   <Stats statsarr={statsarr} />


</motion.div>

      </div>
    </section>
  );
};

export default ExecutiveSummary;