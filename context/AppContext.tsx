'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BLOCKCHAIN_CONFIG } from '@/lib/constants';

// Types for our context
interface WalletInfo {
  address: string;
  balance: number;
  usdcBalance: number;
  network: string;
  isConnected: boolean;
}

interface ComputeResource {
  id: string;
  provider: string;
  providerId: string;
  location: string;
  cpuCores: number;
  gpuMemory: number;
  cpuPrice: number;
  gpuPrice: number;
  availability: number;
  rating: number;
  status: string;
}

interface Task {
  id: string;
  type: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startTime: string;
  endTime?: string;
  duration?: string;
  cpuCores: number;
  gpuMemory: number;
  totalPayment?: number;
  providerId?: string;
  provider?: string;
}

interface Transaction {
  id: string;
  amount: number;
  timestamp: string;
  type: 'incoming' | 'outgoing';
  status: 'pending' | 'completed' | 'failed';
}

interface AppContextType {
  // Wallet state
  wallet: WalletInfo;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  
  // Resource provider state
  isProviding: boolean;
  toggleProviding: () => void;
  providerResources: ComputeResource[];
  registerResource: (resource: Omit<ComputeResource, 'id' | 'providerId' | 'rating' | 'status'>) => Promise<void>;
  
  // Consumer state
  availableResources: ComputeResource[];
  submitTask: (task: any) => Promise<void>;
  
  // Task state
  providerTasks: Task[];
  consumerTasks: Task[];
  
  // Transaction state
  transactions: Transaction[];
  
  // UI state
  loading: boolean;
  error: string | null;
}

// Create the context with default values
const AppContext = createContext<AppContextType>({
  // Default wallet state
  wallet: {
    address: '',
    balance: 0,
    usdcBalance: 0,
    network: BLOCKCHAIN_CONFIG.NETWORK,
    isConnected: false
  },
  connectWallet: async () => {},
  disconnectWallet: () => {},
  
  // Default resource provider state
  isProviding: false,
  toggleProviding: () => {},
  providerResources: [],
  registerResource: async () => {},
  
  // Default consumer state
  availableResources: [],
  submitTask: async () => {},
  
  // Default task state
  providerTasks: [],
  consumerTasks: [],
  
  // Default transaction state
  transactions: [],
  
  // Default UI state
  loading: false,
  error: null
});

// Provider component
export function AppProvider({ children }: { children: ReactNode }) {
  // Wallet state
  const [wallet, setWallet] = useState<WalletInfo>({
    address: '',
    balance: 0,
    usdcBalance: 0,
    network: BLOCKCHAIN_CONFIG.NETWORK,
    isConnected: false
  });
  
  // Resource provider state
  const [isProviding, setIsProviding] = useState(false);
  const [providerResources, setProviderResources] = useState<ComputeResource[]>([]);
  
  // Consumer state
  const [availableResources, setAvailableResources] = useState<ComputeResource[]>([]);
  
  // Task state
  const [providerTasks, setProviderTasks] = useState<Task[]>([]);
  const [consumerTasks, setConsumerTasks] = useState<Task[]>([]);
  
  // Transaction state
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Connect wallet function
  const connectWallet = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate wallet connection
      // In a real app, this would use the Radius wallet SDK
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate a random wallet address
      const address = '0x' + [...Array(40)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
      
      setWallet({
        address,
        balance: 1.5,
        usdcBalance: 100, // Mock USDC balance for demo purposes
        network: BLOCKCHAIN_CONFIG.NETWORK,
        isConnected: true
      });
      
      // Load provider resources if any
      fetchProviderResources(address);
      
      // Load transactions
      fetchTransactions(address);
      
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
      setLoading(false);
    }
  };
  
  // Disconnect wallet function
  const disconnectWallet = () => {
    setWallet({
      address: '',
      balance: 0,
      usdcBalance: 0,
      network: BLOCKCHAIN_CONFIG.NETWORK,
      isConnected: false
    });
    setIsProviding(false);
    setProviderResources([]);
    setProviderTasks([]);
    setConsumerTasks([]);
    setTransactions([]);
  };
  
  // Toggle providing state
  const toggleProviding = () => {
    setIsProviding(prev => !prev);
  };
  
  // Register a new compute resource
  const registerResource = async (resource: Omit<ComputeResource, 'id' | 'providerId' | 'rating' | 'status'>) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!wallet.isConnected) {
        throw new Error('Wallet not connected');
      }
      
      // Prepare the resource data
      const resourceData = {
        ...resource,
        providerId: wallet.address
      };
      
      // Make API call to register the resource
      const response = await fetch('/api/compute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(resourceData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to register resource');
      }
      
      const data = await response.json();
      
      // Add the new resource to the provider resources
      setProviderResources(prev => [...prev, data.resource]);
      
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Failed to register resource');
      setLoading(false);
    }
  };
  
  // Submit a new compute task
  const submitTask = async (task: any) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!wallet.isConnected) {
        throw new Error('Wallet not connected');
      }
      
      // Prepare the task data
      const taskData = {
        ...task,
        consumerId: wallet.address
      };
      
      // Make API call to submit the task
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit task');
      }
      
      const data = await response.json();
      
      // Add the new task to the consumer tasks
      setConsumerTasks(prev => [...prev, data.task]);
      
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Failed to submit task');
      setLoading(false);
    }
  };
  
  // Fetch provider resources
  const fetchProviderResources = async (providerId: string) => {
    try {
      // Make API call to get provider resources
      const response = await fetch(`/api/compute?providerId=${providerId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch provider resources');
      }
      
      const data = await response.json();
      
      setProviderResources(data.resources || []);
    } catch (err: any) {
      console.error('Error fetching provider resources:', err);
    }
  };
  
  // Fetch available resources for the marketplace
  const fetchAvailableResources = async () => {
    try {
      // Make API call to get all available resources
      const response = await fetch('/api/compute');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch available resources');
      }
      
      const data = await response.json();
      
      setAvailableResources(data.resources || []);
    } catch (err: any) {
      console.error('Error fetching available resources:', err);
    }
  };
  
  // Fetch transactions
  const fetchTransactions = async (address: string) => {
    try {
      // Make API call to get transactions
      const response = await fetch(`/api/payments?providerId=${address}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch transactions');
      }
      
      const data = await response.json();
      
      // Transform the transactions to match our format
      const formattedTransactions = (data.transactions || []).map((tx: any) => ({
        id: tx.transactionHash,
        amount: tx.totalPayment,
        timestamp: tx.timestamp,
        type: tx.providerWalletAddress === address ? 'incoming' : 'outgoing',
        status: 'completed'
      }));
      
      setTransactions(formattedTransactions);
    } catch (err: any) {
      console.error('Error fetching transactions:', err);
    }
  };
  
  // Fetch tasks
  const fetchTasks = async () => {
    if (!wallet.isConnected) return;
    
    try {
      // Fetch provider tasks
      const providerResponse = await fetch(`/api/tasks?providerId=${wallet.address}`);
      
      if (providerResponse.ok) {
        const providerData = await providerResponse.json();
        setProviderTasks(providerData.tasks || []);
      }
      
      // Fetch consumer tasks
      const consumerResponse = await fetch(`/api/tasks?consumerId=${wallet.address}`);
      
      if (consumerResponse.ok) {
        const consumerData = await consumerResponse.json();
        setConsumerTasks(consumerData.tasks || []);
      }
    } catch (err: any) {
      console.error('Error fetching tasks:', err);
    }
  };
  
  // Load available resources when the component mounts
  useEffect(() => {
    fetchAvailableResources();
  }, []);
  
  // Load tasks when wallet is connected
  useEffect(() => {
    if (wallet.isConnected) {
      fetchTasks();
    }
  }, [wallet.isConnected]);
  
  // Simulate earnings when providing resources
  useEffect(() => {
    if (!isProviding || !wallet.isConnected) return;
    
    const interval = setInterval(() => {
      // Simulate earning some USDC
      const earningAmount = 0.01; // Higher amount since USDC has different value scale
      
      setWallet(prev => ({
        ...prev,
        usdcBalance: prev.usdcBalance + earningAmount
      }));
      
      // Simulate a new transaction
      const newTransaction = {
        id: 'tx-' + Date.now(),
        amount: earningAmount,
        timestamp: new Date().toISOString(),
        type: 'incoming' as const,
        status: 'completed' as const
      };
      
      setTransactions(prev => [newTransaction, ...prev]);
    }, 30000); // Every 30 seconds
    
    return () => clearInterval(interval);
  }, [isProviding, wallet.isConnected]);
  
  return (
    <AppContext.Provider
      value={{
        wallet,
        connectWallet,
        disconnectWallet,
        isProviding,
        toggleProviding,
        providerResources,
        registerResource,
        availableResources,
        submitTask,
        providerTasks,
        consumerTasks,
        transactions,
        loading,
        error
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// Custom hook to use the context
export function useAppContext() {
  return useContext(AppContext);
}
