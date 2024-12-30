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
    }

    mapping(uint256 => Project) public projects;
    uint256 public projectCount;

    event ProjectCreated(uint256 indexed projectId, string title, uint256 targetAmount);
    event DonationReceived(uint256 indexed projectId, address indexed donor, uint256 amount);

    function createProject(string memory title, string memory description, uint256 targetAmount) public {
        require(targetAmount > 0, "Target amount must be greater than 0");
        
        projectCount++;
        projects[projectCount] = Project({
            title: title,
            description: description,
            targetAmount: targetAmount,
            currentAmount: 0,
            owner: msg.sender,
            isActive: true
        });

        emit ProjectCreated(projectCount, title, targetAmount);
    }

    function donate(uint256 projectId) public payable {
        require(projectId > 0 && projectId <= projectCount, "Invalid project ID");
        require(projects[projectId].isActive, "Project is not active");
        require(msg.value > 0, "Donation amount must be greater than 0");

        Project storage project = projects[projectId];
        project.currentAmount += msg.value;
        
        emit DonationReceived(projectId, msg.sender, msg.value);
    }
}