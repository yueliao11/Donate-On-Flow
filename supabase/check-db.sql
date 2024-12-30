-- Check if tables exist
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public'
  AND table_name = 'projects'
) as projects_table_exists;

SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public'
  AND table_name = 'milestones'
) as milestones_table_exists;

SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public'
  AND table_name = 'donations'
) as donations_table_exists;

-- Count records in each table
SELECT 
  (SELECT COUNT(*) FROM projects) as projects_count,
  (SELECT COUNT(*) FROM milestones) as milestones_count,
  (SELECT COUNT(*) FROM donations) as donations_count;
