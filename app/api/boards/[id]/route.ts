import { NextRequest, NextResponse } from 'next/server';
import { getBoard, getTimelineItems, updateBoard, deleteBoard } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const boardId = parseInt(params.id);

    if (isNaN(boardId)) {
      return NextResponse.json(
        { error: 'Invalid board ID' },
        { status: 400 }
      );
    }

    const [board, items] = await Promise.all([
      getBoard(boardId),
      getTimelineItems(boardId)
    ]);

    if (!board) {
      return NextResponse.json(
        { error: 'Board not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...board,
      items
    });
  } catch (error) {
    console.error('Error fetching board:', error);
    return NextResponse.json(
      { error: 'Failed to fetch board' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const boardId = parseInt(params.id);
    const body = await request.json();

    if (isNaN(boardId)) {
      return NextResponse.json(
        { error: 'Invalid board ID' },
        { status: 400 }
      );
    }

    if (!body.title || body.title.trim().length === 0) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    const board = await updateBoard(boardId, body.title.trim());
    return NextResponse.json(board);
  } catch (error) {
    console.error('Error updating board:', error);
    return NextResponse.json(
      { error: 'Failed to update board' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const boardId = parseInt(params.id);

    if (isNaN(boardId)) {
      return NextResponse.json(
        { error: 'Invalid board ID' },
        { status: 400 }
      );
    }

    await deleteBoard(boardId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting board:', error);
    return NextResponse.json(
      { error: 'Failed to delete board' },
      { status: 500 }
    );
  }
}
