import FungibleToken from 0x9a0766d93b6608b7

access(all) contract ProjectToken: FungibleToken {
    access(all) var totalSupply: UFix64

    access(all) let name: String
    access(all) let symbol: String
    access(all) let decimals: Int8

    access(all) event TokensInitialized(initialSupply: UFix64)
    access(all) event TokensWithdrawn(amount: UFix64, from: Address?)
    access(all) event TokensDeposited(amount: UFix64, to: Address?)

    access(all) resource Vault: FungibleToken.Provider, FungibleToken.Receiver, FungibleToken.Balance {
        access(all) var balance: UFix64

        init(balance: UFix64) {
            self.balance = balance
        }

        access(all) fun withdraw(amount: UFix64): @FungibleToken.Vault {
            self.balance = self.balance - amount
            emit TokensWithdrawn(amount: amount, from: self.owner?.address)
            return <- create Vault(balance: amount)
        }

        access(all) fun deposit(from: @FungibleToken.Vault) {
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

    access(all) resource Minter {
        access(all) fun mintTokens(amount: UFix64): @ProjectToken.Vault {
            ProjectToken.totalSupply = ProjectToken.totalSupply + amount
            return <- create Vault(balance: amount)
        }
    }

    init(name: String, symbol: String) {
        self.name = name
        self.symbol = symbol
        self.decimals = 8
        self.totalSupply = 0.0

        let minter <- create Minter()
        self.account.save(<-minter, to: /storage/ProjectTokenMinter)

        emit TokensInitialized(initialSupply: self.totalSupply)
    }
}
