# Setup & Deployment Guide

## Contract Deployment

1. **Set up environment variables** in `.env`:
```bash
PRIVATE_KEY=your_private_key_without_0x
SEPOLIA_RPC_URL=https://rpc.sepolia.org
ETHERSCAN_API_KEY=your_etherscan_api_key
VITE_CONTRACT_ADDRESS=0x... # Will be set after deployment
VITE_PRIVY_APP_ID=your_privy_app_id
```

2. **Compile contract**:
```bash
npm run compile
```

3. **Deploy to Sepolia**:
```bash
npm run deploy
```

4. **Copy the deployed address** to `.env`:
```bash
VITE_CONTRACT_ADDRESS=0x0a64aA54141753Df024789Fb0abAb7DB6122d6bE
```

5. **Seed sample markets** (optional):
```bash
npm run seed
```

## Frontend Setup

1. **Get Privy App ID**:
   - Go to https://dashboard.privy.io
   - Create a new app
   - Copy the App ID to `.env` as `VITE_PRIVY_APP_ID`

2. **Install dependencies** (if not already done):
```bash
npm install
```

3. **Start development server**:
```bash
npm run dev
```

4. **Build for production**:
```bash
npm run build
```

## Deployment to EigenCloud TEE

1. **Build Docker image**:
```bash
docker build -t your-username/sportsbet:latest .
```

2. **Push to Docker Hub**:
```bash
docker push your-username/sportsbet:latest
```

3. **Deploy via ecloud CLI**:
```bash
cd app
ecloud compute app deploy
```

Select "Build and deploy from Dockerfile" when prompted.

## Environment Variables Reference

### Required
- `VITE_CONTRACT_ADDRESS` - Deployed contract address on Sepolia
- `VITE_PRIVY_APP_ID` - Privy application ID for authentication

### For Contract Deployment
- `PRIVATE_KEY` - Private key of deployer account (without 0x prefix)
- `SEPOLIA_RPC_URL` - Sepolia RPC endpoint (optional, defaults to public RPC)
- `ETHERSCAN_API_KEY` - For contract verification (optional)

### For Production
- `PORT` - Server port (default: 8080)

## Troubleshooting

### Contract won't compile
- Ensure you're using Node.js 18+
- Check Solidity version matches (0.8.20)
- Try deleting `cache/` and `artifacts/` directories

### Deployment fails
- Check you have Sepolia ETH in your account
- Verify `PRIVATE_KEY` is correct
- Check RPC endpoint is accessible

### Frontend won't connect
- Verify `VITE_CONTRACT_ADDRESS` is set correctly
- Check Privy App ID is valid
- Ensure you're on Sepolia network
- Check browser console for errors

### Markets not showing
- Run `npm run seed` to create sample markets
- Verify contract address is correct
- Check market count: `ecloud compute app logs`

