// components/common/WorkInProgress.jsx
import { FaTools } from "react-icons/fa";

const WorkInProgress = ({ title }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <FaTools className="text-6xl text-gray-400 mb-4 animate-pulse" />
      <h1 className="text-2xl font-semibold text-gray-700">{title}</h1>
      <p className="text-gray-500 mt-2">This feature is under development 🚧</p>
    </div>
  );
};

export default WorkInProgress;
