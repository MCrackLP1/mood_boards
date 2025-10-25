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
    
    // Build dynamic update query
    const updates: string[] = [];
    const values: (string | number)[] = [];
    let valueIndex = 1;

    if (body.content !== undefined) {
      updates.push(`content = $${valueIndex++}`);
      values.push(body.content);
    }
    if (body.position_y !== undefined) {
      updates.push(`position_y = $${valueIndex++}`);
      values.push(body.position_y);
    }
    if (body.position_x !== undefined) {
      updates.push(`position_x = $${valueIndex++}`);
      values.push(body.position_x);
    }
    if (body.width !== undefined) {
      updates.push(`width = $${valueIndex++}`);
      values.push(body.width);
    }
    if (body.height !== undefined) {
      updates.push(`height = $${valueIndex++}`);
      values.push(body.height);
    }
    if (body.time !== undefined) {
      updates.push(`time = $${valueIndex++}`);
      values.push(body.time);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    values.push(itemId);
    const query = `
      UPDATE timeline_items 
      SET ${updates.join(', ')}
      WHERE id = $${valueIndex}
      RETURNING *
    `;

    const result = await sql.query<TimelineItem>(query, values);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ item: result.rows[0] });
  } catch (error) {
    console.error('Error updating item:', error);
    return NextResponse.json(
      { error: 'Failed to update item' },
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

