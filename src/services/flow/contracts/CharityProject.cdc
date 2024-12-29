import FungibleToken from 0xFungibleToken
import FUSD from 0xFUSD
import ProjectToken from 0xProjectToken

pub contract CharityProject {
    pub struct Project {
        pub let id: UInt64
        pub let creator: Address
        pub let title: String
        pub let description: String
        pub let targetAmount: UFix64
        pub let endDate: UFix64
        pub var currentAmount: UFix64
        pub var status: String
        pub let tokenSymbol: String
        pub let tokenSupply: UFix64
        
        init(
            id: UInt64,
            creator: Address,
            title: String,
            description: String,
            targetAmount: UFix64,
            endDate: UFix64,
            tokenSymbol: String,
            tokenSupply: UFix64
        ) {
            self.id = id
            self.creator = creator
            self.title = title
            self.description = description
            self.targetAmount = targetAmount
            self.endDate = endDate
            self.currentAmount = 0.0
            self.status = "active"
            self.tokenSymbol = tokenSymbol
            self.tokenSupply = tokenSupply
        }
    }

    pub resource interface ProjectPublic {
        pub fun donateWithFUSD(vault: @FUSD.Vault): @ProjectToken.Vault
        pub fun getDetails(): Project
        pub fun getTokenAllocation(donationAmount: UFix64): UFix64
    }

    pub resource ProjectResource: ProjectPublic {
        access(self) let project: Project
        access(self) let donations: {Address: UFix64}
        access(self) let tokenMinter: @ProjectToken.Minter
        
        pub fun donateWithFUSD(vault: @FUSD.Vault): @ProjectToken.Vault {
            pre {
                self.project.status == "active": "Project is not active"
                self.project.currentAmount + vault.balance <= self.project.targetAmount: "Exceeds target amount"
            }
            
            let donationAmount = vault.balance
            let donor = getCurrentAuthAccount().address
            
            // Store FUSD in project's vault
            self.donations[donor] = (self.donations[donor] ?? 0.0) + donationAmount
            self.project.currentAmount = self.project.currentAmount + donationAmount
            
            // Calculate token allocation
            let tokenAmount = self.getTokenAllocation(donationAmount: donationAmount)
            
            // Mint project tokens for donor
            let tokens <- self.tokenMinter.mintTokens(amount: tokenAmount)
            
            if self.project.currentAmount >= self.project.targetAmount {
                self.project.status = "completed"
            }

            // Clean up FUSD vault
            destroy vault
            
            return <- tokens
        }
        
        pub fun getDetails(): Project {
            return self.project
        }

        pub fun getTokenAllocation(donationAmount: UFix64): UFix64 {
            // Calculate tokens based on donation percentage of target
            let percentage = donationAmount / self.project.targetAmount
            return percentage * self.project.tokenSupply
        }
        
        init(
            id: UInt64,
            creator: Address,
            title: String,
            description: String,
            targetAmount: UFix64,
            endDate: UFix64,
            tokenSymbol: String,
            tokenSupply: UFix64
        ) {
            self.project = Project(
                id: id,
                creator: creator,
                title: title,
                description: description,
                targetAmount: targetAmount,
                endDate: endDate,
                tokenSymbol: tokenSymbol,
                tokenSupply: tokenSupply
            )
            self.donations = {}
            
            // Create project token contract
            let tokenContractCode = ProjectToken.contractCode
            let tokenContract <- create ProjectToken(
                name: title.concat(" Token"),
                symbol: tokenSymbol
            )
            
            // Get minter capability
            self.tokenMinter <- tokenContract.minter
            
            destroy tokenContract
        }

        destroy() {
            destroy self.tokenMinter
        }
    }

    pub fun createProject(
        title: String,
        description: String,
        targetAmount: UFix64,
        endDate: UFix64,
        tokenSymbol: String,
        tokenSupply: UFix64
    ): @ProjectResource {
        let project <- create ProjectResource(
            id: self.nextProjectID,
            creator: getCurrentAuthAccount().address,
            title: title,
            description: description,
            targetAmount: targetAmount,
            endDate: endDate,
            tokenSymbol: tokenSymbol,
            tokenSupply: tokenSupply
        )
        self.nextProjectID = self.nextProjectID + 1
        return <- project
    }

    pub var nextProjectID: UInt64
    
    init() {
        self.nextProjectID = 1
    }
}
