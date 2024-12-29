import { Project } from '../../types/project';

// 模拟项目数据
const mockProjects: Project[] = [
  {
    id: '1',
    title: '帮助山区儿童教育',
    description: '为山区儿童提供教育资源和学习机会，改善教育条件。',
    coverImage: 'https://images.unsplash.com/photo-1509062522246-3755977927d7',
    currentAmount: 5000,
    targetAmount: 10000,
    endTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    category: 'Education',
    creator: '0x123',
    status: 'active'
  },
  {
    id: '2',
    title: '紧急医疗援助',
    description: '为重症患者提供医疗援助，帮助他们渡过难关。',
    coverImage: 'https://images.unsplash.com/photo-1584515933487-779824d29309',
    currentAmount: 8000,
    targetAmount: 15000,
    endTime: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    category: 'Medical',
    creator: '0x456',
    status: 'active'
  }
];

export const fetchProjects = async (
  search?: string,
  category?: string,
  sort?: 'latest' | 'popular' | 'ending'
): Promise<Project[]> => {
  let filteredProjects = [...mockProjects];

  if (search) {
    filteredProjects = filteredProjects.filter(
      p => p.title.toLowerCase().includes(search.toLowerCase()) ||
           p.description.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (category) {
    filteredProjects = filteredProjects.filter(p => p.category === category);
  }

  switch (sort) {
    case 'popular':
      filteredProjects.sort((a, b) => b.currentAmount - a.currentAmount);
      break;
    case 'ending':
      filteredProjects.sort((a, b) => a.endTime.getTime() - b.endTime.getTime());
      break;
    default:
      // 默认按最新排序
      filteredProjects.sort((a, b) => b.endTime.getTime() - a.endTime.getTime());
  }

  return filteredProjects;
};

export const createProject = async (projectData: Omit<Project, 'id' | 'currentAmount' | 'status'>) => {
  // TODO: 实现实际的项目创建逻辑
  return Promise.resolve({ id: 'new-project-id' });
};

export const donateToProject = async (projectId: string, amount: number) => {
  // TODO: 实现区块链交易逻辑
  return Promise.resolve({ success: true });
};