import { useParams, Link } from 'react-router-dom';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useAccount } from 'wagmi';
import { useQueryClient } from '@tanstack/react-query';
import { formatEther } from 'viem';
import { useMarket, usePosition, formatShares } from '../hooks/useMarkets';
import { usePrivyClaimWinnings } from '../hooks/usePrivyContract';
import { TradingPanel } from '../components/TradingPanel';
import { ContractWarning } from '../components/ContractWarning';

const categoryColors: Record<string, string> = {
  'NFL': 'from-orange-500 to-red-600',
  'NBA': 'from-blue-500 to-purple-600',
  'Soccer': 'from-green-500 to-emerald-600',
  'MLB': 'from-red-500 to-pink-600',
  'NHL': 'from-cyan-500 to-blue-600',
  'Tennis': 'from-yellow-500 to-orange-600',
  'UFC': 'from-red-600 to-red-800',
  'Golf': 'from-green-600 to-green-800',
  'default': 'from-gray-500 to-gray-700',
};

const categoryIcons: Record<string, string> = {
  'NFL': '🏈',
  'NBA': '🏀',
  'Soccer': '⚽',
  'MLB': '⚾',
  'NHL': '🏒',
  'Tennis': '🎾',
  'UFC': '🥊',
  'Golf': '⛳',
  'default': '🎯',
};

export function MarketPage() {
  const { id } = useParams<{ id: string }>();
  const marketId = parseInt(id || '0');
  const { user } = usePrivy();
  const { wallets } = useWallets();
  const wagmiAddress = useAccount().address;
  
  // Get address from Privy embedded wallet (primary) or wagmi connected wallet
  const embeddedWallet = wallets.find(w => w.walletClientType === 'privy');
  const address = embeddedWallet?.address || wagmiAddress || user?.wallet?.address;

  const queryClient = useQueryClient();
  const { data: marketData, isLoading, error, refetch } = useMarket(marketId);
  const { data: positionData, refetch: refetchPosition } = usePosition(marketId, address as `0x${string}` | undefined);
  const { claimWinnings: claimWinningsPrivy, isPending: isClaiming } = usePrivyClaimWinnings();

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="glass rounded-2xl overflow-hidden">
          <div className="h-2 shimmer" />
          <div className="p-8 space-y-6">
            <div className="h-8 w-48 shimmer rounded" />
            <div className="h-24 shimmer rounded" />
            <div className="h-40 shimmer rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !marketData) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="glass rounded-2xl p-12 text-center">
          <div className="text-5xl mb-4">❌</div>
          <h2 className="text-xl font-semibold text-white mb-2">Market not found</h2>
          <p className="text-gray-400 mb-6">This market doesn't exist or couldn't be loaded.</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent-blue text-white rounded-xl hover:opacity-90 transition-opacity"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Markets
          </Link>
        </div>
      </div>
    );
  }

  const [question, category, _imageUrl, _createdAt, endTime, resolved, outcome, yesPrice, noPrice, totalVolume] = marketData;
  const gradient = categoryColors[category] || categoryColors.default;
  const icon = categoryIcons[category] || categoryIcons.default;
  const endDate = new Date(Number(endTime) * 1000);
  const isEnded = Date.now() > Number(endTime) * 1000;

  const yesShares = positionData?.[0] || 0n;
  const noShares = positionData?.[1] || 0n;
  const hasPosition = yesShares > 0n || noShares > 0n;

  // Check if user can claim
  const canClaim = resolved && hasPosition && (
    (outcome && yesShares > 0n) || (!outcome && noShares > 0n)
  );

  const handleClaim = async () => {
    try {
      await claimWinningsPrivy(marketId);
      refetch();
      refetchPosition();
    } catch (err) {
      console.error('Claim error:', err);
    }
  };

  const handleTradeComplete = () => {
    // Small delay to ensure state propagation, then force refetch
    setTimeout(() => {
      // Force refetch both queries
      refetch();
      refetchPosition();
    }, 500);
  };

  const timeLeft = () => {
    if (isEnded) return 'Ended';
    const diff = Number(endTime) * 1000 - Date.now();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (days > 0) return `${days}d ${hours}h ${mins}m`;
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  return (
    <div className="max-w-6xl mx-auto">
      <ContractWarning />
      
      {/* Back Link */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Markets
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Market Header */}
          <div className="glass rounded-2xl overflow-hidden">
            <div className={`h-2 bg-gradient-to-r ${gradient}`} />
            <div className="p-6">
              {/* Category & Status */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{icon}</span>
                <span className={`px-3 py-1 text-sm font-semibold rounded-full bg-gradient-to-r ${gradient} text-white`}>
                  {category}
                </span>
                {resolved ? (
                  <span className="px-3 py-1 text-sm font-semibold rounded-full bg-accent-purple/20 text-accent-purple">
                    Resolved: {outcome ? 'YES' : 'NO'}
                  </span>
                ) : isEnded ? (
                  <span className="px-3 py-1 text-sm font-semibold rounded-full bg-accent-yellow/20 text-accent-yellow">
                    Awaiting Resolution
                  </span>
                ) : (
                  <span className="px-3 py-1 text-sm font-medium rounded-full bg-accent-green/20 text-accent-green flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
                    Live
                  </span>
                )}
              </div>

              {/* Question */}
              <h1 className="font-display text-2xl md:text-3xl font-bold text-white mb-6">
                {question}
              </h1>

              {/* Odds Display */}
              <div className="mb-6">
                <div className="flex justify-between text-lg mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-accent-green font-bold text-2xl">{(Number(yesPrice) / 100).toFixed(1)}%</span>
                    <span className="text-gray-400">Yes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">No</span>
                    <span className="text-accent-red font-bold text-2xl">{(Number(noPrice) / 100).toFixed(1)}%</span>
                  </div>
                </div>
                <div className="h-4 bg-dark-700 rounded-full overflow-hidden flex">
                  <div
                    className="bg-gradient-to-r from-accent-green to-emerald-400 transition-all duration-500"
                    style={{ width: `${Number(yesPrice) / 100}%` }}
                  />
                  <div
                    className="bg-gradient-to-r from-rose-400 to-accent-red transition-all duration-500"
                    style={{ width: `${Number(noPrice) / 100}%` }}
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-dark-700 rounded-xl">
                  <div className="text-xs text-gray-500 mb-1">Volume</div>
                  <div className="font-mono font-semibold text-white">
                    {parseFloat(formatEther(totalVolume)).toFixed(4)} ETH
                  </div>
                </div>
                <div className="p-3 bg-dark-700 rounded-xl">
                  <div className="text-xs text-gray-500 mb-1">Ends</div>
                  <div className="font-mono font-semibold text-white">
                    {endDate.toLocaleDateString()}
                  </div>
                </div>
                <div className="p-3 bg-dark-700 rounded-xl">
                  <div className="text-xs text-gray-500 mb-1">Time Left</div>
                  <div className="font-mono font-semibold text-white">
                    {timeLeft()}
                  </div>
                </div>
                <div className="p-3 bg-dark-700 rounded-xl">
                  <div className="text-xs text-gray-500 mb-1">Status</div>
                  <div className="font-semibold text-white">
                    {resolved ? 'Resolved' : isEnded ? 'Ended' : 'Active'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Your Position */}
          {hasPosition && (
            <div className="glass rounded-2xl p-6">
              <h2 className="font-display text-lg font-semibold text-white mb-4">Your Position</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-xl ${yesShares > 0n ? 'bg-accent-green/10 border border-accent-green/30' : 'bg-dark-700'}`}>
                  <div className="text-sm text-gray-400 mb-1">Yes Shares</div>
                  <div className={`text-xl font-bold ${yesShares > 0n ? 'text-accent-green' : 'text-gray-500'}`}>
                    {formatShares(yesShares)}
                  </div>
                  {resolved && outcome && yesShares > 0n && (
                    <div className="text-xs text-accent-green mt-1">🏆 Winner!</div>
                  )}
                </div>
                <div className={`p-4 rounded-xl ${noShares > 0n ? 'bg-accent-red/10 border border-accent-red/30' : 'bg-dark-700'}`}>
                  <div className="text-sm text-gray-400 mb-1">No Shares</div>
                  <div className={`text-xl font-bold ${noShares > 0n ? 'text-accent-red' : 'text-gray-500'}`}>
                    {formatShares(noShares)}
                  </div>
                  {resolved && !outcome && noShares > 0n && (
                    <div className="text-xs text-accent-green mt-1">🏆 Winner!</div>
                  )}
                </div>
              </div>

              {/* Claim Button */}
              {canClaim && (
                <button
                  onClick={handleClaim}
                  disabled={isClaiming}
                  className="w-full mt-4 py-3 bg-gradient-to-r from-accent-yellow to-orange-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isClaiming ? 'Processing...' : '🎉 Claim Winnings'}
                </button>
              )}
            </div>
          )}

          {/* How It Works */}
          <div className="glass rounded-2xl p-6">
            <h2 className="font-display text-lg font-semibold text-white mb-4">How It Works</h2>
            <div className="space-y-4 text-gray-400 text-sm">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-accent-blue/20 text-accent-blue flex items-center justify-center font-bold shrink-0">1</div>
                <p><strong className="text-white">Buy Shares:</strong> Purchase YES or NO shares based on your prediction. The price reflects the current probability.</p>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-accent-blue/20 text-accent-blue flex items-center justify-center font-bold shrink-0">2</div>
                <p><strong className="text-white">Odds Shift:</strong> As more people trade, the odds automatically adjust based on market demand.</p>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-accent-blue/20 text-accent-blue flex items-center justify-center font-bold shrink-0">3</div>
                <p><strong className="text-white">Sell Anytime:</strong> You can sell your shares before the market ends. You'll profit if the odds moved in your favor.</p>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-accent-blue/20 text-accent-blue flex items-center justify-center font-bold shrink-0">4</div>
                <p><strong className="text-white">Resolution:</strong> After the event, the market is resolved. Winning shares can be claimed for their full value.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Trading Panel */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <TradingPanel
              marketId={marketId}
              yesPrice={Number(yesPrice)}
              noPrice={Number(noPrice)}
              yesShares={yesShares}
              noShares={noShares}
              resolved={resolved}
              ended={isEnded}
              onTradeComplete={handleTradeComplete}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

