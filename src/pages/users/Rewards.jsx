import React, { useState } from 'react';
import { 
  FaTrophy, 
  FaMedal, 
  FaAward, 
  FaStar, 
  FaCoins, 
  FaChartLine, 
  FaCheckCircle,
  FaUserFriends,
  FaCrown,
  FaShieldAlt
} from 'react-icons/fa';

const Rewards = () => {
  const [activeTab, setActiveTab] = useState('badges');
  
  // Sample user data
  const userStats = {
    points: 100,
    level: 3,
    rank: '#42',
    nextLevelPoints: 1500,
    reportsThisMonth: 12,
    verificationsThisMonth: 28
  };

  // Badges data
  const badges = [
    { id: 1, name: 'First Report', icon: <FaStar className="text-yellow-500" />, earned: true, description: 'Submitted your first issue report' },
    { id: 2, name: 'Community Verifier', icon: <FaCheckCircle className="text-green-500" />, earned: true, description: 'Verified 25+ community reports' },
    { id: 3, name: 'Neighborhood Hero', icon: <FaShieldAlt className="text-blue-500" />, earned: true, description: 'Resolved 10+ issues in your area' },
    { id: 4, name: 'Influencer', icon: <FaUserFriends className="text-purple-500" />, earned: false, description: 'Your reports got 50+ verifications' },
    { id: 5, name: 'Consistency', icon: <FaChartLine className="text-teal-500" />, earned: false, description: 'Active for 30 consecutive days' },
    { id: 6, name: 'Elite Contributor', icon: <FaCrown className="text-amber-500" />, earned: false, description: 'Top 10 contributor this month' }
  ];

  // Levels data
  const levels = [
    { level: 1, points: 0, reward: 'Starter Badge' },
    { level: 2, points: 100, reward: 'Verification Power' },
    { level: 3, points: 250, reward: 'Priority Support' },
    { level: 4, points: 500, reward: 'Exclusive Badge' },
    { level: 5, points: 750, reward: 'Profile Highlight' },
    { level: 6, points: 1000, reward: 'Community Leader Status' },
    { level: 7, points: 1500, reward: 'Special Recognition' },
    { level: 8, points: 2000, reward: 'Early Feature Access' },
    { level: 9, points: 3000, reward: 'Custom Title' },
    { level: 10, points: 5000, reward: 'Legend Status' }
  ];

  return (
    <div className="p-4 md:p-6 min-h-screen ">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Rewards & Recognition</h1>
        <p className="text-gray-600">Earn points, badges, and rewards for your civic contributions</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Points */}
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl shadow p-4 flex items-center text-white">
          <div className="rounded-full bg-white/20 p-3 mr-4">
            <FaCoins className="text-white text-xl" />
          </div>
          <div>
            <p className="text-sm opacity-80">Total Points</p>
            <p className="text-2xl font-bold">{userStats.points}</p>
            <p className="text-xs opacity-80 mt-1">{userStats.points} points earned</p>
          </div>
        </div>

        {/* Level */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow p-4 flex items-center text-white">
          <div className="rounded-full bg-white/20 p-3 mr-4">
            <FaChartLine className="text-white text-xl" />
          </div>
          <div>
            <p className="text-sm opacity-80">Current Level</p>
            <p className="text-2xl font-bold">{userStats.level}</p>
            <p className="text-xs opacity-80 mt-1">{userStats.nextLevelPoints - userStats.points} to next level</p>
          </div>
        </div>

        {/* Rank */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow p-4 flex items-center text-white">
          <div className="rounded-full bg-white/20 p-3 mr-4">
            <FaTrophy className="text-white text-xl" />
          </div>
          <div>
            <p className="text-sm opacity-80">Community Rank</p>
            <p className="text-2xl font-bold">{userStats.rank}</p>
            <p className="text-xs opacity-80 mt-1">Top contributor</p>
          </div>
        </div>

        {/* Monthly Activity */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow p-4 flex items-center text-white">
          <div className="rounded-full bg-white/20 p-3 mr-4">
            <FaUserFriends className="text-white text-xl" />
          </div>
          <div>
            <p className="text-sm opacity-80">Monthly Activity</p>
            <p className="text-2xl font-bold">{userStats.reportsThisMonth + userStats.verificationsThisMonth}</p>
            <p className="text-xs opacity-80 mt-1">{userStats.reportsThisMonth} reports, {userStats.verificationsThisMonth} verifications</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-gradient-to-r from-white to-indigo-50 rounded-xl shadow-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Level {userStats.level} Progress</span>
          <span className="text-sm font-medium text-gray-700">{userStats.points} / {userStats.nextLevelPoints} points</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2.5 rounded-full" 
            style={{ width: `${(userStats.points / userStats.nextLevelPoints) * 100}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Reach {userStats.nextLevelPoints} points to advance to Level {userStats.level + 1}
        </p>
      </div>

      {/* Tabs - Only Badges and Levels */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-2 px-4 font-medium text-sm ${activeTab === 'badges' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('badges')}
        >
          <FaMedal className="inline mr-2" />
          Badges
        </button>
        <button
          className={`py-2 px-4 font-medium text-sm ${activeTab === 'levels' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('levels')}
        >
          <FaChartLine className="inline mr-2" />
          Levels
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'badges' && (
        <div className="bg-gradient-to-r from-white to-indigo-50 rounded-xl shadow-lg p-6 mb-8">
          <h3 className="font-semibold text-lg text-indigo-700 mb-4">Your Badges</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {badges.map(badge => (
              <div 
                key={badge.id} 
                className={`p-4 rounded-xl border ${badge.earned ? 'bg-white border-blue-200 shadow-sm' : 'bg-gray-100 border-gray-200 opacity-70'} transition-all hover:shadow-md`}
              >
                <div className="flex items-center mb-3">
                  <div className="text-2xl mr-3">
                    {badge.icon}
                  </div>
                  <h4 className="font-medium text-gray-800">{badge.name}</h4>
                </div>
                <p className="text-sm text-gray-600 mb-3">{badge.description}</p>
                <div className={`text-xs font-medium px-2 py-1 rounded-full inline-block ${badge.earned ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-800'}`}>
                  {badge.earned ? 'Earned' : 'Locked'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'levels' && (
        <div className="bg-gradient-to-r from-white to-indigo-50 rounded-xl shadow-lg p-6 mb-8">
          <h3 className="font-semibold text-lg text-indigo-700 mb-4">Level Progression</h3>
          <div className="space-y-4">
            {levels.map(level => (
              <div 
                key={level.level} 
                className={`flex items-center justify-between p-4 rounded-xl border ${userStats.level >= level.level ? 'bg-white border-blue-200 shadow-sm' : 'bg-gray-50 border-gray-200'} ${userStats.level === level.level ? 'ring-2 ring-blue-500' : ''}`}
              >
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${userStats.level >= level.level ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-600'}`}>
                    {userStats.level > level.level ? (
                      <FaCheckCircle className="text-green-500" />
                    ) : (
                      <span className="font-bold">{level.level}</span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Level {level.level}</h4>
                    <p className="text-sm text-gray-600">{level.points} points</p>
                  </div>
                </div>
                <span className={`text-sm font-medium ${userStats.level >= level.level ? 'text-green-600' : 'text-gray-500'}`}>
                  {userStats.level >= level.level ? level.reward : 'Locked'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* How to Earn Section */}
      <div className="bg-gradient-to-r from-white to-green-50 rounded-xl shadow-lg p-6">
        <h3 className="font-semibold text-lg text-green-700 mb-4">How to Earn Points</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start">
            <div className="bg-green-100 p-2 rounded-lg mr-3">
              <FaCheckCircle className="text-green-600 text-xl" />
            </div>
            <div>
              <h4 className="font-medium text-gray-800">Submit Reports</h4>
              <p className="text-sm text-gray-600">Earn 25 points for each verified issue report</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="bg-blue-100 p-2 rounded-lg mr-3">
              <FaUserFriends className="text-blue-600 text-xl" />
            </div>
            <div>
              <h4 className="font-medium text-gray-800">Verify Issues</h4>
              <p className="text-sm text-gray-600">Earn 10 points for each accurate verification</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="bg-purple-100 p-2 rounded-lg mr-3">
              <FaChartLine className="text-purple-600 text-xl" />
            </div>
            <div>
              <h4 className="font-medium text-gray-800">Maintain Streaks</h4>
              <p className="text-sm text-gray-600">Bonus points for consistent weekly activity</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="bg-yellow-100 p-2 rounded-lg mr-3">
              <FaTrophy className="text-yellow-600 text-xl" />
            </div>
            <div>
              <h4 className="font-medium text-gray-800">Achieve Badges</h4>
              <p className="text-sm text-gray-600">Earn special rewards for completing milestones</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rewards;