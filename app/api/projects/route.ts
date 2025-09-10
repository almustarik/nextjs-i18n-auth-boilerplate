import { type NextRequest, NextResponse } from 'next/server';
import { getServerAuthSession } from '@/lib/auth';
import { mockProjects } from '@/mocks/data/projects';
import type { ApiResult, Paginated } from '@/types/common';
import type { CreateProjectRequest } from '@/types/api';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerAuthSession();

    if (!session?.user) {
      return NextResponse.json<ApiResult<null>>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get('page') || '1');
    const limit = Number.parseInt(searchParams.get('limit') || '10');

    const userProjects = mockProjects.filter(
      (p) => p.userId === session.user.id
    );
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProjects = userProjects.slice(startIndex, endIndex);

    const result: Paginated<(typeof paginatedProjects)[0]> = {
      data: paginatedProjects,
      total: userProjects.length,
      page,
      limit,
      totalPages: Math.ceil(userProjects.length / limit),
    };

    return NextResponse.json<ApiResult<typeof result>>({
      success: true,
      data: result,
    });
  } catch (error) {
    return NextResponse.json<ApiResult<null>>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerAuthSession();

    if (!session?.user) {
      return NextResponse.json<ApiResult<null>>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body: CreateProjectRequest = await request.json();

    const newProject = {
      id: `project-${Date.now()}`,
      ...body,
      status: 'active' as const,
      userId: session.user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockProjects.push(newProject);

    return NextResponse.json<ApiResult<typeof newProject>>(
      {
        success: true,
        data: newProject,
        message: 'Project created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json<ApiResult<null>>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
