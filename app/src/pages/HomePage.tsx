import { useState, useMemo } from 'react';
import { useMarkets, useMarketCount } from '../hooks/useMarkets';
import { MarketCard } from '../components/MarketCard';
import { ContractWarning } from '../components/ContractWarning';

const categories = ['All', 'NFL', 'NBA', 'Soccer', 'MLB', 'NHL', 'Tennis', 'UFC', 'Golf'];

export function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: marketCount } = useMarketCount();
  const { data: marketsData, isLoading, error } = useMarkets(0, 100);

  const markets = useMemo(() => {
    if (!marketsData) return [];
    
    const [ids, questions, categoriesArr, yesPrices, noPrices, endTimes, resolvedFlags] = marketsData;
    
    return ids.map((id, i) => ({
      id: Number(id),
      question: questions[i],
      category: categoriesArr[i],
      yesPrice: Number(yesPrices[i]),
      noPrice: Number(noPrices[i]),
      endTime: Number(endTimes[i]),
      resolved: resolvedFlags[i],
    }));
  }, [marketsData]);

  const filteredMarkets = useMemo(() => {
    return markets.filter((market) => {
      const matchesCategory = selectedCategory === 'All' || market.category === selectedCategory;
      const matchesSearch = market.question.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [markets, selectedCategory, searchQuery]);

  const activeMarkets = filteredMarkets.filter(m => !m.resolved && m.endTime * 1000 > Date.now());
  const endedMarkets = filteredMarkets.filter(m => m.resolved || m.endTime * 1000 <= Date.now());

  return (
    <div>
      <ContractWarning />
      
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
          Sports Prediction Markets
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Trade on sports outcomes with decentralized prediction markets. Buy and sell shares as odds shift in real-time.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="glass rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-white">{marketCount?.toString() || '0'}</div>
          <div className="text-sm text-gray-400">Total Markets</div>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-accent-green">{activeMarkets.length}</div>
          <div className="text-sm text-gray-400">Active Markets</div>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-accent-blue">{categories.length - 1}</div>
          <div className="text-sm text-gray-400">Sports Categories</div>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-accent-purple">1%</div>
          <div className="text-sm text-gray-400">Trading Fee</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        {/* Search */}
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search markets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-dark-700 border border-dark-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-accent-blue transition-colors"
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-accent-blue text-white'
                  : 'bg-dark-700 text-gray-400 hover:bg-dark-600 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass rounded-2xl overflow-hidden">
              <div className="h-2 shimmer" />
              <div className="p-5 space-y-4">
                <div className="h-6 w-24 shimmer rounded" />
                <div className="h-12 shimmer rounded" />
                <div className="h-3 shimmer rounded-full" />
                <div className="h-4 shimmer rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="glass rounded-xl p-8 text-center">
          <div className="text-accent-red text-lg mb-2">Failed to load markets</div>
          <p className="text-gray-400 text-sm">{error.message}</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && marketCount === 0n && (
        <div className="glass rounded-xl p-12 text-center">
          <div className="text-5xl mb-4">🏟️</div>
          <h3 className="text-xl font-semibold text-white mb-2">No markets yet</h3>
          <p className="text-gray-400 mb-4">
            Markets haven't been created yet. Run the seed script to create sample markets.
          </p>
          <code className="block text-sm text-gray-500 bg-dark-800 p-3 rounded-lg">
            npm run seed
          </code>
        </div>
      )}
      
      {!isLoading && !error && marketCount !== undefined && marketCount > 0n && filteredMarkets.length === 0 && (
        <div className="glass rounded-xl p-12 text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-white mb-2">No markets match your filters</h3>
          <p className="text-gray-400">
            Try adjusting your search query or category filter
          </p>
        </div>
      )}

      {/* Active Markets */}
      {!isLoading && activeMarkets.length > 0 && (
        <div className="mb-12">
          <h2 className="font-display text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-accent-green animate-pulse" />
            Active Markets
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeMarkets.map((market) => (
              <MarketCard key={market.id} {...market} />
            ))}
          </div>
        </div>
      )}

      {/* Ended Markets */}
      {!isLoading && endedMarkets.length > 0 && (
        <div>
          <h2 className="font-display text-2xl font-bold text-gray-400 mb-6">
            Ended Markets
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-75">
            {endedMarkets.map((market) => (
              <MarketCard key={market.id} {...market} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

