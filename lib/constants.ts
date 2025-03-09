/**
 * Application-wide constants
 */

// Blockchain configuration
export const BLOCKCHAIN_CONFIG = {
  // Network details
  NETWORK: 'Radius Testnet',
  RPC_URL: process.env.NEXT_PUBLIC_RPC_URL || 'https://testnet.radius.network/rpc',
  
  // Contract addresses
  CONTRACTS: {
    USDC: '0xe8F920229F964d0bA163f4adDf032591539C09f5'
  },
  
  // Gas settings
  GAS: {
    DEFAULT_GAS_LIMIT: 300000,
    DEFAULT_GAS_PRICE: 10000000000 // 10 gwei
  }
};

// Application settings
export const APP_CONFIG = {
  // Payment settings
  PAYMENTS: {
    MIN_PAYMENT_AMOUNT: 0.001, // Minimum payment in USDC
    PAYMENT_INTERVAL: 60 // Payment interval in seconds
  },
  
  // Resource settings
  RESOURCES: {
    DEFAULT_CPU_PRICE: 0.0001, // Price per CPU core per hour in USDC
    DEFAULT_GPU_PRICE: 0.001   // Price per GB of GPU memory per hour in USDC
  }
};
