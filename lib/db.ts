import { sql } from '@vercel/postgres';

export interface Board {
  id: number;
  title: string;
  created_at: Date;
  updated_at: Date;
}

export interface TimelineItem {
  id: number;
  board_id: number;
  type: 'note' | 'image';
  content: string;
  position_y: number;
  position_x: number;
  created_at: Date;
}

// Initialize database tables
export async function initDatabase() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS boards (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS timeline_items (
        id SERIAL PRIMARY KEY,
        board_id INTEGER REFERENCES boards(id) ON DELETE CASCADE,
        type VARCHAR(10) NOT NULL CHECK (type IN ('note', 'image')),
        content TEXT NOT NULL,
        position_y INTEGER DEFAULT 0,
        position_x INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// Boards operations
export async function getBoards(): Promise<Board[]> {
  const { rows } = await sql`SELECT * FROM boards ORDER BY updated_at DESC`;
  return rows as Board[];
}

export async function getBoard(id: number): Promise<Board | null> {
  const { rows } = await sql`SELECT * FROM boards WHERE id = ${id}`;
  return rows[0] as Board || null;
}

export async function createBoard(title: string): Promise<Board> {
  const { rows } = await sql`
    INSERT INTO boards (title, updated_at)
    VALUES (${title}, NOW())
    RETURNING *
  `;
  return rows[0] as Board;
}

export async function updateBoard(id: number, title: string): Promise<Board> {
  const { rows } = await sql`
    UPDATE boards
    SET title = ${title}, updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;
  return rows[0] as Board;
}

export async function deleteBoard(id: number): Promise<void> {
  await sql`DELETE FROM boards WHERE id = ${id}`;
}

// Timeline items operations
export async function getTimelineItems(boardId: number): Promise<TimelineItem[]> {
  const { rows } = await sql`
    SELECT * FROM timeline_items
    WHERE board_id = ${boardId}
    ORDER BY position_y ASC, position_x ASC
  `;
  return rows as TimelineItem[];
}

export async function createTimelineItem(
  boardId: number,
  type: 'note' | 'image',
  content: string,
  positionY: number = 0,
  positionX: number = 0
): Promise<TimelineItem> {
  const { rows } = await sql`
    INSERT INTO timeline_items (board_id, type, content, position_y, position_x)
    VALUES (${boardId}, ${type}, ${content}, ${positionY}, ${positionX})
    RETURNING *
  `;
  return rows[0] as TimelineItem;
}

export async function updateTimelineItem(
  id: number,
  content?: string,
  positionY?: number,
  positionX?: number
): Promise<TimelineItem> {
  let query = 'UPDATE timeline_items SET ';
  const updates: string[] = [];
  const values: any[] = [];

  if (content !== undefined) {
    updates.push(`content = $${updates.length + 1}`);
    values.push(content);
  }
  if (positionY !== undefined) {
    updates.push(`position_y = $${updates.length + 1}`);
    values.push(positionY);
  }
  if (positionX !== undefined) {
    updates.push(`position_x = $${updates.length + 1}`);
    values.push(positionX);
  }

  if (updates.length === 0) {
    throw new Error('No fields to update');
  }

  query += updates.join(', ') + ` WHERE id = $${updates.length + 1} RETURNING *`;
  values.push(id);

  const { rows } = await sql.unsafe(query, values);
  return rows[0] as TimelineItem;
}

export async function deleteTimelineItem(id: number): Promise<void> {
  await sql`DELETE FROM timeline_items WHERE id = ${id}`;
}
