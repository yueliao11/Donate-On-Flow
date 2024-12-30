import { Project, Category, ProjectStatus } from './types';

// 使用相对路径，这样会自动使用当前域名和端口
const API_URL = '';

export async function getProjects(options?: {
  category?: Category;
  search?: string;
  status?: ProjectStatus;
}) {
  const params = new URLSearchParams();
  if (options?.category) params.append('category', options.category);
  if (options?.search) params.append('search', options.search);
  if (options?.status) params.append('status', options.status);

  try {
    const response = await fetch(`api/projects?${params}`);
    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch projects');
      } else {
        const text = await response.text();
        console.error('Unexpected response:', text);
        throw new Error('Server returned an invalid response');
      }
    }
    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

export async function getProjectById(id: number) {
  try {
    const response = await fetch(`api/projects/${id}`);
    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch project');
      } else {
        const text = await response.text();
        console.error('Unexpected response:', text);
        throw new Error('Server returned an invalid response');
      }
    }
    const data = await response.json();
    return data || {};
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

export async function createProject(project: Omit<Project, 'id' | 'current_amount' | 'created_at' | 'updated_at'>) {
  try {
    const response = await fetch('api/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(project),
    });
    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create project');
      } else {
        const text = await response.text();
        console.error('Unexpected response:', text);
        throw new Error('Server returned an invalid response');
      }
    }
    const data = await response.json();
    return data || {};
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

export async function updateProjectAmount(projectId: number, amount: number) {
  try {
    const response = await fetch(`api/projects/${projectId}/amount`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount }),
    });
    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update project amount');
      } else {
        const text = await response.text();
        console.error('Unexpected response:', text);
        throw new Error('Server returned an invalid response');
      }
    }
    const data = await response.json();
    return data || {};
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

export async function getProjectsByCreator(creatorAddress: string) {
  try {
    const response = await fetch(`api/projects/creator/${creatorAddress}`);
    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch projects');
      } else {
        const text = await response.text();
        console.error('Unexpected response:', text);
        throw new Error('Server returned an invalid response');
      }
    }
    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}
