'use client';

import { useState } from 'react';

interface ResourceCardProps {
  resource: ComputeResource;
  onSelect: (resourceId: string) => void;
}

export interface ComputeResource {
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

export default function ResourceCard({ resource, onSelect }: ResourceCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  
  const handleSelect = () => {
    onSelect(resource.id);
  };
  
  const getAvailabilityColor = (availability: number) => {
    if (availability >= 90) return 'text-green-400';
    if (availability >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };
  
  const getRatingStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="flex">
        {[...Array(fullStars)].map((_, i) => (
          <svg key={`full-${i}`} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        {hasHalfStar && (
          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" clipPath="inset(0 50% 0 0)" />
          </svg>
        ))}
        {[...Array(emptyStars)].map((_, i) => (
          <svg key={`empty-${i}`} className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-1 text-sm text-gray-400">{rating.toFixed(1)}</span>
      </div>
    );
  };
  
  return (
    <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">{resource.provider}</h3>
          <div className="flex items-center text-sm text-gray-400">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            {resource.location}
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className={`${getAvailabilityColor(resource.availability)} font-medium`}>
            {resource.availability}% Available
          </span>
          <div className="mt-1">
            {getRatingStars(resource.rating)}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-700/30 p-3 rounded-lg">
          <div className="text-sm text-gray-400 mb-1">CPU</div>
          <div className="flex justify-between items-baseline">
            <span className="text-lg font-semibold">{resource.cpuCores} Cores</span>
            <span className="text-sm">{resource.cpuPrice.toFixed(6)} ETH/hr</span>
          </div>
        </div>
        <div className="bg-gray-700/30 p-3 rounded-lg">
          <div className="text-sm text-gray-400 mb-1">GPU</div>
          <div className="flex justify-between items-baseline">
            <span className="text-lg font-semibold">{resource.gpuMemory} GB</span>
            <span className="text-sm">{resource.gpuPrice.toFixed(6)} ETH/hr</span>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <button 
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm text-blue-400 hover:text-blue-300"
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>
        <button 
          onClick={handleSelect}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
        >
          Select
        </button>
      </div>
      
      {showDetails && (
        <div className="mt-4 p-3 bg-gray-700/20 rounded-lg border border-gray-700 text-sm">
          <h4 className="font-medium mb-2">Resource Details</h4>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <div>
              <span className="text-gray-400">Provider ID:</span>
              <span className="ml-2 font-mono text-xs">{resource.providerId}</span>
            </div>
            <div>
              <span className="text-gray-400">Status:</span>
              <span className="ml-2 capitalize">{resource.status}</span>
            </div>
            <div>
              <span className="text-gray-400">CPU Price:</span>
              <span className="ml-2">{resource.cpuPrice.toFixed(6)} ETH/hr</span>
            </div>
            <div>
              <span className="text-gray-400">GPU Price:</span>
              <span className="ml-2">{resource.gpuPrice.toFixed(6)} ETH/hr</span>
            </div>
            <div className="col-span-2">
              <span className="text-gray-400">Estimated Cost (1 hour):</span>
              <span className="ml-2">
                {(resource.cpuCores * resource.cpuPrice + resource.gpuMemory * resource.gpuPrice).toFixed(6)} ETH
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
