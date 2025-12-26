export const PREDICTION_MARKET_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';
export const PREDICTION_MARKET_ABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [],
        "name": "InsufficientPayment",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "InsufficientShares",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "InvalidAmount",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "MarketAlreadyResolved",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "MarketDoesNotExist",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "MarketEnded",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "MarketNotResolved",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "MarketStillActive",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "NoWinnings",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "OwnableInvalidOwner",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "OwnableUnauthorizedAccount",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "ReentrancyGuardReentrantCall",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "TransferFailed",
        "type": "error"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "marketId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "question",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "category",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "endTime",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "initialYesPool",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "initialNoPool",
                "type": "uint256"
            }
        ],
        "name": "MarketCreated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "marketId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "outcome",
                "type": "bool"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "name": "MarketResolved",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "previousOwner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "marketId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "buyer",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "isYes",
                "type": "bool"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "ethAmount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "sharesReceived",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "newYesPrice",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "newNoPrice",
                "type": "uint256"
            }
        ],
        "name": "SharesBought",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "marketId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "seller",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "isYes",
                "type": "bool"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "sharesAmount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "ethReceived",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "newYesPrice",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "newNoPrice",
                "type": "uint256"
            }
        ],
        "name": "SharesSold",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "marketId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "claimer",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "WinningsClaimed",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "BPS_DENOMINATOR",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "FEE_BPS",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "MIN_LIQUIDITY",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "PRECISION",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "marketId",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "isYes",
                "type": "bool"
            },
            {
                "internalType": "uint256",
                "name": "minShares",
                "type": "uint256"
            }
        ],
        "name": "buyShares",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "sharesOut",
                "type": "uint256"
            }
        ],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "marketId",
                "type": "uint256"
            }
        ],
        "name": "claimWinnings",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "payout",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "collectedFees",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "question",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "category",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "imageUrl",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "endTime",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "initialOddsYes",
                "type": "uint256"
            }
        ],
        "name": "createMarket",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "marketId",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "marketId",
                "type": "uint256"
            }
        ],
        "name": "getMarket",
        "outputs": [
            {
                "internalType": "string",
                "name": "question",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "category",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "imageUrl",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "createdAt",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "endTime",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "resolved",
                "type": "bool"
            },
            {
                "internalType": "bool",
                "name": "outcome",
                "type": "bool"
            },
            {
                "internalType": "uint256",
                "name": "yesPrice",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "noPrice",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "totalVolume",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "offset",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "limit",
                "type": "uint256"
            }
        ],
        "name": "getMarkets",
        "outputs": [
            {
                "internalType": "uint256[]",
                "name": "ids",
                "type": "uint256[]"
            },
            {
                "internalType": "string[]",
                "name": "questions",
                "type": "string[]"
            },
            {
                "internalType": "string[]",
                "name": "categories",
                "type": "string[]"
            },
            {
                "internalType": "uint256[]",
                "name": "yesPrices",
                "type": "uint256[]"
            },
            {
                "internalType": "uint256[]",
                "name": "noPrices",
                "type": "uint256[]"
            },
            {
                "internalType": "uint256[]",
                "name": "endTimes",
                "type": "uint256[]"
            },
            {
                "internalType": "bool[]",
                "name": "resolvedFlags",
                "type": "bool[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "marketId",
                "type": "uint256"
            }
        ],
        "name": "getNoPrice",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "marketId",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            }
        ],
        "name": "getPosition",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "yesShares",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "noShares",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "avgYesCost",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "avgNoCost",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            }
        ],
        "name": "getUserPositions",
        "outputs": [
            {
                "internalType": "uint256[]",
                "name": "marketIds",
                "type": "uint256[]"
            },
            {
                "internalType": "uint256[]",
                "name": "yesSharesArr",
                "type": "uint256[]"
            },
            {
                "internalType": "uint256[]",
                "name": "noSharesArr",
                "type": "uint256[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "marketId",
                "type": "uint256"
            }
        ],
        "name": "getYesPrice",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "hasParticipated",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "marketCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "marketParticipants",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "markets",
        "outputs": [
            {
                "internalType": "string",
                "name": "question",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "category",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "imageUrl",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "createdAt",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "endTime",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "resolved",
                "type": "bool"
            },
            {
                "internalType": "bool",
                "name": "outcome",
                "type": "bool"
            },
            {
                "internalType": "uint256",
                "name": "yesPool",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "noPool",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "totalVolume",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "exists",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "positions",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "yesShares",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "noShares",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "avgYesCost",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "avgNoCost",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "marketId",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "isYes",
                "type": "bool"
            },
            {
                "internalType": "uint256",
                "name": "ethAmount",
                "type": "uint256"
            }
        ],
        "name": "quoteBuy",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "sharesOut",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "marketId",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "isYes",
                "type": "bool"
            },
            {
                "internalType": "uint256",
                "name": "sharesAmount",
                "type": "uint256"
            }
        ],
        "name": "quoteSell",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "ethOut",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "marketId",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "outcome",
                "type": "bool"
            }
        ],
        "name": "resolveMarket",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "marketId",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "isYes",
                "type": "bool"
            },
            {
                "internalType": "uint256",
                "name": "sharesAmount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "minEth",
                "type": "uint256"
            }
        ],
        "name": "sellShares",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "ethOut",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "withdrawFees",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "stateMutability": "payable",
        "type": "receive"
    }
];
