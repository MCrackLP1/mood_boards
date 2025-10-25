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

export interface CreateBoardRequest {
  title: string;
}

export interface UpdateItemRequest {
  content?: string;
  position_y?: number;
  position_x?: number;
}

export interface CreateItemRequest {
  type: 'note' | 'image';
  content: string;
  position_y?: number;
  position_x?: number;
}
