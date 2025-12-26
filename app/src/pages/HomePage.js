import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
        if (!marketsData)
            return [];
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
    return (_jsxs("div", { children: [_jsx(ContractWarning, {}), _jsxs("div", { className: "text-center mb-12", children: [_jsx("h1", { className: "font-display text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent", children: "Sports Prediction Markets" }), _jsx("p", { className: "text-gray-400 text-lg max-w-2xl mx-auto", children: "Trade on sports outcomes with decentralized prediction markets. Buy and sell shares as odds shift in real-time." })] }), _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-8", children: [_jsxs("div", { className: "glass rounded-xl p-4 text-center", children: [_jsx("div", { className: "text-2xl font-bold text-white", children: marketCount?.toString() || '0' }), _jsx("div", { className: "text-sm text-gray-400", children: "Total Markets" })] }), _jsxs("div", { className: "glass rounded-xl p-4 text-center", children: [_jsx("div", { className: "text-2xl font-bold text-accent-green", children: activeMarkets.length }), _jsx("div", { className: "text-sm text-gray-400", children: "Active Markets" })] }), _jsxs("div", { className: "glass rounded-xl p-4 text-center", children: [_jsx("div", { className: "text-2xl font-bold text-accent-blue", children: categories.length - 1 }), _jsx("div", { className: "text-sm text-gray-400", children: "Sports Categories" })] }), _jsxs("div", { className: "glass rounded-xl p-4 text-center", children: [_jsx("div", { className: "text-2xl font-bold text-accent-purple", children: "1%" }), _jsx("div", { className: "text-sm text-gray-400", children: "Trading Fee" })] })] }), _jsxs("div", { className: "flex flex-col md:flex-row gap-4 mb-8", children: [_jsxs("div", { className: "relative flex-1", children: [_jsx("svg", { className: "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" }) }), _jsx("input", { type: "text", placeholder: "Search markets...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "w-full pl-10 pr-4 py-3 bg-dark-700 border border-dark-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-accent-blue transition-colors" })] }), _jsx("div", { className: "flex gap-2 overflow-x-auto pb-2 md:pb-0", children: categories.map((cat) => (_jsx("button", { onClick: () => setSelectedCategory(cat), className: `px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${selectedCategory === cat
                                ? 'bg-accent-blue text-white'
                                : 'bg-dark-700 text-gray-400 hover:bg-dark-600 hover:text-white'}`, children: cat }, cat))) })] }), isLoading && (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: [...Array(6)].map((_, i) => (_jsxs("div", { className: "glass rounded-2xl overflow-hidden", children: [_jsx("div", { className: "h-2 shimmer" }), _jsxs("div", { className: "p-5 space-y-4", children: [_jsx("div", { className: "h-6 w-24 shimmer rounded" }), _jsx("div", { className: "h-12 shimmer rounded" }), _jsx("div", { className: "h-3 shimmer rounded-full" }), _jsx("div", { className: "h-4 shimmer rounded w-1/2" })] })] }, i))) })), error && (_jsxs("div", { className: "glass rounded-xl p-8 text-center", children: [_jsx("div", { className: "text-accent-red text-lg mb-2", children: "Failed to load markets" }), _jsx("p", { className: "text-gray-400 text-sm", children: error.message })] })), !isLoading && !error && marketCount === 0n && (_jsxs("div", { className: "glass rounded-xl p-12 text-center", children: [_jsx("div", { className: "text-5xl mb-4", children: "\uD83C\uDFDF\uFE0F" }), _jsx("h3", { className: "text-xl font-semibold text-white mb-2", children: "No markets yet" }), _jsx("p", { className: "text-gray-400 mb-4", children: "Markets haven't been created yet. Run the seed script to create sample markets." }), _jsx("code", { className: "block text-sm text-gray-500 bg-dark-800 p-3 rounded-lg", children: "npm run seed" })] })), !isLoading && !error && marketCount !== undefined && marketCount > 0n && filteredMarkets.length === 0 && (_jsxs("div", { className: "glass rounded-xl p-12 text-center", children: [_jsx("div", { className: "text-5xl mb-4", children: "\uD83D\uDD0D" }), _jsx("h3", { className: "text-xl font-semibold text-white mb-2", children: "No markets match your filters" }), _jsx("p", { className: "text-gray-400", children: "Try adjusting your search query or category filter" })] })), !isLoading && activeMarkets.length > 0 && (_jsxs("div", { className: "mb-12", children: [_jsxs("h2", { className: "font-display text-2xl font-bold text-white mb-6 flex items-center gap-3", children: [_jsx("span", { className: "w-3 h-3 rounded-full bg-accent-green animate-pulse" }), "Active Markets"] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: activeMarkets.map((market) => (_jsx(MarketCard, { ...market }, market.id))) })] })), !isLoading && endedMarkets.length > 0 && (_jsxs("div", { children: [_jsx("h2", { className: "font-display text-2xl font-bold text-gray-400 mb-6", children: "Ended Markets" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-75", children: endedMarkets.map((market) => (_jsx(MarketCard, { ...market }, market.id))) })] }))] }));
}
