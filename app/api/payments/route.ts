import { NextRequest, NextResponse } from 'next/server';
import { createRadiusWallet } from '@radiustechsystems/ai-agent-wallet';

// Constants for payment calculation
const PAYMENT_PER_CPU_SECOND = 0.0001; // ETH per CPU second
const PAYMENT_PER_GPU_SECOND = 0.001;  // ETH per GPU second

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
    
    // In a real application, we would use the Radius wallet to process the payment
    // For this demo, we'll simulate the payment process
    const transactionHash = await simulatePaymentTransaction(body.consumerWalletAddress, body.providerWalletAddress, totalPayment);
    
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

// Helper function to simulate a payment transaction
async function simulatePaymentTransaction(fromAddress: string, toAddress: string, amount: number): Promise<string> {
  // In a real application, we would use the Radius wallet to send the transaction
  // For this demo, we'll generate a fake transaction hash
  
  // This is how we would implement it with the actual Radius wallet:
  /*
  const consumerWallet = await createRadiusWallet({
    rpcUrl: process.env.RPC_PROVIDER_URL,
    privateKey: process.env.CONSUMER_PRIVATE_KEY
  });
  
  const tx = await consumerWallet.sendTransaction({
    to: toAddress,
    value: BigInt(Math.floor(amount * 1e18))
  });
  
  return tx.hash;
  */
  
  // For demo purposes, generate a random transaction hash
  const randomBytes = new Uint8Array(32);
  crypto.getRandomValues(randomBytes);
  const txHash = '0x' + Array.from(randomBytes).map(b => b.toString(16).padStart(2, '0')).join('');
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return txHash;
}
