// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title PredictionMarket
 * @notice A prediction market contract with AMM-based odds that shift on trades
 * @dev Uses constant product AMM (x * y = k) for price discovery
 */
contract PredictionMarket is Ownable, ReentrancyGuard {
    
    // ============ Structs ============
    
    struct Market {
        string question;
        string category;
        string imageUrl;
        uint256 createdAt;
        uint256 endTime;
        bool resolved;
        bool outcome; // true = YES won, false = NO won
        uint256 yesPool; // Virtual YES liquidity
        uint256 noPool;  // Virtual NO liquidity
        uint256 totalVolume;
        bool exists;
    }
    
    struct Position {
        uint256 yesShares;
        uint256 noShares;
        uint256 avgYesCost; // Average cost basis for YES shares (in wei per share)
        uint256 avgNoCost;  // Average cost basis for NO shares (in wei per share)
    }
    
    // ============ State Variables ============
    
    uint256 public marketCount;
    uint256 public constant PRECISION = 1e18;
    uint256 public constant MIN_LIQUIDITY = 1000 * PRECISION; // Minimum pool size
    uint256 public constant FEE_BPS = 100; // 1% fee
    uint256 public constant BPS_DENOMINATOR = 10000;
    
    mapping(uint256 => Market) public markets;
    mapping(uint256 => mapping(address => Position)) public positions;
    mapping(uint256 => address[]) public marketParticipants;
    mapping(uint256 => mapping(address => bool)) public hasParticipated;
    
    uint256 public collectedFees;
    
    // ============ Events ============
    
    event MarketCreated(
        uint256 indexed marketId,
        string question,
        string category,
        uint256 endTime,
        uint256 initialYesPool,
        uint256 initialNoPool
    );
    
    event SharesBought(
        uint256 indexed marketId,
        address indexed buyer,
        bool isYes,
        uint256 ethAmount,
        uint256 sharesReceived,
        uint256 newYesPrice,
        uint256 newNoPrice
    );
    
    event SharesSold(
        uint256 indexed marketId,
        address indexed seller,
        bool isYes,
        uint256 sharesAmount,
        uint256 ethReceived,
        uint256 newYesPrice,
        uint256 newNoPrice
    );
    
    event MarketResolved(
        uint256 indexed marketId,
        bool outcome,
        uint256 timestamp
    );
    
    event WinningsClaimed(
        uint256 indexed marketId,
        address indexed claimer,
        uint256 amount
    );
    
    // ============ Errors ============
    
    error MarketDoesNotExist();
    error MarketAlreadyResolved();
    error MarketNotResolved();
    error MarketStillActive();
    error MarketEnded();
    error InsufficientShares();
    error InsufficientPayment();
    error InvalidAmount();
    error NoWinnings();
    error TransferFailed();
    
    // ============ Constructor ============
    
    constructor() Ownable(msg.sender) {}
    
    // ============ Admin Functions ============
    
    /**
     * @notice Create a new prediction market
     * @param question The market question
     * @param category Market category (e.g., "NFL", "NBA", "Soccer")
     * @param imageUrl Optional image URL for the market
     * @param endTime Unix timestamp when betting closes
     * @param initialOddsYes Initial YES probability (0-100)
     */
    function createMarket(
        string calldata question,
        string calldata category,
        string calldata imageUrl,
        uint256 endTime,
        uint256 initialOddsYes
    ) external onlyOwner returns (uint256 marketId) {
        require(endTime > block.timestamp, "End time must be in future");
        require(initialOddsYes > 0 && initialOddsYes < 100, "Invalid initial odds");
        
        marketId = marketCount++;
        
        // Set initial pools based on desired odds
        // If odds are 50%, pools are equal
        // If odds are 70% YES, yesPool should be smaller (more scarce = more expensive)
        uint256 yesPool = MIN_LIQUIDITY * (100 - initialOddsYes) / 50;
        uint256 noPool = MIN_LIQUIDITY * initialOddsYes / 50;
        
        markets[marketId] = Market({
            question: question,
            category: category,
            imageUrl: imageUrl,
            createdAt: block.timestamp,
            endTime: endTime,
            resolved: false,
            outcome: false,
            yesPool: yesPool,
            noPool: noPool,
            totalVolume: 0,
            exists: true
        });
        
        emit MarketCreated(marketId, question, category, endTime, yesPool, noPool);
    }
    
    /**
     * @notice Resolve a market with the outcome
     * @param marketId The market to resolve
     * @param outcome true if YES won, false if NO won
     */
    function resolveMarket(uint256 marketId, bool outcome) external onlyOwner {
        Market storage market = markets[marketId];
        if (!market.exists) revert MarketDoesNotExist();
        if (market.resolved) revert MarketAlreadyResolved();
        if (block.timestamp < market.endTime) revert MarketStillActive();
        
        market.resolved = true;
        market.outcome = outcome;
        
        emit MarketResolved(marketId, outcome, block.timestamp);
    }
    
    /**
     * @notice Withdraw collected fees
     */
    function withdrawFees() external onlyOwner {
        uint256 amount = collectedFees;
        collectedFees = 0;
        
        (bool success, ) = msg.sender.call{value: amount}("");
        if (!success) revert TransferFailed();
    }
    
    // ============ Trading Functions ============
    
    /**
     * @notice Buy YES or NO shares
     * @param marketId The market to trade in
     * @param isYes true to buy YES shares, false for NO shares
     * @param minShares Minimum shares to receive (slippage protection)
     */
    function buyShares(
        uint256 marketId,
        bool isYes,
        uint256 minShares
    ) external payable nonReentrant returns (uint256 sharesOut) {
        Market storage market = markets[marketId];
        if (!market.exists) revert MarketDoesNotExist();
        if (market.resolved) revert MarketAlreadyResolved();
        if (block.timestamp >= market.endTime) revert MarketEnded();
        if (msg.value == 0) revert InvalidAmount();
        
        // Calculate fee
        uint256 fee = (msg.value * FEE_BPS) / BPS_DENOMINATOR;
        uint256 amountAfterFee = msg.value - fee;
        collectedFees += fee;
        
        // Calculate shares using constant product formula
        // When buying YES: user adds to NO pool, takes from YES pool
        // dy = y - (k / (x + dx)) where x is the pool being added to
        if (isYes) {
            uint256 k = market.yesPool * market.noPool;
            sharesOut = market.yesPool - (k / (market.noPool + amountAfterFee));
            market.yesPool -= sharesOut;
            market.noPool += amountAfterFee;
        } else {
            uint256 k = market.yesPool * market.noPool;
            sharesOut = market.noPool - (k / (market.yesPool + amountAfterFee));
            market.noPool -= sharesOut;
            market.yesPool += amountAfterFee;
        }
        
        require(sharesOut >= minShares, "Slippage too high");
        
        // Update position
        Position storage pos = positions[marketId][msg.sender];
        if (isYes) {
            // Update average cost basis
            uint256 totalCost = (pos.yesShares * pos.avgYesCost) + (amountAfterFee * PRECISION);
            pos.yesShares += sharesOut;
            pos.avgYesCost = totalCost / pos.yesShares;
        } else {
            uint256 totalCost = (pos.noShares * pos.avgNoCost) + (amountAfterFee * PRECISION);
            pos.noShares += sharesOut;
            pos.avgNoCost = totalCost / pos.noShares;
        }
        
        // Track participant
        if (!hasParticipated[marketId][msg.sender]) {
            hasParticipated[marketId][msg.sender] = true;
            marketParticipants[marketId].push(msg.sender);
        }
        
        market.totalVolume += msg.value;
        
        emit SharesBought(
            marketId,
            msg.sender,
            isYes,
            msg.value,
            sharesOut,
            getYesPrice(marketId),
            getNoPrice(marketId)
        );
    }
    
    /**
     * @notice Sell shares back to the market
     * @param marketId The market to trade in
     * @param isYes true to sell YES shares, false for NO shares
     * @param sharesAmount Amount of shares to sell
     * @param minEth Minimum ETH to receive (slippage protection)
     */
    function sellShares(
        uint256 marketId,
        bool isYes,
        uint256 sharesAmount,
        uint256 minEth
    ) external nonReentrant returns (uint256 ethOut) {
        Market storage market = markets[marketId];
        if (!market.exists) revert MarketDoesNotExist();
        if (market.resolved) revert MarketAlreadyResolved();
        if (block.timestamp >= market.endTime) revert MarketEnded();
        if (sharesAmount == 0) revert InvalidAmount();
        
        Position storage pos = positions[marketId][msg.sender];
        
        // Check sufficient shares
        if (isYes) {
            if (pos.yesShares < sharesAmount) revert InsufficientShares();
        } else {
            if (pos.noShares < sharesAmount) revert InsufficientShares();
        }
        
        // Calculate ETH out using constant product formula (reverse of buy)
        // When selling YES: user returns shares to YES pool, takes from NO pool
        if (isYes) {
            uint256 k = market.yesPool * market.noPool;
            ethOut = market.noPool - (k / (market.yesPool + sharesAmount));
            market.yesPool += sharesAmount;
            market.noPool -= ethOut;
        } else {
            uint256 k = market.yesPool * market.noPool;
            ethOut = market.yesPool - (k / (market.noPool + sharesAmount));
            market.noPool += sharesAmount;
            market.yesPool -= ethOut;
        }
        
        // Apply fee
        uint256 fee = (ethOut * FEE_BPS) / BPS_DENOMINATOR;
        ethOut -= fee;
        collectedFees += fee;
        
        require(ethOut >= minEth, "Slippage too high");
        
        // Update position
        if (isYes) {
            pos.yesShares -= sharesAmount;
            if (pos.yesShares == 0) pos.avgYesCost = 0;
        } else {
            pos.noShares -= sharesAmount;
            if (pos.noShares == 0) pos.avgNoCost = 0;
        }
        
        market.totalVolume += ethOut;
        
        // Transfer ETH
        (bool success, ) = msg.sender.call{value: ethOut}("");
        if (!success) revert TransferFailed();
        
        emit SharesSold(
            marketId,
            msg.sender,
            isYes,
            sharesAmount,
            ethOut,
            getYesPrice(marketId),
            getNoPrice(marketId)
        );
    }
    
    /**
     * @notice Claim winnings after market resolution
     * @param marketId The resolved market
     */
    function claimWinnings(uint256 marketId) external nonReentrant returns (uint256 payout) {
        Market storage market = markets[marketId];
        if (!market.exists) revert MarketDoesNotExist();
        if (!market.resolved) revert MarketNotResolved();
        
        Position storage pos = positions[marketId][msg.sender];
        
        uint256 winningShares;
        if (market.outcome) {
            // YES won
            winningShares = pos.yesShares;
            pos.yesShares = 0;
        } else {
            // NO won
            winningShares = pos.noShares;
            pos.noShares = 0;
        }
        
        if (winningShares == 0) revert NoWinnings();
        
        // Each winning share is worth 1 unit (PRECISION)
        // Payout = shares * price at resolution (which is 1.0 for winners)
        payout = winningShares;
        
        // Clear losing shares too
        if (market.outcome) {
            pos.noShares = 0;
        } else {
            pos.yesShares = 0;
        }
        
        (bool success, ) = msg.sender.call{value: payout}("");
        if (!success) revert TransferFailed();
        
        emit WinningsClaimed(marketId, msg.sender, payout);
    }
    
    // ============ View Functions ============
    
    /**
     * @notice Get the current YES price (probability)
     * @return Price in basis points (0-10000 represents 0%-100%)
     */
    function getYesPrice(uint256 marketId) public view returns (uint256) {
        Market storage market = markets[marketId];
        if (!market.exists) return 0;
        
        // Price = noPool / (yesPool + noPool)
        // Higher noPool = higher YES price (more people betting NO = YES is more likely)
        return (market.noPool * BPS_DENOMINATOR) / (market.yesPool + market.noPool);
    }
    
    /**
     * @notice Get the current NO price (probability)
     * @return Price in basis points (0-10000 represents 0%-100%)
     */
    function getNoPrice(uint256 marketId) public view returns (uint256) {
        return BPS_DENOMINATOR - getYesPrice(marketId);
    }
    
    /**
     * @notice Get market details
     */
    function getMarket(uint256 marketId) external view returns (
        string memory question,
        string memory category,
        string memory imageUrl,
        uint256 createdAt,
        uint256 endTime,
        bool resolved,
        bool outcome,
        uint256 yesPrice,
        uint256 noPrice,
        uint256 totalVolume
    ) {
        Market storage market = markets[marketId];
        require(market.exists, "Market does not exist");
        
        return (
            market.question,
            market.category,
            market.imageUrl,
            market.createdAt,
            market.endTime,
            market.resolved,
            market.outcome,
            getYesPrice(marketId),
            getNoPrice(marketId),
            market.totalVolume
        );
    }
    
    /**
     * @notice Get user position in a market
     */
    function getPosition(uint256 marketId, address user) external view returns (
        uint256 yesShares,
        uint256 noShares,
        uint256 avgYesCost,
        uint256 avgNoCost
    ) {
        Position storage pos = positions[marketId][user];
        return (pos.yesShares, pos.noShares, pos.avgYesCost, pos.avgNoCost);
    }
    
    /**
     * @notice Calculate how many shares you'd get for a given ETH amount
     */
    function quoteBuy(uint256 marketId, bool isYes, uint256 ethAmount) external view returns (uint256 sharesOut) {
        Market storage market = markets[marketId];
        if (!market.exists) return 0;
        
        uint256 fee = (ethAmount * FEE_BPS) / BPS_DENOMINATOR;
        uint256 amountAfterFee = ethAmount - fee;
        
        if (isYes) {
            uint256 k = market.yesPool * market.noPool;
            sharesOut = market.yesPool - (k / (market.noPool + amountAfterFee));
        } else {
            uint256 k = market.yesPool * market.noPool;
            sharesOut = market.noPool - (k / (market.yesPool + amountAfterFee));
        }
    }
    
    /**
     * @notice Calculate how much ETH you'd get for selling shares
     */
    function quoteSell(uint256 marketId, bool isYes, uint256 sharesAmount) external view returns (uint256 ethOut) {
        Market storage market = markets[marketId];
        if (!market.exists) return 0;
        
        if (isYes) {
            uint256 k = market.yesPool * market.noPool;
            ethOut = market.noPool - (k / (market.yesPool + sharesAmount));
        } else {
            uint256 k = market.yesPool * market.noPool;
            ethOut = market.yesPool - (k / (market.noPool + sharesAmount));
        }
        
        uint256 fee = (ethOut * FEE_BPS) / BPS_DENOMINATOR;
        ethOut -= fee;
    }
    
    /**
     * @notice Get all markets (paginated)
     */
    function getMarkets(uint256 offset, uint256 limit) external view returns (
        uint256[] memory ids,
        string[] memory questions,
        string[] memory categories,
        uint256[] memory yesPrices,
        uint256[] memory noPrices,
        uint256[] memory endTimes,
        bool[] memory resolvedFlags
    ) {
        uint256 end = offset + limit;
        if (end > marketCount) end = marketCount;
        uint256 length = end - offset;
        
        ids = new uint256[](length);
        questions = new string[](length);
        categories = new string[](length);
        yesPrices = new uint256[](length);
        noPrices = new uint256[](length);
        endTimes = new uint256[](length);
        resolvedFlags = new bool[](length);
        
        for (uint256 i = 0; i < length; i++) {
            uint256 marketId = offset + i;
            Market storage market = markets[marketId];
            
            ids[i] = marketId;
            questions[i] = market.question;
            categories[i] = market.category;
            yesPrices[i] = getYesPrice(marketId);
            noPrices[i] = getNoPrice(marketId);
            endTimes[i] = market.endTime;
            resolvedFlags[i] = market.resolved;
        }
    }
    
    /**
     * @notice Get user positions across all markets they've participated in
     */
    function getUserPositions(address user) external view returns (
        uint256[] memory marketIds,
        uint256[] memory yesSharesArr,
        uint256[] memory noSharesArr
    ) {
        // First pass: count markets with positions
        uint256 count = 0;
        for (uint256 i = 0; i < marketCount; i++) {
            Position storage pos = positions[i][user];
            if (pos.yesShares > 0 || pos.noShares > 0) {
                count++;
            }
        }
        
        // Second pass: populate arrays
        marketIds = new uint256[](count);
        yesSharesArr = new uint256[](count);
        noSharesArr = new uint256[](count);
        
        uint256 idx = 0;
        for (uint256 i = 0; i < marketCount; i++) {
            Position storage pos = positions[i][user];
            if (pos.yesShares > 0 || pos.noShares > 0) {
                marketIds[idx] = i;
                yesSharesArr[idx] = pos.yesShares;
                noSharesArr[idx] = pos.noShares;
                idx++;
            }
        }
    }
    
    // ============ Receive ============
    
    receive() external payable {}
}

