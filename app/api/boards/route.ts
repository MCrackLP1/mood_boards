import { NextRequest, NextResponse } from 'next/server';
import { getBoards, createBoard } from '@/lib/db';
import { CreateBoardRequest } from '@/lib/types';

export async function GET() {
  try {
    const boards = await getBoards();
    return NextResponse.json(boards);
  } catch (error) {
    console.error('Error fetching boards:', error);
    return NextResponse.json(
      { error: 'Failed to fetch boards' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateBoardRequest = await request.json();

    if (!body.title || body.title.trim().length === 0) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    const board = await createBoard(body.title.trim());
    return NextResponse.json(board, { status: 201 });
  } catch (error) {
    console.error('Error creating board:', error);
    return NextResponse.json(
      { error: 'Failed to create board' },
      { status: 500 }
    );
  }
}
