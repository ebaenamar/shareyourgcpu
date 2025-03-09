'use client';

import { useState, useEffect } from 'react';

interface ResourceMonitorProps {
  isProviding: boolean;
  onToggleProviding: () => void;
}

export default function ResourceMonitor({ isProviding, onToggleProviding }: ResourceMonitorProps) {
  const [cpuUsage, setCpuUsage] = useState(0);
  const [gpuUsage, setGpuUsage] = useState(0);
  const [memoryUsage, setMemoryUsage] = useState(0);
  const [networkUsage, setNetworkUsage] = useState(0);
  
  // Simulate resource monitoring
  useEffect(() => {
    if (isProviding) {
      const interval = setInterval(() => {
        setCpuUsage(Math.random() * 80 + 10);
        setGpuUsage(Math.random() * 70 + 5);
        setMemoryUsage(Math.random() * 60 + 20);
        setNetworkUsage(Math.random() * 50 + 10);
      }, 2000);
      
      return () => clearInterval(interval);
    } else {
      // Reset values when not providing
      setCpuUsage(0);
      setGpuUsage(0);
      setMemoryUsage(0);
      setNetworkUsage(0);
    }
  }, [isProviding]);
  
  return (
    <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Resource Monitor</h2>
        <span className={`px-3 py-1 rounded-full text-sm ${isProviding ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
          {isProviding ? 'Active' : 'Inactive'}
        </span>
      </div>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span>CPU Usage</span>
            <span>{cpuUsage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-700/30 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-500" 
              style={{ width: `${cpuUsage}%` }}
            ></div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <span>GPU Usage</span>
            <span>{gpuUsage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-700/30 rounded-full h-2">
            <div 
              className="bg-purple-500 h-2 rounded-full transition-all duration-500" 
              style={{ width: `${gpuUsage}%` }}
            ></div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <span>Memory Usage</span>
            <span>{memoryUsage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-700/30 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-500" 
              style={{ width: `${memoryUsage}%` }}
            ></div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <span>Network Usage</span>
            <span>{networkUsage.toFixed(1)} MB/s</span>
          </div>
          <div className="w-full bg-gray-700/30 rounded-full h-2">
            <div 
              className="bg-yellow-500 h-2 rounded-full transition-all duration-500" 
              style={{ width: `${networkUsage * 2}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      <button
        onClick={onToggleProviding}
        className={`w-full py-2 mt-6 rounded-lg font-medium transition-colors ${isProviding ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
      >
        {isProviding ? 'Stop Providing Resources' : 'Start Providing Resources'}
      </button>
    </div>
  );
}
