import CharityProjectV2 from 0x945c254064cc292c35FA8516AFD415a73A0b23A0

transaction(
    title: String,
    description: String,
    targetAmount: UFix64,
    endDate: UFix64,
    tokenSymbol: String,
    tokenSupply: UFix64
) {
    prepare(signer: AuthAccount) {
        // Calculate deposit amount (10% of target amount)
        let depositAmount = targetAmount * 0.1
        
        // Create project
        let project <- CharityProjectV2.createProject(
            title: title,
            description: description,
            targetAmount: targetAmount,
            depositAmount: depositAmount
        )
        
        // Save the project resource to storage
        signer.save(<-project, to: /storage/CharityProject)
        
        // Create a public capability for the project
        signer.link<&{CharityProjectV2.ProjectPublic}>(
            /public/CharityProject,
            target: /storage/CharityProject
        )
    }

    execute {
        // Deposit FLOW will be handled by the contract
        CharityProjectV2.depositFlow(amount: depositAmount)
    }
}
