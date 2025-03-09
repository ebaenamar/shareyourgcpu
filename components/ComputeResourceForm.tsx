'use client';

import { useState } from 'react';

interface ComputeResourceFormProps {
  onSubmit: (formData: ComputeResourceFormData) => void;
  initialData?: ComputeResourceFormData;
}

export interface ComputeResourceFormData {
  provider: string;
  location: string;
  cpuCores: number;
  gpuMemory: number;
  cpuPrice: number;
  gpuPrice: number;
  availability: number;
}

export default function ComputeResourceForm({ onSubmit, initialData }: ComputeResourceFormProps) {
  const [formData, setFormData] = useState<ComputeResourceFormData>(initialData || {
    provider: '',
    location: 'North America',
    cpuCores: 4,
    gpuMemory: 0,
    cpuPrice: 0.001,
    gpuPrice: 0.01,
    availability: 100
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
      <h2 className="text-xl font-semibold mb-4">Resource Configuration</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm mb-1" htmlFor="provider">Provider Name</label>
          <input
            id="provider"
            name="provider"
            type="text"
            value={formData.provider}
            onChange={handleChange}
            placeholder="Your provider name"
            className="w-full p-2 bg-gray-900 border border-gray-700 rounded"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm mb-1" htmlFor="location">Location</label>
          <select
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full p-2 bg-gray-900 border border-gray-700 rounded"
            required
          >
            <option value="North America">North America</option>
            <option value="Europe">Europe</option>
            <option value="Asia">Asia</option>
            <option value="South America">South America</option>
            <option value="Africa">Africa</option>
            <option value="Oceania">Oceania</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm mb-1" htmlFor="cpuCores">CPU Cores</label>
          <input
            id="cpuCores"
            name="cpuCores"
            type="number"
            min="0"
            step="1"
            value={formData.cpuCores}
            onChange={handleChange}
            className="w-full p-2 bg-gray-900 border border-gray-700 rounded"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm mb-1" htmlFor="gpuMemory">GPU Memory (GB)</label>
          <input
            id="gpuMemory"
            name="gpuMemory"
            type="number"
            min="0"
            step="1"
            value={formData.gpuMemory}
            onChange={handleChange}
            className="w-full p-2 bg-gray-900 border border-gray-700 rounded"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm mb-1" htmlFor="cpuPrice">CPU Price (ETH per hour)</label>
          <input
            id="cpuPrice"
            name="cpuPrice"
            type="number"
            min="0"
            step="0.0001"
            value={formData.cpuPrice}
            onChange={handleChange}
            className="w-full p-2 bg-gray-900 border border-gray-700 rounded"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm mb-1" htmlFor="gpuPrice">GPU Price (ETH per hour)</label>
          <input
            id="gpuPrice"
            name="gpuPrice"
            type="number"
            min="0"
            step="0.0001"
            value={formData.gpuPrice}
            onChange={handleChange}
            className="w-full p-2 bg-gray-900 border border-gray-700 rounded"
            required
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm mb-1" htmlFor="availability">Availability (%)</label>
          <input
            id="availability"
            name="availability"
            type="range"
            min="0"
            max="100"
            step="5"
            value={formData.availability}
            onChange={handleChange}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
          <div className="text-center mt-2">
            Current: {formData.availability}%
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-400">
          Estimated Earnings: 
          <span className="text-white ml-1">
            {((formData.cpuCores * formData.cpuPrice) + (formData.gpuMemory * formData.gpuPrice)).toFixed(6)} ETH/hour
          </span>
        </div>
        <button 
          type="submit" 
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
        >
          Save Configuration
        </button>
      </div>
    </form>
  );
}
