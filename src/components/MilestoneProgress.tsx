import React from 'react';
import { Box, Step, StepLabel, Stepper, Typography, Button, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledStepper = styled(Stepper)(({ theme }) => ({
  '& .MuiStepLabel-root .Mui-completed': {
    color: theme.palette.success.main,
  },
  '& .MuiStepLabel-root .Mui-active': {
    color: theme.palette.primary.main,
  },
}));

interface Milestone {
  id: number;
  percentage: number;
  requiredAmount: number;
  currentAmount: number;
  status: string;
  evidence: string;
}

interface MilestoneProgressProps {
  milestones: Milestone[];
  currentMilestoneIndex: number;
  isCreator: boolean;
  onProposeMilestone: (evidence: string) => void;
  onVote: (approve: boolean) => void;
}

export const MilestoneProgress: React.FC<MilestoneProgressProps> = ({
  milestones,
  currentMilestoneIndex,
  isCreator,
  onProposeMilestone,
  onVote,
}) => {
  const [evidence, setEvidence] = React.useState('');

  const handlePropose = () => {
    onProposeMilestone(evidence);
    setEvidence('');
  };

  const getStepLabel = (milestone: Milestone) => {
    return `${(milestone.percentage * 100).toFixed(0)}% (${milestone.currentAmount}/${milestone.requiredAmount} FUSD)`;
  };

  return (
    <Box sx={{ width: '100%', mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Project Milestones
      </Typography>
      
      <StyledStepper activeStep={currentMilestoneIndex} alternativeLabel>
        {milestones.map((milestone, index) => (
          <Step key={milestone.id} completed={milestone.status === 'WITHDRAWN'}>
            <StepLabel>{getStepLabel(milestone)}</StepLabel>
          </Step>
        ))}
      </StyledStepper>

      {currentMilestoneIndex < milestones.length && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="subtitle1" gutterBottom>
            Current Milestone Status: {milestones[currentMilestoneIndex].status}
          </Typography>

          {isCreator && milestones[currentMilestoneIndex].status === 'PENDING' && (
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                label="Evidence (IPFS hash or description)"
                value={evidence}
                onChange={(e) => setEvidence(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handlePropose}
                disabled={!evidence}
              >
                Propose Milestone Completion
              </Button>
            </Box>
          )}

          {milestones[currentMilestoneIndex].status === 'PROPOSED' && !isCreator && (
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                color="success"
                onClick={() => onVote(true)}
              >
                Approve
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => onVote(false)}
              >
                Reject
              </Button>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};
