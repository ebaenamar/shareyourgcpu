import { NextRequest, NextResponse } from 'next/server';

// Mock database for tasks
let tasks: any[] = [
  {
    id: 'task-1',
    type: 'ML Training',
    description: 'Train a machine learning model on image dataset',
    consumerId: 'consumer-1',
    resourceId: 'resource-1',
    providerId: 'provider-1',
    cpuCores: 4,
    gpuMemory: 8,
    status: 'completed',
    startTime: '2025-03-09T09:00:00Z',
    endTime: '2025-03-09T09:45:00Z',
    duration: '45 min',
    cpuPayment: 0.0010,
    gpuPayment: 0.0015,
    totalPayment: 0.0025,
    transactionHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
  },
  {
    id: 'task-2',
    type: 'Rendering',
    description: '3D scene rendering',
    consumerId: 'consumer-2',
    resourceId: 'resource-2',
    providerId: 'provider-2',
    cpuCores: 2,
    gpuMemory: 12,
    status: 'completed',
    startTime: '2025-03-09T08:00:00Z',
    endTime: '2025-03-09T08:30:00Z',
    duration: '30 min',
    cpuPayment: 0.0003,
    gpuPayment: 0.0015,
    totalPayment: 0.0018,
    transactionHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'
  },
  {
    id: 'task-3',
    type: 'Data Processing',
    description: 'Process large dataset',
    consumerId: 'consumer-1',
    resourceId: 'resource-1',
    providerId: 'provider-1',
    cpuCores: 8,
    gpuMemory: 0,
    status: 'completed',
    startTime: '2025-03-09T07:30:00Z',
    endTime: '2025-03-09T07:45:00Z',
    duration: '15 min',
    cpuPayment: 0.0008,
    gpuPayment: 0,
    totalPayment: 0.0008,
    transactionHash: '0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456'
  }
];

// GET handler to retrieve tasks
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const providerId = searchParams.get('providerId');
  const consumerId = searchParams.get('consumerId');
  const status = searchParams.get('status');
  
  let filteredTasks = [...tasks];
  
  // Filter by provider ID if provided
  if (providerId) {
    filteredTasks = filteredTasks.filter(task => task.providerId === providerId);
  }
  
  // Filter by consumer ID if provided
  if (consumerId) {
    filteredTasks = filteredTasks.filter(task => task.consumerId === consumerId);
  }
  
  // Filter by status if provided
  if (status) {
    filteredTasks = filteredTasks.filter(task => task.status === status);
  }
  
  return NextResponse.json({ tasks: filteredTasks });
}

// POST handler to create a new task
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['type', 'description', 'consumerId', 'resourceId', 'providerId', 'cpuCores', 'gpuMemory'];
    for (const field of requiredFields) {
      if (!body[field] && body[field] !== 0) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }
    
    // Create a new task
    const startTime = new Date().toISOString();
    const newTask = {
      id: `task-${Date.now()}`,
      type: body.type,
      description: body.description,
      consumerId: body.consumerId,
      resourceId: body.resourceId,
      providerId: body.providerId,
      cpuCores: body.cpuCores,
      gpuMemory: body.gpuMemory,
      status: 'pending',
      startTime,
      endTime: null,
      duration: null,
      cpuPayment: null,
      gpuPayment: null,
      totalPayment: null,
      transactionHash: null,
      createdAt: startTime
    };
    
    // Add to the database
    tasks.push(newTask);
    
    return NextResponse.json({ task: newTask }, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}

// PUT handler to update a task
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.id) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
    }
    
    // Find the task
    const taskIndex = tasks.findIndex(task => task.id === body.id);
    
    if (taskIndex === -1) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    
    // Calculate duration if task is being completed
    let updatedFields: any = { ...body };
    
    if (body.status === 'completed' && tasks[taskIndex].status !== 'completed') {
      const startTime = new Date(tasks[taskIndex].startTime);
      const endTime = new Date();
      const durationMs = endTime.getTime() - startTime.getTime();
      const durationMinutes = Math.round(durationMs / (1000 * 60));
      
      updatedFields = {
        ...updatedFields,
        endTime: endTime.toISOString(),
        duration: `${durationMinutes} min`
      };
    }
    
    // Update the task
    const updatedTask = {
      ...tasks[taskIndex],
      ...updatedFields,
      updatedAt: new Date().toISOString()
    };
    
    tasks[taskIndex] = updatedTask;
    
    return NextResponse.json({ task: updatedTask });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

// DELETE handler to remove a task
export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');
  
  if (!id) {
    return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
  }
  
  // Find the task
  const taskIndex = tasks.findIndex(task => task.id === id);
  
  if (taskIndex === -1) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }
  
  // Remove the task
  tasks.splice(taskIndex, 1);
  
  return NextResponse.json({ success: true });
}
