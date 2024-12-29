import React from 'react';
import { Heart, Clock3 } from 'lucide-react';
import { Project } from '../types/project';

interface ProjectCardProps {
  project: Project;
  onDonate: (projectId: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onDonate }) => {
  const progress = (project.currentAmount / project.targetAmount) * 100;
  const timeLeft = Math.max(0, Math.ceil((project.endTime.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img 
        src={project.coverImage} 
        alt={project.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>
        
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full" 
              style={{ width: `${Math.min(100, progress)}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-sm">
            <span className="text-blue-600 font-medium">
              ${project.currentAmount.toLocaleString()}
            </span>
            <span className="text-gray-500">
              of ${project.targetAmount.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-500 text-sm">
            <Clock3 size={16} className="mr-1" />
            <span>{timeLeft} days left</span>
          </div>
          <button
            onClick={() => onDonate(project.id)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Donate Now
          </button>
        </div>
      </div>
    </div>
  );
}