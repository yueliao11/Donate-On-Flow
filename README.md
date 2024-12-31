# Donate On Flow

A decentralized charitable donation platform built on Flow blockchain, integrating Telegram wallet for seamless donations.

![Donate On Flow Banner](./public/banner.png)

## Overview

Donate On Flow revolutionizes charitable giving by leveraging blockchain technology to create a transparent, efficient, and accessible donation platform. Built on Flow blockchain and integrated with Telegram wallet, it enables anyone to create or contribute to charitable projects with complete transparency and minimal friction.

## Features

- **One-Click Wallet Connection**: Seamless integration with OKX Telegram wallet
- **Transparent Project Creation**: Create charitable projects with detailed information and funding goals
- **Real-time Tracking**: Monitor donation progress and fund allocation on-chain
- **Low Transaction Costs**: Leverage Flow blockchain's efficient infrastructure
- **Smart Contract Security**: Audited contracts ensuring fund safety
- **Community Engagement**: Participate in project discussions and updates

## Technology Stack

- **Frontend**: React.js, TypeScript, TailwindCSS
- **Blockchain**: Flow EVM
- **Smart Contracts**: Solidity
- **Wallet Integration**: OKX Telegram Wallet
- **Development Tools**: Vite, Hardhat
- **Testing**: Jest, Hardhat Test

## Architecture

```
Donate On Flow/
├── contracts/            # Smart contracts
├── src/
│   ├── components/       # React components
│   ├── context/         # React context providers
│   ├── pages/           # Page components
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Utility functions
├── public/              # Static assets
└── test/               # Test files
```

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git
- Telegram account
- OKX wallet browser extension

## Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/yourusername/Donate-On-Flow.git
cd Donate-On-Flow
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Create environment file:
\`\`\`bash
cp .env.example .env.local
\`\`\`

4. Configure environment variables:
\`\`\`
NEXT_PUBLIC_CONTRACT_ADDRESS=your_contract_address
NEXT_PUBLIC_FLOW_NETWORK=testnet
\`\`\`

## Development

1. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

2. Deploy smart contracts (testnet):
\`\`\`bash
npx hardhat run scripts/deploy.ts --network flowTestnet
\`\`\`

## Testing

Run the test suite:
\`\`\`bash
npm run test
\`\`\`

## Deployment

1. Build the application:
\`\`\`bash
npm run build
\`\`\`

2. Deploy to production:
\`\`\`bash
npm run deploy
\`\`\`

## Smart Contract Integration

The platform uses a main CharityProject smart contract that handles:
- Project creation
- Donation processing
- Fund tracking
- Minimum fee management

### Key Contract Functions

\`\`\`solidity
function createProject(string memory title, string memory description, uint256 targetAmount)
function donate(uint256 projectId)
function getProjectCount()
function getMinimumFee()
\`\`\`

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Security

- Smart contracts are audited for security
- All transactions are verified on-chain
- Minimum fee requirement prevents spam projects
- Transparent fund tracking

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please:
- Open an issue on GitHub
- Join our Telegram community: [t.me/DonateOnFlow](https://t.me/DonateOnFlow)
- Email us at: support@donateonflow.com

## Acknowledgments

- Flow blockchain team
- OKX wallet team
- All our contributors and supporters

## Roadmap

- Q1 2024: Mainnet launch
- Q2 2024: Multi-currency support
- Q3 2024: DAO governance
- Q4 2024: Mobile app release

---

Built with ❤️ by the Donate On Flow team
