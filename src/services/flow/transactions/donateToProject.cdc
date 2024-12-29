import FUSD from 0xFUSD
import ProjectToken from 0xProjectToken
import CharityProject from 0xCharityProject

transaction(projectAddress: Address, amount: UFix64) {
    let fusdVault: @FUSD.Vault
    let projectRef: &{CharityProject.ProjectPublic}
    
    prepare(signer: AuthAccount) {
        // Get FUSD vault from signer's storage
        let vaultRef = signer.borrow<&FUSD.Vault>(from: /storage/fusdVault)
            ?? panic("Could not borrow FUSD vault reference")
        
        // Withdraw FUSD
        self.fusdVault <- vaultRef.withdraw(amount: amount)
        
        // Get project reference
        self.projectRef = getAccount(projectAddress)
            .getCapability(/public/CharityProject)
            .borrow<&{CharityProject.ProjectPublic}>()
            ?? panic("Could not borrow project reference")
    }

    execute {
        // Donate FUSD and receive project tokens
        let projectTokens <- self.projectRef.donateWithFUSD(vault: <-self.fusdVault)
        
        // Save project tokens to signer's storage
        let tokenStoragePath = /storage/projectTokens
        let tokenPublicPath = /public/projectTokens
        
        // Create token vault if it doesn't exist
        if self.account.borrow<&ProjectToken.Vault>(from: tokenStoragePath) == nil {
            self.account.save(<-projectTokens, to: tokenStoragePath)
            self.account.link<&ProjectToken.Vault{ProjectToken.Balance}>(
                tokenPublicPath,
                target: tokenStoragePath
            )
        } else {
            let vaultRef = self.account.borrow<&ProjectToken.Vault>(from: tokenStoragePath)
                ?? panic("Could not borrow project token vault reference")
            vaultRef.deposit(from: <-projectTokens)
        }
    }
}
