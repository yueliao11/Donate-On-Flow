import CharityProject from 0xCharityProject

transaction(
    title: String,
    description: String,
    targetAmount: UFix64,
    endDate: UFix64,
    tokenSymbol: String,
    tokenSupply: UFix64
) {
    prepare(signer: AuthAccount) {
        let project <- CharityProject.createProject(
            title: title,
            description: description,
            targetAmount: targetAmount,
            endDate: endDate,
            tokenSymbol: tokenSymbol,
            tokenSupply: tokenSupply
        )
        
        // Save the project resource to storage
        signer.save(<-project, to: /storage/CharityProject)
        
        // Create a public capability for the project
        signer.link<&{CharityProject.ProjectPublic}>(
            /public/CharityProject,
            target: /storage/CharityProject
        )
    }
}
