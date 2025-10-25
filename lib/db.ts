import { sql } from '@vercel/postgres';

export async function initDatabase() {
  try {
    // Create boards table
    await sql`
      CREATE TABLE IF NOT EXISTS boards (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Create timeline_items table
    await sql`
      CREATE TABLE IF NOT EXISTS timeline_items (
        id SERIAL PRIMARY KEY,
        board_id INTEGER NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
        type VARCHAR(10) NOT NULL CHECK (type IN ('note', 'image')),
        content TEXT NOT NULL,
        position_y INTEGER NOT NULL DEFAULT 0,
        position_x INTEGER NOT NULL DEFAULT 0,
        width INTEGER,
        height INTEGER,
        time VARCHAR(5),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    console.log('Database tables created successfully');
  } catch (error) {
    console.error('Error creating database tables:', error);
    throw error;
  }
}

// Export sql for direct queries
export { sql };

