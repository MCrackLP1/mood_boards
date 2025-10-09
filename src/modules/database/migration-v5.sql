-- Migration v5: Add new item types and board customization features
-- This migration adds support for:
-- - Links (Pinterest, Instagram, etc.)
-- - Checklists (Shooting todos)
-- - Timelines (Location/time planning)
-- - Custom sections
-- - Layout modes

-- 1. Alter boards table to add new fields
ALTER TABLE boards 
ADD COLUMN IF NOT EXISTS custom_sections JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS layout_mode VARCHAR(20) DEFAULT 'grid';

-- 2. Alter board_items table for new item types
-- First, drop the existing type constraint if it exists
ALTER TABLE board_items 
DROP CONSTRAINT IF EXISTS board_items_type_check;

-- Add new type values
ALTER TABLE board_items 
ADD CONSTRAINT board_items_type_check 
CHECK (type IN ('image', 'note', 'link', 'checklist', 'timeline'));

-- 3. Change section column from ENUM to VARCHAR for flexibility
-- First create a new column
ALTER TABLE board_items
ADD COLUMN IF NOT EXISTS section_new VARCHAR(100);

-- Copy existing data
UPDATE board_items SET section_new = section::text;

-- Drop old column and rename new one
ALTER TABLE board_items DROP COLUMN IF EXISTS section CASCADE;
ALTER TABLE board_items RENAME COLUMN section_new TO section;

-- 4. Add new columns for different item types
ALTER TABLE board_items
ADD COLUMN IF NOT EXISTS link_url TEXT,
ADD COLUMN IF NOT EXISTS link_preview JSONB,
ADD COLUMN IF NOT EXISTS checklist_items JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS timeline_items JSONB DEFAULT '[]';

-- 5. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_board_items_type ON board_items(type);
CREATE INDEX IF NOT EXISTS idx_board_items_section ON board_items(section);

-- 6. Set default layout mode for existing boards
UPDATE boards 
SET layout_mode = 'grid' 
WHERE layout_mode IS NULL;

-- 7. Initialize custom_sections as empty array for existing boards
UPDATE boards 
SET custom_sections = '[]'::jsonb 
WHERE custom_sections IS NULL;

-- 8. Comment on new columns for documentation
COMMENT ON COLUMN boards.custom_sections IS 'User-defined custom sections in JSONB format';
COMMENT ON COLUMN boards.layout_mode IS 'Layout preference: grid, masonry, or single-column';
COMMENT ON COLUMN board_items.link_url IS 'URL for link-type items';
COMMENT ON COLUMN board_items.link_preview IS 'Open Graph preview data for links';
COMMENT ON COLUMN board_items.checklist_items IS 'Array of checklist items with text and checked state';
COMMENT ON COLUMN board_items.timeline_items IS 'Array of timeline entries with time, location, and coordinates';

