export interface Project {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  currentAmount: number;
  targetAmount: number;
  endTime: Date;
  category: string;
  creator: string;
  status: 'active' | 'completed' | 'expired';
}