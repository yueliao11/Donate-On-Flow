// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract CharityProject {
    struct Project {
        string title;
        string description;
        uint256 targetAmount;
        uint256 currentAmount;
        address owner;
        bool isActive;
        uint256 minimumFee;
        bool isMinimumFeePaid;
    }

    mapping(uint256 => Project) public projects;
    uint256 public projectCount;
    uint256 public constant MINIMUM_FEE = 0.01 ether;

    event ProjectCreated(uint256 indexed projectId, string title, uint256 targetAmount);
    event DonationReceived(uint256 indexed projectId, address indexed donor, uint256 amount);
    event MinimumFeePaid(uint256 indexed projectId, address indexed owner);

    function createProject(
        string memory title,
        string memory description,
        uint256 targetAmount
    ) public payable {
        require(bytes(title).length > 0, "Title cannot be empty");
        require(bytes(description).length > 0, "Description cannot be empty");
        require(targetAmount > 0, "Target amount must be greater than 0");
        require(msg.value == MINIMUM_FEE, "Must pay exact minimum fee");
        
        projectCount++;
        projects[projectCount] = Project({
            title: title,
            description: description,
            targetAmount: targetAmount,
            currentAmount: 0,
            owner: msg.sender,
            isActive: true,
            minimumFee: MINIMUM_FEE,
            isMinimumFeePaid: true
        });

        emit ProjectCreated(projectCount, title, targetAmount);
        emit MinimumFeePaid(projectCount, msg.sender);
    }

    function donate(uint256 projectId) public payable {
        require(projectId > 0 && projectId <= projectCount, "Invalid project ID");
        require(projects[projectId].isActive, "Project is not active");
        require(msg.value > 0, "Donation amount must be greater than 0");
        require(projects[projectId].isMinimumFeePaid, "Project minimum fee not paid");

        Project storage project = projects[projectId];
        project.currentAmount += msg.value;
        
        emit DonationReceived(projectId, msg.sender, msg.value);
    }

    function getProjectCount() public view returns (uint256) {
        return projectCount;
    }

    function getMinimumFee() public pure returns (uint256) {
        return MINIMUM_FEE;
    }
}