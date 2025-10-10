import React from "react";
import { motion } from "framer-motion";

const Stats = ({ statsarr }) => {
  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="relative rounded-2xl p-8 text-white shadow-xl overflow-hidden"
      >
        {/* Clean Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700" />
        
        {/* Subtle Shine Effects */}
        <div className="absolute -top-12 -right-12 w-24 h-24 bg-white/10 rounded-full blur-xl" />
        <div className="absolute -bottom-12 -left-12 w-24 h-24 bg-white/5 rounded-full blur-xl" />

        {/* Content */}
        <div className="relative grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {statsarr.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="text-2xl md:text-3xl font-bold mb-1 bg-gradient-to-br from-white to-blue-100 bg-clip-text text-transparent">
                {stat.number}
              </div>
              <div className="text-blue-100/80 text-sm font-medium">
                {stat.label}
              </div>

              {/* Simple Divider */}
              {index < statsarr.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-3 w-px h-8 bg-white/20 transform -translate-y-1/2" />
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Stats;