import FungibleToken from 0x9a0766d93b6608b7
import FUSD from 0xe223d8a629e49c68

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
        access(all) let projectVault: @FUSD.Vault
        access(all) let depositVault: @FUSD.Vault
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
            
            self.projectVault <- FUSD.createEmptyVault()
            self.depositVault <- FUSD.createEmptyVault()
        }

        access(all) fun checkMilestoneCompletion() {
            if self.currentMilestoneIndex >= 0 && self.currentMilestoneIndex < self.milestones.length {
                let milestone = &self.milestones[self.currentMilestoneIndex]
                if milestone.currentAmount >= milestone.requiredAmount {
                    milestone.status = MilestoneStatus.VOTING
                    self.status = ProjectStatus.VOTING
                    emit MilestoneVotingStarted(projectId: self.id, milestoneIndex: UInt64(self.currentMilestoneIndex))
                }
            }
        }
    }

    access(all) resource interface ProjectPublic {
        access(all) fun donate(vault: @FUSD.Vault)
        access(all) fun vote(approve: Bool)
        access(all) fun withdrawMilestoneAmount(): @FUSD.Vault
        access(all) fun getDetails(): Project
    }

    access(all) resource ProjectResource: ProjectPublic {
        access(self) var project: Project

        init(project: Project) {
            self.project = project
        }

        access(all) fun donate(vault: @FUSD.Vault) {
            pre {
                self.project.status == ProjectStatus.ACTIVE:
                    "Project must be active to receive donations"
            }

            let amount = vault.balance
            self.project.currentAmount = self.project.currentAmount + amount
            
            // Record donor contribution
            let donor = getCurrentAuthAccount().address
            if let existingAmount = self.project.donors[donor] {
                self.project.donors[donor] = existingAmount + amount
            } else {
                self.project.donors[donor] = amount
            }

            // Update current milestone amount
            if self.project.currentMilestoneIndex >= 0 && 
               self.project.currentMilestoneIndex < self.project.milestones.length {
                let milestone = &self.project.milestones[self.project.currentMilestoneIndex]
                milestone.currentAmount = milestone.currentAmount + amount
            }

            self.project.projectVault.deposit(from: <-vault)
            self.project.checkMilestoneCompletion()

            emit DonationReceived(
                projectId: self.project.id,
                amount: amount,
                donor: donor
            )
        }

        access(all) fun vote(approve: Bool) {
            pre {
                self.project.status == ProjectStatus.VOTING:
                    "Project must be in voting state"
            }

            let voter = getCurrentAuthAccount().address
            if let donationAmount = self.project.donors[voter] {
                let voteWeight = donationAmount / self.project.currentAmount
                
                if self.project.currentMilestoneIndex >= 0 && 
                   self.project.currentMilestoneIndex < self.project.milestones.length {
                    let milestone = &self.project.milestones[self.project.currentMilestoneIndex]
                    
                    // Only allow voting once
                    if milestone.votes[voter] == nil {
                        let vote = Vote(
                            voter: voter,
                            weight: voteWeight,
                            approve: approve
                        )
                        milestone.votes[voter] = vote

                        if approve {
                            milestone.approvalWeight = milestone.approvalWeight + voteWeight
                        } else {
                            milestone.rejectionWeight = milestone.rejectionWeight + voteWeight
                        }

                        emit VoteCast(
                            projectId: self.project.id,
                            milestoneIndex: UInt64(self.project.currentMilestoneIndex),
                            voter: voter,
                            weight: voteWeight,
                            approve: approve
                        )

                        // Check if voting is complete
                        if milestone.approvalWeight > CharityProjectV2.VOTE_THRESHOLD_PERCENTAGE {
                            milestone.status = MilestoneStatus.COMPLETED
                            self.project.status = ProjectStatus.ACTIVE
                            self.project.currentMilestoneIndex = self.project.currentMilestoneIndex + 1
                            
                            // Check if project is completed
                            if self.project.currentMilestoneIndex >= self.project.milestones.length {
                                self.project.status = ProjectStatus.COMPLETED
                                self.returnDeposit()
                                emit ProjectCompleted(projectId: self.project.id)
                            }
                        } else if milestone.rejectionWeight >= 1.0 - CharityProjectV2.VOTE_THRESHOLD_PERCENTAGE {
                            milestone.status = MilestoneStatus.REJECTED
                            self.project.status = ProjectStatus.CANCELLED
                        }
                    }
                }
            }
        }

        access(all) fun withdrawMilestoneAmount(): @FUSD.Vault {
            pre {
                getCurrentAuthAccount().address == self.project.creator:
                    "Only project creator can withdraw"
                self.project.currentMilestoneIndex > 0:
                    "No milestone completed yet"
            }

            let previousMilestone = &self.project.milestones[self.project.currentMilestoneIndex - 1]
            assert(
                previousMilestone.status == MilestoneStatus.COMPLETED,
                message: "Previous milestone must be completed"
            )

            let amountToWithdraw = previousMilestone.requiredAmount
            emit MilestoneCompleted(
                projectId: self.project.id,
                milestoneIndex: UInt64(self.project.currentMilestoneIndex - 1),
                amountReleased: amountToWithdraw
            )

            return <- self.project.projectVault.withdraw(amount: amountToWithdraw)
        }

        access(all) fun returnDeposit() {
            if self.project.status == ProjectStatus.COMPLETED {
                let depositVault <- self.project.depositVault.withdraw(amount: self.project.depositAmount)
                // Transfer deposit back to creator
                let creatorAccount = getAccount(self.project.creator)
                let creatorVaultRef = creatorAccount
                    .getCapability(/public/fusdReceiver)
                    .borrow<&FUSD.Vault{FungibleToken.Receiver}>()
                    ?? panic("Could not borrow reference to creator's vault")
                
                creatorVaultRef.deposit(from: <-depositVault)
                
                emit DepositReturned(
                    projectId: self.project.id,
                    amount: self.project.depositAmount
                )
            }
        }

        access(all) fun getDetails(): Project {
            return self.project
        }
    }

    // Contract state
    access(self) var nextProjectID: UInt64
    access(self) let platformVault: @FUSD.Vault
    access(self) let projects: @{UInt64: ProjectResource}

    init() {
        self.PLATFORM_FEE_PERCENTAGE = 0.03  // 3%
        self.DEPOSIT_PERCENTAGE = 0.07      // 7%
        self.MILESTONE_PERCENTAGES = [0.25, 0.50, 0.75, 1.00]  // 25%, 50%, 75%, 100%
        self.VOTE_THRESHOLD_PERCENTAGE = 0.66  // 66% approval needed

        self.nextProjectID = 1
        self.platformVault <- FUSD.createEmptyVault()
        self.projects <- {}
    }

    access(all) fun createProject(
        title: String,
        description: String,
        targetAmount: UFix64,
        depositVault: @FUSD.Vault
    ): UInt64 {
        let depositAmount = targetAmount * (self.PLATFORM_FEE_PERCENTAGE + self.DEPOSIT_PERCENTAGE)
        assert(
            depositVault.balance >= depositAmount,
            message: "Insufficient deposit amount"
        )

        // Split deposit into platform fee and project deposit
        let platformFee = targetAmount * self.PLATFORM_FEE_PERCENTAGE
        let platformFeeVault <- depositVault.withdraw(amount: platformFee)
        self.platformVault.deposit(from: <-platformFeeVault)

        let projectID = self.nextProjectID
        let project = Project(
            id: projectID,
            creator: getCurrentAuthAccount().address,
            title: title,
            description: description,
            targetAmount: targetAmount,
            depositAmount: depositAmount - platformFee
        )

        // Store the deposit
        project.depositVault.deposit(from: <-depositVault)

        let projectResource <- create ProjectResource(project: project)
        self.projects[projectID] <-! projectResource

        self.nextProjectID = self.nextProjectID + 1

        emit ProjectCreated(
            id: projectID,
            creator: project.creator,
            depositAmount: depositAmount
        )

        return projectID
    }

    access(all) fun borrowProject(id: UInt64): &ProjectResource{ProjectPublic}? {
        if let project = &self.projects[id] as &ProjectResource? {
            return project
        }
        return nil
    }

    access(all) fun getProjectCount(): UInt64 {
        return self.nextProjectID - 1
    }
}
