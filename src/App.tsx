import React, { useState, useEffect } from 'react';
import { GameBoard } from './components/GameBoard';
import { GameStatus } from './components/GameStatus';
import { createInitialGameState, makeMove } from './gameLogic';
import { getComputerMove } from './computerAI';
import { GameState } from './types';

function App() {
  const [gameState, setGameState] = useState<GameState>(createInitialGameState);
  const [highlightedPit, setHighlightedPit] = useState<number | null>(null);

  const animateMove = async (startPit: number, stones: number) => {
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    
    let currentPit = startPit;
    const isHuman = gameState.currentPlayer === 'human';
    
    for (let i = 0; i < stones; i++) {
      // Calculate next pit
      currentPit = (currentPit + 1) % 14;
      
      // Skip opponent's store
      if (isHuman && currentPit === 13) {
        currentPit = 0;
      } else if (!isHuman && currentPit === 6) {
        currentPit = 7;
      }
      
      setHighlightedPit(currentPit);
      await delay(200); // Animation speed
    }
    
    setHighlightedPit(null);
  };

  const handlePitClick = async (pit: number) => {
    if (gameState.currentPlayer === 'human' && !gameState.gameOver) {
      const stones = gameState.board[pit];
      if (stones > 0) {
        setGameState(prev => ({ ...prev, animatingMove: true }));
        await animateMove(pit, stones);
      }
      const newGameState = makeMove(gameState, pit);
      setGameState(newGameState);
    }
  };

  const handleRestart = () => {
    setGameState(createInitialGameState());
  };

  // Handle computer moves
  useEffect(() => {
    if (gameState.currentPlayer === 'computer' && !gameState.gameOver && !gameState.animatingMove) {
      const timer = setTimeout(() => {
        const computerMove = getComputerMove(gameState);
        if (computerMove !== -1) {
          const stones = gameState.board[computerMove];
          if (stones > 0) {
            setGameState(prev => ({ ...prev, animatingMove: true }));
            animateMove(computerMove, stones).then(() => {
              const newGameState = makeMove(gameState, computerMove);
              setGameState(newGameState);
            });
          }
        }
      }, 1000); // Add delay for better UX

      return () => clearTimeout(timer);
    }
  }, [gameState]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <GameStatus gameState={gameState} onRestart={handleRestart} />
        <GameBoard 
          gameState={gameState} 
          onPitClick={handlePitClick}
          highlightedPit={highlightedPit}
        />
        
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 text-pink-300 opacity-30">
          <div className="animate-pulse">🌸</div>
        </div>
        <div className="absolute top-20 right-20 text-rose-300 opacity-30">
          <div className="animate-pulse delay-500">🌺</div>
        </div>
        <div className="absolute bottom-10 left-20 text-pink-300 opacity-30">
          <div className="animate-pulse delay-1000">🌷</div>
        </div>
        <div className="absolute bottom-20 right-10 text-rose-300 opacity-30">
          <div className="animate-pulse delay-700">🌹</div>
        </div>
      </div>
    </div>
  );
}

export default App;