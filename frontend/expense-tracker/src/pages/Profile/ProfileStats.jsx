import React from "react";

const ProfileStats = ({ stats }) => (
  <div className="w-full mt-4 pt-4 border-t border-gray-100">
    {stats.map((stat, idx) => (
      <div key={idx} className="flex justify-between items-center mb-3">
        <span className="text-gray-600 text-sm">{stat.label}</span>
        <div className="text-right">
          <span className="font-semibold text-gray-900">{stat.value}</span>
          <span className={`text-xs ml-2 ${stat.color}`}>{stat.change}</span>
        </div>
      </div>
    ))}
  </div>
);

export default ProfileStats;
