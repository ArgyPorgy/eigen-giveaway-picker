import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
        if (!positionsData || !marketsData)
            return [];
        const [marketIds, yesSharesArr, noSharesArr] = positionsData;
        const [ids, questions, categories, yesPrices, noPrices, endTimes, resolvedFlags] = marketsData;
        return marketIds.map((marketId, i) => {
            const idx = ids.findIndex((id) => id === marketId);
            if (idx === -1)
                return null;
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
        return (_jsx("div", { className: "max-w-2xl mx-auto", children: _jsxs("div", { className: "glass rounded-2xl p-12 text-center", children: [_jsx("div", { className: "text-5xl mb-4", children: "\uD83D\uDD12" }), _jsx("h2", { className: "font-display text-2xl font-bold text-white mb-4", children: "Connect to View Portfolio" }), _jsx("p", { className: "text-gray-400 mb-6", children: "Connect your wallet to view your positions and trading history." }), _jsx("button", { onClick: login, className: "px-8 py-3 bg-gradient-to-r from-accent-blue to-accent-purple text-white font-semibold rounded-xl hover:opacity-90 transition-opacity", children: "Connect Wallet" })] }) }));
    }
    return (_jsxs("div", { className: "max-w-4xl mx-auto", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "font-display text-3xl font-bold text-white mb-2", children: "Your Portfolio" }), _jsx("p", { className: "text-gray-400", children: "Track your positions across all prediction markets." })] }), _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-8", children: [_jsxs("div", { className: "glass rounded-xl p-4 text-center", children: [_jsx("div", { className: "text-2xl font-bold text-white", children: positions.length }), _jsx("div", { className: "text-sm text-gray-400", children: "Total Positions" })] }), _jsxs("div", { className: "glass rounded-xl p-4 text-center", children: [_jsx("div", { className: "text-2xl font-bold text-accent-green", children: activePositions.length }), _jsx("div", { className: "text-sm text-gray-400", children: "Active" })] }), _jsxs("div", { className: "glass rounded-xl p-4 text-center", children: [_jsx("div", { className: "text-2xl font-bold text-accent-yellow", children: endedPositions.length }), _jsx("div", { className: "text-sm text-gray-400", children: "Ended" })] }), _jsxs("div", { className: "glass rounded-xl p-4 text-center", children: [_jsx("div", { className: "text-2xl font-bold text-accent-blue", children: positions.reduce((acc, p) => {
                                    if (!p)
                                        return acc;
                                    return acc + (p.yesShares > 0n ? 1 : 0) + (p.noShares > 0n ? 1 : 0);
                                }, 0) }), _jsx("div", { className: "text-sm text-gray-400", children: "Share Types" })] })] }), isLoading && (_jsx("div", { className: "space-y-4", children: [...Array(3)].map((_, i) => (_jsxs("div", { className: "glass rounded-xl p-6", children: [_jsx("div", { className: "h-6 w-3/4 shimmer rounded mb-4" }), _jsx("div", { className: "h-4 w-1/2 shimmer rounded" })] }, i))) })), !isLoading && positions.length === 0 && (_jsxs("div", { className: "glass rounded-2xl p-12 text-center", children: [_jsx("div", { className: "text-5xl mb-4", children: "\uD83D\uDCCA" }), _jsx("h2", { className: "text-xl font-semibold text-white mb-2", children: "No positions yet" }), _jsx("p", { className: "text-gray-400 mb-6", children: "Start trading to build your portfolio." }), _jsx(Link, { to: "/", className: "inline-flex items-center gap-2 px-6 py-3 bg-accent-blue text-white rounded-xl hover:opacity-90 transition-opacity", children: "Browse Markets" })] })), !isLoading && activePositions.length > 0 && (_jsxs("div", { className: "mb-8", children: [_jsxs("h2", { className: "font-display text-xl font-bold text-white mb-4 flex items-center gap-2", children: [_jsx("span", { className: "w-2 h-2 rounded-full bg-accent-green animate-pulse" }), "Active Positions"] }), _jsx("div", { className: "space-y-4", children: activePositions.map((position) => position && (_jsx(PositionCard, { ...position }, position.marketId))) })] })), !isLoading && endedPositions.length > 0 && (_jsxs("div", { children: [_jsx("h2", { className: "font-display text-xl font-bold text-gray-400 mb-4", children: "Ended Positions" }), _jsx("div", { className: "space-y-4 opacity-75", children: endedPositions.map((position) => position && (_jsx(PositionCard, { ...position }, position.marketId))) })] }))] }));
}
function PositionCard({ marketId, question, category, yesPrice, noPrice, endTime, resolved, yesShares, noShares, }) {
    const endDate = new Date(endTime * 1000);
    const isEnded = Date.now() > endTime * 1000;
    const categoryColors = {
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
    return (_jsx(Link, { to: `/market/${marketId}`, className: "block glass rounded-xl p-5 card-hover", children: _jsxs("div", { className: "flex items-start justify-between gap-4", children: [_jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx("span", { className: `w-2 h-2 rounded-full ${bgColor}` }), _jsx("span", { className: "text-sm text-gray-400", children: category }), resolved ? (_jsx("span", { className: "px-2 py-0.5 text-xs rounded-full bg-accent-purple/20 text-accent-purple", children: "Resolved" })) : isEnded ? (_jsx("span", { className: "px-2 py-0.5 text-xs rounded-full bg-accent-yellow/20 text-accent-yellow", children: "Awaiting" })) : null] }), _jsx("h3", { className: "font-semibold text-white mb-3 line-clamp-2", children: question }), _jsxs("div", { className: "flex gap-4", children: [yesShares > 0n && (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "px-2 py-1 text-xs font-semibold rounded bg-accent-green/20 text-accent-green", children: "YES" }), _jsx("span", { className: "font-mono text-sm text-white", children: formatShares(yesShares) }), _jsxs("span", { className: "text-xs text-gray-500", children: ["@ ", (yesPrice / 100).toFixed(1), "%"] })] })), noShares > 0n && (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "px-2 py-1 text-xs font-semibold rounded bg-accent-red/20 text-accent-red", children: "NO" }), _jsx("span", { className: "font-mono text-sm text-white", children: formatShares(noShares) }), _jsxs("span", { className: "text-xs text-gray-500", children: ["@ ", (noPrice / 100).toFixed(1), "%"] })] }))] })] }), _jsxs("div", { className: "text-right shrink-0", children: [_jsx("div", { className: "text-sm text-gray-400 mb-1", children: "Current" }), _jsxs("div", { className: "flex gap-3", children: [_jsxs("div", { children: [_jsxs("span", { className: "text-accent-green font-bold", children: [(yesPrice / 100).toFixed(0), "%"] }), _jsx("span", { className: "text-gray-500 text-xs ml-1", children: "Y" })] }), _jsxs("div", { children: [_jsxs("span", { className: "text-accent-red font-bold", children: [(noPrice / 100).toFixed(0), "%"] }), _jsx("span", { className: "text-gray-500 text-xs ml-1", children: "N" })] })] }), _jsx("div", { className: "text-xs text-gray-500 mt-2", children: endDate.toLocaleDateString() })] })] }) }));
}
