'use client';

import { useState, useEffect } from 'react';
import { 
  PetalsModelInfo, 
  getAvailableModels, 
  startHostingModel, 
  stopHostingModel,
  getNodeStats,
  PetalsNodeStats
} from '../lib/petals/client';

interface PetalsModelHostingProps {
  isProviding: boolean;
  onToggleProviding: (modelId: string | null) => void;
}

export default function PetalsModelHosting({ isProviding, onToggleProviding }: PetalsModelHostingProps) {
  const [availableModels, setAvailableModels] = useState<PetalsModelInfo[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [gpuMemory, setGpuMemory] = useState<number>(4); // Default 4GB
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [nodeStats, setNodeStats] = useState<PetalsNodeStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch available models on component mount
  useEffect(() => {
    async function fetchModels() {
      try {
        const models = await getAvailableModels();
        setAvailableModels(models);
        if (models.length > 0) {
          setSelectedModel(models[0].id);
        }
      } catch (err) {
        console.error('Failed to fetch models:', err);
        setError('Failed to load available models');
      }
    }
    
    fetchModels();
  }, []);

  // Fetch node stats when providing
  useEffect(() => {
    if (!isProviding) {
      setNodeStats(null);
      return;
    }

    const fetchStats = async () => {
      try {
        const stats = await getNodeStats();
        setNodeStats(stats);
      } catch (err) {
        console.error('Failed to fetch node stats:', err);
      }
    };

    // Initial fetch
    fetchStats();
    
    // Set up interval for regular updates
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, [isProviding]);

  const handleStartHosting = async () => {
    if (!selectedModel) {
      setError('Please select a model to host');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const success = await startHostingModel(selectedModel, gpuMemory);
      if (success) {
        onToggleProviding(selectedModel);
      } else {
        setError('Failed to start hosting model');
      }
    } catch (err) {
      console.error('Error starting model hosting:', err);
      setError('An error occurred while starting model hosting');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStopHosting = async () => {
    setIsLoading(true);
    
    try {
      const success = await stopHostingModel();
      if (success) {
        onToggleProviding(null);
      } else {
        setError('Failed to stop hosting model');
      }
    } catch (err) {
      console.error('Error stopping model hosting:', err);
      setError('An error occurred while stopping model hosting');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Petals Model Hosting</h2>
        {isProviding && (
          <span className="px-3 py-1 rounded-full text-sm bg-green-500/20 text-green-400">
            Active
          </span>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-300 text-sm">
          {error}
        </div>
      )}

      {isProviding && nodeStats ? (
        <div className="space-y-4">
          <div className="p-4 bg-gray-900/50 rounded-lg">
            <h3 className="font-medium mb-2">Hosting Status</h3>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-400">Model</p>
                <p className="font-medium truncate">
                  {availableModels.find(m => m.id === nodeStats.modelId)?.name || nodeStats.modelId}
                </p>
              </div>
              
              <div>
                <p className="text-gray-400">Layers Hosted</p>
                <p className="font-medium">{nodeStats.layersHosted.join(', ')}</p>
              </div>
              
              <div>
                <p className="text-gray-400">Requests Served</p>
                <p className="font-medium">{nodeStats.requestsServed.toLocaleString()}</p>
              </div>
              
              <div>
                <p className="text-gray-400">Tokens Processed</p>
                <p className="font-medium">{nodeStats.tokensProcessed.toLocaleString()}</p>
              </div>
              
              <div>
                <p className="text-gray-400">Performance</p>
                <p className="font-medium">{nodeStats.performance.toFixed(1)} tokens/sec</p>
              </div>
              
              <div>
                <p className="text-gray-400">Reputation Score</p>
                <p className="font-medium">{nodeStats.reputationScore}/100</p>
              </div>
              
              <div>
                <p className="text-gray-400">Uptime</p>
                <p className="font-medium">
                  {Math.floor(nodeStats.uptime / 3600)}h {Math.floor((nodeStats.uptime % 3600) / 60)}m
                </p>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm">Contribution Level</span>
                <span className="text-sm">{nodeStats.reputationScore}%</span>
              </div>
              <div className="w-full bg-gray-700/30 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${nodeStats.reputationScore}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleStopHosting}
            disabled={isLoading}
            className="w-full py-2 rounded-lg font-medium bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Stopping...' : 'Stop Hosting Model'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Select Model to Host</label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              disabled={isLoading || isProviding}
              className="w-full p-2 bg-gray-900 border border-gray-700 rounded"
            >
              {availableModels.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name} ({model.parameterCount}) - {model.contributors} contributors
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm mb-1">GPU Memory to Contribute (GB)</label>
            <input
              type="number"
              value={gpuMemory}
              onChange={(e) => setGpuMemory(Math.max(1, parseInt(e.target.value) || 1))}
              min={1}
              disabled={isLoading || isProviding}
              className="w-full p-2 bg-gray-900 border border-gray-700 rounded"
            />
          </div>
          
          <div className="p-3 bg-blue-900/20 border border-blue-800 rounded-lg text-sm">
            <p className="text-blue-300 mb-1">Why host a model?</p>
            <p className="text-gray-300">
              By hosting model layers, you contribute to the Petals network and earn USDC rewards based on your contribution. 
              The more GPU memory you provide and the longer your uptime, the more you earn.
            </p>
          </div>
          
          <button
            onClick={handleStartHosting}
            disabled={isLoading || !selectedModel}
            className="w-full py-2 rounded-lg font-medium bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Starting...' : 'Start Hosting Model'}
          </button>
        </div>
      )}
    </div>
  );
}
