import { Link } from 'react-router-dom';
import { formatEther } from 'viem';

interface MarketCardProps {
  id: number;
  question: string;
  category: string;
  yesPrice: number;
  noPrice: number;
  endTime: number;
  resolved: boolean;
  totalVolume?: bigint;
}

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

export function MarketCard({
  id,
  question,
  category,
  yesPrice,
  noPrice,
  endTime,
  resolved,
  totalVolume,
}: MarketCardProps) {
  const yesPct = yesPrice / 100;
  const noPct = noPrice / 100;
  const endDate = new Date(endTime * 1000);
  const isEnded = Date.now() > endTime * 1000;
  const gradient = categoryColors[category] || categoryColors.default;
  const icon = categoryIcons[category] || categoryIcons.default;

  const timeLeft = () => {
    if (isEnded) return 'Ended';
    const diff = endTime * 1000 - Date.now();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    if (days > 0) return `${days}d ${hours}h`;
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  return (
    <Link
      to={`/market/${id}`}
      className="block glass rounded-2xl overflow-hidden card-hover group"
    >
      {/* Category Banner */}
      <div className={`h-2 bg-gradient-to-r ${gradient}`} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{icon}</span>
            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full bg-gradient-to-r ${gradient} text-white`}>
              {category}
            </span>
          </div>
          {resolved ? (
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-accent-purple/20 text-accent-purple">
              Resolved
            </span>
          ) : isEnded ? (
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-accent-yellow/20 text-accent-yellow">
              Awaiting Resolution
            </span>
          ) : (
            <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-dark-600 text-gray-400">
              {timeLeft()}
            </span>
          )}
        </div>

        {/* Question */}
        <h3 className="text-lg font-semibold text-white mb-4 line-clamp-2 group-hover:text-accent-blue transition-colors">
          {question}
        </h3>

        {/* Odds Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-accent-green font-semibold">Yes {yesPct.toFixed(1)}%</span>
            <span className="text-accent-red font-semibold">No {noPct.toFixed(1)}%</span>
          </div>
          <div className="h-3 bg-dark-700 rounded-full overflow-hidden flex">
            <div
              className="bg-gradient-to-r from-accent-green to-emerald-400 transition-all duration-500"
              style={{ width: `${yesPct}%` }}
            />
            <div
              className="bg-gradient-to-r from-rose-400 to-accent-red transition-all duration-500"
              style={{ width: `${noPct}%` }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>
              {totalVolume ? `${parseFloat(formatEther(totalVolume)).toFixed(3)} ETH` : '0 ETH'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{endDate.toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

