# Edge Cases & Error Handling

This document outlines all edge cases and validations implemented in the prediction market platform.

## Smart Contract Edge Cases

### Market Creation
- ✅ Validates `endTime > block.timestamp` (market must end in the future)
- ✅ Validates `initialOddsYes > 0 && initialOddsYes < 100` (valid probability range)
- ⚠️ Empty strings for question/category are allowed (frontend should validate)

### Trading Functions

#### Buy Shares
- ✅ Validates market exists (`MarketDoesNotExist`)
- ✅ Validates market not resolved (`MarketAlreadyResolved`)
- ✅ Validates market not ended (`MarketEnded`)
- ✅ Validates `msg.value > 0` (`InvalidAmount`)
- ✅ Slippage protection via `minShares` parameter
- ✅ Division by zero protection (pools always have MIN_LIQUIDITY)
- ✅ Reentrancy protection via `nonReentrant` modifier

#### Sell Shares
- ✅ Validates market exists (`MarketDoesNotExist`)
- ✅ Validates market not resolved (`MarketAlreadyResolved`)
- ✅ Validates market not ended (`MarketEnded`)
- ✅ Validates `sharesAmount > 0` (`InvalidAmount`)
- ✅ Validates user has sufficient shares (`InsufficientShares`)
- ✅ Slippage protection via `minEth` parameter
- ✅ Reentrancy protection

#### Claim Winnings
- ✅ Validates market resolved (`MarketNotResolved`)
- ✅ Validates user has winning shares (`NoWinnings`)
- ✅ Prevents double-claiming (shares set to 0 after claim)

### AMM Formula Protection
- ✅ Minimum liquidity ensures pools never reach zero
- ✅ Constant product formula (x * y = k) maintains invariants
- ✅ Integer division handled correctly (precision loss acceptable for wei units)

## Frontend Edge Cases

### Contract Address Validation
- ✅ Validates address format (40 hex chars with 0x prefix)
- ✅ Warns if address is zero address or not set
- ✅ Disables contract calls if address invalid

### Input Validation

#### ETH Amount
- ✅ Required field (cannot be empty)
- ✅ Must be a valid number
- ✅ Minimum: 0.0001 ETH
- ✅ Maximum: 1000 ETH (reasonable limit)
- ✅ Must be greater than 0
- ✅ Checks user balance before transaction
- ✅ Prevents sending more than balance (leaves 0.001 ETH for gas)

#### Shares Amount
- ✅ Must be greater than 0
- ✅ Cannot exceed user's holdings
- ✅ Validates shares exist before selling

### Trading Edge Cases

#### Buy Flow
- ✅ Validates ETH amount before enabling button
- ✅ Calculates slippage protection (1% default)
- ✅ Shows quote preview before transaction
- ✅ Handles quote errors gracefully
- ✅ Prevents transaction if balance insufficient

#### Sell Flow
- ✅ Validates shares exist
- ✅ Percentage slider (1-100%)
- ✅ Calculates slippage protection
- ✅ Shows ETH preview before transaction
- ✅ Disables sell if no shares

### Market State Handling
- ✅ Disables trading if market resolved
- ✅ Disables trading if market ended
- ✅ Shows appropriate status badges
- ✅ Handles missing market data gracefully
- ✅ Shows loading states during data fetch

### Error Handling
- ✅ Formats contract errors to user-friendly messages
- ✅ Handles transaction rejections
- ✅ Handles network errors
- ✅ Shows specific error messages for:
  - Insufficient balance
  - Slippage too high
  - Market not found
  - Transaction rejected
  - Network issues

### Price/Quote Calculations
- ✅ Handles division by zero (contract returns 0)
- ✅ Handles invalid market IDs
- ✅ Handles quote failures gracefully
- ✅ Shows loading states during quote calculation
- ✅ Validates quote data before displaying

### Portfolio & Positions
- ✅ Handles empty positions
- ✅ Filters out zero positions
- ✅ Handles missing market data for positions
- ✅ Shows loading states
- ✅ Handles user not connected state

### UI/UX Edge Cases
- ✅ Responsive design (mobile/tablet/desktop)
- ✅ Loading skeletons for async data
- ✅ Empty states with helpful messages
- ✅ Disabled states for unavailable actions
- ✅ Transaction pending states
- ✅ Success feedback after transactions
- ✅ Error toast notifications

## Security Considerations

### Smart Contract
- ✅ Reentrancy protection on all external calls
- ✅ Access control (onlyOwner modifiers)
- ✅ Integer overflow protection (Solidity 0.8+)
- ✅ Safe math operations
- ✅ Transfer failure handling

### Frontend
- ✅ Input sanitization
- ✅ Address validation
- ✅ Amount validation
- ✅ Balance checks before transactions
- ✅ Slippage protection
- ✅ Transaction status tracking

## Known Limitations

1. **Empty String Validation**: Contract doesn't validate non-empty strings for question/category (frontend should enforce)
2. **Gas Estimation**: Frontend doesn't estimate gas before transactions (wallet handles this)
3. **Price Impact Warning**: No warning for large trades that would significantly move price
4. **Market Resolution**: No automatic resolution - requires admin action
5. **Fee Withdrawal**: Owner can withdraw fees at any time (by design)

## Testing Recommendations

- Test with zero balances
- Test with very small amounts (< 0.0001 ETH)
- Test with very large amounts
- Test market resolution edge cases
- Test concurrent trades
- Test failed transactions
- Test network disconnections
- Test invalid market IDs
- Test expired markets
- Test resolved markets

