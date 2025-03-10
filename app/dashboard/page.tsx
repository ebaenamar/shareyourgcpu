'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import WalletManager from '@/components/WalletManager';
import NetworkVerification from '@/components/NetworkVerification';
import PetalsModelHosting from '@/components/PetalsModelHosting';
import PetalsNetworkStatus from '@/components/PetalsNetworkStatus';
import PetalsEarnings from '@/components/PetalsEarnings';
import ResourceMonitor from '@/components/ResourceMonitor';
import { useAppContext } from '@/context/AppContext';
import { BLOCKCHAIN_CONFIG } from '@/lib/constants';

export default function Dashboard() {
  const { 
    wallet, 
    connectWallet, 
    disconnectWallet, 
    isProviding, 
    toggleProviding 
  } = useAppContext();
  
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  
  const [cpuUsage, setCpuUsage] = useState(0);
  const [gpuUsage, setGpuUsage] = useState(0);
  const [taskHistory, setTaskHistory] = useState([
    {
      id: 'task-1',
      type: 'ML Training',
      duration: '45 min',
      earnings: 0.0025,
      status: 'Completed',
      timestamp: '2025-03-09T09:15:00Z'
    },
    {
      id: 'task-2',
      type: 'Rendering',
      duration: '30 min',
      earnings: 0.0018,
      status: 'Completed',
      timestamp: '2025-03-09T08:30:00Z'
    },
    {
      id: 'task-3',
      type: 'Data Processing',
      duration: '15 min',
      earnings: 0.0008,
      status: 'Completed',
      timestamp: '2025-03-09T07:45:00Z'
    }
  ]);

  // Handle model selection for Petals integration
  const handleToggleProviding = (modelId: string | null) => {
    setSelectedModelId(modelId);
    toggleProviding();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Resource Provider Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <ResourceMonitor 
          isProviding={isProviding} 
          onToggleProviding={toggleProviding} 
        />
        
        <PetalsEarnings />

        
        <WalletManager
          walletAddress={wallet.address}
          balance={wallet.balance}
          usdcBalance={wallet.usdcBalance}
          network={wallet.network}
          onConnect={connectWallet}
          onDisconnect={disconnectWallet}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <PetalsModelHosting 
            isProviding={isProviding} 
            onToggleProviding={handleToggleProviding} 
          />
        </div>
        
        <div>
          <PetalsNetworkStatus />
        </div>
      </div>
      
      <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700 mb-8">
        <h2 className="text-xl font-semibold mb-4">Network Verification</h2>
        <p className="text-sm text-gray-400 mb-4">
          Verify that your application is connected to the Radius Network. This information proves that all transactions and operations are performed on the Radius blockchain.
        </p>
        <NetworkVerification />
      </div>
      
      <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-semibold mb-4">Recent Tasks</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-2">Task ID</th>
                <th className="text-left py-2">Type</th>
                <th className="text-left py-2">Duration</th>
                <th className="text-left py-2">Earnings (USDC)</th>
                <th className="text-left py-2">Status</th>
                <th className="text-left py-2">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {taskHistory.map((task) => (
                <tr key={task.id} className="border-b border-gray-800">
                  <td className="py-2">{task.id}</td>
                  <td className="py-2">{task.type}</td>
                  <td className="py-2">{task.duration}</td>
                  <td className="py-2">{task.earnings.toFixed(2)} USDC</td>
                  <td className="py-2">
                    <span className="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-400">
                      {task.status}
                    </span>
                  </td>
                  <td className="py-2">{new Date(task.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
