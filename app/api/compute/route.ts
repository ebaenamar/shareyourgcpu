import { NextRequest, NextResponse } from 'next/server';

// Mock database for compute resources
let computeResources: any[] = [
  {
    id: 'resource-1',
    provider: 'CloudCompute',
    providerId: 'provider-1',
    location: 'North America',
    cpuCores: 8,
    gpuMemory: 16,
    cpuPrice: 0.0008,
    gpuPrice: 0.0045,
    availability: 95,
    rating: 4.8,
    status: 'active'
  },
  {
    id: 'resource-2',
    provider: 'GPUMaster',
    providerId: 'provider-2',
    location: 'Europe',
    cpuCores: 4,
    gpuMemory: 24,
    cpuPrice: 0.0005,
    gpuPrice: 0.0060,
    availability: 90,
    rating: 4.5,
    status: 'active'
  }
];

// GET handler to retrieve compute resources
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const providerId = searchParams.get('providerId');
  const resourceType = searchParams.get('type');
  
  let filteredResources = [...computeResources];
  
  // Filter by provider ID if provided
  if (providerId) {
    filteredResources = filteredResources.filter(resource => resource.providerId === providerId);
  }
  
  // Filter by resource type if provided
  if (resourceType) {
    if (resourceType === 'cpu') {
      filteredResources = filteredResources.filter(resource => resource.cpuCores > 0);
    } else if (resourceType === 'gpu') {
      filteredResources = filteredResources.filter(resource => resource.gpuMemory > 0);
    }
  }
  
  return NextResponse.json({ resources: filteredResources });
}

// POST handler to register a new compute resource
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['providerId', 'cpuCores', 'gpuMemory', 'cpuPrice', 'gpuPrice', 'location'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }
    
    // Create a new resource
    const newResource = {
      id: `resource-${Date.now()}`,
      provider: body.provider || 'Anonymous Provider',
      providerId: body.providerId,
      location: body.location,
      cpuCores: body.cpuCores,
      gpuMemory: body.gpuMemory,
      cpuPrice: body.cpuPrice,
      gpuPrice: body.gpuPrice,
      availability: body.availability || 100,
      rating: body.rating || 0,
      status: 'active',
      createdAt: new Date().toISOString()
    };
    
    // Add to the database
    computeResources.push(newResource);
    
    return NextResponse.json({ resource: newResource }, { status: 201 });
  } catch (error) {
    console.error('Error registering compute resource:', error);
    return NextResponse.json({ error: 'Failed to register compute resource' }, { status: 500 });
  }
}

// PUT handler to update a compute resource
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.id) {
      return NextResponse.json({ error: 'Resource ID is required' }, { status: 400 });
    }
    
    // Find the resource
    const resourceIndex = computeResources.findIndex(resource => resource.id === body.id);
    
    if (resourceIndex === -1) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
    }
    
    // Update the resource
    const updatedResource = {
      ...computeResources[resourceIndex],
      ...body,
      updatedAt: new Date().toISOString()
    };
    
    computeResources[resourceIndex] = updatedResource;
    
    return NextResponse.json({ resource: updatedResource });
  } catch (error) {
    console.error('Error updating compute resource:', error);
    return NextResponse.json({ error: 'Failed to update compute resource' }, { status: 500 });
  }
}

// DELETE handler to remove a compute resource
export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');
  
  if (!id) {
    return NextResponse.json({ error: 'Resource ID is required' }, { status: 400 });
  }
  
  // Find the resource
  const resourceIndex = computeResources.findIndex(resource => resource.id === id);
  
  if (resourceIndex === -1) {
    return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
  }
  
  // Remove the resource
  computeResources.splice(resourceIndex, 1);
  
  return NextResponse.json({ success: true });
}
