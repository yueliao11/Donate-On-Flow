export type FormStep = 'basic' | 'story' | 'wallet';

export interface Milestone {
  title: string;
  completed: boolean;
}

export interface ProjectFormData {
  title: string;
  description: string;
  targetAmount: number;
  endDate: string;
  category: string;
  media?: { type: 'image' | 'video', url: string }[];
  milestones?: Milestone[];
  telegramChannel?: string;
}