import { createRadiusWallet } from '@radiustechsystems/ai-agent-wallet';

// Interface for wallet configuration
interface WalletConfig {
  rpcUrl: string;
  privateKey?: string;
  address?: string;
}

// Interface for transaction parameters
interface TransactionParams {
  to: string;
  value: bigint;
  data?: string;
}

/**
 * Create a Radius wallet instance for payment processing
 * @param config Wallet configuration
 * @returns Wallet instance
 */
export async function createWallet(config: WalletConfig) {
  try {
    // Validate configuration
    if (!config.rpcUrl) {
      throw new Error('RPC URL is required');
    }
    
    if (!config.privateKey && !config.address) {
      throw new Error('Either privateKey or address is required');
    }
    
    // Create the wallet
    const wallet = await createRadiusWallet({
      rpcUrl: config.rpcUrl,
      privateKey: config.privateKey || ''
      // Note: address is not used in the wallet creation, only for read-only operations
    });
    
    return wallet;
  } catch (error) {
    console.error('Error creating wallet:', error);
    throw error;
  }
}

/**
 * Send a payment transaction
 * @param wallet Wallet instance
 * @param params Transaction parameters
 * @returns Transaction receipt
 */
export async function sendPayment(wallet: any, params: TransactionParams) {
  try {
    // Validate parameters
    if (!params.to) {
      throw new Error('Recipient address is required');
    }
    
    if (!params.value) {
      throw new Error('Transaction value is required');
    }
    
    // Send the transaction
    const tx = await wallet.sendTransaction({
      to: params.to,
      value: params.value,
      data: params.data
    });
    
    // Wait for the transaction to be mined
    const receipt = await tx.wait();
    
    return receipt;
  } catch (error) {
    console.error('Error sending payment:', error);
    throw error;
  }
}

/**
 * Get the balance of a wallet
 * @param wallet Wallet instance
 * @returns Wallet balance in ETH
 */
export async function getWalletBalance(wallet: any) {
  try {
    const balanceWei = await wallet.getBalance();
    const balanceEth = Number(balanceWei) / 1e18;
    
    return balanceEth;
  } catch (error) {
    console.error('Error getting wallet balance:', error);
    throw error;
  }
}

/**
 * Format an amount in ETH to Wei
 * @param ethAmount Amount in ETH
 * @returns Amount in Wei as BigInt
 */
export function ethToWei(ethAmount: number): bigint {
  return BigInt(Math.floor(ethAmount * 1e18));
}

/**
 * Format an amount in Wei to ETH
 * @param weiAmount Amount in Wei
 * @returns Amount in ETH as number
 */
export function weiToEth(weiAmount: bigint): number {
  return Number(weiAmount) / 1e18;
}
