-- Create tables
create table if not exists projects (
  id bigint primary key generated always as identity,
  title varchar(255) not null,
  description text not null,
  target_amount numeric(20,2) not null,
  current_amount numeric(20,2) default 0,
  status varchar(20) default 'ACTIVE',
  creator_address varchar(255) not null,
  category varchar(50) not null,
  image_url text not null,
  end_date timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists milestones (
  id bigint primary key generated always as identity,
  project_id bigint references projects(id) on delete cascade,
  title varchar(255) not null,
  description text not null,
  percentage numeric(5,2) not null,
  required_amount numeric(20,2) not null,
  current_amount numeric(20,2) default 0,
  status varchar(20) default 'PENDING',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists donations (
  id bigint primary key generated always as identity,
  project_id bigint references projects(id) on delete cascade,
  donor_address varchar(255) not null,
  amount numeric(20,2) not null,
  transaction_id varchar(255) not null,
  created_at timestamp with time zone default now()
);

-- Insert sample projects
INSERT INTO projects (title, description, target_amount, creator_address, category, image_url, end_date) VALUES
-- Education Projects
('Digital Literacy for Rural Schools', 'Providing computers and internet access to rural schools to bridge the digital divide.', 50000.00, '0x945c254064cc292c', 'Education', 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b', now() + interval '60 days'),
('STEM Education Initiative', 'Supporting science and mathematics education through interactive learning tools.', 35000.00, '0x945c254064cc292c', 'Education', 'https://images.unsplash.com/photo-1567168544646-208fa5d408fb', now() + interval '45 days'),
('Library Renovation Project', 'Modernizing community libraries with new books and digital resources.', 25000.00, '0x945c254064cc292c', 'Education', 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da', now() + interval '30 days'),
('Scholarship Fund', 'Creating opportunities for underprivileged students to pursue higher education.', 75000.00, '0x945c254064cc292c', 'Education', 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1', now() + interval '90 days'),

-- Healthcare Projects
('Mobile Medical Clinic', 'Bringing healthcare services to remote communities through mobile clinics.', 80000.00, '0x945c254064cc292c', 'Healthcare', 'https://images.unsplash.com/photo-1516549655169-df83a0774514', now() + interval '75 days'),
('Mental Health Support', 'Establishing counseling centers for mental health awareness and support.', 45000.00, '0x945c254064cc292c', 'Healthcare', 'https://images.unsplash.com/photo-1527613426441-4da17471b66d', now() + interval '60 days'),
('Children''s Hospital Equipment', 'Upgrading medical equipment in the pediatric ward.', 100000.00, '0x945c254064cc292c', 'Healthcare', 'https://images.unsplash.com/photo-1538108149393-fbbd81895907', now() + interval '120 days'),
('Elder Care Program', 'Supporting seniors with medical care and daily assistance.', 60000.00, '0x945c254064cc292c', 'Healthcare', 'https://images.unsplash.com/photo-1576091160550-2173dba999ef', now() + interval '45 days'),

-- Environment Projects
('Ocean Cleanup Initiative', 'Removing plastic waste from coastal areas and protecting marine life.', 40000.00, '0x945c254064cc292c', 'Environment', 'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f', now() + interval '90 days'),
('Reforestation Project', 'Planting trees to restore damaged forest ecosystems.', 30000.00, '0x945c254064cc292c', 'Environment', 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09', now() + interval '180 days'),
('Renewable Energy for Communities', 'Installing solar panels in rural communities.', 70000.00, '0x945c254064cc292c', 'Environment', 'https://images.unsplash.com/photo-1509391366360-2e959784a276', now() + interval '120 days'),
('Wildlife Conservation', 'Protecting endangered species and their habitats.', 55000.00, '0x945c254064cc292c', 'Environment', 'https://images.unsplash.com/photo-1474314170901-f351b68f544f', now() + interval '150 days'),

-- Technology Projects
('Coding Bootcamp', 'Teaching programming skills to unemployed youth.', 45000.00, '0x945c254064cc292c', 'Technology', 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6', now() + interval '60 days'),
('AI Research Lab', 'Supporting artificial intelligence research for social good.', 90000.00, '0x945c254064cc292c', 'Technology', 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e', now() + interval '180 days'),
('Smart City Solutions', 'Developing technology to improve urban living.', 65000.00, '0x945c254064cc292c', 'Technology', 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b', now() + interval '90 days'),
('Blockchain Education', 'Creating educational resources about blockchain technology.', 40000.00, '0x945c254064cc292c', 'Technology', 'https://images.unsplash.com/photo-1639322537228-f710d846310a', now() + interval '120 days'),

-- Arts & Culture Projects
('Community Theater Revival', 'Renovating a historic theater for community performances.', 35000.00, '0x945c254064cc292c', 'Arts & Culture', 'https://images.unsplash.com/photo-1503095396549-807759245b35', now() + interval '90 days'),
('Indigenous Art Preservation', 'Documenting and preserving traditional art forms.', 25000.00, '0x945c254064cc292c', 'Arts & Culture', 'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8', now() + interval '120 days'),
('Music Education Program', 'Providing musical instruments and lessons to youth.', 30000.00, '0x945c254064cc292c', 'Arts & Culture', 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae', now() + interval '60 days'),
('Public Art Initiative', 'Creating murals and sculptures in public spaces.', 20000.00, '0x945c254064cc292c', 'Arts & Culture', 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b', now() + interval '45 days');

-- Insert sample milestones for each project
INSERT INTO milestones (project_id, title, description, percentage, required_amount)
SELECT 
  p.id,
  'Initial Phase',
  'Setting up the foundation and initial planning',
  25.00,
  p.target_amount * 0.25
FROM projects p;

INSERT INTO milestones (project_id, title, description, percentage, required_amount)
SELECT 
  p.id,
  'Development Phase',
  'Main implementation and development work',
  50.00,
  p.target_amount * 0.25
FROM projects p;

INSERT INTO milestones (project_id, title, description, percentage, required_amount)
SELECT 
  p.id,
  'Expansion Phase',
  'Expanding the project scope and reach',
  75.00,
  p.target_amount * 0.25
FROM projects p;

INSERT INTO milestones (project_id, title, description, percentage, required_amount)
SELECT 
  p.id,
  'Completion Phase',
  'Final implementation and project completion',
  100.00,
  p.target_amount * 0.25
FROM projects p;

-- Insert some sample donations
INSERT INTO donations (project_id, donor_address, amount, transaction_id)
SELECT 
  p.id,
  '0x' || encode(gen_random_bytes(10), 'hex'),
  random() * 1000 + 100,
  encode(gen_random_bytes(16), 'hex')
FROM projects p
CROSS JOIN generate_series(1, 5);

-- Update current_amount in projects based on donations
UPDATE projects p
SET current_amount = (
  SELECT COALESCE(SUM(amount), 0)
  FROM donations d
  WHERE d.project_id = p.id
);

-- Update milestone status and current_amount based on project progress
UPDATE milestones m
SET 
  current_amount = p.current_amount,
  status = CASE 
    WHEN p.current_amount >= m.required_amount THEN 'COMPLETED'
    WHEN p.current_amount > 0 THEN 'ACTIVE'
    ELSE 'PENDING'
  END
FROM projects p
WHERE m.project_id = p.id;
