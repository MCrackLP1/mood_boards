import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import type { TimelineItem, UpdateItemInput } from '@/lib/types';

type RouteContext = {
  params: Promise<{ id: string }>;
};

// PATCH /api/items/[id] - Update timeline item
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const itemId = parseInt(id);

    if (isNaN(itemId)) {
      return NextResponse.json(
        { error: 'Invalid item ID' },
        { status: 400 }
      );
    }

    const body: UpdateItemInput = await request.json();
    
    console.log('PATCH request body:', body);

    // Update with conditional fields
    // We'll use a more straightforward approach with Vercel Postgres
    const updates: string[] = [];
    
    if (body.content !== undefined) updates.push('content');
    if (body.position_y !== undefined) updates.push('position_y');
    if (body.position_x !== undefined) updates.push('position_x');
    if (body.width !== undefined) updates.push('width');
    if (body.height !== undefined) updates.push('height');
    if (body.time !== undefined) updates.push('time');

    if (updates.length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    // Fetch current item
    const currentResult = await sql<TimelineItem>`
      SELECT * FROM timeline_items WHERE id = ${itemId}
    `;

    if (currentResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    const currentItem = currentResult.rows[0];

    // Merge updates with current values
    const updatedContent = body.content ?? currentItem.content;
    const updatedPositionY = body.position_y ?? currentItem.position_y;
    const updatedPositionX = body.position_x ?? currentItem.position_x;
    const updatedWidth = body.width ?? currentItem.width;
    const updatedHeight = body.height ?? currentItem.height;
    const updatedTime = body.time !== undefined ? body.time : currentItem.time;

    // Update with merged values
    const result = await sql<TimelineItem>`
      UPDATE timeline_items 
      SET 
        content = ${updatedContent},
        position_y = ${updatedPositionY},
        position_x = ${updatedPositionX},
        width = ${updatedWidth},
        height = ${updatedHeight},
        time = ${updatedTime}
      WHERE id = ${itemId}
      RETURNING *
    `;

    console.log('Update result:', result.rows[0]);

    return NextResponse.json({ item: result.rows[0] });
  } catch (error) {
    console.error('Error updating item:', error);
    return NextResponse.json(
      { error: 'Failed to update item', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// DELETE /api/items/[id] - Delete timeline item
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const itemId = parseInt(id);

    if (isNaN(itemId)) {
      return NextResponse.json(
        { error: 'Invalid item ID' },
        { status: 400 }
      );
    }

    await sql`DELETE FROM timeline_items WHERE id = ${itemId}`;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting item:', error);
    return NextResponse.json(
      { error: 'Failed to delete item' },
      { status: 500 }
    );
  }
}
