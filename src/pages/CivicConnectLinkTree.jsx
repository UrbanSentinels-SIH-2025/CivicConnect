import React from "react";
import {
  FaUsers,
  FaShieldAlt,
  FaBolt,
  FaWater,
  FaTrash,
  FaArrowRight,
  FaCity
} from "react-icons/fa";

const CivicConnectLinkTree = () => {
  const links = [
    {
      name: "Citizen Portal",
      url: "https://civicconnecturbansentinels.netlify.app/",
      icon: <FaUsers className="text-2xl text-blue-500" />,
      desc: "Report issues & track progress",
    },
    {
      name: "Admin Dashboard",
      url: "https://civicconnecturbansentinels.netlify.app/admin/dashboard",
      icon: <FaShieldAlt className="text-2xl text-green-500" />,
      desc: "Monitor stats & verify resolutions",
    },
    {
      name: "Electricity Department",
      url: "https://civicconnecturbansentinels.netlify.app/department/Electricity",
      icon: <FaBolt className="text-2xl text-yellow-500" />,
      desc: "Manage electricity complaints",
    },
    {
      name: "Water Department",
      url: "https://civicconnecturbansentinels.netlify.app/department/Water",
      icon: <FaWater className="text-2xl text-blue-700" />,
      desc: "Track water supply issues",
    },
    {
      name: "Sanitation Department",
      url: "https://civicconnecturbansentinels.netlify.app/department/Sanitation",
      icon: <FaTrash className="text-2xl text-gray-700" />,
      desc: "Oversee waste management",
    },
  ];

  return (
    <div className="min-h-screen flex justify-center bg-gradient-to-b from-blue-100 to-blue-400 p-4">
      <div className="max-w-2xl w-full">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-black rounded-2xl flex items-center justify-center shadow-sm border border-gray-100">
            <FaCity className="text-blue-100 text-xl sm:text-2xl" />
          </div>
          <h1 className="text-4xl font-bold font-serif mt-2">CivicConnect</h1>
        </div>
        <p className="text-center font-bold text-gray-900 mb-6">
          This page showcases the different portals for different users based on their use case.
          Please visit the respective link to access the portal.
        </p>

        {/* links */}
        <div className="flex flex-col gap-4">
          {links.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-black rounded-2xl py-4 px-4 flex justify-between items-center bg-white shadow-lg hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="flex items-center gap-4">
                {link.icon}
                <div>
                  <h1 className="text-xl font-bold font-mono">{link.name}</h1>
                  <p className="text-sm text-gray-900">{link.desc}</p>
                </div>
              </div>
              <FaArrowRight />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CivicConnectLinkTree;
