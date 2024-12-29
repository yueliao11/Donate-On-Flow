import React from 'react';

export const CommunityUpdates: React.FC = () => {
  const updates = [
    {
      title: 'New Project Milestone',
      description: 'Education Fund reached 80% of goal',
      time: '2h ago'
    },
    {
      title: 'Community Vote',
      description: 'New proposal for medical supplies',
      time: '4h ago'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Community Updates</h2>
      <div className="space-y-4">
        {updates.map((update, index) => (
          <div key={index} className="border-b border-gray-200 pb-4 last:border-0">
            <h3 className="font-medium text-gray-900">{update.title}</h3>
            <p className="text-sm text-gray-500 mt-1">{update.description}</p>
            <span className="text-xs text-gray-400 mt-2">{update.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
