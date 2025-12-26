# Deployment Guide

This guide covers deploying the SportsBet prediction market aggregator to Render and preparing for EigenCompute TEE deployment.

## Current State

✅ **Markets**: 19 sample sports markets have been seeded (NFL, NBA, Soccer, MLB, NHL, Tennis, UFC, Golf)
✅ **Contract**: Deployed on Sepolia at `0x0a64aA54141753Df024789Fb0abAb7DB6122d6bE`
✅ **Frontend**: React + Vite + Privy + wagmi setup complete

---

## Deployment Options

### 1. Render (Recommended for Initial Production)

Render is a platform-as-a-service that makes it easy to deploy web apps with minimal configuration.

#### Prerequisites

- GitHub account (free)
- Render account (free tier available)
- Your `.env` variables ready

#### Step 1: Prepare Repository

1. **Push to GitHub** (if not already):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Create `.env.example`** (for reference, not committed):
   ```bash
   VITE_PRIVY_APP_ID=your_privy_app_id
   VITE_CONTRACT_ADDRESS=0x0a64aA54141753Df024789Fb0abAb7DB6122d6bE
   ```

#### Step 2: Deploy on Render

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Create New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository and branch

3. **Configure Service**:
   - **Name**: `sportsbet` (or your preferred name)
   - **Root Directory**: `app` (since your app is in the app folder)
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run preview` (or use the serve approach below)

4. **Environment Variables**:
   Add these in Render's Environment Variables section:
   ```
   VITE_PRIVY_APP_ID=your_privy_app_id_here
   VITE_CONTRACT_ADDRESS=0x0a64aA54141753Df024789Fb0abAb7DB6122d6bE
   ```

5. **Advanced Settings**:
   - **Auto-Deploy**: Yes (deploys on every push to main)
   - **Plan**: Free (or choose a paid plan for better performance)

6. **Click "Create Web Service"**

#### Step 3: Update Start Command (Optional - Better for Production)

For production, use a proper static file server. Update the start command in Render:

**Option A: Using serve (already in Dockerfile)**
- Build: `npm install && npm run build`
- Start: `npx serve -s dist -l 8080`

**Option B: Using Node.js server**
Create `server.js`:
```javascript
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
```

Then update package.json scripts:
```json
"start": "node server.js"
```

#### Step 4: Verify Deployment

- Render will provide a URL like `https://sportsbet.onrender.com`
- Visit the URL and test the app
- Check browser console for any errors
- Test wallet connection and trading

---

## Docker Usage

Docker is used for containerizing the application, making it portable and consistent across environments.

### Dockerfile Explanation

The current `Dockerfile`:
1. Uses Node 18 Alpine (lightweight Linux base image)
2. Sets working directory
3. Copies package files and installs dependencies
4. Copies source code and builds the React app
5. Uses `serve` to serve the built static files
6. Exposes port 8080

### Docker Commands

**Build image locally:**
```bash
cd app
docker build -t sportsbet:latest .
```

**Run container locally:**
```bash
docker run -p 8080:8080 \
  -e VITE_PRIVY_APP_ID=your_app_id \
  -e VITE_CONTRACT_ADDRESS=0x0a64aA54141753Df024789Fb0abAb7DB6122d6bE \
  sportsbet:latest
```

**Push to Docker Hub (for EigenCompute later):**
```bash
docker tag sportsbet:latest yourusername/sportsbet:latest
docker push yourusername/sportsbet:latest
```

### Docker vs Render Native

- **Render Native**: Simpler, uses build/start commands directly
- **Docker**: More control, consistent environment, needed for EigenCompute

You can deploy to Render without Docker, but Docker will be needed for EigenCompute TEE deployment.

---

## EigenCompute TEE Deployment (Future)

EigenCompute requires Docker images for deployment to Trusted Execution Environments.

### Why EigenCompute?

- **Enhanced Security**: TEE provides hardware-backed security
- **Verifiable Execution**: Transparent and auditable
- **Decentralized**: Runs on decentralized infrastructure

### Preparation Steps (For Later)

1. **Ensure Dockerfile is ready** (already done ✅)
   - Platform: `linux/amd64`
   - Port exposed: `8080`
   - App binds to `0.0.0.0`

2. **Build and test Docker image:**
   ```bash
   cd app
   docker build -t yourusername/sportsbet:latest .
   docker run -p 8080:8080 \
     -e VITE_PRIVY_APP_ID=your_app_id \
     -e VITE_CONTRACT_ADDRESS=0x0a64aA54141753Df024789Fb0abAb7DB6122d6bE \
     yourusername/sportsbet:latest
   ```

3. **Push to Docker registry:**
   ```bash
   docker login
   docker push yourusername/sportsbet:latest
   ```

4. **Deploy with ecloud CLI:**
   ```bash
   # Install ecloud CLI
   npm install -g @layr-labs/ecloud-cli
   
   # Authenticate
   ecloud auth login
   
   # Set environment
   ecloud compute env set sepolia  # or mainnet
   
   # Navigate to app directory
   cd app
   
   # Deploy
   ecloud compute app deploy
   # Select: "Build and deploy from Dockerfile"
   ```

### Environment Variables for EigenCompute

The same environment variables are needed:
- `VITE_PRIVY_APP_ID`
- `VITE_CONTRACT_ADDRESS`

These can be set via `.env` file or ecloud environment configuration.

---

## Production Checklist

### Before Deploying to Render

- [x] Contract deployed to Sepolia (or Mainnet)
- [x] Markets seeded (19 markets)
- [x] Privy App ID configured
- [x] Contract address set in environment variables
- [ ] Test locally: `npm run build && npm run preview`
- [ ] Verify all features work (login, trading, portfolio)
- [ ] Check browser console for errors
- [ ] Test on mobile device (responsive design)

### Environment Variables Required

```bash
# Required for production
VITE_PRIVY_APP_ID=clxxxxxxxxxxxxx
VITE_CONTRACT_ADDRESS=0x0a64aA54141753Df024789Fb0abAb7DB6122d6bE

# Optional (for contract deployment/seeding)
PRIVATE_KEY=your_private_key
SEPOLIA_RPC_URL=https://rpc.sepolia.org
ETHERSCAN_API_KEY=your_etherscan_key
```

### Render-Specific Notes

1. **Build Time**: First build may take 5-10 minutes
2. **Cold Starts**: Free tier may have cold starts (app sleeps after inactivity)
3. **HTTPS**: Automatically enabled by Render
4. **Custom Domain**: Can be configured in Render dashboard
5. **Logs**: View logs in Render dashboard

---

## Post-Deployment

### 1. Verify Everything Works

- [ ] App loads without errors
- [ ] Wallet connection works (Privy login)
- [ ] Markets display correctly
- [ ] Trading functionality works
- [ ] Portfolio page loads user positions
- [ ] Transactions execute successfully

### 2. Monitor

- Check Render logs for errors
- Monitor transaction success rate
- Watch for user-reported issues
- Track contract gas usage

### 3. Updates

To update the app:
1. Make changes locally
2. Commit and push to GitHub
3. Render auto-deploys (if enabled)
4. Verify new deployment works

---

## Troubleshooting

### Build Fails on Render

- Check Node.js version (should be 18+)
- Verify all dependencies in package.json
- Check build logs for specific errors
- Ensure `app` directory structure is correct

### App Doesn't Load

- Verify environment variables are set correctly
- Check browser console for errors
- Verify contract address is correct
- Check Privy App ID is valid

### Transactions Fail

- Verify contract is deployed and address is correct
- Check user has sufficient Sepolia ETH
- Verify network is set to Sepolia
- Check contract logs for errors

---

## Summary

1. **Render Deployment**: Use GitHub integration, set environment variables, deploy
2. **Docker**: Already configured, will be needed for EigenCompute
3. **EigenCompute**: Deploy later using ecloud CLI with Docker image
4. **Markets**: 19 markets already seeded, keep as-is

The app is production-ready for Render deployment now, and prepared for EigenCompute deployment later.

