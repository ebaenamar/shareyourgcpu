'use client';

import { useState, useEffect } from 'react';
import { ContributorStats, getContributorStats, claimEarnings } from '../lib/petals/payment';
import { useAppContext } from '../context/AppContext';

export default function PetalsEarnings() {
  const { wallet } = useAppContext();
  const [stats, setStats] = useState<ContributorStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isClaiming, setIsClaiming] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [claimSuccess, setClaimSuccess] = useState<{amount: number} | null>(null);

  useEffect(() => {
    async function fetchStats() {
      if (!wallet.address || !wallet.provider) return;
      
      try {
        setIsLoading(true);
        const contributorStats = await getContributorStats(wallet.provider, wallet.address);
        setStats(contributorStats);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch contributor stats:', err);
        setError('Failed to load your contribution statistics');
      } finally {
        setIsLoading(false);
      }
    }

    if (wallet.address && wallet.provider) {
      fetchStats();
      
      // Refresh stats every minute
      const interval = setInterval(fetchStats, 60000);
      return () => clearInterval(interval);
    }
  }, [wallet.address, wallet.provider]);

  const handleClaimEarnings = async () => {
    if (!wallet.signer) {
      setError('Wallet not connected or not properly initialized');
      return;
    }

    try {
      setIsClaiming(true);
      setError(null);
      setClaimSuccess(null);
      
      const result = await claimEarnings(wallet.signer);
      
      if (result.success) {
        setClaimSuccess({ amount: result.amount });
        // Refresh stats after claiming
        if (wallet.provider && wallet.address) {
          const updatedStats = await getContributorStats(wallet.provider, wallet.address);
          setStats(updatedStats);
        }
      } else {
        setError('Failed to claim earnings. Please try again later.');
      }
    } catch (err) {
      console.error('Error claiming earnings:', err);
      setError('An error occurred while claiming earnings');
    } finally {
      setIsClaiming(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    return `${days}d ${hours}h ${minutes}m`;
  };

  return (
    <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
      <h2 className="text-xl font-semibold mb-4">Petals Earnings</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-300 text-sm">
          {error}
        </div>
      )}
      
      {claimSuccess && (
        <div className="mb-4 p-3 bg-green-900/30 border border-green-700 rounded-lg text-green-300 text-sm">
          Successfully claimed {claimSuccess.amount.toFixed(2)} USDC!
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <span className="ml-2">Loading earnings data...</span>
        </div>
      ) : !stats ? (
        <div className="p-4 text-center">
          <p className="text-gray-400">
            {wallet.address 
              ? 'No contribution data found. Start hosting a model to earn USDC!'
              : 'Connect your wallet to view your earnings'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-900/50 p-4 rounded-lg">
              <p className="text-gray-400 text-sm">Pending Earnings</p>
              <p className="text-2xl font-bold text-green-400">{stats.pendingEarnings.toFixed(2)} USDC</p>
            </div>
            
            <div className="bg-gray-900/50 p-4 rounded-lg">
              <p className="text-gray-400 text-sm">Total Earned</p>
              <p className="text-2xl font-bold">{stats.totalEarned.toFixed(2)} USDC</p>
            </div>
          </div>
          
          <div className="bg-gray-900/50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Contribution Stats</h3>
            
            <div className="grid grid-cols-2 gap-y-3 text-sm">
              <div>
                <p className="text-gray-400">Tokens Processed</p>
                <p className="font-medium">{stats.tokensProcessed.toLocaleString()}</p>
              </div>
              
              <div>
                <p className="text-gray-400">Total Uptime</p>
                <p className="font-medium">{formatDuration(stats.uptime)}</p>
              </div>
              
              <div>
                <p className="text-gray-400">Reputation Score</p>
                <p className="font-medium">{stats.reputationScore}/100</p>
              </div>
              
              <div>
                <p className="text-gray-400">Models Hosted</p>
                <p className="font-medium">{stats.models.length}</p>
              </div>
            </div>
            
            <div className="mt-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-400">Reputation Score</span>
                <span className="text-xs">{stats.reputationScore}%</span>
              </div>
              <div className="w-full bg-gray-700/30 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${stats.reputationScore}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          {stats.models.length > 0 && (
            <div className="bg-gray-900/50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Hosted Models</h3>
              <div className="space-y-2">
                {stats.models.map((model, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                    <div className="truncate max-w-[70%]">
                      <p className="font-medium text-sm truncate">{model.modelId.split('/')[1] || model.modelId}</p>
                      <p className="text-xs text-gray-400">{model.modelId.split('/')[0]}</p>
                    </div>
                    <div className="text-sm">
                      <span className="px-2 py-1 bg-blue-900/30 text-blue-400 rounded">
                        {model.layersCount} layers
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <button
            onClick={handleClaimEarnings}
            disabled={isClaiming || stats.pendingEarnings <= 0}
            className={`w-full py-2 rounded-lg font-medium transition-colors ${
              stats.pendingEarnings <= 0
                ? 'bg-gray-600 cursor-not-allowed opacity-50'
                : 'bg-green-600 hover:bg-green-700'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isClaiming 
              ? 'Claiming...' 
              : stats.pendingEarnings <= 0 
                ? 'No Earnings to Claim' 
                : `Claim ${stats.pendingEarnings.toFixed(2)} USDC`}
          </button>
          
          <p className="text-xs text-gray-400 text-center">
            Earnings are calculated based on your contribution to the Petals network.
            Higher uptime and more tokens processed result in higher earnings.
          </p>
        </div>
      )}
    </div>
  );
}
