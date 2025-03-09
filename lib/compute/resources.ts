/**
 * Utility functions for compute resource management
 */

// Interface for compute resource
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
  createdAt?: string;
  updatedAt?: string;
}

// Interface for compute usage metrics
export interface ComputeUsageMetrics {
  taskId: string;
  providerId: string;
  cpuCores: number;
  cpuSeconds: number;
  gpuMemory: number;
  gpuSeconds: number;
  startTime: string;
  endTime: string;
}

/**
 * Calculate the estimated cost for using compute resources
 * @param cpuCores Number of CPU cores
 * @param cpuHours Hours of CPU usage
 * @param cpuPrice Price per CPU core per hour
 * @param gpuMemory GPU memory in GB
 * @param gpuHours Hours of GPU usage
 * @param gpuPrice Price per GB of GPU memory per hour
 * @returns Estimated cost in ETH
 */
export function calculateEstimatedCost(
  cpuCores: number,
  cpuHours: number,
  cpuPrice: number,
  gpuMemory: number,
  gpuHours: number,
  gpuPrice: number
): number {
  const cpuCost = cpuCores * cpuHours * cpuPrice;
  const gpuCost = gpuMemory * gpuHours * gpuPrice;
  
  return cpuCost + gpuCost;
}

/**
 * Calculate the actual cost based on usage metrics
 * @param metrics Compute usage metrics
 * @param cpuPrice Price per CPU core per second
 * @param gpuPrice Price per GB of GPU memory per second
 * @returns Actual cost in ETH
 */
export function calculateActualCost(
  metrics: ComputeUsageMetrics,
  cpuPrice: number,
  gpuPrice: number
): { cpuCost: number; gpuCost: number; totalCost: number } {
  const cpuCost = metrics.cpuCores * metrics.cpuSeconds * cpuPrice;
  const gpuCost = metrics.gpuMemory * metrics.gpuSeconds * gpuPrice;
  const totalCost = cpuCost + gpuCost;
  
  return { cpuCost, gpuCost, totalCost };
}

/**
 * Check if a resource has sufficient capacity for a task
 * @param resource Compute resource
 * @param requiredCpuCores Required CPU cores
 * @param requiredGpuMemory Required GPU memory
 * @returns Whether the resource has sufficient capacity
 */
export function hasResourceCapacity(
  resource: ComputeResource,
  requiredCpuCores: number,
  requiredGpuMemory: number
): boolean {
  return (
    resource.cpuCores >= requiredCpuCores &&
    resource.gpuMemory >= requiredGpuMemory &&
    resource.status === 'active'
  );
}

/**
 * Calculate the duration between two timestamps in seconds
 * @param startTime Start timestamp
 * @param endTime End timestamp
 * @returns Duration in seconds
 */
export function calculateDurationSeconds(startTime: string, endTime: string): number {
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  
  return Math.floor((end - start) / 1000);
}

/**
 * Format duration in seconds to a human-readable string
 * @param seconds Duration in seconds
 * @returns Formatted duration string
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds} sec`;
  }
  
  const minutes = Math.floor(seconds / 60);
  
  if (minutes < 60) {
    return `${minutes} min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours} hr`;
  }
  
  return `${hours} hr ${remainingMinutes} min`;
}
