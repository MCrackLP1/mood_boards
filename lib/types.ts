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

export type CreateBoardInput = {
  title: string;
};

export type CreateItemInput = {
  board_id: number;
  type: 'note' | 'image';
  content: string;
  position_y: number;
  position_x: number;
};

export type UpdateItemInput = {
  content?: string;
  position_y?: number;
  position_x?: number;
};

