import React from 'react'

const Header = () => {
  return (
    <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Community Issues Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Monitor and manage reported community issues
            </p>
          </div>
          <div className="flex gap-2">
            {/* <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md">
              Export Data
            </button> */}
          </div>
        </div>
  )
}

export default Header