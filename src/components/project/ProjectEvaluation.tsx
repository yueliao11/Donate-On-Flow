import React, { useState } from 'react';

interface ProjectEvaluationProps {
  projectId: string;
  onSubmit: (evaluation: ProjectEvaluation) => void;
}

interface ProjectEvaluation {
  transparency: number;
  impact: number;
  execution: number;
  communication: number;
  comments: string;
}

export const ProjectEvaluation: React.FC<ProjectEvaluationProps> = ({ projectId, onSubmit }) => {
  const [evaluation, setEvaluation] = useState<ProjectEvaluation>({
    transparency: 0,
    impact: 0,
    execution: 0,
    communication: 0,
    comments: ''
  });

  const criteria = [
    { key: 'transparency', label: 'Financial Transparency' },
    { key: 'impact', label: 'Social Impact' },
    { key: 'execution', label: 'Project Execution' },
    { key: 'communication', label: 'Community Communication' }
  ];

  const handleRatingChange = (criterion: keyof ProjectEvaluation, value: number) => {
    setEvaluation(prev => ({ ...prev, [criterion]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(evaluation);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-bold mb-4">Project Evaluation</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        {criteria.map(({ key, label }) => (
          <div key={key} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {label}
            </label>
            <div className="flex gap-4">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleRatingChange(key as keyof ProjectEvaluation, value)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 
                    ${evaluation[key as keyof ProjectEvaluation] === value
                      ? 'border-blue-500 bg-blue-50 text-blue-600'
                      : 'border-gray-300 hover:border-blue-300'
                    }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Additional Comments
          </label>
          <textarea
            value={evaluation.comments}
            onChange={(e) => setEvaluation(prev => ({ ...prev, comments: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            rows={4}
            placeholder="Share your thoughts about this project..."
          />
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Submit Evaluation
        </button>
      </form>
    </div>
  );
};
