import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { User, Play } from 'lucide-react';

const NameInputScreen: React.FC = () => {
  const { updateGameState } = useGame();
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (name.trim().length < 2) {
      setError('Name must be at least 2 characters long');
      return;
    }
    
    if (name.trim().length > 20) {
      setError('Name must be less than 20 characters');
      return;
    }

    updateGameState({ 
      playerName: name.trim(),
      hasEnteredName: true,
      currentScreen: 'menu' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Animation - Responsive sizing */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-4 sm:w-6 md:w-8 h-4 sm:h-6 md:h-8 bg-white rounded-full animate-ping"></div>
        <div className="absolute top-20 right-20 w-3 sm:w-4 md:w-6 h-3 sm:h-4 md:h-6 bg-yellow-300 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-5 sm:w-8 md:w-10 h-5 sm:h-8 md:h-10 bg-green-300 rounded-full animate-bounce"></div>
        <div className="absolute bottom-10 right-10 w-6 sm:w-10 md:w-12 h-6 sm:h-10 md:h-12 bg-red-300 rounded-full animate-pulse"></div>
      </div>

      <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 sm:p-8 md:p-12 max-w-sm sm:max-w-md w-full text-center shadow-2xl mx-4">
        <div className="mb-6 sm:mb-8">
          <User className="w-16 sm:w-20 h-16 sm:h-20 text-indigo-600 mx-auto mb-4" />
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">Welcome!</h1>
          <p className="text-gray-600 text-sm sm:text-base">Enter your name to start playing</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              placeholder="Enter your name"
              className="w-full px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors text-center"
              maxLength={20}
              autoFocus
            />
            {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={name.trim().length < 2}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 sm:py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            <Play className="w-4 sm:w-5 h-4 sm:h-5" />
            Start Playing
          </button>
        </form>

        <div className="mt-4 sm:mt-6 text-xs sm:text-sm text-gray-500">
          <p>Your name will be used for the leaderboard</p>
        </div>
      </div>
    </div>
  );
};

export default NameInputScreen;