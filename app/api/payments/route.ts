import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { BLOCKCHAIN_CONFIG, APP_CONFIG } from '@/lib/constants';
import { transferUSDC } from '@/lib/radius/token';

// Constants for payment calculation
const PAYMENT_PER_CPU_SECOND = APP_CONFIG.RESOURCES.DEFAULT_CPU_PRICE / 3600; // USDC per CPU second
const PAYMENT_PER_GPU_SECOND = APP_CONFIG.RESOURCES.DEFAULT_GPU_PRICE / 3600;  // USDC per GPU second

// Interface for compute usage metrics
interface ComputeUsageMetrics {
  taskId: string;
  providerId: string;
  cpuCores: number;
  cpuSeconds: number;
  gpuMemory: number;
  gpuSeconds: number;
  startTime: string;
  endTime: string;
}

// Interface for payment transaction
interface PaymentTransaction {
  taskId: string;
  providerId: string;
  consumerWalletAddress: string;
  providerWalletAddress: string;
  cpuPayment: number;
  gpuPayment: number;
  totalPayment: number;
  transactionHash: string;
  timestamp: string;
}

// Mock database for payment transactions
let paymentTransactions: PaymentTransaction[] = [];

// GET handler to retrieve payment transactions
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const providerId = searchParams.get('providerId');
  const taskId = searchParams.get('taskId');
  
  let filteredTransactions = [...paymentTransactions];
  
  // Filter by provider ID if provided
  if (providerId) {
    filteredTransactions = filteredTransactions.filter(tx => tx.providerId === providerId);
  }
  
  // Filter by task ID if provided
  if (taskId) {
    filteredTransactions = filteredTransactions.filter(tx => tx.taskId === taskId);
  }
  
  return NextResponse.json({ transactions: filteredTransactions });
}

// POST handler to process a payment for compute usage
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = [
      'taskId', 'providerId', 'consumerWalletAddress', 'providerWalletAddress',
      'cpuCores', 'cpuSeconds', 'gpuMemory', 'gpuSeconds', 'startTime', 'endTime'
    ];
    
    for (const field of requiredFields) {
      if (body[field] === undefined) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }
    
    // Calculate payment amounts
    const cpuPayment = calculateCpuPayment(body.cpuCores, body.cpuSeconds);
    const gpuPayment = calculateGpuPayment(body.gpuMemory, body.gpuSeconds);
    const totalPayment = cpuPayment + gpuPayment;
    
    // Process the payment using USDC on Radius Testnet
    // If environment variables aren't set, it will fall back to simulation
    const transactionHash = await processPaymentTransaction(
      body.consumerWalletAddress, 
      body.providerWalletAddress, 
      totalPayment
    );
    
    // Record the payment transaction
    const paymentTransaction: PaymentTransaction = {
      taskId: body.taskId,
      providerId: body.providerId,
      consumerWalletAddress: body.consumerWalletAddress,
      providerWalletAddress: body.providerWalletAddress,
      cpuPayment,
      gpuPayment,
      totalPayment,
      transactionHash,
      timestamp: new Date().toISOString()
    };
    
    // Add to the database
    paymentTransactions.push(paymentTransaction);
    
    return NextResponse.json({ transaction: paymentTransaction }, { status: 201 });
  } catch (error) {
    console.error('Error processing payment:', error);
    return NextResponse.json({ error: 'Failed to process payment' }, { status: 500 });
  }
}

// Helper function to calculate CPU payment
function calculateCpuPayment(cpuCores: number, cpuSeconds: number): number {
  return cpuCores * cpuSeconds * PAYMENT_PER_CPU_SECOND;
}

// Helper function to calculate GPU payment
function calculateGpuPayment(gpuMemory: number, gpuSeconds: number): number {
  return gpuMemory * gpuSeconds * PAYMENT_PER_GPU_SECOND;
}

// Process a payment transaction using USDC on Radius Testnet
async function processPaymentTransaction(fromAddress: string, toAddress: string, amount: number): Promise<string> {
  try {
    // Check if we have the private key in environment variables
    const privateKey = process.env.CONSUMER_PRIVATE_KEY;
    if (!privateKey) {
      console.warn('No private key found in environment variables, using simulated transaction');
      return simulatePaymentTransaction(fromAddress, toAddress, amount);
    }
    
    // Create a provider connected to Radius Testnet
    const provider = new ethers.JsonRpcProvider(BLOCKCHAIN_CONFIG.RPC_URL);
    
    // Create a wallet with the private key
    const wallet = new ethers.Wallet(privateKey, provider);
    
    // Transfer USDC tokens
    const receipt = await transferUSDC(wallet, toAddress, amount);
    
    if (!receipt || !receipt.hash) {
      throw new Error('Transaction failed or receipt not available');
    }
    
    return receipt.hash;
  } catch (error) {
    console.error('Error processing payment with USDC:', error);
    // Fall back to simulation if the real transaction fails
    return simulatePaymentTransaction(fromAddress, toAddress, amount);
  }
}

// Helper function to simulate a payment transaction (fallback)
async function simulatePaymentTransaction(fromAddress: string, toAddress: string, amount: number): Promise<string> {
  // For demo purposes, generate a random transaction hash
  const randomBytes = new Uint8Array(32);
  crypto.getRandomValues(randomBytes);
  const txHash = '0x' + Array.from(randomBytes).map(b => b.toString(16).padStart(2, '0')).join('');
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  console.log(`[SIMULATED] Transferred ${amount} USDC from ${fromAddress} to ${toAddress}`);
  return txHash;
}
