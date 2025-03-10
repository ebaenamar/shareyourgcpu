'use client';

import { useState, useEffect } from 'react';
import { PetalsNetworkStats, getNetworkStats } from '../lib/petals/client';

export default function PetalsNetworkStatus() {
  const [networkStats, setNetworkStats] = useState<PetalsNetworkStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNetworkStats() {
      try {
        setIsLoading(true);
        const stats = await getNetworkStats();
        setNetworkStats(stats);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch Petals network stats:', err);
        setError('Failed to load network statistics');
      } finally {
        setIsLoading(false);
      }
    }

    fetchNetworkStats();
    
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchNetworkStats, 30000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-semibold mb-4">Petals Network Status</h2>
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <span className="ml-2">Loading network status...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-semibold mb-4">Petals Network Status</h2>
        <div className="p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-300 text-sm">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
      <h2 className="text-xl font-semibold mb-4">Petals Network Status</h2>
      
      {networkStats && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-blue-900/20 border border-blue-800 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
              <span className="font-medium">Active Nodes</span>
            </div>
            <span className="text-xl font-bold">{networkStats.totalNodes}</span>
          </div>
          
          <div>
            <h3 className="text-md font-medium mb-2">Active Models</h3>
            <div className="space-y-2">
              {networkStats.activeModels.map((model) => (
                <div key={model.id} className="p-3 bg-gray-900/50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{model.name}</h4>
                      <p className="text-sm text-gray-400">{model.id}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      model.status === 'healthy' ? 'bg-green-500/20 text-green-400' :
                      model.status === 'degraded' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {model.status}
                    </span>
                  </div>
                  
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-400">Size:</span> {model.parameterCount}
                    </div>
                    <div>
                      <span className="text-gray-400">Contributors:</span> {model.contributors}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-md font-medium mb-2">Top Contributors</h3>
            <div className="space-y-1">
              {networkStats.topContributors.map((address, index) => (
                <div key={address} className="flex items-center p-2 bg-gray-900/30 rounded">
                  <div className="bg-blue-900/30 text-blue-400 rounded-full w-6 h-6 flex items-center justify-center mr-2">
                    {index + 1}
                  </div>
                  <span className="font-mono text-sm truncate">{address}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="text-center mt-2">
            <a 
              href="https://health.petals.dev" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline text-sm inline-flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
              </svg>
              View Full Network Status
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
