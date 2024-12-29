import React from 'react';
import { ProjectFormData } from '../../types/form';
import { MediaUpload } from '../shared/MediaUpload';

interface StoryStepProps {
  data: ProjectFormData;
  onChange: (data: Partial<ProjectFormData>) => void;
}

export const StoryStep: React.FC<StoryStepProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Project Story
        </label>
        <textarea
          value={data.description}
          onChange={(e) => onChange({ description: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 h-32"
          placeholder="Tell your project's story..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Media Content
        </label>
        <p className="text-sm text-gray-500 mb-2">
          Add photos and videos to help tell your story
        </p>
        <MediaUpload
          currentMedia={data.media}
          onMediaSelected={(media) => onChange({ media })}
          maxFiles={5}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Milestones
        </label>
        <div className="space-y-2">
          {data.milestones?.map((milestone, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={milestone.title}
                onChange={(e) => {
                  const newMilestones = [...(data.milestones || [])];
                  newMilestones[index] = { ...milestone, title: e.target.value };
                  onChange({ milestones: newMilestones });
                }}
                className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Milestone title"
              />
              <button
                onClick={() => {
                  const newMilestones = data.milestones?.filter((_, i) => i !== index);
                  onChange({ milestones: newMilestones });
                }}
                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            onClick={() => {
              const newMilestones = [...(data.milestones || []), { title: '', completed: false }];
              onChange({ milestones: newMilestones });
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Add Milestone
          </button>
        </div>
      </div>
    </div>
  );
};