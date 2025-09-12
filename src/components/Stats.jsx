import React from "react";
import { motion } from "framer-motion";


const Stats = ({statsarr}) => {
  return (
    <div>
      {" "}
      <div className="relative rounded-2xl p-6 md:p-10 lg:p-14 text-white shadow-2xl overflow-hidden">
        {/* Background Glow Layer */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-700 via-indigo-600 to-blue-500 opacity-95" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_70%)]" />

        {/* Content */}
        <div className="relative grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 text-center">
          {statsarr.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.5,
                delay: 0.1 * index,
                ease: "easeOut",
              }}
              viewport={{ once: true, margin: "-20px" }}
              className="relative"
            >
              <div className="text-2xl md:text-3xl lg:text-4xl font-extrabold mb-1 md:mb-2 drop-shadow-lg">
                {stat.number}
              </div>
              <div className="text-blue-100 text-xs md:text-sm tracking-wide">
                {stat.label}
              </div>

              {/* Divider lines */}
              {index < 3 && (
                <div className="hidden md:block absolute top-1/2 -right-5 w-px h-12 bg-white/20 transform -translate-y-1/2"></div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stats;
