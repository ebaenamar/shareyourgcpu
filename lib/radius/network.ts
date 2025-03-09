import { ethers } from 'ethers';
import { BLOCKCHAIN_CONFIG } from '../constants';

/**
 * Network verification information
 */
interface NetworkInfo {
  chainId: number;
  name: string;
  isRadius: boolean;
  blockNumber: number;
  blockTimestamp: number;
  formattedTime: string;
  rpcUrl: string;
}

/**
 * Radius Network Chain IDs
 */
const RADIUS_CHAIN_IDS = {
  MAINNET: 1380012617,
  TESTNET: 1380012618,
};

/**
 * Verify if the connected network is Radius
 * @param provider Ethers provider
 * @returns Network verification information
 */
export async function verifyRadiusNetwork(provider: ethers.Provider): Promise<NetworkInfo> {
  try {
    // Get network information
    const network = await provider.getNetwork();
    const chainId = Number(network.chainId);
    
    // Get latest block information
    const blockNumber = await provider.getBlockNumber();
    const block = await provider.getBlock(blockNumber);
    const blockTimestamp = block?.timestamp ?? 0;
    
    // Format timestamp
    const date = new Date(blockTimestamp * 1000);
    const formattedTime = date.toLocaleString();
    
    // Check if this is a Radius network
    const isRadius = (
      chainId === RADIUS_CHAIN_IDS.MAINNET || 
      chainId === RADIUS_CHAIN_IDS.TESTNET
    );
    
    // Network name
    let name = network.name;
    if (chainId === RADIUS_CHAIN_IDS.MAINNET) {
      name = 'Radius Mainnet';
    } else if (chainId === RADIUS_CHAIN_IDS.TESTNET) {
      name = 'Radius Testnet';
    }
    
    return {
      chainId,
      name,
      isRadius,
      blockNumber,
      blockTimestamp,
      formattedTime,
      rpcUrl: BLOCKCHAIN_CONFIG.RPC_URL,
    };
  } catch (error) {
    console.error('Error verifying Radius network:', error);
    throw error;
  }
}

/**
 * Get a block explorer URL for a transaction
 * @param txHash Transaction hash
 * @returns Block explorer URL
 */
export function getRadiusExplorerUrl(txHash: string): string {
  return `https://explorer.testnet.radius.network/tx/${txHash}`;
}

/**
 * Get a block explorer URL for an address
 * @param address Wallet address
 * @returns Block explorer URL
 */
export function getRadiusAddressExplorerUrl(address: string): string {
  return `https://explorer.testnet.radius.network/address/${address}`;
}
