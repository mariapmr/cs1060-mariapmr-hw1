import { GameState } from './types';

export const HUMAN_STORE = 6;
export const COMPUTER_STORE = 13;
export const INITIAL_STONES = 4;

export function createInitialGameState(): GameState {
  // Board layout: [0-5] human pits, [6] human store, [7-12] computer pits, [13] computer store
  const board = new Array(14).fill(INITIAL_STONES);
  board[HUMAN_STORE] = 0; // Human store starts empty
  board[COMPUTER_STORE] = 0; // Computer store starts empty
  
  return {
    board,
    currentPlayer: 'human',
    gameOver: false,
    winner: null,
    lastMove: null,
    captured: false,
    animatingMove: false,
    highlightedPit: null
  };
}

export function isValidMove(gameState: GameState, pit: number): boolean {
  if (gameState.gameOver) return false;
  
  if (gameState.currentPlayer === 'human') {
    return pit >= 0 && pit <= 5 && gameState.board[pit] > 0;
  } else {
    return pit >= 7 && pit <= 12 && gameState.board[pit] > 0;
  }
}

export function makeMove(gameState: GameState, pit: number): GameState {
  if (!isValidMove(gameState, pit)) return gameState;
  
  const newBoard = [...gameState.board];
  let stones = newBoard[pit];
  newBoard[pit] = 0;
  
  let currentPit = pit;
  let captured = false;
  
  // Distribute stones
  while (stones > 0) {
    currentPit = getNextPit(currentPit, gameState.currentPlayer);
    newBoard[currentPit]++;
    stones--;
  }
  
  // Check for capture
  const isHumanSide = currentPit >= 0 && currentPit <= 5;
  const isComputerSide = currentPit >= 7 && currentPit <= 12;
  const landedInEmptyPit = newBoard[currentPit] === 1;
  
  if (landedInEmptyPit && 
      ((gameState.currentPlayer === 'human' && isHumanSide) ||
       (gameState.currentPlayer === 'computer' && isComputerSide))) {
    const oppositePit = getOppositePit(currentPit);
    const oppositeStones = newBoard[oppositePit];
    
    if (oppositeStones > 0) {
      captured = true;
      const playerStore = gameState.currentPlayer === 'human' ? HUMAN_STORE : COMPUTER_STORE;
      newBoard[playerStore] += newBoard[currentPit] + oppositeStones;
      newBoard[currentPit] = 0;
      newBoard[oppositePit] = 0;
    }
  }
  
  // Check if player gets another turn (landed in their store)
  const getsAnotherTurn = (gameState.currentPlayer === 'human' && currentPit === HUMAN_STORE) ||
                          (gameState.currentPlayer === 'computer' && currentPit === COMPUTER_STORE);
  
  const nextPlayer = getsAnotherTurn ? gameState.currentPlayer : 
                     gameState.currentPlayer === 'human' ? 'computer' : 'human';
  
  // Check if game is over
  const humanSideEmpty = newBoard.slice(0, 6).every(stones => stones === 0);
  const computerSideEmpty = newBoard.slice(7, 13).every(stones => stones === 0);
  const gameOver = humanSideEmpty || computerSideEmpty;
  
  // If game over, move remaining stones to respective stores
  if (gameOver) {
    if (humanSideEmpty) {
      const remainingStones = newBoard.slice(7, 13).reduce((sum, stones) => sum + stones, 0);
      newBoard[COMPUTER_STORE] += remainingStones;
      for (let i = 7; i <= 12; i++) {
        newBoard[i] = 0;
      }
    } else {
      const remainingStones = newBoard.slice(0, 6).reduce((sum, stones) => sum + stones, 0);
      newBoard[HUMAN_STORE] += remainingStones;
      for (let i = 0; i <= 5; i++) {
        newBoard[i] = 0;
      }
    }
  }
  
  const winner = gameOver ? getWinner(newBoard) : null;
  
  return {
    board: newBoard,
    currentPlayer: nextPlayer,
    gameOver,
    winner,
    lastMove: pit,
    captured,
    animatingMove: false,
    highlightedPit: null
  };
}

function getNextPit(currentPit: number, player: 'human' | 'computer'): number {
  const nextPit = (currentPit + 1) % 14;
  
  // Skip opponent's store
  if (player === 'human' && nextPit === COMPUTER_STORE) {
    return 0;
  }
  if (player === 'computer' && nextPit === HUMAN_STORE) {
    return 7;
  }
  
  return nextPit;
}

function getOppositePit(pit: number): number {
  return 12 - pit;
}

function getWinner(board: number[]): 'human' | 'computer' | 'tie' {
  const humanScore = board[HUMAN_STORE];
  const computerScore = board[COMPUTER_STORE];
  
  if (humanScore > computerScore) return 'human';
  if (computerScore > humanScore) return 'computer';
  return 'tie';
}

export function getValidMoves(gameState: GameState): number[] {
  const moves: number[] = [];
  
  if (gameState.currentPlayer === 'human') {
    for (let i = 0; i <= 5; i++) {
      if (isValidMove(gameState, i)) {
        moves.push(i);
      }
    }
  } else {
    for (let i = 7; i <= 12; i++) {
      if (isValidMove(gameState, i)) {
        moves.push(i);
      }
    }
  }
  
  return moves;
}