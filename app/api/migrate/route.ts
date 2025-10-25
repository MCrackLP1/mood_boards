import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

// GET /api/migrate - Add time column to timeline_items
export async function GET() {
  try {
    // Add time column if it doesn't exist
    await sql`
      ALTER TABLE timeline_items 
      ADD COLUMN IF NOT EXISTS time VARCHAR(5)
    `;

    return NextResponse.json({ 
      success: true, 
      message: 'Migration completed successfully' 
    });
  } catch (error) {
    console.error('Error running migration:', error);
    return NextResponse.json(
      { error: 'Failed to run migration' },
      { status: 500 }
    );
  }
}

