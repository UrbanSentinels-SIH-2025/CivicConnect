import React from 'react'
import { useReports } from '../../hooks/tanstack/useReports'
import { FaFlag, FaCheckCircle, FaUsers, FaMedal } from "react-icons/fa";

const StatsCard = () => {
    const { data: reports = [] } = useReports();
    
    const totalReports = reports.length;
    const issuesResolved = reports.filter(report => report.progress.resolved.completed === true).length;
    
    const pendingReports = reports.filter(report => report.progress.resolved.completed === false).length;
    const totalVerifications = reports.reduce((total, report) => 
        total + report.verifications.real.length, 0
    );

    const stats = {
        reportsSubmitted: totalReports,
        issuesResolved: issuesResolved,
        verifications: totalVerifications,
        pendingReports: pendingReports,
    };

    const cards = [
        {
            title: "Reports Submitted",
            icon: <FaFlag className="text-white text-xl" />,
            color: "from-blue-500 to-blue-600",
            borderGlow: "hover:border-blue-400 hover:shadow-[0_0_20px_#3b82f6]",
            value: stats.reportsSubmitted || 0,
        },
        {
            title: "Issues Resolved",
            icon: <FaCheckCircle className="text-white text-xl" />,
            color: "from-green-500 to-green-600",
            borderGlow: "hover:border-green-400 hover:shadow-[0_0_20px_#22c55e]",
            value: stats.issuesResolved || 0,
        },
        {
            title: "Verifications",
            icon: <FaUsers className="text-white text-xl" />,
            color: "from-purple-500 to-purple-600",
            borderGlow: "hover:border-purple-400 hover:shadow-[0_0_20px_#a855f7]",
            value: stats.verifications || 0,
        },
        {
            title: "Pending Reports",
            icon: <FaMedal className="text-white text-xl" />,
            color: "from-orange-500 to-orange-600",
            borderGlow: "hover:border-orange-400 hover:shadow-[0_0_20px_#f97316]",
            value: stats.pendingReports || 0,
        },
    ];

    return (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {cards.map((card, index) => (
                <div
                    key={index}
                    className={`bg-gradient-to-r ${card.color} rounded-xl shadow-lg p-4 flex items-center text-white transform hover:scale-105 transition-all duration-300 border border-transparent ${card.borderGlow}`}
                >
                    <div className="rounded-full bg-white/20 p-3 mr-4 backdrop-blur-sm">
                        {card.icon}
                    </div>
                    <div>
                        <p className="text-sm opacity-80 font-iceberg">{card.title}</p>
                        <p className="text-2xl font-bold">{card.value}</p>
             
                    </div>
                </div>
            ))}
        </section>
    )
}

export default StatsCard