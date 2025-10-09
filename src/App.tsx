/**
 * Main App component
 * Handles routing between home, editor, and customer view
 */

import { useState } from 'react';
import { Home } from '@/pages/Home';
import { BoardEditor } from '@/pages/BoardEditor';
import { CustomerView } from '@/pages/CustomerView';
import './App.css';

type View = 'home' | 'editor' | 'customer';

interface AppState {
  view: View;
  boardId?: string;
}

function App() {
  const [state, setState] = useState<AppState>({ view: 'home' });
  
  // Simple routing based on URL hash
  // Format: #/board/{id} or #/view/{id}
  useState(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      
      if (hash.startsWith('#/board/')) {
        const id = hash.replace('#/board/', '');
        setState({ view: 'editor', boardId: id });
      } else if (hash.startsWith('#/view/')) {
        const id = hash.replace('#/view/', '');
        setState({ view: 'customer', boardId: id });
      } else {
        setState({ view: 'home' });
      }
    };
    
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Initial load
    
    return () => window.removeEventListener('hashchange', handleHashChange);
  });
  
  const navigateToBoard = (id: string) => {
    window.location.hash = `/board/${id}`;
  };
  
  const navigateHome = () => {
    window.location.hash = '/';
  };
  
  // Generate shareable link
  const handleShare = (boardId: string) => {
    const baseUrl = import.meta.env.VITE_PUBLIC_BASE_URL || window.location.origin;
    const shareUrl = `${baseUrl}/#/view/${boardId}`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      alert(`Link kopiert:\n${shareUrl}`);
    } else {
      prompt('Kopiere diesen Link:', shareUrl);
    }
  };
  
  if (state.view === 'editor' && state.boardId) {
    return (
      <BoardEditor
        boardId={state.boardId}
        onBack={navigateHome}
        onShare={handleShare}
      />
    );
  }
  
  if (state.view === 'customer' && state.boardId) {
    return <CustomerView boardId={state.boardId} />;
  }
  
  return <Home onOpenBoard={navigateToBoard} />;
}

export default App;

