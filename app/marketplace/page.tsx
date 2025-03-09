'use client';

import { useState } from 'react';
import Link from 'next/link';

interface ComputeResource {
  id: string;
  provider: string;
  location: string;
  cpuCores: number;
  gpuMemory: number;
  cpuPrice: number;
  gpuPrice: number;
  availability: number;
  rating: number;
}

export default function Marketplace() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('price');
  
  // Mock data for available compute resources
  const [resources, setResources] = useState<ComputeResource[]>([
    {
      id: 'resource-1',
      provider: 'CloudCompute',
      location: 'North America',
      cpuCores: 8,
      gpuMemory: 16,
      cpuPrice: 0.0008,
      gpuPrice: 0.0045,
      availability: 95,
      rating: 4.8
    },
    {
      id: 'resource-2',
      provider: 'GPUMaster',
      location: 'Europe',
      cpuCores: 4,
      gpuMemory: 24,
      cpuPrice: 0.0005,
      gpuPrice: 0.0060,
      availability: 90,
      rating: 4.5
    },
    {
      id: 'resource-3',
      provider: 'ComputeNode',
      location: 'Asia',
      cpuCores: 16,
      gpuMemory: 8,
      cpuPrice: 0.0012,
      gpuPrice: 0.0030,
      availability: 98,
      rating: 4.9
    },
    {
      id: 'resource-4',
      provider: 'CPUCluster',
      location: 'North America',
      cpuCores: 32,
      gpuMemory: 0,
      cpuPrice: 0.0015,
      gpuPrice: 0,
      availability: 99,
      rating: 4.7
    },
    {
      id: 'resource-5',
      provider: 'RenderFarm',
      location: 'Europe',
      cpuCores: 12,
      gpuMemory: 48,
      cpuPrice: 0.0010,
      gpuPrice: 0.0080,
      availability: 85,
      rating: 4.6
    }
  ]);

  // Filter resources based on search term and filter type
  const filteredResources = resources.filter(resource => {
    const matchesSearch = 
      resource.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterType === 'all') return matchesSearch;
    if (filterType === 'cpu') return matchesSearch && resource.cpuCores > 0;
    if (filterType === 'gpu') return matchesSearch && resource.gpuMemory > 0;
    return matchesSearch;
  });

  // Sort resources based on sort criteria
  const sortedResources = [...filteredResources].sort((a, b) => {
    if (sortBy === 'price') {
      const aPrice = a.cpuPrice + a.gpuPrice;
      const bPrice = b.cpuPrice + b.gpuPrice;
      return aPrice - bPrice;
    }
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'availability') return b.availability - a.availability;
    return 0;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Compute Resource Marketplace</h1>
      
      {/* Search and Filter Section */}
      <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm mb-1">Search Resources</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by provider or location"
              className="w-full p-2 bg-gray-900 border border-gray-700 rounded"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Resource Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full p-2 bg-gray-900 border border-gray-700 rounded"
            >
              <option value="all">All Resources</option>
              <option value="cpu">CPU Only</option>
              <option value="gpu">GPU Only</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full p-2 bg-gray-900 border border-gray-700 rounded"
            >
              <option value="price">Price (Low to High)</option>
              <option value="rating">Rating (High to Low)</option>
              <option value="availability">Availability (High to Low)</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {sortedResources.map((resource) => (
          <div key={resource.id} className="bg-gray-800/30 rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold">{resource.provider}</h3>
              <div className="flex items-center">
                <span className="text-yellow-400 mr-1">★</span>
                <span>{resource.rating.toFixed(1)}</span>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between mb-1 text-sm">
                <span className="text-gray-400">Location:</span>
                <span>{resource.location}</span>
              </div>
              <div className="flex justify-between mb-1 text-sm">
                <span className="text-gray-400">Availability:</span>
                <span>{resource.availability}%</span>
              </div>
            </div>
            
            <div className="bg-gray-700/30 p-3 rounded-lg mb-4">
              <h4 className="text-sm font-medium mb-2">Compute Resources</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-blue-900/20 p-2 rounded">
                  <div className="text-xs text-gray-400">CPU Cores</div>
                  <div className="text-lg font-semibold">{resource.cpuCores}</div>
                  <div className="text-xs text-blue-400">{resource.cpuPrice.toFixed(4)} ETH/hr</div>
                </div>
                <div className="bg-purple-900/20 p-2 rounded">
                  <div className="text-xs text-gray-400">GPU Memory</div>
                  <div className="text-lg font-semibold">{resource.gpuMemory} GB</div>
                  <div className="text-xs text-purple-400">{resource.gpuPrice.toFixed(4)} ETH/hr</div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-sm">
                Rent Resources
              </button>
              <button className="px-3 py-2 border border-gray-600 hover:border-gray-500 rounded-lg">
                <span className="sr-only">Details</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Submit Resource Section */}
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Have Computing Resources to Share?</h2>
        <p className="text-lg mb-6 max-w-2xl mx-auto">
          List your CPU/GPU resources on our marketplace and start earning cryptocurrency rewards today.
        </p>
        <Link
          href="/dashboard"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors inline-block"
        >
          Register Your Resources
        </Link>
      </div>
    </div>
  );
}
