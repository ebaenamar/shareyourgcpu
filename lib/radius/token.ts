import { ethers } from 'ethers';
import { BLOCKCHAIN_CONFIG } from '../constants';

// Standard ERC20 ABI for the functions we need
const ERC20_ABI = [
  // Read-only functions
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function name() view returns (string)',
  
  // Write functions
  'function transfer(address to, uint amount) returns (bool)',
  'function approve(address spender, uint256 amount) returns (bool)',
  
  // Events
  'event Transfer(address indexed from, address indexed to, uint amount)',
  'event Approval(address indexed owner, address indexed spender, uint256 value)'
];

/**
 * Get a contract instance for the USDC token
 * @param provider Ethers provider
 * @returns Contract instance
 */
export function getUSDCContract(provider: ethers.Provider | ethers.Signer) {
  return new ethers.Contract(BLOCKCHAIN_CONFIG.CONTRACTS.USDC, ERC20_ABI, provider);
}

/**
 * Get the USDC balance of an address
 * @param provider Ethers provider
 * @param address Wallet address
 * @returns Balance in USDC (decimal adjusted)
 */
export async function getUSDCBalance(provider: ethers.Provider, address: string): Promise<number> {
  try {
    const contract = getUSDCContract(provider);
    const decimals = await contract.decimals();
    const balance = await contract.balanceOf(address);
    
    // Convert from wei to USDC with proper decimal places
    return Number(ethers.formatUnits(balance, decimals));
  } catch (error) {
    console.error('Error getting USDC balance:', error);
    return 0;
  }
}

/**
 * Transfer USDC tokens to another address
 * @param signer Ethers signer
 * @param toAddress Recipient address
 * @param amount Amount in USDC (decimal adjusted)
 * @returns Transaction receipt
 */
export async function transferUSDC(signer: ethers.Signer, toAddress: string, amount: number): Promise<ethers.TransactionReceipt | null> {
  try {
    const contract = getUSDCContract(signer);
    const decimals = await contract.decimals();
    
    // Convert from USDC to wei with proper decimal places
    const amountInWei = ethers.parseUnits(amount.toString(), decimals);
    
    // Send the transaction
    const tx = await contract.transfer(toAddress, amountInWei, {
      gasLimit: BLOCKCHAIN_CONFIG.GAS.DEFAULT_GAS_LIMIT
    });
    
    // Wait for the transaction to be mined
    return await tx.wait();
  } catch (error) {
    console.error('Error transferring USDC:', error);
    throw error;
  }
}

/**
 * Approve another address to spend USDC tokens
 * @param signer Ethers signer
 * @param spenderAddress Address to approve
 * @param amount Amount in USDC (decimal adjusted)
 * @returns Transaction receipt
 */
export async function approveUSDC(signer: ethers.Signer, spenderAddress: string, amount: number): Promise<ethers.TransactionReceipt | null> {
  try {
    const contract = getUSDCContract(signer);
    const decimals = await contract.decimals();
    
    // Convert from USDC to wei with proper decimal places
    const amountInWei = ethers.parseUnits(amount.toString(), decimals);
    
    // Send the transaction
    const tx = await contract.approve(spenderAddress, amountInWei, {
      gasLimit: BLOCKCHAIN_CONFIG.GAS.DEFAULT_GAS_LIMIT
    });
    
    // Wait for the transaction to be mined
    return await tx.wait();
  } catch (error) {
    console.error('Error approving USDC:', error);
    throw error;
  }
}
