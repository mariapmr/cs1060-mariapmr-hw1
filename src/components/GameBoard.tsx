import React from 'react';
import { GameState } from '../types';
import { Flower } from 'lucide-react';

interface GameBoardProps {
  gameState: GameState;
  onPitClick: (pit: number) => void;
  highlightedPit?: number | null;
}

export function GameBoard({ gameState, onPitClick, highlightedPit }: GameBoardProps) {
  const renderFlowerPetals = (count: number) => {
    const petals = [];
    for (let i = 0; i < Math.min(count, 12); i++) {
      const angle = (i * 360) / Math.min(count, 12);
      const radius = Math.min(count * 2, 20);
      const x = Math.cos((angle * Math.PI) / 180) * radius;
      const y = Math.sin((angle * Math.PI) / 180) * radius;
      
      petals.push(
        <div
          key={i}
          className="absolute transform -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `calc(50% + ${x}px)`,
            top: `calc(50% + ${y}px)`,
          }}
        >
          <Flower 
            size={16} 
            className={`${
              i % 4 === 0 ? 'text-pink-400' :
              i % 4 === 1 ? 'text-rose-400' :
              i % 4 === 2 ? 'text-pink-300' : 'text-rose-300'
            } drop-shadow-sm`}
          />
        </div>
      );
    }
    
    if (count > 12) {
      petals.push(
        <div
          key="overflow"
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-pink-200 rounded-full px-2 py-1 text-xs font-semibold text-pink-800"
        >
          +{count - 12}
        </div>
      );
    }
    
    return petals;
  };

  const renderPit = (pitIndex: number, isStore: boolean = false) => {
    const stones = gameState.board[pitIndex];
    const isHumanTurn = gameState.currentPlayer === 'human';
    const isHumanPit = pitIndex >= 0 && pitIndex <= 5;
    const isComputerPit = pitIndex >= 7 && pitIndex <= 12;
    const isClickable = !gameState.gameOver && 
      ((isHumanTurn && isHumanPit) || (!isHumanTurn && isComputerPit)) && 
      stones > 0 && !isStore;
    
    const wasLastMove = gameState.lastMove === pitIndex;
    const isHighlighted = highlightedPit === pitIndex;
    
    return (
      <div
        key={pitIndex}
        className={`
          relative rounded-2xl transition-all duration-300 shadow-lg
          ${isStore 
            ? 'h-32 w-16 bg-gradient-to-b from-pink-100 to-pink-200' 
            : 'h-20 w-20 bg-gradient-to-br from-pink-50 to-pink-100'
          }
          ${isClickable 
            ? 'cursor-pointer hover:from-pink-200 hover:to-pink-300 hover:shadow-xl transform hover:-translate-y-1' 
            : ''
          }
          ${wasLastMove ? 'ring-4 ring-pink-400 ring-opacity-50' : ''}
          ${isHighlighted ? 'ring-4 ring-yellow-400 ring-opacity-70 bg-gradient-to-br from-yellow-100 to-yellow-200 animate-pulse' : ''}
          border-2 border-pink-200
        `}
        onClick={() => isClickable ? onPitClick(pitIndex) : undefined}
      >
        {/* Flower petals */}
        <div className="absolute inset-2">
          {renderFlowerPetals(stones)}
        </div>
        
        {/* Stone count */}
        <div className="absolute -top-2 -right-2 bg-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold text-pink-800 shadow-md border border-pink-200">
          {stones}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-pink-50 to-rose-100 rounded-3xl p-8 shadow-2xl border border-pink-200">
      {/* Computer side (top) */}
      <div className="flex items-center justify-between mb-8">
        <div className="text-center">
          <div className="text-sm font-semibold text-pink-800 mb-2">Computer Store</div>
          {renderPit(13, true)}
        </div>
        
        <div className="flex space-x-4">
          {[12, 11, 10, 9, 8, 7].map(pit => renderPit(pit))}
        </div>
        
        <div className="w-16"></div>
      </div>
      
      {/* Human side (bottom) */}
      <div className="flex items-center justify-between">
        <div className="w-16"></div>
        
        <div className="flex space-x-4">
          {[0, 1, 2, 3, 4, 5].map(pit => renderPit(pit))}
        </div>
        
        <div className="text-center">
          <div className="text-sm font-semibold text-pink-800 mb-2">Your Store</div>
          {renderPit(6, true)}
        </div>
      </div>
    </div>
  );
}