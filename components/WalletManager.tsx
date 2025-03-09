'use client';

import { useState, useEffect } from 'react';

interface WalletManagerProps {
  walletAddress?: string;
  balance?: number;
  network?: string;
  onConnect: () => void;
  onDisconnect: () => void;
}

export default function WalletManager({ 
  walletAddress, 
  balance = 0, 
  network = 'Radius Testnet',
  onConnect, 
  onDisconnect 
}: WalletManagerProps) {
  const [isConnected, setIsConnected] = useState(!!walletAddress);
  const [showDetails, setShowDetails] = useState(false);
  
  useEffect(() => {
    setIsConnected(!!walletAddress);
  }, [walletAddress]);
  
  const handleConnect = () => {
    onConnect();
  };
  
  const handleDisconnect = () => {
    onDisconnect();
    setShowDetails(false);
  };
  
  const formatWalletAddress = (address: string) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  return (
    <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
      <h2 className="text-xl font-semibold mb-4">Wallet</h2>
      
      {isConnected ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <div>
              <div className="text-sm text-gray-400 mb-1">Connected to</div>
              <div className="font-medium">{network}</div>
            </div>
            <div className="flex items-center">
              <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
              <span className="text-green-400 text-sm">Connected</span>
            </div>
          </div>
          
          <div className="bg-gray-700/30 p-4 rounded-lg mb-4">
            <div className="text-sm text-gray-400 mb-1">Wallet Address</div>
            <div className="font-mono text-sm truncate">{walletAddress}</div>
          </div>
          
          <div className="bg-gray-700/30 p-4 rounded-lg mb-6">
            <div className="text-sm text-gray-400 mb-1">Balance</div>
            <div className="text-xl font-semibold">{balance.toFixed(6)} ETH</div>
            <div className="text-xs text-gray-400">
              u2248 ${(balance * 3000).toFixed(2)} USD
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => setShowDetails(!showDetails)}
              className="py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
            >
              {showDetails ? 'Hide Details' : 'Show Details'}
            </button>
            <button 
              onClick={handleDisconnect}
              className="py-2 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors"
            >
              Disconnect
            </button>
          </div>
          
          {showDetails && (
            <div className="mt-4 p-4 bg-gray-700/20 rounded-lg border border-gray-700">
              <h3 className="text-sm font-semibold mb-2">Wallet Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Network</span>
                  <span>{network}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Address</span>
                  <span className="font-mono text-xs truncate max-w-[200px]">{walletAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Balance</span>
                  <span>{balance.toFixed(6)} ETH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">USD Value</span>
                  <span>${(balance * 3000).toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center">
          <div className="mb-4">
            <svg className="w-16 h-16 mx-auto text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
            </svg>
          </div>
          <p className="text-gray-400 mb-6">Connect your wallet to start earning from your compute resources</p>
          <button 
            onClick={handleConnect}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
          >
            Connect Wallet
          </button>
        </div>
      )}
    </div>
  );
}
