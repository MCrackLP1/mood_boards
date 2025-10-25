import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import type { Board, CreateBoardInput } from '@/lib/types';

// GET /api/boards - Get all boards
export async function GET() {
  try {
    const result = await sql<Board>`
      SELECT * FROM boards 
      ORDER BY updated_at DESC
    `;
    
    return NextResponse.json({ boards: result.rows });
  } catch (error) {
    console.error('Error fetching boards:', error);
    return NextResponse.json(
      { error: 'Failed to fetch boards' },
      { status: 500 }
    );
  }
}

// POST /api/boards - Create new board
export async function POST(request: NextRequest) {
  try {
    const body: CreateBoardInput = await request.json();
    
    if (!body.title || body.title.trim() === '') {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    const result = await sql<Board>`
      INSERT INTO boards (title)
      VALUES (${body.title})
      RETURNING *
    `;

    return NextResponse.json({ board: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Error creating board:', error);
    return NextResponse.json(
      { error: 'Failed to create board' },
      { status: 500 }
    );
  }
}

