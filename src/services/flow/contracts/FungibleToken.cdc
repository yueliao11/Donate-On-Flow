access(all) contract interface FungibleToken {
    access(all) var totalSupply: UFix64

    access(all) event TokensInitialized(initialSupply: UFix64)
    access(all) event TokensWithdrawn(amount: UFix64, from: Address?)
    access(all) event TokensDeposited(amount: UFix64, to: Address?)

    access(all) resource interface Provider {
        access(all) fun withdraw(amount: UFix64): @Vault {
            post {
                result.balance == amount: "Withdrawn amount must be equal to the balance of the withdrawn Vault"
            }
        }
    }

    access(all) resource interface Receiver {
        access(all) fun deposit(from: @Vault)
    }

    access(all) resource interface Balance {
        access(all) var balance: UFix64
    }

    access(all) resource Vault: Provider, Receiver, Balance {
        access(all) var balance: UFix64
    }

    access(all) fun createEmptyVault(): @Vault {
        post {
            result.balance == 0.0: "New vault must have zero balance"
        }
    }
}
