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

    // Validate item exists first
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

    // Check if any fields are provided to update
    const hasUpdates = body.content !== undefined || 
                       body.position_y !== undefined || 
                       body.position_x !== undefined || 
                       body.width !== undefined || 
                       body.height !== undefined || 
                       body.time !== undefined;

    if (!hasUpdates) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    // Validate content if provided
    let updatedContent = currentItem.content;
    if (body.content !== undefined) {
      if (typeof body.content !== 'string') {
        return NextResponse.json(
          { error: 'content must be a string' },
          { status: 400 }
        );
      }
      const trimmedContent = body.content.trim();
      if (trimmedContent === '') {
        return NextResponse.json(
          { error: 'content cannot be empty' },
          { status: 400 }
        );
      }
      updatedContent = trimmedContent;
    }

    // Validate positions (round to integers for INTEGER column)
    let updatedPositionY = currentItem.position_y;
    let updatedPositionX = currentItem.position_x;
    if (body.position_y !== undefined) {
      const posY = Number(body.position_y);
      if (!Number.isFinite(posY)) {
        return NextResponse.json(
          { error: 'position_y must be a valid number' },
          { status: 400 }
        );
      }
      updatedPositionY = Math.round(posY);
    }
    if (body.position_x !== undefined) {
      const posX = Number(body.position_x);
      if (!Number.isFinite(posX)) {
        return NextResponse.json(
          { error: 'position_x must be a valid number' },
          { status: 400 }
        );
      }
      updatedPositionX = Math.round(posX);
    }

    // Validate dimensions
    let updatedWidth: number | null | undefined = currentItem.width;
    let updatedHeight: number | null | undefined = currentItem.height;
    if (body.width !== undefined) {
      if (body.width === null) {
        updatedWidth = null;
      } else {
        const width = Number(body.width);
        if (!Number.isFinite(width) || width <= 0 || width > 10000) {
          return NextResponse.json(
            { error: 'width must be a positive number between 1 and 10000' },
            { status: 400 }
          );
        }
        updatedWidth = width;
      }
    }
    if (body.height !== undefined) {
      if (body.height === null) {
        updatedHeight = null;
      } else {
        const height = Number(body.height);
        if (!Number.isFinite(height) || height <= 0 || height > 10000) {
          return NextResponse.json(
            { error: 'height must be a positive number between 1 and 10000' },
            { status: 400 }
          );
        }
        updatedHeight = height;
      }
    }

    // Validate time format
    let updatedTime: string | null | undefined = currentItem.time;
    if (body.time !== undefined) {
      if (body.time === null || body.time === '') {
        updatedTime = null;
      } else {
        if (typeof body.time !== 'string') {
          return NextResponse.json(
            { error: 'time must be a string in HH:MM format' },
            { status: 400 }
          );
        }
        const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeRegex.test(body.time)) {
          return NextResponse.json(
            { error: 'time must be in HH:MM format (24-hour)' },
            { status: 400 }
          );
        }
        updatedTime = body.time;
      }
    }

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
