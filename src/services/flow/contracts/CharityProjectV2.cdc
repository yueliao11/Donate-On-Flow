access(all) contract CharityProjectV2 {
    // Constants
    access(all) let PLATFORM_FEE_PERCENTAGE: UFix64
    access(all) let DEPOSIT_PERCENTAGE: UFix64
    access(all) let MILESTONE_PERCENTAGES: [UFix64]
    access(all) let VOTE_THRESHOLD_PERCENTAGE: UFix64

    // Events
    access(all) event ProjectCreated(id: UInt64, creator: Address, depositAmount: UFix64)
    access(all) event DonationReceived(projectId: UInt64, amount: UFix64, donor: Address)
    access(all) event MilestoneVotingStarted(projectId: UInt64, milestoneIndex: UInt64)
    access(all) event VoteCast(projectId: UInt64, milestoneIndex: UInt64, voter: Address, weight: UFix64, approve: Bool)
    access(all) event MilestoneCompleted(projectId: UInt64, milestoneIndex: UInt64, amountReleased: UFix64)
    access(all) event DepositReturned(projectId: UInt64, amount: UFix64)
    access(all) event ProjectCompleted(projectId: UInt64)

    // Project Status
    access(all) enum ProjectStatus: UInt8 {
        access(all) case ACTIVE
        access(all) case VOTING
        access(all) case COMPLETED
        access(all) case CANCELLED
    }

    // Milestone Status
    access(all) enum MilestoneStatus: UInt8 {
        access(all) case PENDING
        access(all) case VOTING
        access(all) case COMPLETED
        access(all) case REJECTED
    }

    // Vote struct
    access(all) struct Vote {
        access(all) let voter: Address
        access(all) let weight: UFix64
        access(all) let approve: Bool

        init(voter: Address, weight: UFix64, approve: Bool) {
            self.voter = voter
            self.weight = weight
            self.approve = approve
        }
    }

    // Milestone struct
    access(all) struct Milestone {
        access(all) let percentage: UFix64
        access(all) let requiredAmount: UFix64
        access(all) var currentAmount: UFix64
        access(all) var status: MilestoneStatus
        access(all) var votes: {Address: Vote}
        access(all) var approvalWeight: UFix64
        access(all) var rejectionWeight: UFix64

        init(percentage: UFix64, requiredAmount: UFix64) {
            self.percentage = percentage
            self.requiredAmount = requiredAmount
            self.currentAmount = 0.0
            self.status = MilestoneStatus.PENDING
            self.votes = {}
            self.approvalWeight = 0.0
            self.rejectionWeight = 0.0
        }
    }

    // Project struct
    access(all) struct Project {
        access(all) let id: UInt64
        access(all) let creator: Address
        access(all) let title: String
        access(all) let description: String
        access(all) let targetAmount: UFix64
        access(all) let depositAmount: UFix64
        access(all) var currentAmount: UFix64
        access(all) var status: ProjectStatus
        access(all) var milestones: [Milestone]
        access(all) var currentMilestoneIndex: Int
        access(all) var donors: {Address: UFix64}

        init(
            id: UInt64,
            creator: Address,
            title: String,
            description: String,
            targetAmount: UFix64,
            depositAmount: UFix64
        ) {
            self.id = id
            self.creator = creator
            self.title = title
            self.description = description
            self.targetAmount = targetAmount
            self.depositAmount = depositAmount
            self.currentAmount = 0.0
            self.status = ProjectStatus.ACTIVE
            self.currentMilestoneIndex = 0
            self.donors = {}
            
            // Initialize milestones
            self.milestones = []
            for percentage in CharityProjectV2.MILESTONE_PERCENTAGES {
                let milestone = Milestone(
                    percentage: percentage,
                    requiredAmount: targetAmount * percentage
                )
                self.milestones.append(milestone)
            }
        }

        access(all) fun checkMilestoneCompletion() {
            if self.currentMilestoneIndex >= 0 && self.currentMilestoneIndex < self.milestones.length {
                let milestone = &self.milestones[self.currentMilestoneIndex] as &Milestone
                if milestone.currentAmount >= milestone.requiredAmount {
                    milestone.status = MilestoneStatus.VOTING
                    self.status = ProjectStatus.VOTING
                    emit MilestoneVotingStarted(projectId: self.id, milestoneIndex: UInt64(self.currentMilestoneIndex))
                }
            }
        }
    }

    access(all) resource interface ProjectPublic {
        access(all) fun donate(amount: UFix64)
        access(all) fun vote(approve: Bool)
        access(all) fun withdrawMilestoneAmount(): UFix64
        access(all) fun getDetails(): Project
    }

    access(all) resource ProjectResource: ProjectPublic {
        access(self) var project: Project

        init(project: Project) {
            self.project = project
        }

        access(all) fun donate(amount: UFix64) {
            pre {
                self.project.status == ProjectStatus.ACTIVE:
                    "Project must be active to receive donations"
            } post {
                self.project.currentAmount == self.project.currentAmount + amount:
                    "Donation amount must be added to project's current amount"
            }

            self.project.currentAmount = self.project.currentAmount + amount;
            
            // Record donor contribution
            let donor = getCurrentAuthAccount().address;
            if let existingAmount = self.project.donors[donor] {
                self.project.donors[donor] = existingAmount + amount;
            } else {
                self.project.donors[donor] = amount;
            }

            // Update current milestone amount
            if self.project.currentMilestoneIndex >= 0 && 
               self.project.currentMilestoneIndex < self.project.milestones.length {
                let milestone = &self.project.milestones[self.project.currentMilestoneIndex] as &Milestone;
                milestone.currentAmount = milestone.currentAmount + amount;
            }

            self.project.checkMilestoneCompletion();

            emit DonationReceived(
                projectId: self.project.id,
                amount: amount,
                donor: donor
            );
        }

        access(all) fun vote(approve: Bool) {
            pre {
                self.project.status == ProjectStatus.VOTING:
                    "Project must be in voting state"
            }

            let voter = getCurrentAuthAccount().address;
            if let donationAmount = self.project.donors[voter] {
                let voteWeight = donationAmount / self.project.currentAmount;
                
                if self.project.currentMilestoneIndex >= 0 && 
                   self.project.currentMilestoneIndex < self.project.milestones.length {
                    let milestone = &self.project.milestones[self.project.currentMilestoneIndex] as &Milestone;
                    
                    // Only allow voting once
                    if milestone.votes[voter] == nil {
                        let vote = Vote(
                            voter: voter,
                            weight: voteWeight,
                            approve: approve
                        );
                        milestone.votes[voter] = vote;

                        if approve {
                            milestone.approvalWeight = milestone.approvalWeight + voteWeight;
                        } else {
                            milestone.rejectionWeight = milestone.rejectionWeight + voteWeight;
                        }

                        emit VoteCast(
                            projectId: self.project.id,
                            milestoneIndex: UInt64(self.project.currentMilestoneIndex),
                            voter: voter,
                            weight: voteWeight,
                            approve: approve
                        );

                        // Check if voting threshold is reached
                        if milestone.approvalWeight >= CharityProjectV2.VOTE_THRESHOLD_PERCENTAGE {
                            milestone.status = MilestoneStatus.COMPLETED;
                            self.project.status = ProjectStatus.ACTIVE;
                            self.project.currentMilestoneIndex = self.project.currentMilestoneIndex + 1;

                            // Release funds for this milestone
                            let amountToRelease = milestone.requiredAmount;
                            emit MilestoneCompleted(
                                projectId: self.project.id,
                                milestoneIndex: UInt64(self.project.currentMilestoneIndex - 1),
                                amountReleased: amountToRelease
                            );

                            // Check if project is completed
                            if self.project.currentMilestoneIndex >= self.project.milestones.length {
                                self.project.status = ProjectStatus.COMPLETED;
                                emit ProjectCompleted(projectId: self.project.id);
                            }
                        } else if milestone.rejectionWeight >= CharityProjectV2.VOTE_THRESHOLD_PERCENTAGE {
                            milestone.status = MilestoneStatus.REJECTED;
                            self.project.status = ProjectStatus.CANCELLED;
                        }
                    }
                }
            }
        }

        access(all) fun withdrawMilestoneAmount(): UFix64 {
            pre {
                getCurrentAuthAccount().address == self.project.creator:
                    "Only project creator can withdraw";
                self.project.currentMilestoneIndex > 0:
                    "No milestone completed yet"
            }

            let completedMilestone = &self.project.milestones[self.project.currentMilestoneIndex - 1] as &Milestone;

            if completedMilestone.status != MilestoneStatus.COMPLETED {
                panic("Previous milestone must be completed")
            }

            return completedMilestone.requiredAmount
        }

        access(all) fun getDetails(): Project {
            return self.project
        }
    }

    // Contract state
    access(self) var nextProjectID: UInt64
    access(self) var totalPlatformFees: UFix64
    access(self) var projects: @{UInt64: ProjectResource}

    init() {
        self.PLATFORM_FEE_PERCENTAGE = 0.03
        self.DEPOSIT_PERCENTAGE = 0.07
        self.MILESTONE_PERCENTAGES = [0.3, 0.3, 0.4]
        self.VOTE_THRESHOLD_PERCENTAGE = 0.51

        self.nextProjectID = 1
        self.totalPlatformFees = 0.0
        self.projects <- {}
    }

    access(all) fun createProject(
        title: String,
        description: String,
        targetAmount: UFix64,
        depositAmount: UFix64
    ): UInt64 {
        let creator = getCurrentAuthAccount().address
        
        let project = Project(
            id: self.nextProjectID,
            creator: creator,
            title: title,
            description: description,
            targetAmount: targetAmount,
            depositAmount: depositAmount
        )

        let projectResource <- create ProjectResource(project: project)
        self.projects[self.nextProjectID] <-! projectResource

        emit ProjectCreated(
            id: self.nextProjectID,
            creator: creator,
            depositAmount: depositAmount
        )

        self.nextProjectID = self.nextProjectID + 1
        return self.nextProjectID - 1
    }

    access(all) fun depositFlow(amount: UFix64) {
        // This function will be called in the transaction's execute block
        // to deposit FLOW tokens for the project
    }

    access(all) fun borrowProject(id: UInt64): &ProjectResource? {
        if let project = &self.projects[id] as &ProjectResource? {
            return project
        }
        return nil
    }

    access(all) fun getProject(id: UInt64): Project? {
        if let project = self.borrowProject(id) {
            return project.getDetails()
        }
        return nil
    }
}
