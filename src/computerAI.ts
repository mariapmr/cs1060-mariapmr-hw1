import { GameState } from './types';
import { makeMove, getValidMoves, COMPUTER_STORE } from './gameLogic';

export function getComputerMove(gameState: GameState): number {
  const validMoves = getValidMoves(gameState);
  
  if (validMoves.length === 0) return -1;
  
  // Strategy 1: Look for moves that give another turn (end in computer store)
  for (const move of validMoves) {
    if (wouldEndInStore(gameState, move)) {
      return move;
    }
  }
  
  // Strategy 2: Look for capture opportunities
  for (const move of validMoves) {
    if (wouldCapture(gameState, move)) {
      return move;
    }
  }
  
  // Strategy 3: Prefer moves from pits with more stones (more distribution)
  const scoredMoves = validMoves.map(move => ({
    move,
    score: gameState.board[move]
  }));
  
  scoredMoves.sort((a, b) => b.score - a.score);
  
  // Add some randomness to the top choices
  const topMoves = scoredMoves.slice(0, Math.min(3, scoredMoves.length));
  const randomIndex = Math.floor(Math.random() * topMoves.length);
  
  return topMoves[randomIndex].move;
}

function wouldEndInStore(gameState: GameState, pit: number): boolean {
  const stones = gameState.board[pit];
  let currentPit = pit;
  
  for (let i = 0; i < stones; i++) {
    currentPit = getNextPit(currentPit);
  }
  
  return currentPit === COMPUTER_STORE;
}

function wouldCapture(gameState: GameState, pit: number): boolean {
  const stones = gameState.board[pit];
  let currentPit = pit;
  
  for (let i = 0; i < stones; i++) {
    currentPit = getNextPit(currentPit);
  }
  
  // Check if would land in empty pit on computer's side
  const isComputerSide = currentPit >= 7 && currentPit <= 12;
  if (!isComputerSide) return false;
  
  // Simulate the move to check if pit would be empty after placing stone
  const simulatedBoard = [...gameState.board];
  simulatedBoard[pit] = 0;
  let simCurrentPit = pit;
  let simStones = stones;
  
  while (simStones > 0) {
    simCurrentPit = getNextPit(simCurrentPit);
    simulatedBoard[simCurrentPit]++;
    simStones--;
  }
  
  const landedInEmptyPit = simulatedBoard[currentPit] === 1;
  const oppositePit = 12 - currentPit;
  const oppositeHasStones = simulatedBoard[oppositePit] > 0;
  
  return landedInEmptyPit && oppositeHasStones;
}

function getNextPit(currentPit: number): number {
  const nextPit = (currentPit + 1) % 14;
  
  // Skip human store for computer
  if (nextPit === 6) {
    return 7;
  }
  
  return nextPit;
}