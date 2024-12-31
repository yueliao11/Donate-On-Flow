-- Add chain_project_id column
ALTER TABLE projects
ADD COLUMN chain_project_id INTEGER;

-- Add minimum_fee_paid column with default value false
ALTER TABLE projects
ADD COLUMN minimum_fee_paid BOOLEAN DEFAULT false;

-- Add index on chain_project_id for faster lookups
CREATE INDEX idx_projects_chain_project_id 
ON projects(chain_project_id);

-- Add comment for documentation
COMMENT ON COLUMN projects.chain_project_id IS 'The ID of the project on the blockchain';
COMMENT ON COLUMN projects.minimum_fee_paid IS 'Whether the minimum fee has been paid for this project';

-- Update existing records to have minimum_fee_paid as false
UPDATE projects 
SET minimum_fee_paid = false 
WHERE minimum_fee_paid IS NULL;

-- Add not null constraint after setting default values
ALTER TABLE projects
ALTER COLUMN minimum_fee_paid SET NOT NULL;
