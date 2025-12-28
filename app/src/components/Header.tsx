import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useBalance, useAccount } from 'wagmi';

export function Header() {
  const { login, logout, authenticated, user } = usePrivy();
  const { wallets } = useWallets();
  const wagmiAddress = useAccount().address;
  const location = useLocation();

  // Get address from Privy embedded wallet (primary) or wagmi connected wallet
  const embeddedWallet = wallets.find(w => w.walletClientType === 'privy');
  const address = embeddedWallet?.address || wagmiAddress || user?.wallet?.address;
  
  // Use embedded wallet address for balance if available
  const balanceAddress = embeddedWallet?.address || wagmiAddress;
  const { data: balance } = useBalance({ 
    address: balanceAddress as `0x${string}` | undefined,
    query: { enabled: !!balanceAddress }
  });

  const navItems = [
    { path: '/', label: 'Markets' },
    { path: '/portfolio', label: 'Portfolio' },
    { path: '/how-it-works', label: 'How It Works' },
  ];

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const [copied, setCopied] = useState(false);

  const copyAddress = async () => {
    if (address) {
      try {
        await navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy address:', err);
      }
    }
  };

  return (
    <header className="glass sticky top-0 z-50 border-b border-dark-600">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center transform group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <span className="font-display font-bold text-xl tracking-tight">
              Aggre<span className="text-accent-blue">gator</span>
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  location.pathname === item.path
                    ? 'bg-dark-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-dark-700'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Auth */}
          <div className="flex items-center gap-3">
            {authenticated && address ? (
              <div className="flex items-center gap-3">
                {/* Balance */}
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-dark-700 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
                  <span className="font-mono text-sm text-gray-300">
                    {balance ? `${parseFloat(balance.formatted).toFixed(4)} ETH` : '...'}
                  </span>
                </div>

                {/* User Menu */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={copyAddress}
                    className="group relative px-3 py-1.5 bg-dark-600 rounded-lg hover:bg-dark-500 transition-colors"
                    title="Click to copy address"
                  >
                    <span className="font-mono text-sm text-gray-300 group-hover:text-white transition-colors">
                      {formatAddress(address)}
                    </span>
                    {copied && (
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-accent-green text-white text-xs rounded whitespace-nowrap">
                        Copied!
                      </span>
                    )}
                  </button>
                  <button
                    onClick={logout}
                    className="p-2 text-gray-400 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
                    title="Logout"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={login}
                className="px-5 py-2.5 bg-gradient-to-r from-accent-blue to-accent-purple text-white font-semibold rounded-xl hover:opacity-90 transition-opacity btn-hover"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

