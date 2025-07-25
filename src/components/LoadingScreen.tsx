import React, { useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';

const LoadingScreen: React.FC = () => {
  const { gameState, updateGameState } = useGame();
  const [progress, setProgress] = useState(0);
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            // Check if player has entered name, if not go to name input
            if (!gameState.hasEnteredName) {
              updateGameState({ currentScreen: 'name-input' });
            } else {
              updateGameState({ currentScreen: 'menu' });
            }
          }, 500);
          return 100;
        }
        return prev + (100 / 100); // 5 seconds = 100 intervals of 50ms
      });
    }, 50);

    const animationTimer = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 4);
    }, 1000);

    return () => {
      clearInterval(timer);
      clearInterval(animationTimer);
    };
  }, [updateGameState, gameState.hasEnteredName]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 via-sky-300 to-green-400 flex items-center justify-center relative overflow-hidden px-4">
      {/* Road */}
      <div className="absolute bottom-0 w-full h-16 sm:h-24 md:h-32 bg-gray-700 flex items-center justify-center">
        <div className="w-full h-1 sm:h-2 bg-yellow-400 animate-pulse"></div>
      </div>

      {/* Traffic Light - Responsive positioning */}
      <div className="absolute top-10 sm:top-16 md:top-20 right-4 sm:right-12 md:right-20 w-8 sm:w-12 md:w-16 h-16 sm:h-24 md:h-32 bg-gray-800 rounded-lg flex flex-col items-center justify-around p-1 sm:p-2">
        <div className={`w-4 sm:w-6 md:w-8 h-4 sm:h-6 md:h-8 rounded-full ${animationPhase === 0 ? 'bg-red-500' : 'bg-red-200'} transition-colors duration-500`}></div>
        <div className={`w-4 sm:w-6 md:w-8 h-4 sm:h-6 md:h-8 rounded-full ${animationPhase === 1 ? 'bg-yellow-500' : 'bg-yellow-200'} transition-colors duration-500`}></div>
        <div className={`w-4 sm:w-6 md:w-8 h-4 sm:h-6 md:h-8 rounded-full ${animationPhase >= 2 ? 'bg-green-500' : 'bg-green-200'} transition-colors duration-500`}></div>
      </div>

      {/* Cars - Responsive sizing and positioning */}
      <div className="absolute bottom-8 sm:bottom-12 md:bottom-16 flex gap-2 sm:gap-4 md:gap-8">
        <div className={`w-8 sm:w-12 md:w-16 h-4 sm:h-6 md:h-8 bg-blue-600 rounded transform transition-transform duration-1000 ${animationPhase >= 2 ? 'translate-x-32 sm:translate-x-64 md:translate-x-96' : ''}`}>
          <div className="w-full h-full bg-blue-600 rounded flex items-center justify-center text-white text-xs">🚗</div>
        </div>
        <div className={`w-8 sm:w-12 md:w-16 h-4 sm:h-6 md:h-8 bg-red-600 rounded transform transition-transform duration-1000 delay-300 ${animationPhase >= 2 ? 'translate-x-32 sm:translate-x-64 md:translate-x-96' : ''}`}>
          <div className="w-full h-full bg-red-600 rounded flex items-center justify-center text-white text-xs">🚗</div>
        </div>
        <div className={`w-8 sm:w-12 md:w-16 h-4 sm:h-6 md:h-8 bg-green-600 rounded transform transition-transform duration-1000 delay-500 ${animationPhase >= 2 ? 'translate-x-32 sm:translate-x-64 md:translate-x-96' : ''}`}>
          <div className="w-full h-full bg-green-600 rounded flex items-center justify-center text-white text-xs">🚗</div>
        </div>
      </div>

      {/* Loading Content - Responsive text and sizing */}
      <div className="text-center z-10 px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 md:mb-8 animate-bounce">
          Follow the Track
        </h1>
        <div className="w-64 sm:w-72 md:w-80 bg-white rounded-full h-3 sm:h-4 mb-3 sm:mb-4">
          <div 
            className="bg-blue-600 h-3 sm:h-4 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-white text-lg sm:text-xl">Loading... {Math.round(progress)}%</p>
        <p className="text-white text-sm sm:text-base mt-2">Learn traffic safety the fun way!</p>
      </div>
    </div>
  );
};

export default LoadingScreen;