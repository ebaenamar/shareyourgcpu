'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { verifyRadiusNetwork, getRadiusExplorerUrl } from '../lib/radius/network';
import { BLOCKCHAIN_CONFIG } from '../lib/constants';

export default function NetworkVerification() {
  const [networkInfo, setNetworkInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkNetwork() {
      try {
        setLoading(true);
        const provider = new ethers.JsonRpcProvider(BLOCKCHAIN_CONFIG.RPC_URL);
        const info = await verifyRadiusNetwork(provider);
        setNetworkInfo(info);
        setError(null);
      } catch (err) {
        console.error('Network verification error:', err);
        setError('Failed to verify network. Please check your connection.');
      } finally {
        setLoading(false);
      }
    }

    checkNetwork();
    // Check network every 30 seconds
    const interval = setInterval(checkNetwork, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="p-4 border border-gray-700 rounded-lg bg-gray-800/30">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          <p className="text-sm text-gray-300">Verifying network connection...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-red-700 rounded-lg bg-red-900/30">
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p className="text-sm text-red-300">{error}</p>
        </div>
      </div>
    );
  }

  if (!networkInfo) return null;

  return (
    <div className={`p-4 border rounded-lg ${networkInfo.isRadius ? 'border-green-700 bg-green-900/20' : 'border-yellow-700 bg-yellow-900/20'}`}>
      <h3 className="text-lg font-medium mb-2 flex items-center">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
        </svg>
        Network Verification
      </h3>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400">Network:</span>
          <span className={networkInfo.isRadius ? 'text-green-400 font-medium' : 'text-yellow-400'}>
            {networkInfo.name} {networkInfo.isRadius && '✓'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-400">Chain ID:</span>
          <span className="font-mono">{networkInfo.chainId}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-400">Latest Block:</span>
          <span className="font-mono">{networkInfo.blockNumber}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-400">Block Time:</span>
          <span>{networkInfo.formattedTime}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-400">RPC URL:</span>
          <span className="font-mono text-xs truncate max-w-[200px]">{networkInfo.rpcUrl}</span>
        </div>
      </div>
      
      {networkInfo.isRadius ? (
        <div className="mt-3 p-2 bg-green-800/30 rounded border border-green-700 text-sm">
          <p className="flex items-center text-green-300">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            Verified: Application is connected to Radius Network
          </p>
        </div>
      ) : (
        <div className="mt-3 p-2 bg-yellow-800/30 rounded border border-yellow-700 text-sm">
          <p className="flex items-center text-yellow-300">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
            Warning: Not connected to Radius Network
          </p>
        </div>
      )}
      
      <div className="mt-3 text-xs text-gray-400">
        <a 
          href="https://explorer.testnet.radius.network" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline flex items-center"
        >
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
          </svg>
          View Radius Explorer
        </a>
      </div>
    </div>
  );
}
