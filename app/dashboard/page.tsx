'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import WalletManager from '@/components/WalletManager';
import NetworkVerification from '@/components/NetworkVerification';
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

  // Simulate resource monitoring
  useEffect(() => {
    if (isProviding) {
      const interval = setInterval(() => {
        setCpuUsage(Math.random() * 80 + 10);
        setGpuUsage(Math.random() * 70 + 5);
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [isProviding]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Resource Provider Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Resource Status</h2>
          <div className="flex justify-between items-center mb-4">
            <span>Status:</span>
            <span className={`px-3 py-1 rounded-full text-sm ${isProviding ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              {isProviding ? 'Providing' : 'Offline'}
            </span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span>CPU Usage:</span>
            <span>{cpuUsage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-700/30 rounded-full h-2 mb-4">
            <div 
              className="bg-blue-500 h-2 rounded-full" 
              style={{ width: `${cpuUsage}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span>GPU Usage:</span>
            <span>{gpuUsage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-700/30 rounded-full h-2 mb-6">
            <div 
              className="bg-purple-500 h-2 rounded-full" 
              style={{ width: `${gpuUsage}%` }}
            ></div>
          </div>
          <button
            onClick={toggleProviding}
            className={`w-full py-2 rounded-lg font-medium ${isProviding ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
          >
            {isProviding ? 'Stop Providing' : 'Start Providing'}
          </button>
        </div>
        
        <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Earnings</h2>
          <div className="text-3xl font-bold mb-2">{wallet.usdcBalance.toFixed(2)} USDC</div>
          <div className="text-sm text-gray-400 mb-4">≈ ${wallet.usdcBalance.toFixed(2)} USD</div>
          <div className="text-sm mb-4">
            <div className="flex justify-between mb-1">
              <span>Today:</span>
              <span>{(wallet.usdcBalance * 0.4).toFixed(2)} USDC</span>
            </div>
            <div className="flex justify-between">
              <span>This Week:</span>
              <span>{wallet.usdcBalance.toFixed(2)} USDC</span>
            </div>
          </div>
          <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium">
            Withdraw Funds
          </button>
        </div>
        
        <WalletManager
          walletAddress={wallet.address}
          balance={wallet.balance}
          usdcBalance={wallet.usdcBalance}
          network={wallet.network}
          onConnect={connectWallet}
          onDisconnect={disconnectWallet}
        />
      </div>
      
      <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700 mb-8">
        <h2 className="text-xl font-semibold mb-4">Network Verification</h2>
        <p className="text-sm text-gray-400 mb-4">
          Verify that your application is connected to the Radius Network. This information proves that all transactions and operations are performed on the Radius blockchain.
        </p>
        <NetworkVerification />
      </div>
      
      <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700 mb-8">
        <h2 className="text-xl font-semibold mb-4">Resource Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm mb-1">CPU Price (USDC per hour)</label>
            <input
              type="number"
              defaultValue={0.5}
              step={0.1}
              min={0}
              className="w-full p-2 bg-gray-900 border border-gray-700 rounded"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">GPU Price (USDC per hour)</label>
            <input
              type="number"
              defaultValue={2.0}
              step={0.1}
              min={0}
              className="w-full p-2 bg-gray-900 border border-gray-700 rounded"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Max CPU Cores to Share</label>
            <input
              type="number"
              defaultValue={4}
              step={1}
              min={1}
              className="w-full p-2 bg-gray-900 border border-gray-700 rounded"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Max GPU Memory to Share (GB)</label>
            <input
              type="number"
              defaultValue={4}
              step={1}
              min={0}
              className="w-full p-2 bg-gray-900 border border-gray-700 rounded"
            />
          </div>
        </div>
        <button className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium">
          Save Configuration
        </button>
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
