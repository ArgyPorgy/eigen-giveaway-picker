import { useState } from 'react';
import { useWallets } from '@privy-io/react-auth';
import { PREDICTION_MARKET_ADDRESS, PREDICTION_MARKET_ABI } from '../contract';
import { parseEther } from 'viem';
import { createWalletClient, custom, encodeFunctionData } from 'viem';
import { sepolia } from 'viem/chains';
export function usePrivyBuyShares() {
    const { wallets } = useWallets();
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState(null);
    const [hash, setHash] = useState(null);
    const buyShares = async (marketId, isYes, ethAmount, minShares = 0n) => {
        const embeddedWallet = wallets.find(w => w.walletClientType === 'privy');
        if (!embeddedWallet) {
            throw new Error('No embedded wallet found. Please connect your wallet.');
        }
        setIsPending(true);
        setError(null);
        try {
            // Get the provider from Privy wallet
            const provider = await embeddedWallet.getEthereumProvider();
            // Get the account address
            const account = embeddedWallet.address;
            // Create wallet client from provider
            const walletClient = createWalletClient({
                account,
                chain: sepolia,
                transport: custom(provider),
            });
            // Encode function data
            const value = parseEther(ethAmount);
            const data = encodeFunctionData({
                abi: PREDICTION_MARKET_ABI,
                functionName: 'buyShares',
                args: [BigInt(marketId), isYes, minShares],
            });
            // Send transaction
            const result = await walletClient.sendTransaction({
                to: PREDICTION_MARKET_ADDRESS,
                data,
                value,
                account,
            });
            setHash(result);
            return result;
        }
        catch (err) {
            const error = err instanceof Error ? err : new Error(err.message || 'Transaction failed');
            setError(error);
            throw error;
        }
        finally {
            setIsPending(false);
        }
    };
    return { buyShares, isPending, error, hash };
}
export function usePrivySellShares() {
    const { wallets } = useWallets();
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState(null);
    const [hash, setHash] = useState(null);
    const sellShares = async (marketId, isYes, sharesAmount, minEth = 0n) => {
        const embeddedWallet = wallets.find(w => w.walletClientType === 'privy');
        if (!embeddedWallet) {
            throw new Error('No embedded wallet found. Please connect your wallet.');
        }
        setIsPending(true);
        setError(null);
        try {
            const provider = await embeddedWallet.getEthereumProvider();
            const account = embeddedWallet.address;
            const walletClient = createWalletClient({
                account,
                chain: sepolia,
                transport: custom(provider),
            });
            const data = encodeFunctionData({
                abi: PREDICTION_MARKET_ABI,
                functionName: 'sellShares',
                args: [BigInt(marketId), isYes, sharesAmount, minEth],
            });
            const result = await walletClient.sendTransaction({
                to: PREDICTION_MARKET_ADDRESS,
                data,
                account,
            });
            setHash(result);
            return result;
        }
        catch (err) {
            const error = err instanceof Error ? err : new Error(err.message || 'Transaction failed');
            setError(error);
            throw error;
        }
        finally {
            setIsPending(false);
        }
    };
    return { sellShares, isPending, error, hash };
}
export function usePrivyClaimWinnings() {
    const { wallets } = useWallets();
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState(null);
    const [hash, setHash] = useState(null);
    const claimWinnings = async (marketId) => {
        const embeddedWallet = wallets.find(w => w.walletClientType === 'privy');
        if (!embeddedWallet) {
            throw new Error('No embedded wallet found. Please connect your wallet.');
        }
        setIsPending(true);
        setError(null);
        try {
            const provider = await embeddedWallet.getEthereumProvider();
            const account = embeddedWallet.address;
            const walletClient = createWalletClient({
                account,
                chain: sepolia,
                transport: custom(provider),
            });
            const data = encodeFunctionData({
                abi: PREDICTION_MARKET_ABI,
                functionName: 'claimWinnings',
                args: [BigInt(marketId)],
            });
            const result = await walletClient.sendTransaction({
                to: PREDICTION_MARKET_ADDRESS,
                data,
                account,
            });
            setHash(result);
            return result;
        }
        catch (err) {
            const error = err instanceof Error ? err : new Error(err.message || 'Transaction failed');
            setError(error);
            throw error;
        }
        finally {
            setIsPending(false);
        }
    };
    return { claimWinnings, isPending, error, hash };
}
