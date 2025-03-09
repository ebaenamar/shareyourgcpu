'use client';

import { useState } from 'react';

interface TaskSubmissionFormProps {
  onSubmit: (formData: TaskSubmissionFormData) => void;
  resources: ComputeResource[];
}

export interface TaskSubmissionFormData {
  type: string;
  description: string;
  resourceId: string;
  cpuCores: number;
  gpuMemory: number;
  estimatedDuration: number;
}

interface ComputeResource {
  id: string;
  provider: string;
  location: string;
  cpuCores: number;
  gpuMemory: number;
  cpuPrice: number;
  gpuPrice: number;
}

export default function TaskSubmissionForm({ onSubmit, resources }: TaskSubmissionFormProps) {
  const [formData, setFormData] = useState<TaskSubmissionFormData>({
    type: 'ML Training',
    description: '',
    resourceId: resources.length > 0 ? resources[0].id : '',
    cpuCores: 2,
    gpuMemory: 4,
    estimatedDuration: 30
  });
  
  const [selectedResource, setSelectedResource] = useState<ComputeResource | null>(
    resources.length > 0 ? resources[0] : null
  );
  
  const taskTypes = [
    'ML Training',
    'Rendering',
    'Data Processing',
    'Scientific Computation',
    'Cryptocurrency Mining',
    'Video Encoding',
    'Other'
  ];
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
    
    // Update selected resource when resourceId changes
    if (name === 'resourceId') {
      const resource = resources.find(r => r.id === value) || null;
      setSelectedResource(resource);
      
      // Reset CPU and GPU values if they exceed the resource limits
      if (resource) {
        setFormData(prev => ({
          ...prev,
          cpuCores: Math.min(prev.cpuCores, resource.cpuCores),
          gpuMemory: Math.min(prev.gpuMemory, resource.gpuMemory)
        }));
      }
    }
  };
  
  const calculateEstimatedCost = () => {
    if (!selectedResource) return 0;
    
    const cpuCost = formData.cpuCores * (formData.estimatedDuration / 60) * selectedResource.cpuPrice;
    const gpuCost = formData.gpuMemory * (formData.estimatedDuration / 60) * selectedResource.gpuPrice;
    
    return cpuCost + gpuCost;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
      <h2 className="text-xl font-semibold mb-4">Submit Compute Task</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm mb-1" htmlFor="type">Task Type</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full p-2 bg-gray-900 border border-gray-700 rounded"
            required
          >
            {taskTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm mb-1" htmlFor="resourceId">Select Resource</label>
          <select
            id="resourceId"
            name="resourceId"
            value={formData.resourceId}
            onChange={handleChange}
            className="w-full p-2 bg-gray-900 border border-gray-700 rounded"
            required
          >
            {resources.length > 0 ? (
              resources.map(resource => (
                <option key={resource.id} value={resource.id}>
                  {resource.provider} - {resource.cpuCores} CPU, {resource.gpuMemory} GPU
                </option>
              ))
            ) : (
              <option value="" disabled>No resources available</option>
            )}
          </select>
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm mb-1" htmlFor="description">Task Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your compute task..."
            className="w-full p-2 bg-gray-900 border border-gray-700 rounded h-24"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm mb-1" htmlFor="cpuCores">
            CPU Cores (Max: {selectedResource?.cpuCores || 0})
          </label>
          <input
            id="cpuCores"
            name="cpuCores"
            type="number"
            min="1"
            max={selectedResource?.cpuCores || 1}
            step="1"
            value={formData.cpuCores}
            onChange={handleChange}
            className="w-full p-2 bg-gray-900 border border-gray-700 rounded"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm mb-1" htmlFor="gpuMemory">
            GPU Memory (GB) (Max: {selectedResource?.gpuMemory || 0})
          </label>
          <input
            id="gpuMemory"
            name="gpuMemory"
            type="number"
            min="0"
            max={selectedResource?.gpuMemory || 0}
            step="1"
            value={formData.gpuMemory}
            onChange={handleChange}
            className="w-full p-2 bg-gray-900 border border-gray-700 rounded"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm mb-1" htmlFor="estimatedDuration">Estimated Duration (minutes)</label>
          <input
            id="estimatedDuration"
            name="estimatedDuration"
            type="number"
            min="1"
            step="1"
            value={formData.estimatedDuration}
            onChange={handleChange}
            className="w-full p-2 bg-gray-900 border border-gray-700 rounded"
            required
          />
        </div>
        
        <div className="flex items-center">
          <div className="bg-gray-700/30 p-3 rounded-lg w-full">
            <div className="text-sm text-gray-400 mb-1">Estimated Cost</div>
            <div className="text-xl font-semibold">{calculateEstimatedCost().toFixed(6)} ETH</div>
            <div className="text-xs text-gray-400">
              ≈ ${(calculateEstimatedCost() * 3000).toFixed(2)} USD
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button 
          type="submit" 
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
          disabled={!selectedResource}
        >
          Submit Task
        </button>
      </div>
    </form>
  );
}
