# Aggregator

A decentralized sports prediction market platform built on Ethereum (Sepolia testnet). Aggregator enables users to trade on sports outcomes using an Automated Market Maker (AMM) mechanism where odds shift dynamically based on trading activity. All transactions are executed on-chain via smart contracts, ensuring transparency and trustlessness.

## 🌟 Features

### Market Discovery
- **Home Dashboard**: Browse all active and ended markets with real-time odds
- **Category Filtering**: Filter markets by sport (NFL, NBA, Soccer, MLB, NHL, Tennis, UFC, Golf)
- **Trending Markets**: Discover markets with trading volume > 0, highlighted with a distinct yellow filter
- **Search Functionality**: Search markets by question text
- **Market Stats**: View total markets, active markets, sports categories, and trading fee at a glance
- **Real-time Updates**: Odds and market data update automatically after each trade

### Trading
- **Buy Shares**: Purchase YES or NO shares with ETH based on your prediction
- **Sell Shares**: Exit positions anytime before market resolution, profit from favorable odds movement
- **Real-time Quotes**: See exact share amounts and ETH payouts before confirming trades
- **Slippage Protection**: Built-in protection against price movements during transaction confirmation
- **Quick Amount Buttons**: Pre-set ETH amounts (0.001, 0.005, 0.01, 0.05) for faster trading
- **MAX Button**: Automatically fill maximum tradeable amount (leaving gas for fees)
- **Live Odds Display**: Visual odds bars and percentage indicators update in real-time

### Portfolio Management
- **Position Tracking**: View all your active and ended positions across all markets
- **Share Balances**: See your YES and NO share holdings for each market
- **Claim Winnings**: One-click claiming for resolved markets where you hold winning shares
- **Performance Overview**: Track your positions' status, end times, and resolution outcomes
- **Active vs Ended**: Separate views for ongoing and resolved markets

### Market Details
- **Detailed Market View**: Comprehensive market information including:
  - Question and category with visual indicators
  - Real-time YES/NO odds with visual bars
  - Trading volume in ETH
  - End time and countdown timer
  - Resolution status and outcome (if resolved)
- **Your Position**: Display of your YES/NO shares in the market
- **Trading Panel**: Sticky sidebar trading interface with buy/sell controls
- **How It Works Guide**: In-market explanation of the prediction market mechanism

### Authentication & Wallet
- **Privy Integration**: Seamless authentication with multiple options:
  - Email/password
  - Social logins (Google, Twitter, etc.)
  - Wallet connection (MetaMask, WalletConnect, Coinbase Wallet)
  - Embedded wallet (no external wallet required)
- **Balance Display**: Real-time ETH balance in header
- **Address Management**: Copy wallet address with one click
- **Multi-wallet Support**: Switch between embedded and external wallets

### Technical Features
- **AMM Pricing**: Constant product market maker (x * y = k) for dynamic odds
- **On-chain Execution**: All trades executed via smart contract on Sepolia testnet
- **Transaction Confirmation**: Wait for blockchain confirmation before UI updates
- **Error Handling**: Comprehensive error messages and validation
- **Responsive Design**: Modern, mobile-friendly UI with Tailwind CSS
- **Type Safety**: Full TypeScript implementation for reliability

## 📚 Documentation Links

### Core Technologies
- [React](https://react.dev/) - UI framework
- [Vite](https://vitejs.dev/) - Build tool and dev server
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [React Router](https://reactrouter.com/) - Client-side routing
- [React Query (TanStack Query)](https://tanstack.com/query/latest) - Data fetching and caching

### Blockchain & Web3
- [wagmi](https://wagmi.sh/) - React Hooks for Ethereum
- [viem](https://viem.sh/) - TypeScript Ethereum library
- [Privy](https://privy.io/docs) - Embedded wallet and authentication
- [Hardhat](https://hardhat.org/docs) - Ethereum development environment
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/) - Secure smart contract library
- [Ethereum Sepolia Testnet](https://ethereum.org/en/developers/docs/networks/#sepolia) - Test network documentation

### Deployment
- [Render](https://render.com/docs) - Web hosting platform
- [Docker](https://docs.docker.com/) - Containerization
- [EigenCompute](https://docs.eigenlayer.xyz/eigenlayer/) - Trusted execution environment (TEE) deployment

### Smart Contract Standards
- [ERC-20](https://eips.ethereum.org/EIPS/eip-20) - Token standard
- [Solidity Documentation](https://docs.soliditylang.org/) - Smart contract language
- [Ethereum Developer Resources](https://ethereum.org/en/developers/)

## 🏗️ Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **State Management**: React Query for server state, React hooks for local state
- **Routing**: React Router v7
- **Styling**: Tailwind CSS with custom design system
- **Web3 Integration**: wagmi + viem for blockchain interactions
- **Authentication**: Privy for embedded wallets and social auth

### Smart Contract
- **Language**: Solidity ^0.8.20
- **Framework**: Hardhat
- **Security**: OpenZeppelin Ownable and ReentrancyGuard
- **Pricing Model**: Constant Product AMM (x * y = k)
- **Fee Structure**: 1% trading fee collected by contract owner

### Deployment
- **Development**: Vite dev server (localhost:8080)
- **Production**: Docker container with static file serving
- **Hosting Options**:
  - Render (recommended for initial deployment)
  - EigenCompute (TEE for verifiable execution)

## 📁 Project Structure

```
aggregator/
├── app/
│   ├── contracts/              # Smart contracts
│   │   └── PredictionMarket.sol
│   ├── scripts/                # Deployment scripts
│   │   ├── deploy.js          # Contract deployment
│   │   └── seed-markets.js    # Sample market creation
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── Header.tsx
│   │   │   ├── MarketCard.tsx
│   │   │   ├── TradingPanel.tsx
│   │   │   └── ContractWarning.tsx
│   │   ├── pages/             # Page components
│   │   │   ├── HomePage.tsx
│   │   │   ├── MarketPage.tsx
│   │   │   ├── PortfolioPage.tsx
│   │   │   └── HowItWorksPage.tsx
│   │   ├── hooks/             # Custom React hooks
│   │   │   ├── useMarkets.ts  # Market data fetching
│   │   │   └── usePrivyContract.ts  # Privy transaction hooks
│   │   ├── utils/             # Utility functions
│   │   │   └── validation.ts
│   │   ├── contract.ts        # Contract ABI and address
│   │   ├── providers.tsx      # React Query, wagmi, Privy providers
│   │   ├── App.tsx            # Main app component
│   │   └── main.tsx           # Entry point
│   ├── Dockerfile             # Docker configuration
│   ├── hardhat.config.cjs     # Hardhat configuration
│   ├── tailwind.config.js     # Tailwind CSS config
│   ├── vite.config.ts         # Vite configuration
│   ├── package.json           # Dependencies
│   ├── SECURITY.md            # Security guidelines
│   └── SETUP.md               # Setup instructions
└── README.md                  # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- npm or yarn
- MetaMask or compatible wallet (for contract deployment)
- Sepolia ETH (for testing)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd aggregator
   ```

2. **Install dependencies**
   ```bash
   cd app
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the `app/` directory:
   ```bash
   # Privy App ID (get from https://dashboard.privy.io)
   VITE_PRIVY_APP_ID=your_privy_app_id
   
   # Contract address (set after deployment)
   VITE_CONTRACT_ADDRESS=0x...
   
   # For deployment (not required for frontend-only)
   PRIVATE_KEY=your_private_key
   SEPOLIA_RPC_URL=https://rpc.sepolia.org
   ETHERSCAN_API_KEY=your_etherscan_api_key
   ```

4. **Deploy smart contract** (optional - use existing deployment)
   ```bash
   npm run compile
   npm run deploy
   ```
   
   Copy the deployed contract address to your `.env` file.

5. **Seed sample markets** (optional)
   ```bash
   npm run seed
   ```

6. **Run development server**
   ```bash
   npm run dev
   ```
   
   Visit http://localhost:8080

## 🎯 Usage Guide

### For Traders

1. **Connect Wallet**
   - Click "Connect Wallet" in the header
   - Choose your preferred authentication method (email, social, or wallet)
   - Privy will create an embedded wallet if you don't have one

2. **Browse Markets**
   - View all markets on the home page
   - Use category filters (NFL, NBA, Soccer, etc.) or search
   - Click "Trending" to see markets with trading activity
   - Click any market card to view details

3. **Place a Trade**
   - Navigate to a market detail page
   - Select "Buy" mode and choose YES or NO
   - Enter ETH amount or use quick amount buttons
   - Review the quote (shares you'll receive)
   - Click "Buy [Yes/No] Shares"
   - Confirm transaction in your wallet

4. **Monitor Positions**
   - Go to "Portfolio" from the header
   - View all your active and ended positions
   - See your YES/NO share balances

5. **Sell Shares**
   - On the market page, switch to "Sell" mode
   - Use the slider to select percentage to sell
   - Review the ETH payout quote
   - Click "Sell [Yes/No] Shares"

6. **Claim Winnings**
   - After a market resolves, winners can claim
   - Go to the market page or Portfolio
   - Click "🎉 Claim Winnings" button
   - Receive ETH payout for winning shares

### For Developers

See [app/SETUP.md](./app/SETUP.md) for detailed development setup instructions.

See [app/SECURITY.md](./app/SECURITY.md) for security best practices and guidelines.

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run compile` - Compile smart contracts
- `npm run deploy` - Deploy contract to Sepolia
- `npm run seed` - Seed sample markets

### Smart Contract Details

The `PredictionMarket.sol` contract implements:

- **Market Creation**: Admin-only function to create new markets
- **AMM Pricing**: Constant product formula for dynamic odds
  - YES Price = `noPool / (yesPool + noPool)`
  - NO Price = `yesPool / (yesPool + noPool)`
- **Trading**: Buy/sell shares with ETH, shares priced by AMM
- **Resolution**: Admin resolves markets after events conclude
- **Claims**: Winners claim 1 ETH per winning share
- **Fees**: 1% fee on all trades collected by owner

### Key Hooks

- `useMarkets()` - Fetch all markets
- `useMarket(id)` - Fetch single market data
- `usePosition(marketId, address)` - Get user position in market
- `useUserPositions(address)` - Get all user positions
- `useQuoteBuy()` - Get buy quote (shares for ETH)
- `useQuoteSell()` - Get sell quote (ETH for shares)

## 🚢 Deployment

### Render (Recommended)

1. Push code to GitHub
2. Connect repository to Render
3. Create new Web Service
4. Set environment variables:
   - `VITE_PRIVY_APP_ID`
   - `VITE_CONTRACT_ADDRESS`
5. Set Dockerfile path: `app/Dockerfile`
6. Deploy

See Render documentation for detailed steps.

### Docker

```bash
cd app
docker build -t aggregator:latest .
docker run -p 8080:8080 \
  -e VITE_PRIVY_APP_ID=your_app_id \
  -e VITE_CONTRACT_ADDRESS=0x... \
  aggregator:latest
```

### EigenCompute

For deployment to Trusted Execution Environments:

```bash
# Install ecloud CLI
npm install -g @layr-labs/ecloud-cli

# Authenticate
ecloud auth login

# Deploy
cd app
ecloud compute app deploy
```

See [app/src/pages/HowItWorksPage.tsx](./app/src/pages/HowItWorksPage.tsx) for detailed EigenCompute deployment guide.

## 🔒 Security

- All sensitive values use environment variables
- Private keys never committed to repository
- Smart contracts use OpenZeppelin security patterns
- ReentrancyGuard protection on critical functions
- Input validation on all user inputs

See [app/SECURITY.md](./app/SECURITY.md) for comprehensive security guidelines.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Ensure all tests pass
5. Submit a pull request

## 📄 License

MIT License

## 🙏 Acknowledgments

- OpenZeppelin for secure contract libraries
- Privy for embedded wallet infrastructure
- wagmi and viem teams for excellent Ethereum tooling
- EigenLayer for TEE deployment capabilities

## 📞 Support

For issues, questions, or contributions, please open an issue on the repository.

---

Built with ❤️ using React, TypeScript, Solidity, and Ethereum.
