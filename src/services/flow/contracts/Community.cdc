pub contract Community {
    pub struct Comment {
        pub let id: UInt64
        pub let author: Address
        pub let content: String
        pub let timestamp: UFix64
        pub let projectId: UInt64
        pub var likes: UInt64

        init(id: UInt64, author: Address, content: String, projectId: UInt64) {
            self.id = id
            self.author = author
            self.content = content
            self.timestamp = getCurrentBlock().timestamp
            self.projectId = projectId
            self.likes = 0
        }
    }

    pub struct Proposal {
        pub let id: UInt64
        pub let creator: Address
        pub let title: String
        pub let description: String
        pub let options: [String]
        pub let startTime: UFix64
        pub let endTime: UFix64
        pub var votes: {UInt64: UInt64}
        pub var status: String

        init(
            id: UInt64,
            creator: Address,
            title: String,
            description: String,
            options: [String],
            duration: UFix64
        ) {
            self.id = id
            self.creator = creator
            self.title = title
            self.description = description
            self.options = options
            self.startTime = getCurrentBlock().timestamp
            self.endTime = self.startTime + duration
            self.votes = {}
            self.status = "active"
        }
    }

    pub resource interface CommunityPublic {
        pub fun addComment(content: String, projectId: UInt64)
        pub fun likeComment(commentId: UInt64)
        pub fun vote(proposalId: UInt64, optionIndex: UInt64)
        pub fun getComments(projectId: UInt64): [Comment]
        pub fun getProposals(): [Proposal]
    }

    pub resource CommunityResource: CommunityPublic {
        pub var comments: {UInt64: Comment}
        pub var proposals: {UInt64: Proposal}
        pub var nextCommentId: UInt64
        pub var nextProposalId: UInt64

        pub fun addComment(content: String, projectId: UInt64) {
            let comment = Comment(
                id: self.nextCommentId,
                author: getCurrentAuthAccount().address,
                content: content,
                projectId: projectId
            )
            self.comments[comment.id] = comment
            self.nextCommentId = self.nextCommentId + 1
        }

        pub fun likeComment(commentId: UInt64) {
            if let comment = &self.comments[commentId] as &Comment {
                comment.likes = comment.likes + 1
            }
        }

        pub fun createProposal(
            title: String,
            description: String,
            options: [String],
            duration: UFix64
        ) {
            let proposal = Proposal(
                id: self.nextProposalId,
                creator: getCurrentAuthAccount().address,
                title: title,
                description: description,
                options: options,
                duration: duration
            )
            self.proposals[proposal.id] = proposal
            self.nextProposalId = self.nextProposalId + 1
        }

        pub fun vote(proposalId: UInt64, optionIndex: UInt64) {
            if let proposal = &self.proposals[proposalId] as &Proposal {
                assert(
                    getCurrentBlock().timestamp <= proposal.endTime,
                    message: "Voting period has ended"
                )
                assert(
                    optionIndex < UInt64(proposal.options.length),
                    message: "Invalid option index"
                )
                
                proposal.votes[optionIndex] = (proposal.votes[optionIndex] ?? 0) + 1
            }
        }

        pub fun getComments(projectId: UInt64): [Comment] {
            let projectComments: [Comment] = []
            for comment in self.comments.values {
                if comment.projectId == projectId {
                    projectComments.append(comment)
                }
            }
            return projectComments
        }

        pub fun getProposals(): [Proposal] {
            return self.proposals.values
        }

        init() {
            self.comments = {}
            self.proposals = {}
            self.nextCommentId = 0
            self.nextProposalId = 0
        }
    }

    pub fun createCommunityResource(): @CommunityResource {
        return <- create CommunityResource()
    }
}
