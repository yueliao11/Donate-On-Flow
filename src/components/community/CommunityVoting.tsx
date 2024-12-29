import React, { useState } from 'react';

interface Proposal {
  id: string;
  title: string;
  description: string;
  options: string[];
  votes: number[];
  startTime: Date;
  endTime: Date;
  status: 'active' | 'ended';
}

interface CommunityVotingProps {
  proposals: Proposal[];
  onVote: (proposalId: string, optionIndex: number) => void;
  onCreateProposal: (proposal: Omit<Proposal, 'id' | 'votes' | 'status'>) => void;
}

export const CommunityVoting: React.FC<CommunityVotingProps> = ({
  proposals,
  onVote,
  onCreateProposal
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProposal, setNewProposal] = useState({
    title: '',
    description: '',
    options: ['', ''],
    startTime: new Date(),
    endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 1 week from now
  });

  const formatTimeDistance = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return `${days} days`;
    }
    return `${hours} hours`;
  };

  const handleCreateProposal = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateProposal(newProposal);
    setShowCreateForm(false);
    setNewProposal({
      title: '',
      description: '',
      options: ['', ''],
      startTime: new Date(),
      endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });
  };

  const addOption = () => {
    setNewProposal(prev => ({
      ...prev,
      options: [...prev.options, '']
    }));
  };

  const removeOption = (index: number) => {
    setNewProposal(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }));
  };

  const getTotalVotes = (votes: number[]) => votes.reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Community Voting</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Create Proposal
        </button>
      </div>

      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h3 className="text-xl font-bold mb-4">Create New Proposal</h3>
            <form onSubmit={handleCreateProposal} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={newProposal.title}
                  onChange={e => setNewProposal(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newProposal.description}
                  onChange={e => setNewProposal(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={4}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Options
                </label>
                <div className="space-y-2">
                  {newProposal.options.map((option, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={option}
                        onChange={e => {
                          const newOptions = [...newProposal.options];
                          newOptions[index] = e.target.value;
                          setNewProposal(prev => ({ ...prev, options: newOptions }));
                        }}
                        className="flex-grow px-3 py-2 border border-gray-300 rounded-md"
                        placeholder={`Option ${index + 1}`}
                        required
                      />
                      {newProposal.options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeOption(index)}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addOption}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    + Add Option
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Create Proposal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {proposals.map(proposal => (
          <div key={proposal.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{proposal.title}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {proposal.status === 'active'
                    ? `Ends in ${formatTimeDistance(proposal.endTime)}`
                    : 'Voting ended'}
                </p>
              </div>
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  proposal.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {proposal.status === 'active' ? 'Active' : 'Ended'}
              </span>
            </div>

            <p className="text-gray-600 mb-6">{proposal.description}</p>

            <div className="space-y-4">
              {proposal.options.map((option, index) => {
                const totalVotes = getTotalVotes(proposal.votes);
                const voteCount = proposal.votes[index];
                const percentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;

                return (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-900">{option}</span>
                      <span className="text-sm text-gray-500">
                        {voteCount} votes ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="relative">
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div
                          className="h-2 bg-blue-600 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      {proposal.status === 'active' && (
                        <button
                          onClick={() => onVote(proposal.id, index)}
                          className="absolute -right-20 top-1/2 -translate-y-1/2 text-sm text-blue-600 hover:text-blue-700"
                        >
                          Vote
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
