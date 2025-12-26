import { PREDICTION_MARKET_ADDRESS } from '../contract';
import { validateContractAddress } from '../utils/validation';

export function ContractWarning() {
  const isValid = validateContractAddress(PREDICTION_MARKET_ADDRESS);

  if (isValid) return null;

  return (
    <div className="bg-accent-yellow/20 border border-accent-yellow/50 rounded-xl p-4 mb-6">
      <div className="flex items-start gap-3">
        <svg className="w-5 h-5 text-accent-yellow mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div className="flex-1">
          <h3 className="font-semibold text-accent-yellow mb-1">Contract Address Not Configured</h3>
          <p className="text-sm text-gray-300">
            Please set <code className="bg-dark-700 px-1.5 py-0.5 rounded text-xs">VITE_CONTRACT_ADDRESS</code> in your <code className="bg-dark-700 px-1.5 py-0.5 rounded text-xs">.env</code> file.
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Current value: {PREDICTION_MARKET_ADDRESS || '(not set)'}
          </p>
        </div>
      </div>
    </div>
  );
}

