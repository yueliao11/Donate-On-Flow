import CharityProject from 0xCharityProject

transaction(projectId: UInt64, memberAddress: Address, role: String) {
    let projectRef: &{CharityProject.ProjectPublic}

    prepare(signer: AuthAccount) {
        self.projectRef = signer
            .borrow<&{CharityProject.ProjectPublic}>(from: /storage/CharityProject)
            ?? panic("Could not borrow project reference")
    }

    execute {
        self.projectRef.addTeamMember(address: memberAddress, role: role)
    }
}
