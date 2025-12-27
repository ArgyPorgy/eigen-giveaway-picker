import { Link } from 'react-router-dom';

export function HowItWorksPage() {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
          How It Works: Deploy to EigenCompute
        </h1>
        <p className="text-gray-400 text-lg max-w-3xl mx-auto">
          A practical guide for full-stack developers: Build your app, containerize it, deploy it with verifiable execution.
        </p>
      </div>

      {/* Why This Matters */}
      <div className="glass rounded-2xl p-8 mb-12 border border-accent-blue/20">
        <h2 className="text-2xl font-bold text-white mb-4">Why Should You Care?</h2>
        <div className="space-y-3 text-gray-300">
          <p>
            You've built apps before. You know React, Node.js, Docker. But when you deploy to AWS or Heroku, 
            <strong className="text-white"> users have to trust that your server ran the code correctly</strong>. 
            There's no way to verify what actually happened.
          </p>
          <p>
            <strong className="text-white">EigenCompute changes that.</strong> It lets you deploy your existing Docker containers 
            to verifiable infrastructure. Users can cryptographically verify that your code ran correctly, 
            with the exact inputs and outputs. It's like having a public audit trail for your backend execution.
          </p>
          <p className="text-accent-green font-semibold">
            No need to learn Solidity. No need to rewrite your logic. Just containerize and deploy.
          </p>
        </div>
      </div>

      {/* What We Built */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">What We Built</h2>
        <div className="glass rounded-2xl p-8 border border-dark-600">
          <p className="text-gray-300 mb-4">
            This prediction market app is a standard full-stack application:
          </p>
          <ul className="space-y-2 text-gray-300 list-disc list-inside mb-6">
            <li><strong className="text-white">Frontend:</strong> React + TypeScript + Vite</li>
            <li><strong className="text-white">Smart Contract:</strong> Solidity (for on-chain market logic)</li>
            <li><strong className="text-white">Authentication:</strong> Privy (wallet management)</li>
            <li><strong className="text-white">Blockchain:</strong> Ethereum Sepolia testnet</li>
          </ul>
          <p className="text-gray-300">
            Nothing special. Just a normal web app that happens to interact with a blockchain. 
            The same app you'd build for any other use case.
          </p>
        </div>
      </div>

      {/* Step 1: Containerize */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">Step 1: Containerize Your App</h2>
        
        <div className="glass rounded-2xl p-8 border border-dark-600 mb-6">
          <h3 className="text-xl font-bold text-white mb-4">Create a Dockerfile</h3>
          <p className="text-gray-300 mb-4">
            Create a <code className="bg-dark-800 px-2 py-1 rounded text-accent-green">Dockerfile</code> in your project root:
          </p>
          <div className="bg-dark-900 rounded-lg p-4 border border-dark-600 overflow-x-auto">
            <pre className="text-sm text-gray-300 font-mono">
{`FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
RUN npm install

# Copy source code
COPY . .

# Build the app (Vite embeds env vars at build time)
ARG VITE_PRIVY_APP_ID
ARG VITE_CONTRACT_ADDRESS
ENV VITE_PRIVY_APP_ID=\${VITE_PRIVY_APP_ID}
ENV VITE_CONTRACT_ADDRESS=\${VITE_CONTRACT_ADDRESS}

RUN npm run build

# Install serve to serve static files
RUN npm install -g serve

EXPOSE 8080

# Start the server (must bind to 0.0.0.0, not localhost)
CMD ["sh", "-c", "serve -s dist -l 0.0.0.0:\${PORT:-8080}"]`}
            </pre>
          </div>
          <div className="mt-4 p-4 bg-dark-800 rounded-lg border border-dark-600">
            <p className="text-sm text-gray-400 mb-2"><strong className="text-white">Key points:</strong></p>
            <ul className="text-sm text-gray-300 space-y-1 list-disc list-inside">
              <li>Use <code className="bg-dark-700 px-1 rounded">ARG</code> and <code className="bg-dark-700 px-1 rounded">ENV</code> for build-time variables (Vite needs them during build)</li>
              <li>Expose a port (8080 or use <code className="bg-dark-700 px-1 rounded">PORT</code> env var)</li>
              <li>Define a clear entrypoint (what command runs when container starts)</li>
            </ul>
          </div>
        </div>

        <div className="glass rounded-2xl p-8 border border-dark-600">
          <h3 className="text-xl font-bold text-white mb-4">Create .dockerignore</h3>
          <p className="text-gray-300 mb-4">
            Exclude unnecessary files from your Docker build:
          </p>
          <div className="bg-dark-900 rounded-lg p-4 border border-dark-600 overflow-x-auto">
            <pre className="text-sm text-gray-300 font-mono">
{`node_modules/
dist/
.env
.env.local
.git/
.vscode/
*.log
cache/
artifacts/`}
            </pre>
          </div>
        </div>

        <div className="glass rounded-2xl p-8 border border-dark-600 mt-6">
          <h3 className="text-xl font-bold text-white mb-4">Test Locally</h3>
          <div className="bg-dark-900 rounded-lg p-4 border border-dark-600">
            <pre className="text-sm text-gray-300 font-mono">
{`# Build the image
docker build -t prediction-market-app .

# Run locally
docker run -p 8080:8080 \\
  -e VITE_PRIVY_APP_ID=your_app_id \\
  -e VITE_CONTRACT_ADDRESS=0x... \\
  prediction-market-app`}
            </pre>
          </div>
          <p className="text-gray-300 mt-4 text-sm">
            If it works locally, it'll work on EigenCompute. Same container, different infrastructure.
          </p>
        </div>
      </div>

      {/* Step 2: Deploy to EigenCompute */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">Step 2: Deploy to EigenCompute</h2>
        
        <div className="glass rounded-2xl p-8 border border-dark-600 mb-6">
          <h3 className="text-xl font-bold text-white mb-4">Prerequisites</h3>
          <ul className="space-y-2 text-gray-300 list-disc list-inside">
            <li>Docker installed locally</li>
            <li>Testnet or Mainnet ETH for deployment transactions</li>
            <li>Your app containerized (Dockerfile ready)</li>
          </ul>
        </div>

        <div className="glass rounded-2xl p-8 border border-dark-600 mb-6">
          <h3 className="text-xl font-bold text-white mb-4">Install ecloud CLI</h3>
          <div className="bg-dark-900 rounded-lg p-4 border border-dark-600 mb-4">
            <pre className="text-sm text-gray-300 font-mono">
{`npm install -g @layr-labs/ecloud-cli`}
            </pre>
          </div>
        </div>

        <div className="glass rounded-2xl p-8 border border-dark-600 mb-6">
          <h3 className="text-xl font-bold text-white mb-4">Initial Setup</h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">1. Login to Docker</h4>
              <div className="bg-dark-900 rounded-lg p-4 border border-dark-600">
                <pre className="text-sm text-gray-300 font-mono">
{`docker login`}
                </pre>
              </div>
              <p className="text-gray-400 text-sm mt-2">Required to push your application images</p>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-2">2. Authenticate with EigenCloud</h4>
              <p className="text-gray-300 mb-3">Choose one option:</p>
              <div className="bg-dark-900 rounded-lg p-4 border border-dark-600 mb-3">
                <pre className="text-sm text-gray-300 font-mono">
{`# Option 1: Use existing private key
ecloud auth login

# Option 2: Generate new private key
ecloud auth generate --store`}
                </pre>
              </div>
              <p className="text-gray-400 text-sm">Check your address: <code className="bg-dark-800 px-2 py-1 rounded text-accent-green">ecloud auth whoami</code></p>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-2">3. Set Environment (Optional)</h4>
              <div className="bg-dark-900 rounded-lg p-4 border border-dark-600">
                <pre className="text-sm text-gray-300 font-mono">
{`# For Sepolia testnet (recommended for testing)
ecloud compute env set sepolia

# For Mainnet
ecloud compute env set mainnet`}
                </pre>
              </div>
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-8 border border-dark-600 mb-6">
          <h3 className="text-xl font-bold text-white mb-4">Create & Deploy Your App</h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">1. Create Application (Optional)</h4>
              <p className="text-gray-300 mb-3">
                If starting fresh, create from a template. For existing apps (like this one), skip this step.
              </p>
              <div className="bg-dark-900 rounded-lg p-4 border border-dark-600">
                <pre className="text-sm text-gray-300 font-mono">
{`ecloud compute app create --name my-app --language typescript --template-repo minimal
cd my-app`}
                </pre>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-2">2. Configure Environment Variables</h4>
              <p className="text-gray-300 mb-3">
                Create a <code className="bg-dark-800 px-2 py-1 rounded text-accent-green">.env</code> file with your variables:
              </p>
              <div className="bg-dark-900 rounded-lg p-4 border border-dark-600">
                <pre className="text-sm text-gray-300 font-mono">
{`# Example .env
VITE_PRIVY_APP_ID=your_privy_app_id
VITE_CONTRACT_ADDRESS=0x...
PORT=8080

# Variables with _PUBLIC suffix are visible to users
NETWORK_PUBLIC=sepolia`}
                </pre>
              </div>
              <p className="text-gray-400 text-sm mt-2">
                <strong className="text-white">Note:</strong> Variables with <code className="bg-dark-800 px-1 rounded">_PUBLIC</code> suffix are visible to users. Standard variables remain encrypted in the TEE.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-2">3. Subscribe to EigenCompute</h4>
              <div className="bg-dark-900 rounded-lg p-4 border border-dark-600 mb-3">
                <pre className="text-sm text-gray-300 font-mono">
{`ecloud billing subscribe`}
                </pre>
              </div>
              <p className="text-gray-300 text-sm">Enter payment details in the payment portal that opens</p>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-2">4. Deploy Your App</h4>
              <div className="bg-dark-900 rounded-lg p-4 border border-dark-600 mb-3">
                <pre className="text-sm text-gray-300 font-mono">
{`ecloud compute app deploy`}
                </pre>
              </div>
              <p className="text-gray-300 mb-3">
                When prompted, select <strong className="text-white">"Build and deploy from Dockerfile"</strong>. The CLI will:
              </p>
              <ul className="text-gray-300 space-y-1 list-disc list-inside mb-3">
                <li>Build your Docker image (targeting linux/amd64)</li>
                <li>Push the image to your Docker registry</li>
                <li>Deploy to a TEE instance</li>
                <li>Return your app details (app ID and instance IP)</li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-2">5. View Your App</h4>
              <div className="bg-dark-900 rounded-lg p-4 border border-dark-600">
                <pre className="text-sm text-gray-300 font-mono">
{`ecloud compute app info

# View logs if needed
ecloud compute app logs`}
                </pre>
              </div>
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-8 border border-accent-blue/30">
          <h3 className="text-xl font-bold text-white mb-4">Important: Port Configuration</h3>
          <p className="text-gray-300 mb-4">
            Make sure your Dockerfile includes:
          </p>
          <div className="bg-dark-900 rounded-lg p-4 border border-dark-600 mb-4">
            <pre className="text-sm text-gray-300 font-mono">
{`# Expose the port your app listens on
EXPOSE 8080

# Your app must bind to 0.0.0.0 (not localhost)
CMD ["sh", "-c", "serve -s dist -l 0.0.0.0:8080"]`}
            </pre>
          </div>
          <p className="text-gray-300 text-sm">
            <strong className="text-white">Critical:</strong> Your application must bind to <code className="bg-dark-800 px-2 py-1 rounded">0.0.0.0</code> (not <code className="bg-dark-800 px-2 py-1 rounded">localhost</code>) to be accessible from outside the container.
          </p>
        </div>
      </div>

      {/* What Happens Behind the Scenes */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">What Happens Behind the Scenes</h2>
        
        <div className="space-y-6">
          <div className="glass rounded-2xl p-8 border border-dark-600">
            <h3 className="text-xl font-bold text-white mb-4">1. Your Container Runs in a TEE</h3>
            <p className="text-gray-300 mb-3">
              A <strong className="text-white">Trusted Execution Environment (TEE)</strong> is hardware that provides:
            </p>
            <ul className="text-gray-300 space-y-1 list-disc list-inside mb-3">
              <li>Isolated execution (your code runs in a secure enclave)</li>
              <li>Cryptographic attestation (proof of what code ran)</li>
              <li>Tamper resistance (can't modify execution without detection)</li>
            </ul>
            <p className="text-gray-300 text-sm italic">
              Think of it like a secure sandbox that can prove what happened inside.
            </p>
          </div>

          <div className="glass rounded-2xl p-8 border border-dark-600">
            <h3 className="text-xl font-bold text-white mb-4">2. Execution is Attested</h3>
            <p className="text-gray-300 mb-3">
              Every time your app runs, the TEE generates a <strong className="text-white">cryptographic proof</strong> that includes:
            </p>
            <ul className="text-gray-300 space-y-1 list-disc list-inside">
              <li>Which container image ran (code hash)</li>
              <li>What inputs it received</li>
              <li>What outputs it produced</li>
              <li>Execution logs</li>
            </ul>
            <p className="text-gray-300 mt-3 text-sm">
              Anyone can verify these proofs independently. No need to trust the operator.
            </p>
          </div>

          <div className="glass rounded-2xl p-8 border border-dark-600">
            <h3 className="text-xl font-bold text-white mb-4">3. Proofs are Published</h3>
            <p className="text-gray-300 mb-3">
              All attestations are published to <strong className="text-white">EigenDA</strong> (EigenLayer's data availability layer). 
              This creates a permanent, publicly verifiable record of:
            </p>
            <ul className="text-gray-300 space-y-1 list-disc list-inside">
              <li>Every execution of your app</li>
              <li>All inputs and outputs</li>
              <li>Complete audit trail</li>
            </ul>
          </div>

          <div className="glass rounded-2xl p-8 border border-dark-600">
            <h3 className="text-xl font-bold text-white mb-4">4. Economic Security</h3>
            <p className="text-gray-300 mb-3">
              Operators running EigenCompute have <strong className="text-white">stake at risk</strong>. If they:
            </p>
            <ul className="text-gray-300 space-y-1 list-disc list-inside mb-3">
              <li>Run incorrect code</li>
              <li>Modify execution results</li>
              <li>Violate execution guarantees</li>
            </ul>
            <p className="text-gray-300">
              They get <strong className="text-white">penalized (slashed)</strong>. Their staked tokens are at risk, 
              making cheating economically unviable.
            </p>
          </div>
        </div>
      </div>

      {/* Why This Matters for Developers */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">Why This Matters for You</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass rounded-2xl p-6 border border-accent-blue/30">
            <div className="text-accent-blue text-3xl mb-3">🔒</div>
            <h3 className="text-lg font-bold text-white mb-2">Verifiable Execution</h3>
            <p className="text-gray-300 text-sm">
              Users can cryptographically verify that your backend ran correctly. No more "trust us, it worked."
            </p>
          </div>

          <div className="glass rounded-2xl p-6 border border-accent-green/30">
            <div className="text-accent-green text-3xl mb-3">📦</div>
            <h3 className="text-lg font-bold text-white mb-2">No Code Changes</h3>
            <p className="text-gray-300 text-sm">
              Use your existing Docker containers. No need to rewrite logic or learn new languages.
            </p>
          </div>

          <div className="glass rounded-2xl p-6 border border-accent-purple/30">
            <div className="text-accent-purple text-3xl mb-3">⚡</div>
            <h3 className="text-lg font-bold text-white mb-2">Full Stack Flexibility</h3>
            <p className="text-gray-300 text-sm">
              Python, Node.js, Rust, Go — any language that runs in Docker works. No constraints.
            </p>
          </div>

          <div className="glass rounded-2xl p-6 border border-accent-yellow/30">
            <div className="text-accent-yellow text-3xl mb-3">💰</div>
            <h3 className="text-lg font-bold text-white mb-2">On-Chain Integration</h3>
            <p className="text-gray-300 text-sm">
              Your smart contracts can verify off-chain execution proofs and trigger on-chain actions automatically.
            </p>
          </div>
        </div>
      </div>

      {/* The Simple Workflow */}
      <div className="glass rounded-2xl p-8 mb-12 border-2 border-accent-green/50 bg-gradient-to-br from-dark-800/50 to-dark-700/50">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">The Simple Workflow</h2>
        <div className="text-center">
          <div className="inline-block bg-dark-800 rounded-xl p-6 border border-dark-600">
            <p className="text-gray-200 text-lg font-mono space-y-2">
              <span className="text-accent-blue">Build your app</span>
              <span className="mx-4">→</span>
              <span className="text-accent-purple">Dockerize it</span>
              <span className="mx-4">→</span>
              <span className="text-accent-green">Deploy to EigenCompute</span>
              <span className="mx-4">→</span>
              <span className="text-accent-yellow">Get verifiable execution</span>
            </p>
          </div>
        </div>
        <p className="text-gray-300 mt-6 text-center text-sm">
          That's it. Same development workflow you're used to, with cryptographic verifiability built in.
        </p>
      </div>

      {/* Real-World Example */}
      <div className="glass rounded-2xl p-8 mb-12 border border-dark-600">
        <h2 className="text-2xl font-bold text-white mb-4">Real-World Example</h2>
        <p className="text-gray-300 mb-4">
          This prediction market app you're using right now could be deployed to EigenCompute:
        </p>
        <div className="bg-dark-800 rounded-lg p-4 border border-dark-600">
          <ul className="text-gray-300 text-sm space-y-2">
            <li>✓ Frontend built with React (standard web app)</li>
            <li>✓ Containerized with Docker (standard deployment)</li>
            <li>✓ Ready for EigenCompute (just needs deployment config)</li>
            <li>✓ Execution would be verifiable (users can verify backend logic)</li>
            <li>✓ Smart contracts can trust off-chain computations (settle markets based on proofs)</li>
          </ul>
        </div>
        <p className="text-gray-300 mt-4 text-sm">
          The code is the same. The deployment target is different. The guarantees are stronger.
        </p>
      </div>

      {/* CTA */}
      <div className="text-center mb-12">
        <Link
          to="/"
          className="inline-block px-8 py-4 bg-gradient-to-r from-accent-blue to-accent-purple text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
        >
          Explore the Markets →
        </Link>
      </div>
    </div>
  );
}
