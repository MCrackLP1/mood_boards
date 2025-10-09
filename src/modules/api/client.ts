/**
 * API Client
 * Handles all communication with the backend server
 */

import { apiUrl } from './config';
import type { Board, BoardItem } from '@/types';
import type { LibraryAsset } from '@/modules/library/types';
import type { LibraryFolder } from '@/modules/library/folderTypes';

// Helper for API requests
async function apiRequest<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
}

// Boards API
export const boardsApi = {
  getAll: () => apiRequest<Board[]>(apiUrl('/boards')),
  
  getById: (id: string) => apiRequest<Board>(apiUrl(`/boards/${id}`)),
  
  create: (title: string) => 
    apiRequest<Board>(apiUrl('/boards'), {
      method: 'POST',
      body: JSON.stringify({ title }),
    }),
  
  update: (id: string, updates: Partial<Board>) =>
    apiRequest<Board>(apiUrl(`/boards/${id}`), {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),
  
  delete: (id: string) =>
    apiRequest<{ success: boolean }>(apiUrl(`/boards/${id}`), {
      method: 'DELETE',
    }),
  
  duplicate: (id: string) =>
    apiRequest<Board>(apiUrl(`/boards/${id}/duplicate`), {
      method: 'POST',
    }),
};

// Items API
export const itemsApi = {
  getByBoardId: (boardId: string) =>
    apiRequest<BoardItem[]>(apiUrl(`/items/board/${boardId}`)),
  
  create: (item: Omit<BoardItem, 'id' | 'createdAt' | 'order'>) =>
    apiRequest<BoardItem>(apiUrl('/items'), {
      method: 'POST',
      body: JSON.stringify(item),
    }),
  
  update: (id: string, updates: Partial<BoardItem>) =>
    apiRequest<BoardItem>(apiUrl(`/items/${id}`), {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),
  
  delete: (id: string) =>
    apiRequest<{ success: boolean }>(apiUrl(`/items/${id}`), {
      method: 'DELETE',
    }),
};

// Assets API
export const assetsApi = {
  getAll: (folderId?: string) => {
    const url = folderId 
      ? apiUrl(`/assets?folderId=${folderId}`)
      : apiUrl('/assets');
    return apiRequest<LibraryAsset[]>(url);
  },
  
  getById: (id: string) =>
    apiRequest<LibraryAsset>(apiUrl(`/assets/${id}`)),
  
  create: (asset: Omit<LibraryAsset, 'id' | 'uploadedAt'>) =>
    apiRequest<LibraryAsset>(apiUrl('/assets'), {
      method: 'POST',
      body: JSON.stringify(asset),
    }),
  
  move: (assetId: string, targetFolderId: string) =>
    apiRequest<LibraryAsset>(apiUrl(`/assets/${assetId}/move`), {
      method: 'PUT',
      body: JSON.stringify({ folderId: targetFolderId }),
    }),
  
  delete: (id: string) =>
    apiRequest<{ success: boolean }>(apiUrl(`/assets/${id}`), {
      method: 'DELETE',
    }),
};

// Folders API
export const foldersApi = {
  getAll: () => apiRequest<LibraryFolder[]>(apiUrl('/folders')),
  
  create: (folder: { name: string; icon?: string }) =>
    apiRequest<LibraryFolder>(apiUrl('/folders'), {
      method: 'POST',
      body: JSON.stringify(folder),
    }),
  
  update: (id: string, updates: Partial<LibraryFolder>) =>
    apiRequest<LibraryFolder>(apiUrl(`/folders/${id}`), {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),
  
  delete: (id: string) =>
    apiRequest<{ success: boolean }>(apiUrl(`/folders/${id}`), {
      method: 'DELETE',
    }),
};

// Health check
export async function checkServerConnection(): Promise<boolean> {
  try {
    const response = await fetch(apiUrl('/health'));
    return response.ok;
  } catch {
    return false;
  }
}

