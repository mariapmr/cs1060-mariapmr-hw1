export interface GameState {
  board: number[];
  currentPlayer: 'human' | 'computer';
  gameOver: boolean;
  winner: 'human' | 'computer' | 'tie' | null;
  lastMove: number | null;
  captured: boolean;
  animatingMove: boolean;
  highlightedPit: number | null;
}

export interface Position {
  pit: number;
  isStore: boolean;
}