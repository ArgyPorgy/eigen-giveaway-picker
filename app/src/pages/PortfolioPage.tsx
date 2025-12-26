import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useAccount } from 'wagmi';
import { useUserPositions, useMarkets, formatShares } from '../hooks/useMarkets';

export function PortfolioPage() {
  const { login, authenticated, user } = usePrivy();
  const { wallets } = useWallets();
  const wagmiAddress = useAccount().address;
  
  // Get address from Privy embedded wallet (primary) or wagmi connected wallet
  const embeddedWallet = wallets.find(w => w.walletClientType === 'privy');
  const address = embeddedWallet?.address || wagmiAddress || user?.wallet?.address;

  const { data: positionsData, isLoading: positionsLoading } = useUserPositions(address);
  const { data: marketsData, isLoading: marketsLoading } = useMarkets(0, 100);

  const positions = useMemo(() => {
    if (!positionsData || !marketsData) return [];

    const [marketIds, yesSharesArr, noSharesArr] = positionsData;
    const [ids, questions, categories, yesPrices, noPrices, endTimes, resolvedFlags] = marketsData;

    return marketIds.map((marketId, i) => {
      const idx = ids.findIndex((id) => id === marketId);
      if (idx === -1) return null;

      return {
        marketId: Number(marketId),
        question: questions[idx],
        category: categories[idx],
        yesPrice: Number(yesPrices[idx]),
        noPrice: Number(noPrices[idx]),
        endTime: Number(endTimes[idx]),
        resolved: resolvedFlags[idx],
        yesShares: yesSharesArr[i],
        noShares: noSharesArr[i],
      };
    }).filter(Boolean);
  }, [positionsData, marketsData]);

  const activePositions = positions.filter(p => p && !p.resolved && p.endTime * 1000 > Date.now());
  const endedPositions = positions.filter(p => p && (p.resolved || p.endTime * 1000 <= Date.now()));

  const isLoading = positionsLoading || marketsLoading;

  if (!authenticated) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="glass rounded-2xl p-12 text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="font-display text-2xl font-bold text-white mb-4">Connect to View Portfolio</h2>
          <p className="text-gray-400 mb-6">
            Connect your wallet to view your positions and trading history.
          </p>
          <button
            onClick={login}
            className="px-8 py-3 bg-gradient-to-r from-accent-blue to-accent-purple text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-white mb-2">Your Portfolio</h1>
        <p className="text-gray-400">Track your positions across all prediction markets.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="glass rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-white">{positions.length}</div>
          <div className="text-sm text-gray-400">Total Positions</div>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-accent-green">{activePositions.length}</div>
          <div className="text-sm text-gray-400">Active</div>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-accent-yellow">{endedPositions.length}</div>
          <div className="text-sm text-gray-400">Ended</div>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-accent-blue">
            {positions.reduce((acc, p) => {
              if (!p) return acc;
              return acc + (p.yesShares > 0n ? 1 : 0) + (p.noShares > 0n ? 1 : 0);
            }, 0)}
          </div>
          <div className="text-sm text-gray-400">Share Types</div>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="glass rounded-xl p-6">
              <div className="h-6 w-3/4 shimmer rounded mb-4" />
              <div className="h-4 w-1/2 shimmer rounded" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && positions.length === 0 && (
        <div className="glass rounded-2xl p-12 text-center">
          <div className="text-5xl mb-4">📊</div>
          <h2 className="text-xl font-semibold text-white mb-2">No positions yet</h2>
          <p className="text-gray-400 mb-6">
            Start trading to build your portfolio.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent-blue text-white rounded-xl hover:opacity-90 transition-opacity"
          >
            Browse Markets
          </Link>
        </div>
      )}

      {/* Active Positions */}
      {!isLoading && activePositions.length > 0 && (
        <div className="mb-8">
          <h2 className="font-display text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
            Active Positions
          </h2>
          <div className="space-y-4">
            {activePositions.map((position) => position && (
              <PositionCard key={position.marketId} {...position} />
            ))}
          </div>
        </div>
      )}

      {/* Ended Positions */}
      {!isLoading && endedPositions.length > 0 && (
        <div>
          <h2 className="font-display text-xl font-bold text-gray-400 mb-4">
            Ended Positions
          </h2>
          <div className="space-y-4 opacity-75">
            {endedPositions.map((position) => position && (
              <PositionCard key={position.marketId} {...position} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface PositionCardProps {
  marketId: number;
  question: string;
  category: string;
  yesPrice: number;
  noPrice: number;
  endTime: number;
  resolved: boolean;
  yesShares: bigint;
  noShares: bigint;
}

function PositionCard({
  marketId,
  question,
  category,
  yesPrice,
  noPrice,
  endTime,
  resolved,
  yesShares,
  noShares,
}: PositionCardProps) {
  const endDate = new Date(endTime * 1000);
  const isEnded = Date.now() > endTime * 1000;

  const categoryColors: Record<string, string> = {
    'NFL': 'bg-orange-500',
    'NBA': 'bg-blue-500',
    'Soccer': 'bg-green-500',
    'MLB': 'bg-red-500',
    'NHL': 'bg-cyan-500',
    'Tennis': 'bg-yellow-500',
    'UFC': 'bg-red-600',
    'Golf': 'bg-green-600',
    'default': 'bg-gray-500',
  };

  const bgColor = categoryColors[category] || categoryColors.default;

  return (
    <Link
      to={`/market/${marketId}`}
      className="block glass rounded-xl p-5 card-hover"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-2">
            <span className={`w-2 h-2 rounded-full ${bgColor}`} />
            <span className="text-sm text-gray-400">{category}</span>
            {resolved ? (
              <span className="px-2 py-0.5 text-xs rounded-full bg-accent-purple/20 text-accent-purple">
                Resolved
              </span>
            ) : isEnded ? (
              <span className="px-2 py-0.5 text-xs rounded-full bg-accent-yellow/20 text-accent-yellow">
                Awaiting
              </span>
            ) : null}
          </div>

          {/* Question */}
          <h3 className="font-semibold text-white mb-3 line-clamp-2">{question}</h3>

          {/* Shares */}
          <div className="flex gap-4">
            {yesShares > 0n && (
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 text-xs font-semibold rounded bg-accent-green/20 text-accent-green">
                  YES
                </span>
                <span className="font-mono text-sm text-white">{formatShares(yesShares)}</span>
                <span className="text-xs text-gray-500">@ {(yesPrice / 100).toFixed(1)}%</span>
              </div>
            )}
            {noShares > 0n && (
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 text-xs font-semibold rounded bg-accent-red/20 text-accent-red">
                  NO
                </span>
                <span className="font-mono text-sm text-white">{formatShares(noShares)}</span>
                <span className="text-xs text-gray-500">@ {(noPrice / 100).toFixed(1)}%</span>
              </div>
            )}
          </div>
        </div>

        {/* Current Odds */}
        <div className="text-right shrink-0">
          <div className="text-sm text-gray-400 mb-1">Current</div>
          <div className="flex gap-3">
            <div>
              <span className="text-accent-green font-bold">{(yesPrice / 100).toFixed(0)}%</span>
              <span className="text-gray-500 text-xs ml-1">Y</span>
            </div>
            <div>
              <span className="text-accent-red font-bold">{(noPrice / 100).toFixed(0)}%</span>
              <span className="text-gray-500 text-xs ml-1">N</span>
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            {endDate.toLocaleDateString()}
          </div>
        </div>
      </div>
    </Link>
  );
}

