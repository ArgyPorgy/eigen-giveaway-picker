import { parseEther, formatEther } from 'viem';

export function validateContractAddress(address: string): boolean {
  if (!address || address === '0x0000000000000000000000000000000000000000') {
    return false;
  }
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export function validateEthAmount(amount: string): { valid: boolean; error?: string } {
  if (!amount || amount.trim() === '') {
    return { valid: false, error: 'Amount is required' };
  }

  const num = parseFloat(amount);
  
  if (isNaN(num)) {
    return { valid: false, error: 'Invalid number' };
  }

  if (num <= 0) {
    return { valid: false, error: 'Amount must be greater than 0' };
  }

  if (num < 0.0001) {
    return { valid: false, error: 'Amount too small (min 0.0001 ETH)' };
  }

  if (num > 1000) {
    return { valid: false, error: 'Amount too large (max 1000 ETH)' };
  }

  return { valid: true };
}

export function calculateMinShares(shares: bigint, slippagePercent: number = 1): bigint {
  const slippageBps = BigInt(Math.floor(slippagePercent * 100));
  const slippageAmount = (shares * slippageBps) / 10000n;
  return shares - slippageAmount;
}

export function calculateMinEth(eth: bigint, slippagePercent: number = 1): bigint {
  const slippageBps = BigInt(Math.floor(slippagePercent * 100));
  const slippageAmount = (eth * slippageBps) / 10000n;
  return eth - slippageAmount;
}

export function formatError(error: any): string {
  if (!error) return 'Unknown error';
  
  const errorMessage = error.message || error.toString();
  
  // Handle common contract errors
  if (errorMessage.includes('MarketDoesNotExist')) {
    return 'Market does not exist';
  }
  if (errorMessage.includes('MarketAlreadyResolved')) {
    return 'Market is already resolved';
  }
  if (errorMessage.includes('MarketEnded')) {
    return 'Trading has ended for this market';
  }
  if (errorMessage.includes('InsufficientShares')) {
    return 'Insufficient shares';
  }
  if (errorMessage.includes('Insufficient')) {
    return 'Insufficient balance';
  }
  if (errorMessage.includes('Slippage')) {
    return 'Slippage too high. Try again or increase slippage tolerance.';
  }
  if (errorMessage.includes('user rejected')) {
    return 'Transaction rejected';
  }
  if (errorMessage.includes('insufficient funds')) {
    return 'Insufficient funds for transaction';
  }
  if (errorMessage.includes('nonce')) {
    return 'Transaction failed. Please try again.';
  }
  
  // Return a cleaned version of the error
  return errorMessage.length > 100 
    ? errorMessage.substring(0, 100) + '...'
    : errorMessage;
}

