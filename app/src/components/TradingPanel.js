import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useAccount, useBalance } from 'wagmi';
import { formatEther, parseEther } from 'viem';
import { useQuoteBuy, useQuoteSell, formatShares } from '../hooks/useMarkets';
import { usePrivyBuyShares, usePrivySellShares } from '../hooks/usePrivyContract';
import { validateEthAmount, calculateMinShares, calculateMinEth, formatError } from '../utils/validation';
export function TradingPanel({ marketId, yesPrice, noPrice, yesShares, noShares, resolved, ended, onTradeComplete, }) {
    const { login, authenticated } = usePrivy();
    const { wallets } = useWallets();
    const wagmiAddress = useAccount().address;
    // Get address from Privy embedded wallet (primary) or wagmi connected wallet
    const embeddedWallet = wallets.find(w => w.walletClientType === 'privy');
    // Use embedded wallet address for balance if available
    const balanceAddress = embeddedWallet?.address || wagmiAddress;
    const { data: balance } = useBalance({
        address: balanceAddress,
        query: { enabled: !!balanceAddress }
    });
    const [mode, setMode] = useState('buy');
    const [side, setSide] = useState('yes');
    const [amount, setAmount] = useState('');
    const [sellPercent, setSellPercent] = useState(100);
    const { buyShares: buySharesPrivy, isPending: isBuying, error: buyError } = usePrivyBuyShares();
    const { sellShares: sellSharesPrivy, isPending: isSelling, error: sellError } = usePrivySellShares();
    const [buySuccess, setBuySuccess] = useState(false);
    const [sellSuccess, setSellSuccess] = useState(false);
    // Calculate sell amount based on percentage
    const currentShares = side === 'yes' ? yesShares : noShares;
    const sellAmount = currentShares > 0n ? (currentShares * BigInt(sellPercent)) / 100n : 0n;
    // Get quotes
    const { data: buyQuote } = useQuoteBuy(marketId, side === 'yes', amount);
    const { data: sellQuote } = useQuoteSell(marketId, side === 'yes', sellAmount);
    // Reset success states after a delay
    useEffect(() => {
        if (buySuccess) {
            const timer = setTimeout(() => setBuySuccess(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [buySuccess]);
    useEffect(() => {
        if (sellSuccess) {
            const timer = setTimeout(() => setSellSuccess(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [sellSuccess]);
    const handleBuy = async () => {
        // Validate amount
        const validation = validateEthAmount(amount);
        if (!validation.valid) {
            return;
        }
        if (!buyQuote || buyQuote <= 0n) {
            return;
        }
        try {
            // Calculate slippage protection (1% default)
            const minShares = calculateMinShares(buyQuote, 1);
            await buySharesPrivy(marketId, side === 'yes', amount, minShares);
            setBuySuccess(true);
            setAmount('');
            onTradeComplete?.();
        }
        catch (err) {
            console.error('Buy error:', err);
            // Error is handled by hook
        }
    };
    const handleSell = async () => {
        if (sellAmount <= 0n) {
            return;
        }
        if (!sellQuote || sellQuote <= 0n) {
            return;
        }
        try {
            // Calculate slippage protection (1% default)
            const minEth = calculateMinEth(sellQuote, 1);
            await sellSharesPrivy(marketId, side === 'yes', sellAmount, minEth);
            setSellSuccess(true);
            setSellPercent(100);
            onTradeComplete?.();
        }
        catch (err) {
            console.error('Sell error:', err);
            // Error is handled by hook
        }
    };
    const isPending = isBuying || isSelling;
    const error = buyError || sellError;
    const errorMessage = error ? formatError(error) : '';
    // Validate buy amount
    const buyValidation = mode === 'buy' && amount ? validateEthAmount(amount) : { valid: true };
    const canTrade = !resolved && !ended;
    const hasShares = yesShares > 0n || noShares > 0n;
    // Quick amount buttons
    const quickAmounts = ['0.001', '0.005', '0.01', '0.05'];
    // Helper to render shares conditionally
    const renderShares = (shares) => {
        if (shares <= 0n)
            return null;
        return _jsxs("div", { className: "text-xs text-gray-500 mt-1", children: [formatShares(shares), " shares"] });
    };
    return (_jsxs("div", { className: "glass rounded-2xl overflow-hidden", children: [_jsx("div", { className: "p-4 border-b border-dark-600", children: _jsx("h3", { className: "font-display text-lg font-semibold text-white", children: "Trade" }) }), !canTrade ? (_jsxs("div", { className: "p-6 text-center", children: [_jsx("div", { className: "text-4xl mb-3", children: resolved ? '🏆' : '⏰' }), _jsx("p", { className: "text-gray-400", children: resolved ? 'This market has been resolved' : 'Trading has ended for this market' })] })) : !authenticated ? (_jsxs("div", { className: "p-6 text-center", children: [_jsx("p", { className: "text-gray-400 mb-4", children: "Connect your wallet to start trading" }), _jsx("button", { onClick: login, className: "w-full py-3 bg-gradient-to-r from-accent-blue to-accent-purple text-white font-semibold rounded-xl hover:opacity-90 transition-opacity", children: "Connect Wallet" })] })) : (_jsxs("div", { className: "p-4 space-y-4", children: [_jsxs("div", { className: "flex gap-2 p-1 bg-dark-700 rounded-xl", children: [_jsx("button", { onClick: () => setMode('buy'), className: `flex-1 py-2 rounded-lg font-medium transition-all ${mode === 'buy'
                                    ? 'bg-accent-green text-white'
                                    : 'text-gray-400 hover:text-white'}`, children: "Buy" }), _jsx("button", { onClick: () => setMode('sell'), disabled: !hasShares, className: `flex-1 py-2 rounded-lg font-medium transition-all ${mode === 'sell'
                                    ? 'bg-accent-red text-white'
                                    : 'text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed'}`, children: "Sell" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("button", { onClick: () => setSide('yes'), className: `p-4 rounded-xl border-2 transition-all ${side === 'yes'
                                    ? 'border-accent-green bg-accent-green/10'
                                    : 'border-dark-600 hover:border-dark-500'}`, children: [_jsx("div", { className: "text-sm text-gray-400 mb-1", children: "Yes" }), _jsxs("div", { className: `text-2xl font-bold ${side === 'yes' ? 'text-accent-green' : 'text-white'}`, children: [(yesPrice / 100).toFixed(1), "%"] }), renderShares(yesShares)] }), _jsxs("button", { onClick: () => setSide('no'), className: `p-4 rounded-xl border-2 transition-all ${side === 'no'
                                    ? 'border-accent-red bg-accent-red/10'
                                    : 'border-dark-600 hover:border-dark-500'}`, children: [_jsx("div", { className: "text-sm text-gray-400 mb-1", children: "No" }), _jsxs("div", { className: `text-2xl font-bold ${side === 'no' ? 'text-accent-red' : 'text-white'}`, children: [(noPrice / 100).toFixed(1), "%"] }), renderShares(noShares)] })] }), mode === 'buy' ? (_jsxs("div", { children: [_jsx("label", { className: "block text-sm text-gray-400 mb-2", children: "Amount (ETH)" }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: "number", value: amount, onChange: (e) => {
                                            const val = e.target.value;
                                            // Allow empty string for deletion
                                            if (val === '' || /^\d*\.?\d*$/.test(val)) {
                                                setAmount(val);
                                            }
                                        }, placeholder: "0.00", step: "0.001", min: "0", className: `w-full px-4 py-3 bg-dark-700 border rounded-xl text-white text-lg font-mono placeholder-gray-600 focus:outline-none transition-colors ${amount && !buyValidation.valid
                                            ? 'border-accent-red focus:border-accent-red'
                                            : 'border-dark-600 focus:border-accent-blue'}` }), _jsx("button", { onClick: () => {
                                            if (balance) {
                                                // Leave 0.001 ETH for gas
                                                const maxAmount = balance.value > parseEther('0.001')
                                                    ? formatEther(balance.value - parseEther('0.001'))
                                                    : '0';
                                                setAmount(parseFloat(maxAmount).toFixed(4));
                                            }
                                        }, className: "absolute right-3 top-1/2 -translate-y-1/2 text-xs text-accent-blue hover:text-white transition-colors", children: "MAX" })] }), amount && !buyValidation.valid && (_jsx("p", { className: "text-xs text-accent-red mt-1", children: buyValidation.error })), _jsx("div", { className: "flex gap-2 mt-2", children: quickAmounts.map((amt) => (_jsx("button", { onClick: () => setAmount(amt), className: "flex-1 py-1.5 text-xs bg-dark-700 hover:bg-dark-600 text-gray-400 hover:text-white rounded-lg transition-colors", children: amt }, amt))) }), _jsxs("div", { className: "text-xs text-gray-500 mt-2", children: ["Balance: ", balance ? parseFloat(formatEther(balance.value)).toFixed(4) : '0', " ETH"] })] })) : (_jsxs("div", { children: [_jsxs("label", { className: "block text-sm text-gray-400 mb-2", children: ["Sell ", sellPercent, "% of ", side === 'yes' ? 'YES' : 'NO', " shares"] }), _jsx("input", { type: "range", min: "1", max: "100", value: sellPercent, onChange: (e) => setSellPercent(parseInt(e.target.value)), className: "w-full h-2 bg-dark-700 rounded-full appearance-none cursor-pointer accent-accent-red" }), _jsxs("div", { className: "flex justify-between text-xs text-gray-500 mt-1", children: [_jsx("span", { children: "1%" }), _jsxs("span", { className: "text-white font-mono", children: [formatShares(sellAmount), " shares"] }), _jsx("span", { children: "100%" })] })] })), mode === 'buy' && buyQuote && buyQuote > 0n && (_jsxs("div", { className: "p-3 bg-dark-700 rounded-xl", children: [_jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { className: "text-gray-400", children: "You'll receive" }), _jsxs("span", { className: "text-white font-mono", children: [formatShares(buyQuote), " shares"] })] }), _jsxs("div", { className: "flex justify-between text-sm mt-1", children: [_jsx("span", { className: "text-gray-400", children: "Avg price" }), _jsxs("span", { className: "text-white font-mono", children: [amount && buyQuote > 0n
                                                ? ((parseFloat(amount) / parseFloat(formatEther(buyQuote))) * 100).toFixed(2)
                                                : '0', "%"] })] })] })), mode === 'sell' && sellQuote && sellQuote > 0n && (_jsx("div", { className: "p-3 bg-dark-700 rounded-xl", children: _jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { className: "text-gray-400", children: "You'll receive" }), _jsxs("span", { className: "text-white font-mono", children: [parseFloat(formatEther(sellQuote)).toFixed(6), " ETH"] })] }) })), errorMessage && (_jsx("div", { className: "p-3 bg-accent-red/10 border border-accent-red/20 rounded-xl", children: _jsx("p", { className: "text-accent-red text-sm", children: errorMessage }) })), _jsx("button", { onClick: mode === 'buy' ? handleBuy : handleSell, disabled: Boolean(isPending ||
                            (mode === 'buy' && (!amount || parseFloat(amount) <= 0 || !buyValidation.valid)) ||
                            (mode === 'sell' && sellAmount <= 0n) ||
                            (mode === 'buy' && balance && amount && parseFloat(amount) > parseFloat(formatEther(balance.value)))), className: `w-full py-4 font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed ${mode === 'buy'
                            ? 'bg-gradient-to-r from-accent-green to-emerald-400 text-white hover:opacity-90'
                            : 'bg-gradient-to-r from-accent-red to-rose-400 text-white hover:opacity-90'}`, children: isPending
                            ? 'Processing...'
                            : mode === 'buy' && balance && amount && parseFloat(amount) > parseFloat(formatEther(balance.value))
                                ? 'Insufficient balance'
                                : mode === 'buy'
                                    ? `Buy ${side === 'yes' ? 'Yes' : 'No'} Shares`
                                    : `Sell ${side === 'yes' ? 'Yes' : 'No'} Shares` }), _jsx("p", { className: "text-xs text-center text-gray-500", children: "1% fee on all trades" })] }))] }));
}
