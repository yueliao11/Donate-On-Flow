import React from 'react';

interface ProjectTokenInfoProps {
  tokenSymbol: string;
  tokenSupply: number;
  donationAmount: number;
  targetAmount: number;
}

export const ProjectTokenInfo: React.FC<ProjectTokenInfoProps> = ({
  tokenSymbol,
  tokenSupply,
  donationAmount,
  targetAmount,
}) => {
  const calculateTokenAllocation = () => {
    const percentage = donationAmount / targetAmount;
    return percentage * tokenSupply;
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Project Token Details</h3>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Token Symbol</span>
          <span className="font-medium">{tokenSymbol}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Total Supply</span>
          <span className="font-medium">{tokenSupply.toLocaleString()} {tokenSymbol}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Your Allocation</span>
          <span className="font-medium">
            {calculateTokenAllocation().toLocaleString()} {tokenSymbol}
          </span>
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-600">
            By donating {donationAmount} FUSD, you will receive {calculateTokenAllocation().toLocaleString()} {tokenSymbol} tokens.
            These tokens grant you voting rights and access to project updates.
          </p>
        </div>
      </div>
    </div>
  );
};
