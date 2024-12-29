import React from 'react';

interface Donation {
  donor: string;
  amount: number;
  tokenType: string;
  timestamp: Date;
  projectTitle: string;
}

interface DonationLeaderboardProps {
  donations: Donation[];
  timeframe: 'all' | 'week' | 'month';
  onTimeframeChange: (timeframe: 'all' | 'week' | 'month') => void;
}

export const DonationLeaderboard: React.FC<DonationLeaderboardProps> = ({
  donations,
  timeframe,
  onTimeframeChange
}) => {
  const timeframes = [
    { value: 'all', label: 'All Time' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' }
  ];

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) {
      return `${days} days ago`;
    }
    if (hours > 0) {
      return `${hours} hours ago`;
    }
    return `${minutes} minutes ago`;
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Top Donors</h3>
          <div className="flex gap-2">
            {timeframes.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => onTimeframeChange(value as 'all' | 'week' | 'month')}
                className={`px-3 py-1 text-sm rounded-full ${
                  timeframe === value
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {donations.map((donation, index) => (
          <div
            key={index}
            className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center 
                ${index < 3 ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'}`}
              >
                {index + 1}
              </div>
              <div>
                <p className="font-medium text-gray-900">{donation.donor}</p>
                <p className="text-sm text-gray-500">
                  {formatTimeAgo(donation.timestamp)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium text-gray-900">
                {donation.amount} {donation.tokenType}
              </p>
              <p className="text-sm text-gray-500">{donation.projectTitle}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-200">
        <button className="w-full text-blue-600 hover:text-blue-700 text-sm font-medium">
          View All Donations
        </button>
      </div>
    </div>
  );
};
