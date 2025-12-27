import { useState } from 'react';
import { useWallets } from '@privy-io/react-auth';
import { PREDICTION_MARKET_ADDRESS, PREDICTION_MARKET_ABI } from '../contract';
import { parseEther } from 'viem';
import { createWalletClient, custom, encodeFunctionData, createPublicClient } from 'viem';
import { sepolia } from 'viem/chains';

export function usePrivyBuyShares() {
  const { wallets } = useWallets();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hash, setHash] = useState<`0x${string}` | null>(null);

  const buyShares = async (
    marketId: number,
    isYes: boolean,
    ethAmount: string,
    minShares: bigint = 0n
  ) => {
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
      const account = embeddedWallet.address as `0x${string}`;
      
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
      const hash = await walletClient.sendTransaction({
        to: PREDICTION_MARKET_ADDRESS as `0x${string}`,
        data,
        value,
        account,
      });

      setHash(hash);

      // Wait for transaction confirmation using the same provider
      const publicClient = createPublicClient({
        chain: sepolia,
        transport: custom(provider),
      });

      await publicClient.waitForTransactionReceipt({ hash });

      // Add a small delay to ensure blockchain state has fully propagated
      await new Promise(resolve => setTimeout(resolve, 1500));

      return hash;
    } catch (err: any) {
      const error = err instanceof Error ? err : new Error(err.message || 'Transaction failed');
      setError(error);
      throw error;
    } finally {
      setIsPending(false);
    }
  };

  return { buyShares, isPending, error, hash };
}

export function usePrivySellShares() {
  const { wallets } = useWallets();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hash, setHash] = useState<`0x${string}` | null>(null);

  const sellShares = async (
    marketId: number,
    isYes: boolean,
    sharesAmount: bigint,
    minEth: bigint = 0n
  ) => {
    const embeddedWallet = wallets.find(w => w.walletClientType === 'privy');
    
    if (!embeddedWallet) {
      throw new Error('No embedded wallet found. Please connect your wallet.');
    }

    setIsPending(true);
    setError(null);

    try {
      const provider = await embeddedWallet.getEthereumProvider();
      const account = embeddedWallet.address as `0x${string}`;
      
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

      const hash = await walletClient.sendTransaction({
        to: PREDICTION_MARKET_ADDRESS as `0x${string}`,
        data,
        account,
      });

      setHash(hash);

      // Wait for transaction confirmation using the same provider
      const publicClient = createPublicClient({
        chain: sepolia,
        transport: custom(provider),
      });

      await publicClient.waitForTransactionReceipt({ hash });

      // Add a small delay to ensure blockchain state has fully propagated
      await new Promise(resolve => setTimeout(resolve, 1500));

      return hash;
    } catch (err: any) {
      const error = err instanceof Error ? err : new Error(err.message || 'Transaction failed');
      setError(error);
      throw error;
    } finally {
      setIsPending(false);
    }
  };

  return { sellShares, isPending, error, hash };
}

export function usePrivyClaimWinnings() {
  const { wallets } = useWallets();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hash, setHash] = useState<`0x${string}` | null>(null);

  const claimWinnings = async (marketId: number) => {
    const embeddedWallet = wallets.find(w => w.walletClientType === 'privy');
    
    if (!embeddedWallet) {
      throw new Error('No embedded wallet found. Please connect your wallet.');
    }

    setIsPending(true);
    setError(null);

    try {
      const provider = await embeddedWallet.getEthereumProvider();
      const account = embeddedWallet.address as `0x${string}`;
      
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

      const hash = await walletClient.sendTransaction({
        to: PREDICTION_MARKET_ADDRESS as `0x${string}`,
        data,
        account,
      });

      setHash(hash);

      // Wait for transaction confirmation using the same provider
      const publicClient = createPublicClient({
        chain: sepolia,
        transport: custom(provider),
      });

      await publicClient.waitForTransactionReceipt({ hash });

      // Add a small delay to ensure blockchain state has fully propagated
      await new Promise(resolve => setTimeout(resolve, 1500));

      return hash;
    } catch (err: any) {
      const error = err instanceof Error ? err : new Error(err.message || 'Transaction failed');
      setError(error);
      throw error;
    } finally {
      setIsPending(false);
    }
  };

  return { claimWinnings, isPending, error, hash };
}

