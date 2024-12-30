import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mdlorawrspaacqhvkzpz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kbG9yYXdyc3BhYWNqaHZrenB6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUzMDcwMDksImV4cCI6MjA1MDg4MzAwOX0.op36q5KCMPomwNDqcWKda3NsjZc-KnCwBG5Lom2XYHc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

export async function getProjects(options?: {
  category?: Category;
  search?: string;
  status?: ProjectStatus;
}) {
  try {
    console.log('Calling Supabase getProjects with options:', options);
    let query = supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (options?.category) {
      query = query.eq('category', options.category);
    }

    if (options?.status) {
      query = query.eq('status', options.status);
    }

    if (options?.search) {
      query = query.ilike('title', `%${options.search}%`);
    }

    const { data, error } = await query;
    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    console.log('Supabase response:', data);
    return data;
  } catch (error) {
    console.error('Error in getProjects:', error);
    throw error;
  }
}

export async function getProjectById(id: number) {
  try {
    console.log('Calling Supabase getProjectById with id:', id);
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        milestones (*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    console.log('Supabase response:', data);
    return data;
  } catch (error) {
    console.error('Error in getProjectById:', error);
    throw error;
  }
}

export async function getProjectMilestones(projectId: number) {
  try {
    console.log('Calling Supabase getProjectMilestones with projectId:', projectId);
    const { data, error } = await supabase
      .from('milestones')
      .select('*')
      .eq('project_id', projectId)
      .order('percentage', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    console.log('Supabase response:', data);
    return data;
  } catch (error) {
    console.error('Error in getProjectMilestones:', error);
    throw error;
  }
}

export async function getProjectDonations(projectId: number) {
  try {
    console.log('Calling Supabase getProjectDonations with projectId:', projectId);
    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    console.log('Supabase response:', data);
    return data;
  } catch (error) {
    console.error('Error in getProjectDonations:', error);
    throw error;
  }
}

export async function createProject(project: Omit<Project, 'id' | 'current_amount' | 'created_at' | 'updated_at'>) {
  try {
    console.log('Calling Supabase createProject with project:', project);
    const { data, error } = await supabase
      .from('projects')
      .insert([project])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    console.log('Supabase response:', data);
    return data;
  } catch (error) {
    console.error('Error in createProject:', error);
    throw error;
  }
}

export async function createMilestone(milestone: Omit<Milestone, 'id' | 'current_amount' | 'created_at' | 'updated_at'>) {
  try {
    console.log('Calling Supabase createMilestone with milestone:', milestone);
    const { data, error } = await supabase
      .from('milestones')
      .insert([milestone])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    console.log('Supabase response:', data);
    return data;
  } catch (error) {
    console.error('Error in createMilestone:', error);
    throw error;
  }
}

export async function createDonation(donation: Omit<Donation, 'id' | 'created_at'>) {
  try {
    console.log('Calling Supabase createDonation with donation:', donation);
    const { data, error } = await supabase
      .from('donations')
      .insert([donation])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    console.log('Supabase response:', data);
    return data;
  } catch (error) {
    console.error('Error in createDonation:', error);
    throw error;
  }
}

export async function updateProjectAmount(projectId: number, amount: number) {
  try {
    console.log('Calling Supabase updateProjectAmount with projectId and amount:', projectId, amount);
    const { data, error } = await supabase
      .from('projects')
      .update({ current_amount: amount })
      .eq('id', projectId)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    console.log('Supabase response:', data);
    return data;
  } catch (error) {
    console.error('Error in updateProjectAmount:', error);
    throw error;
  }
}

export async function updateMilestoneAmount(milestoneId: number, amount: number) {
  try {
    console.log('Calling Supabase updateMilestoneAmount with milestoneId and amount:', milestoneId, amount);
    const { data, error } = await supabase
      .from('milestones')
      .update({ current_amount: amount })
      .eq('id', milestoneId)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    console.log('Supabase response:', data);
    return data;
  } catch (error) {
    console.error('Error in updateMilestoneAmount:', error);
    throw error;
  }
}

export async function updateMilestoneStatus(milestoneId: number, status: MilestoneStatus) {
  try {
    console.log('Calling Supabase updateMilestoneStatus with milestoneId and status:', milestoneId, status);
    const { data, error } = await supabase
      .from('milestones')
      .update({ status })
      .eq('id', milestoneId)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    console.log('Supabase response:', data);
    return data;
  } catch (error) {
    console.error('Error in updateMilestoneStatus:', error);
    throw error;
  }
}

export async function updateProjectStatus(projectId: number, status: ProjectStatus) {
  try {
    console.log('Calling Supabase updateProjectStatus with projectId and status:', projectId, status);
    const { data, error } = await supabase
      .from('projects')
      .update({ status })
      .eq('id', projectId)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    console.log('Supabase response:', data);
    return data;
  } catch (error) {
    console.error('Error in updateProjectStatus:', error);
    throw error;
  }
}

export async function getProjectsByCreator(creatorAddress: string) {
  try {
    console.log('Calling Supabase getProjectsByCreator with creatorAddress:', creatorAddress);
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        milestones (*)
      `)
      .eq('creator_address', creatorAddress)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    console.log('Supabase response:', data);
    return data;
  } catch (error) {
    console.error('Error in getProjectsByCreator:', error);
    throw error;
  }
}

export async function getDonationsByDonor(donorAddress: string) {
  try {
    console.log('Calling Supabase getDonationsByDonor with donorAddress:', donorAddress);
    const { data, error } = await supabase
      .from('donations')
      .select(`
        *,
        project:projects (
          id,
          title,
          status,
          category,
          image_url
        )
      `)
      .eq('donor_address', donorAddress)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    console.log('Supabase response:', data);
    return data;
  } catch (error) {
    console.error('Error in getDonationsByDonor:', error);
    throw error;
  }
}
