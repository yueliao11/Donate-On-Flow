import { useState, useEffect } from 'react';
import { Project } from '../types/project';
import * as projectsService from '../services/api/projects';

export const useProjects = (
  search?: string,
  category?: string,
  sort?: 'latest' | 'popular' | 'ending'
) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        const data = await projectsService.fetchProjects(search, category, sort);
        setProjects(data);
        setError(null);
      } catch (err) {
        setError('Failed to load projects');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, [search, category, sort]);

  return { projects, loading, error };
};