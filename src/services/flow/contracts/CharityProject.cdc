import FungibleToken from 0x9a0766d93b6608b7
import FUSD from 0xe223d8a629e49c68

access(all) contract CharityProject {
    // Events
    access(all) event ProjectCreated(id: UInt64, creator: Address)
    access(all) event DonationReceived(projectId: UInt64, amount: UFix64, donor: Address)
    access(all) event MilestoneProposed(projectId: UInt64, milestoneId: UInt64)
    access(all) event VoteCast(projectId: UInt64, milestoneId: UInt64, voter: Address, approve: Bool)
    access(all) event MilestoneCompleted(projectId: UInt64, milestoneId: UInt64)
    access(all) event FundsWithdrawn(projectId: UInt64, amount: UFix64)

    // Project Status
    access(all) enum ProjectStatus: UInt8 {
        access(all) case ACTIVE
        access(all) case PAUSED
        access(all) case COMPLETED
        access(all) case CANCELLED
    }

    // Milestone Status
    access(all) enum MilestoneStatus: UInt8 {
        access(all) case PENDING
        access(all) case PROPOSED
        access(all) case APPROVED
        access(all) case REJECTED
        access(all) case WITHDRAWN
    }

    // Milestone struct
    access(all) struct Milestone {
        access(all) let id: UInt64
        access(all) let percentage: UFix64
        access(all) let requiredAmount: UFix64
        access(all) var currentAmount: UFix64
        access(all) var status: MilestoneStatus
        access(all) var evidence: String
        access(all) var approvalVotes: UFix64
        access(all) var rejectionVotes: UFix64
        access(all) var voters: {Address: Bool}

        init(
            id: UInt64,
            percentage: UFix64,
            requiredAmount: UFix64
        ) {
            self.id = id
            self.percentage = percentage
            self.requiredAmount = requiredAmount
            self.currentAmount = 0.0
            self.status = MilestoneStatus.PENDING
            self.evidence = ""
            self.approvalVotes = 0.0
            self.rejectionVotes = 0.0
            self.voters = {}
        }
    }

    // Project struct
    access(all) struct Project {
        access(all) let id: UInt64
        access(all) let creator: Address
        access(all) let title: String
        access(all) let description: String
        access(all) let targetAmount: UFix64
        access(all) let endDate: UFix64
        access(all) var currentAmount: UFix64
        access(all) var status: ProjectStatus
        access(all) var milestones: [Milestone]
        access(all) var currentMilestoneIndex: UInt64
        access(all) let fusdVault: @FUSD.Vault

        init(
            id: UInt64,
            creator: Address,
            title: String,
            description: String,
            targetAmount: UFix64,
            endDate: UFix64
        ) {
            self.id = id
            self.creator = creator
            self.title = title
            self.description = description
            self.targetAmount = targetAmount
            self.endDate = endDate
            self.currentAmount = 0.0
            self.status = ProjectStatus.ACTIVE
            self.currentMilestoneIndex = 0
            
            // Initialize milestones (30%, 60%, 90%)
            self.milestones = []
            let percentages: [UFix64] = [0.3, 0.6, 0.9]
            var milestoneId: UInt64 = 0
            for percentage in percentages {
                let milestone = Milestone(
                    id: milestoneId,
                    percentage: percentage,
                    requiredAmount: targetAmount * percentage
                )
                self.milestones.append(milestone)
                milestoneId = milestoneId + 1
            }
            
            self.fusdVault <- FUSD.createEmptyVault()
        }
    }

    access(all) resource interface ProjectPublic {
        access(all) fun donate(vault: @FUSD.Vault)
        access(all) fun proposeMilestone(evidence: String)
        access(all) fun vote(approve: Bool)
        access(all) fun withdraw(): @FUSD.Vault
        access(all) fun getDetails(): Project
    }

    access(all) resource ProjectResource: ProjectPublic {
        access(self) var project: Project

        access(all) fun donate(vault: @FUSD.Vault) {
            pre {
                self.project.status == ProjectStatus.ACTIVE:
                    "Project must be active to receive donations"
            }

            let amount = vault.balance
            self.project.currentAmount = self.project.currentAmount + amount
            self.project.fusdVault.deposit(from: <-vault)

            // Update milestone amounts
            if let milestone = &self.project.milestones[self.project.currentMilestoneIndex] {
                milestone.currentAmount = milestone.currentAmount + amount
            }

            emit DonationReceived(
                projectId: self.project.id,
                amount: amount,
                donor: getCurrentAuthAccount().address
            )
        }

        access(all) fun proposeMilestone(evidence: String) {
            pre {
                self.project.status == ProjectStatus.ACTIVE:
                    "Project must be active"
                getCurrentAuthAccount().address == self.project.creator:
                    "Only project creator can propose milestone"
            }

            if let milestone = &self.project.milestones[self.project.currentMilestoneIndex] {
                milestone.evidence = evidence
                milestone.status = MilestoneStatus.PROPOSED

                emit MilestoneProposed(
                    projectId: self.project.id,
                    milestoneId: milestone.id
                )
            }
        }

        access(all) fun vote(approve: Bool) {
            pre {
                self.project.status == ProjectStatus.ACTIVE:
                    "Project must be active"
            }

            let voter = getCurrentAuthAccount().address
            if let milestone = &self.project.milestones[self.project.currentMilestoneIndex] {
                if milestone.voters[voter] == nil {
                    milestone.voters[voter] = approve
                    if approve {
                        milestone.approvalVotes = milestone.approvalVotes + 1.0
                    } else {
                        milestone.rejectionVotes = milestone.rejectionVotes + 1.0
                    }

                    emit VoteCast(
                        projectId: self.project.id,
                        milestoneId: milestone.id,
                        voter: voter,
                        approve: approve
                    )

                    // Check if milestone is approved
                    if milestone.approvalVotes > (milestone.approvalVotes + milestone.rejectionVotes) * 0.66 {
                        milestone.status = MilestoneStatus.APPROVED
                        emit MilestoneCompleted(
                            projectId: self.project.id,
                            milestoneId: milestone.id
                        )
                    } else if milestone.rejectionVotes >= (milestone.approvalVotes + milestone.rejectionVotes) * 0.34 {
                        milestone.status = MilestoneStatus.REJECTED
                    }
                }
            }
        }

        access(all) fun withdraw(): @FUSD.Vault {
            pre {
                getCurrentAuthAccount().address == self.project.creator:
                    "Only project creator can withdraw"
                let milestone = self.project.milestones[self.project.currentMilestoneIndex]
                milestone.status == MilestoneStatus.APPROVED:
                    "Current milestone must be approved"
            }

            let milestone = &self.project.milestones[self.project.currentMilestoneIndex]
            let withdrawAmount = milestone.currentAmount

            // Update milestone status
            milestone.status = MilestoneStatus.WITHDRAWN
            self.project.currentMilestoneIndex = self.project.currentMilestoneIndex + 1

            // Check if project is completed
            if self.project.currentMilestoneIndex >= UInt64(self.project.milestones.length) {
                self.project.status = ProjectStatus.COMPLETED
            }

            emit FundsWithdrawn(
                projectId: self.project.id,
                amount: withdrawAmount
            )

            return <- self.project.fusdVault.withdraw(amount: withdrawAmount)
        }

        access(all) fun getDetails(): Project {
            return self.project
        }

        init(project: Project) {
            self.project = project
        }
    }

    access(all) fun createProject(
        title: String,
        description: String,
        targetAmount: UFix64,
        endDate: UFix64
    ): @ProjectResource {
        let project = Project(
            id: self.nextProjectID,
            creator: getCurrentAuthAccount().address,
            title: title,
            description: description,
            targetAmount: targetAmount,
            endDate: endDate
        )

        emit ProjectCreated(id: self.nextProjectID, creator: getCurrentAuthAccount().address)

        self.nextProjectID = self.nextProjectID + 1

        return <- create ProjectResource(project: project)
    }

    access(all) var nextProjectID: UInt64

    init() {
        self.nextProjectID = 1
    }
}
