# SportsBet - Sports Prediction Market Aggregator

A decentralized prediction market platform for sports events built on Ethereum (Sepolia). Features an AMM-based pricing mechanism where odds shift dynamically based on trading activity.

## Features

- 🏈 **Sports Markets**: NFL, NBA, Soccer, MLB, NHL, Tennis, UFC, Golf
- 📊 **AMM Pricing**: Constant product market maker (x * y = k) for dynamic odds
- 💰 **Trade Shares**: Buy YES/NO shares with ETH, sell anytime before resolution
- 🔐 **Privy Auth**: Easy authentication with email, wallet, or social login
- ⛓️ **On-Chain**: All trades executed via smart contract on Sepolia

## Quick Start

### 1. Install Dependencies

```bash
cd app
npm install
```

### 2. Set Up Environment

Create a `.env` file:

```bash
# Privy App ID (get from https://dashboard.privy.io)
VITE_PRIVY_APP_ID=your_privy_app_id

# Deployed contract address on Sepolia
VITE_CONTRACT_ADDRESS=0x...

# For deployment
PRIVATE_KEY=your_private_key
SEPOLIA_RPC_URL=https://rpc.sepolia.org
ETHERSCAN_API_KEY=your_etherscan_api_key
```

### 3. Deploy Smart Contract

```bash
# Compile contract
npm run compile

# Deploy to Sepolia
npm run deploy
```

Copy the deployed contract address to your `.env` file.

### 4. Seed Sample Markets

```bash
npm run seed
```

### 5. Run Development Server

```bash
npm run dev
```

Visit http://localhost:8080

## Smart Contract

The `PredictionMarket.sol` contract handles:

- **Market Creation**: Admin creates markets with question, category, end time, and initial odds
- **Trading**: Users buy/sell YES/NO shares using AMM pricing
- **Resolution**: Admin resolves markets after the event
- **Claims**: Winners claim their payout (1 share = 1 unit of value)

### AMM Mechanism

Uses constant product formula: `k = yesPool * noPool`

- **YES Price** = `noPool / (yesPool + noPool)`
- **NO Price** = `yesPool / (yesPool + noPool)`

When buying YES:
1. User's ETH adds to NO pool
2. User receives shares from YES pool
3. k remains constant
4. YES price increases (more scarce)

### Trading Fee

1% fee on all trades, collected by contract owner.

## Project Structure

```
app/
├── contracts/           # Solidity smart contracts
│   └── PredictionMarket.sol
├── scripts/             # Deployment and seeding scripts
│   ├── deploy.ts
│   └── seed-markets.ts
├── src/
│   ├── components/      # React components
│   │   ├── Header.tsx
│   │   ├── MarketCard.tsx
│   │   └── TradingPanel.tsx
│   ├── pages/           # Page components
│   │   ├── HomePage.tsx
│   │   ├── MarketPage.tsx
│   │   └── PortfolioPage.tsx
│   ├── hooks/           # Custom React hooks
│   │   └── useMarkets.ts
│   ├── contract.ts      # Contract ABI and address
│   ├── providers.tsx    # Privy, wagmi, React Query setup
│   └── main.tsx         # Entry point
├── hardhat.config.ts    # Hardhat configuration
├── tailwind.config.js   # Tailwind CSS config
└── vite.config.ts       # Vite configuration
```

## Deployment

### Render (Recommended for Initial Production)

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

Quick steps:
1. Push code to GitHub
2. Connect repo to Render
3. Set environment variables
4. Deploy

### Docker

The app is containerized for easy deployment:

```bash
# Build image
docker build -t sportsbet:latest .

# Run locally
docker run -p 8080:8080 \
  -e VITE_PRIVY_APP_ID=your_app_id \
  -e VITE_CONTRACT_ADDRESS=0x0a64aA54141753Df024789Fb0abAb7DB6122d6bE \
  sportsbet:latest
```

### EigenCompute TEE (Future)

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

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment guide.

## License

MIT
