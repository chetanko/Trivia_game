import { useEffect } from 'react';

export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | Classroom Trivia Tic-Tac-Toe` : 'Classroom Trivia Tic-Tac-Toe';
  }, [title]);
}
