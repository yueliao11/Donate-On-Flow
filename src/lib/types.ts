export type ProjectStatus = 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
export type MilestoneStatus = 'PENDING' | 'ACTIVE' | 'COMPLETED';
export type Category = 'Education' | 'Healthcare' | 'Environment' | 'Technology' | 'Arts & Culture';

export interface Project {
  id: number;
  title: string;
  description: string;
  target_amount: number;
  current_amount: number;
  status: ProjectStatus;
  creator_address: string;
  category: Category;
  image_url: string;
  end_date: string;
  created_at: string;
  updated_at: string;
}

export interface Milestone {
  id: number;
  project_id: number;
  title: string;
  description: string;
  percentage: number;
  required_amount: number;
  current_amount: number;
  status: MilestoneStatus;
  created_at: string;
  updated_at: string;
}

export interface Donation {
  id: number;
  project_id: number;
  donor_address: string;
  amount: number;
  transaction_id: string;
  created_at: string;
}
