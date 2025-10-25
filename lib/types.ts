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
  width?: number;
  height?: number;
  time?: string; // Uhrzeit im Format HH:MM
  created_at: Date;
}

export type CreateBoardInput = {
  title: string;
};

export type CreateItemInput = {
  board_id: number;
  type: 'note' | 'image';
  content: string;
  position_y: number;
  position_x: number;
  width?: number;
  height?: number;
  time?: string;
};

export type UpdateItemInput = {
  content?: string;
  position_y?: number;
  position_x?: number;
  width?: number;
  height?: number;
  time?: string;
};

