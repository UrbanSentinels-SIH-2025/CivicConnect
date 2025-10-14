import { FaCamera, FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ActionGrid = () => {
  const navigate = useNavigate();

  const actions = [
    { 
      title: "Report Issue", 
      link: "/user/report", 
      gradient: "from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700", 
      icon: <FaCamera /> 
    },
    { 
      title: "Verify Issues", 
      link: "/user/community-reports", 
      gradient: "from-green-500 to-green-600 hover:from-green-600 hover:to-green-700", 
      icon: <FaCheckCircle /> 
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {actions.map((action, idx) => (
        <div
          key={idx}
          onClick={() => navigate(action.link)}
          className={`flex flex-col items-center justify-center p-6 rounded-xl cursor-pointer
            bg-gradient-to-br ${action.gradient} text-white transition-all duration-300 
            hover:scale-105 hover:shadow-[0_0_15px_rgba(255,255,255,0.4)]`}
        >
          <div className="w-16 h-16 rounded-full bg-white/30 flex items-center justify-center mb-3 shadow-lg backdrop-blur-sm text-2xl">
            {action.icon}
          </div>
          <span className="text-lg font-semibold">{action.title}</span>
        </div>
      ))}
    </div>
  );
};

export default ActionGrid;
