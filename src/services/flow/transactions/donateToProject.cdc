import FLOW from 0xFLOW
import ProjectToken from 0xProjectToken
import CharityProject from 0xCharityProject

transaction(projectAddress: Address, amount: UFix64) {
    let flowVault: @FLOW.Vault
    let projectRef: &{CharityProject.ProjectPublic}
    
    prepare(signer: AuthAccount) {
        // Get FLOW vault from signer's storage
        let vaultRef = signer.borrow<&FLOW.Vault>(from: /storage/flowVault)
            ?? panic("Could not borrow FLOW vault reference")
        
        // Withdraw FLOW
        self.flowVault <- vaultRef.withdraw(amount: amount)
        
        // Get project reference
        self.projectRef = getAccount(projectAddress)
            .getCapability(/public/CharityProject)
            .borrow<&{CharityProject.ProjectPublic}>()
            ?? panic("Could not borrow project reference")
    }

    execute {
        // Donate FLOW and receive project tokens
        let projectTokens <- self.projectRef.donateWithFLOW(vault: <-self.flowVault)
        
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
