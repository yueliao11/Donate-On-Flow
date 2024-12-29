import React from 'react';

export const LeaderboardCard: React.FC = () => {
  const topDonors = [
    { name: 'Alice', amount: '1,000 FLOW' },
    { name: 'Bob', amount: '850 FLOW' },
    { name: 'Charlie', amount: '720 FLOW' },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Top Donors</h2>
      <div className="space-y-4">
        {topDonors.map((donor, index) => (
          <div key={index} className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-900">{donor.name}</span>
            </div>
            <span className="text-sm text-gray-500">{donor.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
