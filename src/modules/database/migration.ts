/**
 * Migration utility to transfer data from IndexedDB to Supabase
 * Run this once to migrate existing local data to the cloud
 */

import { db } from './db';
import { supabase } from './supabase';

export interface MigrationResult {
  success: boolean;
  boards: number;
  items: number;
  folders: number;
  assets: number;
  errors: string[];
}

export async function migrateToSupabase(): Promise<MigrationResult> {
  const result: MigrationResult = {
    success: true,
    boards: 0,
    items: 0,
    folders: 0,
    assets: 0,
    errors: [],
  };

  console.log('🚀 Starting migration from IndexedDB to Supabase...');

  try {
    // 1. Migrate folders
    console.log('📁 Migrating folders...');
    const folders = await db.libraryFolders.toArray();
    for (const folder of folders) {
      try {
        const { error } = await supabase.from('library_folders').upsert({
          id: folder.id,
          name: folder.name,
          icon: folder.icon,
          order: folder.order,
          created_at: folder.createdAt,
        });

        if (error) throw error;
        result.folders++;
      } catch (error: any) {
        result.errors.push(`Folder ${folder.id}: ${error.message}`);
      }
    }
    console.log(`✅ Migrated ${result.folders} folders`);

    // 2. Migrate assets
    console.log('🖼️ Migrating assets...');
    const assets = await db.libraryAssets.toArray();
    for (const asset of assets) {
      try {
        const { error } = await supabase.from('library_assets').upsert({
          id: asset.id,
          folder_id: asset.folderId,
          name: asset.name,
          src: asset.src,
          thumbnail_src: asset.thumbnailSrc,
          palette: asset.palette as any,
          width: asset.width,
          height: asset.height,
          file_size: asset.fileSize,
          uploaded_at: asset.uploadedAt,
          tags: asset.tags,
        });

        if (error) throw error;
        result.assets++;
      } catch (error: any) {
        result.errors.push(`Asset ${asset.id}: ${error.message}`);
      }
    }
    console.log(`✅ Migrated ${result.assets} assets`);

    // 3. Migrate boards
    console.log('📋 Migrating boards...');
    const boards = await db.boards.toArray();
    for (const board of boards) {
      try {
        const { error } = await supabase.from('boards').upsert({
          id: board.id,
          title: board.title,
          created_at: board.createdAt,
          updated_at: board.updatedAt,
          welcome_text: board.welcomeText,
          branding_enabled: board.brandingEnabled,
          password_hash: board.passwordHash,
          ambient_sound_url: board.ambientSoundUrl,
        });

        if (error) throw error;
        result.boards++;
      } catch (error: any) {
        result.errors.push(`Board ${board.id}: ${error.message}`);
      }
    }
    console.log(`✅ Migrated ${result.boards} boards`);

    // 4. Migrate board items
    console.log('📝 Migrating board items...');
    const items = await db.items.toArray();
    for (const item of items) {
      try {
        const { error } = await supabase.from('board_items').upsert({
          id: item.id,
          board_id: item.boardId,
          type: item.type,
          section: item.section,
          order: item.order,
          created_at: item.createdAt,
          src: item.src,
          palette: item.palette as any,
          text: item.text,
          meta: item.meta as any,
        });

        if (error) throw error;
        result.items++;
      } catch (error: any) {
        result.errors.push(`Item ${item.id}: ${error.message}`);
      }
    }
    console.log(`✅ Migrated ${result.items} board items`);

    if (result.errors.length > 0) {
      console.warn(`⚠️ Migration completed with ${result.errors.length} errors`);
      result.success = false;
    } else {
      console.log('✨ Migration completed successfully!');
    }

    return result;
  } catch (error: any) {
    console.error('❌ Migration failed:', error);
    result.success = false;
    result.errors.push(`Fatal error: ${error.message}`);
    return result;
  }
}

/**
 * Clear all local IndexedDB data (use after successful migration)
 */
export async function clearLocalData(): Promise<void> {
  console.log('🗑️ Clearing local IndexedDB data...');
  await db.boards.clear();
  await db.items.clear();
  await db.libraryFolders.clear();
  await db.libraryAssets.clear();
  console.log('✅ Local data cleared');
}

