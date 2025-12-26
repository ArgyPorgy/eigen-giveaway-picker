import { useReadContract, useReadContracts, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { PREDICTION_MARKET_ADDRESS, PREDICTION_MARKET_ABI } from '../contract';
import { parseEther, formatEther } from 'viem';
import { validateContractAddress } from '../utils/validation';

export interface Market {
  id: number;
  question: string;
  category: string;
  imageUrl: string;
  createdAt: number;
  endTime: number;
  resolved: boolean;
  outcome: boolean;
  yesPrice: number; // 0-10000 (basis points)
  noPrice: number;
  totalVolume: bigint;
}

export interface Position {
  yesShares: bigint;
  noShares: bigint;
  avgYesCost: bigint;
  avgNoCost: bigint;
}

export function useMarketCount() {
  const isValid = validateContractAddress(PREDICTION_MARKET_ADDRESS);
  
  return useReadContract({
    address: PREDICTION_MARKET_ADDRESS as `0x${string}`,
    abi: PREDICTION_MARKET_ABI,
    functionName: 'marketCount',
    query: {
      enabled: isValid,
    },
  });
}

export function useMarkets(offset: number = 0, limit: number = 50) {
  const { data: marketCount } = useMarketCount();
  const isValid = validateContractAddress(PREDICTION_MARKET_ADDRESS);
  
  return useReadContract({
    address: PREDICTION_MARKET_ADDRESS as `0x${string}`,
    abi: PREDICTION_MARKET_ABI,
    functionName: 'getMarkets',
    args: [BigInt(offset), BigInt(limit)],
    query: {
      enabled: isValid && marketCount !== undefined && marketCount > 0n,
    },
  });
}

export function useMarket(marketId: number) {
  return useReadContract({
    address: PREDICTION_MARKET_ADDRESS as `0x${string}`,
    abi: PREDICTION_MARKET_ABI,
    functionName: 'getMarket',
    args: [BigInt(marketId)],
  });
}

export function usePosition(marketId: number, userAddress: `0x${string}` | undefined) {
  return useReadContract({
    address: PREDICTION_MARKET_ADDRESS as `0x${string}`,
    abi: PREDICTION_MARKET_ABI,
    functionName: 'getPosition',
    args: [BigInt(marketId), userAddress!],
    query: {
      enabled: !!userAddress,
    },
  });
}

export function useUserPositions(userAddress: `0x${string}` | undefined) {
  return useReadContract({
    address: PREDICTION_MARKET_ADDRESS as `0x${string}`,
    abi: PREDICTION_MARKET_ABI,
    functionName: 'getUserPositions',
    args: [userAddress!],
    query: {
      enabled: !!userAddress,
    },
  });
}

export function useQuoteBuy(marketId: number, isYes: boolean, ethAmount: string) {
  const isValid = validateContractAddress(PREDICTION_MARKET_ADDRESS);
  let amountWei = 0n;
  
  try {
    if (ethAmount && parseFloat(ethAmount) > 0) {
      amountWei = parseEther(ethAmount);
    }
  } catch {
    amountWei = 0n;
  }
  
  return useReadContract({
    address: PREDICTION_MARKET_ADDRESS as `0x${string}`,
    abi: PREDICTION_MARKET_ABI,
    functionName: 'quoteBuy',
    args: [BigInt(marketId), isYes, amountWei],
    query: {
      enabled: isValid && amountWei > 0n && marketId >= 0,
    },
  });
}

export function useQuoteSell(marketId: number, isYes: boolean, sharesAmount: bigint) {
  const isValid = validateContractAddress(PREDICTION_MARKET_ADDRESS);
  
  return useReadContract({
    address: PREDICTION_MARKET_ADDRESS as `0x${string}`,
    abi: PREDICTION_MARKET_ABI,
    functionName: 'quoteSell',
    args: [BigInt(marketId), isYes, sharesAmount],
    query: {
      enabled: isValid && sharesAmount > 0n && marketId >= 0,
    },
  });
}

export function useBuyShares() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const buyShares = (marketId: number, isYes: boolean, ethAmount: string, minShares: bigint = 0n) => {
    if (!validateContractAddress(PREDICTION_MARKET_ADDRESS)) {
      throw new Error('Invalid contract address');
    }
    
    try {
      const value = parseEther(ethAmount);
      writeContract({
        address: PREDICTION_MARKET_ADDRESS as `0x${string}`,
        abi: PREDICTION_MARKET_ABI,
        functionName: 'buyShares',
        args: [BigInt(marketId), isYes, minShares],
        value,
      });
    } catch (err: any) {
      throw new Error(err.message || 'Failed to buy shares');
    }
  };

  return { buyShares, isPending, isConfirming, isSuccess, error, hash };
}

export function useSellShares() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const sellShares = (marketId: number, isYes: boolean, sharesAmount: bigint, minEth: bigint = 0n) => {
    if (!validateContractAddress(PREDICTION_MARKET_ADDRESS)) {
      throw new Error('Invalid contract address');
    }
    
    if (sharesAmount <= 0n) {
      throw new Error('Invalid shares amount');
    }
    
    try {
      writeContract({
        address: PREDICTION_MARKET_ADDRESS as `0x${string}`,
        abi: PREDICTION_MARKET_ABI,
        functionName: 'sellShares',
        args: [BigInt(marketId), isYes, sharesAmount, minEth],
      });
    } catch (err: any) {
      throw new Error(err.message || 'Failed to sell shares');
    }
  };

  return { sellShares, isPending, isConfirming, isSuccess, error, hash };
}

export function useClaimWinnings() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const claimWinnings = (marketId: number) => {
    writeContract({
      address: PREDICTION_MARKET_ADDRESS as `0x${string}`,
      abi: PREDICTION_MARKET_ABI,
      functionName: 'claimWinnings',
      args: [BigInt(marketId)],
    });
  };

  return { claimWinnings, isPending, isConfirming, isSuccess, error, hash };
}

// Helper to format price from basis points to percentage
export function formatPrice(bps: number | bigint): string {
  const value = typeof bps === 'bigint' ? Number(bps) : bps;
  return (value / 100).toFixed(1);
}

// Helper to format shares (from wei to readable)
export function formatShares(shares: bigint): string {
  const formatted = formatEther(shares);
  const num = parseFloat(formatted);
  if (num < 0.0001) return '0';
  if (num < 1) return num.toFixed(4);
  if (num < 1000) return num.toFixed(2);
  return num.toLocaleString(undefined, { maximumFractionDigits: 0 });
}

