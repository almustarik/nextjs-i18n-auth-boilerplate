import { type NextRequest, NextResponse } from 'next/server';
import { getServerAuthSession } from '@/lib/auth';
import { mockNotifications } from '@/mocks/data/notifications';
import type { ApiResult } from '@/types/common';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerAuthSession();

    if (!session?.user) {
      return NextResponse.json<ApiResult<null>>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;
    const notificationIndex = mockNotifications.findIndex(
      (n) => n.id === id && n.userId === session.user.id
    );

    if (notificationIndex === -1) {
      return NextResponse.json<ApiResult<null>>(
        { success: false, error: 'Notification not found' },
        { status: 404 }
      );
    }

    mockNotifications[notificationIndex] = {
      ...mockNotifications[notificationIndex],
      read: true,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json<
      ApiResult<(typeof mockNotifications)[notificationIndex]>
    >({
      success: true,
      data: mockNotifications[notificationIndex],
      message: 'Notification marked as read',
    });
  } catch (error) {
    return NextResponse.json<ApiResult<null>>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
