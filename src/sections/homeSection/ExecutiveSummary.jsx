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
  Globe,
} from "lucide-react";
import Stats from "../../components/Stats";

const ExecutiveSummary = () => {
  const statsarr = [
    { number: "70%", label: "Faster Resolution" },
    { number: "90%", label: "Reduced False Reports" },
    { number: "360°", label: "Transparency" },
    { number: "24/7", label: "Accessibility" },
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
    viewport: { once: true, margin: "-50px" },
  };

  return (
    <section
      id="features"
      className="relative min-h-screen bg-gradient-to-br from-blue-100 via-indigo-50 to-blue-100 pt-16 md:pt-24 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Subtle Animated Blobs */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute top-32 -left-10 w-80 h-80 bg-blue-300/20 rounded-full blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: "easeOut", delay: 0.3 }}
        className="absolute bottom-20 -right-16 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl"
      />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        {/* Header */}
        <motion.div {...fadeInUp} className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg mb-5">
            <Building2 className="text-white text-2xl" />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bbh font-extrabold text-gray-900 mb-5 leading-tight">
            Transforming Civic Engagement with{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent drop-shadow-sm">
              Community-Powered Technology
            </span>
          </h2>
        </motion.div>

        {/* The Challenge */}
        <motion.div
          {...fadeInUp}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 backdrop-blur-md rounded-2xl p-8 md:p-10 shadow-lg border border-white/40 hover:shadow-xl transition-all duration-300 mb-10 relative overflow-hidden"
        >
          {/* Half-circle shine effect */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-xl" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-gradient-to-tr from-white/15 to-transparent rounded-full blur-xl" />
          
          <div className="relative z-10">
            <div className="flex items-center mb-8">
              <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mr-4 shadow-sm">
                <Search className="text-red-600 text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-white">The Civic Engagement Gap</h3>
            </div>
            <p className="text-white/90 text-lg font-semibold mb-8 leading-relaxed font-agu">
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
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.05 * i }}
                  viewport={{ once: true }}
                  className="flex items-start"
                >
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-3 mt-1">
                    <div className="w-2.5 h-2.5 bg-black rounded-full" />
                  </div>
                  <span className="text-white/90 font-agu">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Our Innovation */}
        <motion.div
          {...fadeInUp}
          className="bg-gradient-to-br from-white/90 to-blue-50/80 backdrop-blur-md rounded-2xl p-8 md:p-10 shadow-lg border border-white/40 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
        >
          {/* Half-circle shine effects */}
          <div className="absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-bl from-blue-100/40 to-transparent rounded-full blur-2xl" />
          <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-gradient-to-tr from-indigo-100/30 to-transparent rounded-full blur-2xl" />
          
          <div className="relative z-10">
            <div className="flex items-center mb-8">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mr-4 shadow-sm">
                <Lightbulb className="text-blue-600 text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 font-bbh">Our Innovation</h3>
            </div>
            <p className="text-gray-700 mb-8 leading-relaxed font-agu">
              CivicConnect delivers a comprehensive platform that transforms civic issue reporting into a collaborative, efficient process:
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: <MapPin className="text-green-600" />, bg: "bg-green-100", title: "Geo-Tagged Reporting", desc: "Automatic location tagging with photo and voice documentation", color: "from-green-500 to-emerald-500" },
                { icon: <Bot className="text-purple-600" />, bg: "bg-purple-100", title: "AI-Priority Assessment", desc: "Intelligent severity evaluation for optimal resource allocation", color: "from-purple-500 to-violet-500" },
                { icon: <Heart className="text-orange-600" />, bg: "bg-orange-100", title: "Community Verification", desc: "Local validation through upvotes and comments on reports", color: "from-orange-500 to-amber-500" },
                { icon: <Route className="text-blue-600" />, bg: "bg-blue-100", title: "Smart Municipal Routing", desc: "Automated task delegation to appropriate departments", color: "from-blue-500 to-cyan-500" },
                { icon: <BarChart3 className="text-indigo-600" />, bg: "bg-indigo-100", title: "Predictive Civic Analytics", desc: "AI forecasting of recurring issues for preventive action", color: "from-indigo-500 to-blue-500" },
                { icon: <Globe className="text-red-600" />, bg: "bg-red-100", title: "Multi-Language Support", desc: "Voice reporting in local languages with auto-transcription", color: "from-red-500 to-pink-500" },
                { icon: <Shield className="text-teal-600" />, bg: "bg-teal-100", title: "Citizen Trust System", desc: "Reputation scoring for accurate reporting and validation", color: "from-teal-500 to-green-500" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.05 * i }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center text-center p-6 rounded-xl bg-gradient-to-br from-gray-900 to-black backdrop-blur-sm border border-gray-800 shadow-lg hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 relative overflow-hidden group"
                >
                  {/* Animated half-circle shine effects */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    className="absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-bl from-white/10 to-transparent rounded-full blur-md group-hover:opacity-40 transition-opacity duration-500"
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: i * 0.1 + 0.2 }}
                    className="absolute -bottom-12 -left-12 w-24 h-24 bg-gradient-to-tr from-white/5 to-transparent rounded-full blur-md group-hover:opacity-30 transition-opacity duration-500"
                  />
                  
                  {/* Corner gradient accents */}
                  <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl ${item.color} opacity-5 rounded-tr-xl`} />
                  <div className={`absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr ${item.color} opacity-5 rounded-bl-xl`} />

                  <div className="relative z-10">
                    <div className={`w-14 h-14 ${item.bg} rounded-lg flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                      {item.icon}
                    </div>
                    <h4 className="font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent drop-shadow-sm font-bbh">
                      {item.title}
                    </h4>
                    <p className="text-gray-300 font-agu text-sm leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                      {item.desc}
                    </p>
                  </div>

                  {/* Hover border gradient */}
                  <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 -z-10`} />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div {...fadeInUp} transition={{ ...fadeInUp.transition, delay: 0.2 }} className="mt-20">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 font-bbh">
              Measurable Impact
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto font-agu text-xl">
              Our platform delivers quantifiable improvements in civic engagement and municipal efficiency
            </p>
          </div>
          <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-[2px] shadow-lg relative overflow-hidden">
            {/* Stats card shine effects */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
            
            <div className="rounded-2xl bg-white/90 backdrop-blur-md p-6 relative z-10">
              <Stats statsarr={statsarr} />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ExecutiveSummary;