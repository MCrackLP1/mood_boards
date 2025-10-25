import { NextRequest, NextResponse } from 'next/server';
import { updateTimelineItem, deleteTimelineItem } from '@/lib/db';
import { UpdateItemRequest } from '@/lib/types';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const itemId = parseInt(params.id);
    const body: UpdateItemRequest = await request.json();

    if (isNaN(itemId)) {
      return NextResponse.json(
        { error: 'Invalid item ID' },
        { status: 400 }
      );
    }

    if (Object.keys(body).length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    const item = await updateTimelineItem(
      itemId,
      body.content,
      body.position_y,
      body.position_x
    );

    return NextResponse.json(item);
  } catch (error) {
    console.error('Error updating timeline item:', error);
    return NextResponse.json(
      { error: 'Failed to update timeline item' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const itemId = parseInt(params.id);

    if (isNaN(itemId)) {
      return NextResponse.json(
        { error: 'Invalid item ID' },
        { status: 400 }
      );
    }

    await deleteTimelineItem(itemId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting timeline item:', error);
    return NextResponse.json(
      { error: 'Failed to delete timeline item' },
      { status: 500 }
    );
  }
}
