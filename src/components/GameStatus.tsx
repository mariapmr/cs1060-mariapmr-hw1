import React from 'react';
import { GameState } from '../types';
import { Crown, Flower2, RotateCcw } from 'lucide-react';

interface GameStatusProps {
  gameState: GameState;
  onRestart: () => void;
}

export function GameStatus({ gameState, onRestart }: GameStatusProps) {
  const humanScore = gameState.board[6];
  const computerScore = gameState.board[13];
  
  return (
    <div className="text-center space-y-4">
      {/* Game Title */}
      <div className="flex items-center justify-center space-x-2">
        <Flower2 className="text-pink-500" size={32} />
        <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
          Petal Mancala
        </h1>
        <Flower2 className="text-pink-500" size={32} />
      </div>
      
      {/* Score Display */}
      <div className="flex items-center justify-center space-x-8 bg-white rounded-2xl p-4 shadow-lg border border-pink-200">
        <div className="text-center">
          <div className="text-lg font-semibold text-pink-800">You</div>
          <div className="text-3xl font-bold text-pink-600">{humanScore}</div>
        </div>
        <div className="text-2xl text-pink-400">vs</div>
        <div className="text-center">
          <div className="text-lg font-semibold text-pink-800">Computer</div>
          <div className="text-3xl font-bold text-pink-600">{computerScore}</div>
        </div>
      </div>
      
      {/* Game Status */}
      {gameState.gameOver ? (
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <Crown className="text-yellow-500" size={24} />
            <div className="text-2xl font-bold text-pink-800">
              {gameState.winner === 'human' 
                ? '🎉 You Won!' 
                : gameState.winner === 'computer' 
                ? '🤖 Computer Won!' 
                : '🤝 It\'s a Tie!'}
            </div>
            <Crown className="text-yellow-500" size={24} />
          </div>
          <button
            onClick={onRestart}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold px-6 py-3 rounded-2xl shadow-lg transition-all duration-200 transform hover:-translate-y-1"
          >
            <RotateCcw size={20} />
            <span>Play Again</span>
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="text-xl font-semibold text-pink-800">
            {gameState.currentPlayer === 'human' ? "Your Turn" : "Computer's Turn"}
          </div>
          {gameState.captured && (
            <div className="text-sm text-pink-600 animate-bounce">
              ✨ Captured petals! ✨
            </div>
          )}
          {gameState.currentPlayer === 'computer' && (
            <div className="text-sm text-pink-600">
              Computer is thinking...
            </div>
          )}
        </div>
      )}
      
      {/* Instructions */}
      {!gameState.gameOver && gameState.currentPlayer === 'human' && (
        <div className="text-sm text-pink-700 bg-pink-100 rounded-lg p-3 max-w-md mx-auto">
          Click on one of your pits to pick up all the flower petals and distribute them around the board!
        </div>
      )}
    </div>
  );
}