pub contract TokenVault {
    pub resource interface TokenReceiver {
        pub fun deposit(from: @FungibleToken.Vault)
        pub fun getBalance(): UFix64
    }

    pub resource Vault: TokenReceiver {
        pub var balance: UFix64
        pub let supportedTokens: {String: Bool}
        pub let transactions: [Transaction]

        pub struct Transaction {
            pub let timestamp: UFix64
            pub let amount: UFix64
            pub let tokenType: String
            pub let description: String
            pub let category: String

            init(amount: UFix64, tokenType: String, description: String, category: String) {
                self.timestamp = getCurrentBlock().timestamp
                self.amount = amount
                self.tokenType = tokenType
                self.description = description
                self.category = category
            }
        }

        pub fun deposit(from: @FungibleToken.Vault) {
            let tokenType = from.getType().identifier
            assert(self.supportedTokens[tokenType] ?? false, message: "Token type not supported")
            
            self.balance = self.balance + from.balance
            self.transactions.append(Transaction(
                amount: from.balance,
                tokenType: tokenType,
                description: "Donation received",
                category: "donation"
            ))
            
            destroy from
        }

        pub fun withdraw(amount: UFix64, tokenType: String, description: String, category: String): @FungibleToken.Vault {
            self.balance = self.balance - amount
            
            self.transactions.append(Transaction(
                amount: amount,
                tokenType: tokenType,
                description: description,
                category: category
            ))
            
            return <- create FungibleToken.Vault(balance: amount)
        }

        pub fun getBalance(): UFix64 {
            return self.balance
        }

        pub fun getTransactionHistory(): [Transaction] {
            return self.transactions
        }

        init() {
            self.balance = 0.0
            self.supportedTokens = {
                "A.1654653399040a61.FlowToken": true,
                "A.b19436aae4d94622.FiatToken": true  // USDC
            }
            self.transactions = []
        }
    }

    pub fun createVault(): @Vault {
        return <- create Vault()
    }
}
