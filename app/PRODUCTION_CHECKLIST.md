# Production Deployment Checklist

## Pre-Deployment Verification

### Code Status
- [x] Contract deployed to Sepolia: `0x0a64aA54141753Df024789Fb0abAb7DB6122d6bE`
- [x] 19 markets seeded (NFL, NBA, Soccer, MLB, NHL, Tennis, UFC, Golf)
- [x] Frontend builds successfully
- [x] All dependencies installed
- [x] Environment variables documented

### Functionality Tests
- [ ] Wallet connection works (Privy)
- [ ] Markets display correctly
- [ ] Market detail pages load
- [ ] Trading (buy/sell) works
- [ ] Portfolio page displays positions
- [ ] Balance displays correctly
- [ ] Transaction execution successful
- [ ] Error handling works
- [ ] Mobile responsive design

### Build Verification
```bash
cd app
npm install
npm run build
npm run preview  # Test built version locally
```

---

## Render Deployment Steps

### 1. GitHub Setup
```bash
# If not already done
git init
git add .
git commit -m "Ready for production deployment"
git remote add origin <your-github-repo>
git push -u origin main
```

### 2. Render Dashboard Setup

1. Go to https://dashboard.render.com
2. Sign up/Login
3. Click "New +" → "Web Service"
4. Connect GitHub repository

### 3. Service Configuration

**Basic Settings:**
- **Name**: `sportsbet` (or your choice)
- **Region**: Choose closest to users
- **Branch**: `main` (or your default branch)
- **Root Directory**: `app`
- **Runtime**: `Node`

**Build & Deploy:**
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npx serve -s dist -l $PORT`
  - OR: `npm start` (if using server.js approach)

**Environment Variables:**
```
VITE_PRIVY_APP_ID=your_privy_app_id_here
VITE_CONTRACT_ADDRESS=0x0a64aA54141753Df024789Fb0abAb7DB6122d6bE
```

### 4. Deploy

- Click "Create Web Service"
- Wait for build to complete (5-10 minutes first time)
- Service will be available at `https://sportsbet.onrender.com`

### 5. Post-Deployment Verification

- [ ] App loads without errors
- [ ] Check browser console for errors
- [ ] Test wallet connection
- [ ] Verify markets load
- [ ] Test a trade (buy/sell)
- [ ] Check portfolio functionality
- [ ] Test on mobile device

---

## Environment Variables Reference

### Required for Production
```bash
VITE_PRIVY_APP_ID=clxxxxxxxxxxxxx        # From Privy dashboard
VITE_CONTRACT_ADDRESS=0x0a64aA54141753Df024789Fb0abAb7DB6122d6bE  # Deployed contract
```

### Optional (for contract management)
```bash
PRIVATE_KEY=your_private_key             # Only if deploying/updating contracts
SEPOLIA_RPC_URL=https://rpc.sepolia.org # Only for contract scripts
ETHERSCAN_API_KEY=your_key               # Only for contract verification
```

---

## Docker Usage

### Current Dockerfile

The Dockerfile is configured for:
- ✅ Building the React app
- ✅ Serving static files with `serve`
- ✅ Port 8080 exposed
- ✅ Linux/AMD64 platform (for EigenCompute compatibility)

### Docker Commands

**Build:**
```bash
cd app
docker build -t sportsbet:latest .
```

**Run locally:**
```bash
docker run -p 8080:8080 \
  -e VITE_PRIVY_APP_ID=your_app_id \
  -e VITE_CONTRACT_ADDRESS=0x0a64aA54141753Df024789Fb0abAb7DB6122d6bE \
  sportsbet:latest
```

**Push to Docker Hub (for EigenCompute):**
```bash
docker login
docker tag sportsbet:latest yourusername/sportsbet:latest
docker push yourusername/sportsbet:latest
```

---

## EigenCompute TEE Deployment (Future)

### Prerequisites
- [ ] Docker image built and tested
- [ ] Image pushed to Docker Hub
- [ ] ecloud CLI installed
- [ ] Authenticated with EigenCloud
- [ ] Sepolia ETH for deployment

### Deployment Steps (When Ready)

```bash
# 1. Install ecloud CLI
npm install -g @layr-labs/ecloud-cli

# 2. Authenticate
ecloud auth login

# 3. Set environment
ecloud compute env set sepolia

# 4. Subscribe (if needed)
ecloud billing subscribe

# 5. Navigate to app directory
cd app

# 6. Deploy
ecloud compute app deploy
# Select: "Build and deploy from Dockerfile"
```

### Why EigenCompute Later?

- **Render**: Quick deployment, easy updates, good for initial launch
- **EigenCompute**: Enhanced security (TEE), verifiable execution, decentralized infrastructure
- **Strategy**: Deploy to Render first, migrate to EigenCompute for enhanced security later

---

## Monitoring & Maintenance

### After Deployment

1. **Monitor Logs**
   - Render: Dashboard → Your Service → Logs
   - Check for errors regularly

2. **User Feedback**
   - Monitor for transaction failures
   - Watch for user-reported issues
   - Track common errors

3. **Updates**
   - Push changes to GitHub
   - Render auto-deploys (if enabled)
   - Verify new deployment works

4. **Contract Management**
   - Monitor contract events
   - Track gas usage
   - Watch for any contract issues

---

## Troubleshooting

### Common Issues

**Build fails:**
- Check Node version (18+)
- Verify all dependencies
- Check build logs

**App doesn't load:**
- Verify environment variables
- Check browser console
- Verify contract address

**Transactions fail:**
- Check user has Sepolia ETH
- Verify network is Sepolia
- Check contract logs

**Markets not showing:**
- Verify contract is deployed
- Check marketCount > 0
- Verify contract address is correct

---

## Quick Reference

### Current Deployment
- **Contract**: Sepolia `0x0a64aA54141753Df024789Fb0abAb7DB6122d6bE`
- **Markets**: 19 sports markets seeded
- **Frontend**: Ready for Render deployment

### Next Steps
1. Deploy to Render (this guide)
2. Test thoroughly
3. Get user feedback
4. Deploy to EigenCompute TEE (future)

