'use client';

import { useState } from 'react';

interface TaskListProps {
  tasks: Task[];
  onViewTask?: (taskId: string) => void;
}

export interface Task {
  id: string;
  type: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startTime: string;
  endTime?: string;
  duration?: string;
  cpuCores: number;
  gpuMemory: number;
  totalPayment?: number;
  providerId?: string;
  provider?: string;
}

export default function TaskList({ tasks, onViewTask }: TaskListProps) {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  
  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'active') return ['pending', 'running'].includes(task.status);
    if (filter === 'completed') return ['completed', 'failed'].includes(task.status);
    return true;
  });
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'running': return 'bg-blue-500/20 text-blue-400';
      case 'completed': return 'bg-green-500/20 text-green-400';
      case 'failed': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };
  
  return (
    <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Tasks</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-full text-sm ${filter === 'all' ? 'bg-blue-600' : 'bg-gray-700/50 hover:bg-gray-700'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-3 py-1 rounded-full text-sm ${filter === 'active' ? 'bg-blue-600' : 'bg-gray-700/50 hover:bg-gray-700'}`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1 rounded-full text-sm ${filter === 'completed' ? 'bg-blue-600' : 'bg-gray-700/50 hover:bg-gray-700'}`}
          >
            Completed
          </button>
        </div>
      </div>
      
      {filteredTasks.length > 0 ? (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {filteredTasks.map(task => (
            <div 
              key={task.id} 
              className="p-4 bg-gray-700/20 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer"
              onClick={() => onViewTask && onViewTask(task.id)}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium">{task.type}</h3>
                  <p className="text-sm text-gray-400 truncate max-w-md">{task.description}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(task.status)}`}>
                  {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                </span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                <div>
                  <div className="text-gray-400">Started</div>
                  <div>{formatDate(task.startTime)}</div>
                </div>
                <div>
                  <div className="text-gray-400">Duration</div>
                  <div>{task.duration || 'In progress'}</div>
                </div>
                <div>
                  <div className="text-gray-400">Resources</div>
                  <div>{task.cpuCores} CPU, {task.gpuMemory} GPU</div>
                </div>
                <div>
                  <div className="text-gray-400">Payment</div>
                  <div>{task.totalPayment ? `${task.totalPayment.toFixed(6)} ETH` : 'Pending'}</div>
                </div>
              </div>
              
              {task.provider && (
                <div className="mt-2 text-xs text-gray-400">
                  Provider: {task.provider}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400">
          No {filter !== 'all' ? filter : ''} tasks found
        </div>
      )}
    </div>
  );
}
