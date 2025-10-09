/**
 * Supabase database type definitions
 * Auto-generated types for type-safe database operations
 */

import { Color } from '@/types';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      boards: {
        Row: {
          id: string;
          title: string;
          created_at: number;
          updated_at: number;
          welcome_text: string;
          branding_enabled: boolean;
          password_hash: string | null;
          ambient_sound_url: string | null;
        };
        Insert: {
          id: string;
          title: string;
          created_at: number;
          updated_at: number;
          welcome_text: string;
          branding_enabled?: boolean;
          password_hash?: string | null;
          ambient_sound_url?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          created_at?: number;
          updated_at?: number;
          welcome_text?: string;
          branding_enabled?: boolean;
          password_hash?: string | null;
          ambient_sound_url?: string | null;
        };
      };
      board_items: {
        Row: {
          id: string;
          board_id: string;
          type: 'image' | 'note';
          section: 'inspiration' | 'location' | 'general' | null;
          order: number;
          created_at: number;
          src: string | null;
          palette: Color[] | null;
          text: string | null;
          meta: Json | null;
        };
        Insert: {
          id: string;
          board_id: string;
          type: 'image' | 'note';
          section?: 'inspiration' | 'location' | 'general' | null;
          order: number;
          created_at: number;
          src?: string | null;
          palette?: Color[] | null;
          text?: string | null;
          meta?: Json | null;
        };
        Update: {
          id?: string;
          board_id?: string;
          type?: 'image' | 'note';
          section?: 'inspiration' | 'location' | 'general' | null;
          order?: number;
          created_at?: number;
          src?: string | null;
          palette?: Color[] | null;
          text?: string | null;
          meta?: Json | null;
        };
      };
      library_folders: {
        Row: {
          id: string;
          name: string;
          icon: string;
          order: number;
          created_at: number;
        };
        Insert: {
          id: string;
          name: string;
          icon?: string;
          order: number;
          created_at: number;
        };
        Update: {
          id?: string;
          name?: string;
          icon?: string;
          order?: number;
          created_at?: number;
        };
      };
      library_assets: {
        Row: {
          id: string;
          folder_id: string;
          name: string;
          src: string;
          thumbnail_src: string | null;
          palette: Color[] | null;
          width: number;
          height: number;
          file_size: number;
          uploaded_at: number;
          tags: string[] | null;
        };
        Insert: {
          id: string;
          folder_id: string;
          name: string;
          src: string;
          thumbnail_src?: string | null;
          palette?: Color[] | null;
          width: number;
          height: number;
          file_size: number;
          uploaded_at: number;
          tags?: string[] | null;
        };
        Update: {
          id?: string;
          folder_id?: string;
          name?: string;
          src?: string;
          thumbnail_src?: string | null;
          palette?: Color[] | null;
          width?: number;
          height?: number;
          file_size?: number;
          uploaded_at?: number;
          tags?: string[] | null;
        };
      };
    };
  };
}

