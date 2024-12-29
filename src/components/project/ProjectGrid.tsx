import React from 'react';
import { Project } from '../../types/project';
import { ProjectCard } from './ProjectCard';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { ErrorMessage } from '../shared/ErrorMessage';

interface ProjectGridProps {
  projects: Project[];
  loading: boolean;
  error: string | null;
  onDonate: (projectId: string) => void;
}

export const ProjectGrid: React.FC<ProjectGridProps> = ({
  projects,
  loading,
  error,
  onDonate,
}) => {
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (projects.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No projects found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map(project => (
        <ProjectCard
          key={project.id}
          project={project}
          onDonate={onDonate}
        />
      ))}
    </div>
  );
};