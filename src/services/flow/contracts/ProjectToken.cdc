import FungibleToken from 0xFungibleToken

pub contract ProjectToken: FungibleToken {
    // Total supply of tokens
    pub var totalSupply: UFix64

    // Token metadata
    pub let name: String
    pub let symbol: String
    pub let decimals: Int8

    // Events
    pub event TokensInitialized(initialSupply: UFix64)
    pub event TokensWithdrawn(amount: UFix64, from: Address?)
    pub event TokensDeposited(amount: UFix64, to: Address?)

    // Vault
    pub resource Vault: FungibleToken.Provider, FungibleToken.Receiver, FungibleToken.Balance {
        pub var balance: UFix64

        init(balance: UFix64) {
            self.balance = balance
        }

        pub fun withdraw(amount: UFix64): @FungibleToken.Vault {
            self.balance = self.balance - amount
            emit TokensWithdrawn(amount: amount, from: self.owner?.address)
            return <- create Vault(balance: amount)
        }

        pub fun deposit(from: @FungibleToken.Vault) {
            let vault <- from as! @ProjectToken.Vault
            self.balance = self.balance + vault.balance
            emit TokensDeposited(amount: vault.balance, to: self.owner?.address)
            vault.balance = 0.0
            destroy vault
        }

        destroy() {
            ProjectToken.totalSupply = ProjectToken.totalSupply - self.balance
        }
    }

    // Minter
    pub resource Minter {
        pub fun mintTokens(amount: UFix64): @ProjectToken.Vault {
            ProjectToken.totalSupply = ProjectToken.totalSupply + amount
            return <- create Vault(balance: amount)
        }
    }

    init(name: String, symbol: String) {
        self.name = name
        self.symbol = symbol
        self.decimals = 8
        self.totalSupply = 0.0

        // Create Minter and save it to storage
        let minter <- create Minter()
        self.account.save(<-minter, to: /storage/ProjectTokenMinter)

        emit TokensInitialized(initialSupply: self.totalSupply)
    }
}
