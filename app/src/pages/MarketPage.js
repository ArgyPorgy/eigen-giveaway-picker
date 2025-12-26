import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useParams, Link } from 'react-router-dom';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useAccount } from 'wagmi';
import { formatEther } from 'viem';
import { useMarket, usePosition, formatShares } from '../hooks/useMarkets';
import { usePrivyClaimWinnings } from '../hooks/usePrivyContract';
import { TradingPanel } from '../components/TradingPanel';
import { ContractWarning } from '../components/ContractWarning';
const categoryColors = {
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
const categoryIcons = {
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
    const { id } = useParams();
    const marketId = parseInt(id || '0');
    const { user } = usePrivy();
    const { wallets } = useWallets();
    const wagmiAddress = useAccount().address;
    // Get address from Privy embedded wallet (primary) or wagmi connected wallet
    const embeddedWallet = wallets.find(w => w.walletClientType === 'privy');
    const address = embeddedWallet?.address || wagmiAddress || user?.wallet?.address;
    const { data: marketData, isLoading, error, refetch } = useMarket(marketId);
    const { data: positionData, refetch: refetchPosition } = usePosition(marketId, address);
    const { claimWinnings: claimWinningsPrivy, isPending: isClaiming } = usePrivyClaimWinnings();
    if (isLoading) {
        return (_jsx("div", { className: "max-w-4xl mx-auto", children: _jsxs("div", { className: "glass rounded-2xl overflow-hidden", children: [_jsx("div", { className: "h-2 shimmer" }), _jsxs("div", { className: "p-8 space-y-6", children: [_jsx("div", { className: "h-8 w-48 shimmer rounded" }), _jsx("div", { className: "h-24 shimmer rounded" }), _jsx("div", { className: "h-40 shimmer rounded" })] })] }) }));
    }
    if (error || !marketData) {
        return (_jsx("div", { className: "max-w-4xl mx-auto", children: _jsxs("div", { className: "glass rounded-2xl p-12 text-center", children: [_jsx("div", { className: "text-5xl mb-4", children: "\u274C" }), _jsx("h2", { className: "text-xl font-semibold text-white mb-2", children: "Market not found" }), _jsx("p", { className: "text-gray-400 mb-6", children: "This market doesn't exist or couldn't be loaded." }), _jsxs(Link, { to: "/", className: "inline-flex items-center gap-2 px-6 py-3 bg-accent-blue text-white rounded-xl hover:opacity-90 transition-opacity", children: [_jsx("svg", { className: "w-5 h-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M10 19l-7-7m0 0l7-7m-7 7h18" }) }), "Back to Markets"] })] }) }));
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
    const canClaim = resolved && hasPosition && ((outcome && yesShares > 0n) || (!outcome && noShares > 0n));
    const handleClaim = async () => {
        try {
            await claimWinningsPrivy(marketId);
            refetch();
            refetchPosition();
        }
        catch (err) {
            console.error('Claim error:', err);
        }
    };
    const handleTradeComplete = () => {
        refetch();
        refetchPosition();
    };
    const timeLeft = () => {
        if (isEnded)
            return 'Ended';
        const diff = Number(endTime) * 1000 - Date.now();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        if (days > 0)
            return `${days}d ${hours}h ${mins}m`;
        if (hours > 0)
            return `${hours}h ${mins}m`;
        return `${mins}m`;
    };
    return (_jsxs("div", { className: "max-w-6xl mx-auto", children: [_jsx(ContractWarning, {}), _jsxs(Link, { to: "/", className: "inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors", children: [_jsx("svg", { className: "w-5 h-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M10 19l-7-7m0 0l7-7m-7 7h18" }) }), "Back to Markets"] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsxs("div", { className: "lg:col-span-2 space-y-6", children: [_jsxs("div", { className: "glass rounded-2xl overflow-hidden", children: [_jsx("div", { className: `h-2 bg-gradient-to-r ${gradient}` }), _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex items-center gap-3 mb-4", children: [_jsx("span", { className: "text-3xl", children: icon }), _jsx("span", { className: `px-3 py-1 text-sm font-semibold rounded-full bg-gradient-to-r ${gradient} text-white`, children: category }), resolved ? (_jsxs("span", { className: "px-3 py-1 text-sm font-semibold rounded-full bg-accent-purple/20 text-accent-purple", children: ["Resolved: ", outcome ? 'YES' : 'NO'] })) : isEnded ? (_jsx("span", { className: "px-3 py-1 text-sm font-semibold rounded-full bg-accent-yellow/20 text-accent-yellow", children: "Awaiting Resolution" })) : (_jsxs("span", { className: "px-3 py-1 text-sm font-medium rounded-full bg-accent-green/20 text-accent-green flex items-center gap-1", children: [_jsx("span", { className: "w-2 h-2 rounded-full bg-accent-green animate-pulse" }), "Live"] }))] }), _jsx("h1", { className: "font-display text-2xl md:text-3xl font-bold text-white mb-6", children: question }), _jsxs("div", { className: "mb-6", children: [_jsxs("div", { className: "flex justify-between text-lg mb-3", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("span", { className: "text-accent-green font-bold text-2xl", children: [(Number(yesPrice) / 100).toFixed(1), "%"] }), _jsx("span", { className: "text-gray-400", children: "Yes" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-gray-400", children: "No" }), _jsxs("span", { className: "text-accent-red font-bold text-2xl", children: [(Number(noPrice) / 100).toFixed(1), "%"] })] })] }), _jsxs("div", { className: "h-4 bg-dark-700 rounded-full overflow-hidden flex", children: [_jsx("div", { className: "bg-gradient-to-r from-accent-green to-emerald-400 transition-all duration-500", style: { width: `${Number(yesPrice) / 100}%` } }), _jsx("div", { className: "bg-gradient-to-r from-rose-400 to-accent-red transition-all duration-500", style: { width: `${Number(noPrice) / 100}%` } })] })] }), _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [_jsxs("div", { className: "p-3 bg-dark-700 rounded-xl", children: [_jsx("div", { className: "text-xs text-gray-500 mb-1", children: "Volume" }), _jsxs("div", { className: "font-mono font-semibold text-white", children: [parseFloat(formatEther(totalVolume)).toFixed(4), " ETH"] })] }), _jsxs("div", { className: "p-3 bg-dark-700 rounded-xl", children: [_jsx("div", { className: "text-xs text-gray-500 mb-1", children: "Ends" }), _jsx("div", { className: "font-mono font-semibold text-white", children: endDate.toLocaleDateString() })] }), _jsxs("div", { className: "p-3 bg-dark-700 rounded-xl", children: [_jsx("div", { className: "text-xs text-gray-500 mb-1", children: "Time Left" }), _jsx("div", { className: "font-mono font-semibold text-white", children: timeLeft() })] }), _jsxs("div", { className: "p-3 bg-dark-700 rounded-xl", children: [_jsx("div", { className: "text-xs text-gray-500 mb-1", children: "Status" }), _jsx("div", { className: "font-semibold text-white", children: resolved ? 'Resolved' : isEnded ? 'Ended' : 'Active' })] })] })] })] }), hasPosition && (_jsxs("div", { className: "glass rounded-2xl p-6", children: [_jsx("h2", { className: "font-display text-lg font-semibold text-white mb-4", children: "Your Position" }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: `p-4 rounded-xl ${yesShares > 0n ? 'bg-accent-green/10 border border-accent-green/30' : 'bg-dark-700'}`, children: [_jsx("div", { className: "text-sm text-gray-400 mb-1", children: "Yes Shares" }), _jsx("div", { className: `text-xl font-bold ${yesShares > 0n ? 'text-accent-green' : 'text-gray-500'}`, children: formatShares(yesShares) }), resolved && outcome && yesShares > 0n && (_jsx("div", { className: "text-xs text-accent-green mt-1", children: "\uD83C\uDFC6 Winner!" }))] }), _jsxs("div", { className: `p-4 rounded-xl ${noShares > 0n ? 'bg-accent-red/10 border border-accent-red/30' : 'bg-dark-700'}`, children: [_jsx("div", { className: "text-sm text-gray-400 mb-1", children: "No Shares" }), _jsx("div", { className: `text-xl font-bold ${noShares > 0n ? 'text-accent-red' : 'text-gray-500'}`, children: formatShares(noShares) }), resolved && !outcome && noShares > 0n && (_jsx("div", { className: "text-xs text-accent-green mt-1", children: "\uD83C\uDFC6 Winner!" }))] })] }), canClaim && (_jsx("button", { onClick: handleClaim, disabled: isClaiming, className: "w-full mt-4 py-3 bg-gradient-to-r from-accent-yellow to-orange-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50", children: isClaiming ? 'Processing...' : '🎉 Claim Winnings' }))] })), _jsxs("div", { className: "glass rounded-2xl p-6", children: [_jsx("h2", { className: "font-display text-lg font-semibold text-white mb-4", children: "How It Works" }), _jsxs("div", { className: "space-y-4 text-gray-400 text-sm", children: [_jsxs("div", { className: "flex gap-3", children: [_jsx("div", { className: "w-8 h-8 rounded-full bg-accent-blue/20 text-accent-blue flex items-center justify-center font-bold shrink-0", children: "1" }), _jsxs("p", { children: [_jsx("strong", { className: "text-white", children: "Buy Shares:" }), " Purchase YES or NO shares based on your prediction. The price reflects the current probability."] })] }), _jsxs("div", { className: "flex gap-3", children: [_jsx("div", { className: "w-8 h-8 rounded-full bg-accent-blue/20 text-accent-blue flex items-center justify-center font-bold shrink-0", children: "2" }), _jsxs("p", { children: [_jsx("strong", { className: "text-white", children: "Odds Shift:" }), " As more people trade, the odds automatically adjust based on market demand."] })] }), _jsxs("div", { className: "flex gap-3", children: [_jsx("div", { className: "w-8 h-8 rounded-full bg-accent-blue/20 text-accent-blue flex items-center justify-center font-bold shrink-0", children: "3" }), _jsxs("p", { children: [_jsx("strong", { className: "text-white", children: "Sell Anytime:" }), " You can sell your shares before the market ends. You'll profit if the odds moved in your favor."] })] }), _jsxs("div", { className: "flex gap-3", children: [_jsx("div", { className: "w-8 h-8 rounded-full bg-accent-blue/20 text-accent-blue flex items-center justify-center font-bold shrink-0", children: "4" }), _jsxs("p", { children: [_jsx("strong", { className: "text-white", children: "Resolution:" }), " After the event, the market is resolved. Winning shares can be claimed for their full value."] })] })] })] })] }), _jsx("div", { className: "lg:col-span-1", children: _jsx("div", { className: "sticky top-24", children: _jsx(TradingPanel, { marketId: marketId, yesPrice: Number(yesPrice), noPrice: Number(noPrice), yesShares: yesShares, noShares: noShares, resolved: resolved, ended: isEnded, onTradeComplete: handleTradeComplete }) }) })] })] }));
}
