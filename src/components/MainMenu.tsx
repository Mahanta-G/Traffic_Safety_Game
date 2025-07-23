import React from 'react';
import { useGame } from '../context/GameContext';
import { Trophy, Play, Info, X, Crown, Lock, LogOut, Settings } from 'lucide-react';
import { AudioManager } from '../utils/AudioManager';

const MainMenu: React.FC = () => {
  const { gameState, updateGameState, logout } = useGame();

  // Start background music when menu loads
  React.useEffect(() => {
    AudioManager.play();
  }, []);

  const handleLevelSelect = (level: number) => {
    // Check if level 2 is locked
    if (level === 2 && gameState.level1Score === 0) {
      return; // Don't allow access to level 2 if level 1 not completed
    }
    
    updateGameState({ 
      currentLevel: level,
      currentScreen: level === 1 ? 'level1' : 'level2',
      score: 0
    });
  };

  const handleLogout = () => {
    logout();
  };

  const isLevel2Locked = gameState.level1Score === 0;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* GIF Background */}
      <div className="absolute inset-0">
        <img 
          src="/maja-djokic-park-2-gif.gif" 
          alt="Traffic intersection background"
          className="w-full h-full object-cover"
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 min-h-screen">
        {/* Mobile Layout */}
        <div className="block lg:hidden">
          {/* Mobile Header */}
          <div className="flex justify-between items-center p-4">
            {/* High Score */}
            <button
              onClick={() => updateGameState({ currentScreen: 'leaderboard' })}
              className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-white hover:bg-white/30 transition-all duration-300 transform hover:scale-105 group"
            >
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400 group-hover:animate-bounce" />
                <div>
                  <p className="text-xs opacity-90">High Score</p>
                  <p className="text-lg font-bold">{gameState.highScore}</p>
                </div>
              </div>
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="bg-red-500/20 backdrop-blur-sm hover:bg-red-500/30 text-white p-3 rounded-lg transition-all duration-300 transform hover:scale-105 group"
            >
              <LogOut className="w-5 h-5 text-red-400 group-hover:animate-pulse" />
            </button>
          </div>

          {/* Mobile Title */}
          <div className="text-center px-4 mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2 animate-pulse drop-shadow-2xl">
              Follow the Track
            </h1>
            <p className="text-white text-base sm:text-lg opacity-90 drop-shadow-lg">
              Master Traffic Safety Through Fun Games!
            </p>
            {gameState.playerName && (
              <div className="mt-4 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 inline-flex items-center gap-2">
                <Crown className="w-4 h-4 text-yellow-400" />
                <span className="text-white font-semibold text-sm">Welcome, {gameState.playerName}!</span>
              </div>
            )}
          </div>

          {/* Mobile Menu Buttons */}
          <div className="px-4 space-y-4">
            {/* Level 1 Button */}
            <button
              onClick={() => handleLevelSelect(1)}
              className="w-full bg-white/15 backdrop-blur-sm hover:bg-white/25 text-white p-4 rounded-xl transform hover:scale-105 transition-all duration-300 shadow-lg group"
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl group-hover:animate-bounce">🃏</div>
                <div className="text-left flex-1">
                  <h3 className="text-lg font-bold">Level 1</h3>
                  <p className="text-white/80 text-sm">Memory Match</p>
                  {gameState.level1Score > 0 && (
                    <div className="mt-1 px-2 py-1 bg-blue-500/50 rounded-full text-xs inline-block">
                      Best: {gameState.level1Score}
                    </div>
                  )}
                </div>
              </div>
            </button>

            {/* Level 2 Button */}
            <button
              onClick={() => handleLevelSelect(2)}
              disabled={isLevel2Locked}
              className={`
                w-full
                ${isLevel2Locked 
                  ? 'bg-gray-500/20 cursor-not-allowed' 
                  : 'bg-white/15 hover:bg-white/25 transform hover:scale-105'
                } 
                backdrop-blur-sm text-white p-4 rounded-xl transition-all duration-300 shadow-lg group
              `}
            >
              <div className="flex items-center gap-3">
                <div className={`text-2xl ${!isLevel2Locked && 'group-hover:animate-bounce'}`}>
                  {isLevel2Locked ? <Lock className="w-6 h-6" /> : '🚦'}
                </div>
                <div className="text-left flex-1">
                  <h3 className="text-lg font-bold">Level 2</h3>
                  <p className="text-white/80 text-sm">
                    {isLevel2Locked ? 'Complete Level 1 first' : 'Quiz Challenge'}
                  </p>
                  {gameState.level2Score > 0 && !isLevel2Locked && (
                    <div className="mt-1 px-2 py-1 bg-green-500/50 rounded-full text-xs inline-block">
                      Best: {gameState.level2Score}
                    </div>
                  )}
                </div>
              </div>
            </button>

            {/* Settings Button */}
            <button
              onClick={() => updateGameState({ currentScreen: 'settings' })}
              className="w-full bg-white/15 backdrop-blur-sm hover:bg-white/25 text-white p-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <div className="flex items-center gap-3">
                <Settings className="w-6 h-6" />
                <div className="text-left flex-1">
                  <h3 className="text-lg font-bold">Settings</h3>
                  <p className="text-white/80 text-sm">Audio & display options</p>
                </div>
              </div>
            </button>

            {/* Credits Button */}
            <button
              onClick={() => updateGameState({ currentScreen: 'credits' })}
              className="w-full bg-white/15 backdrop-blur-sm hover:bg-white/25 text-white p-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <div className="flex items-center gap-3">
                <Info className="w-6 h-6" />
                <div className="text-left flex-1">
                  <h3 className="text-lg font-bold">Credits</h3>
                  <p className="text-white/80 text-sm">About the game</p>
                </div>
              </div>
            </button>

            {/* Quit Button */}
            <button
              onClick={() => window.close()}
              className="w-full bg-red-500/20 backdrop-blur-sm hover:bg-red-500/30 text-white p-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <div className="flex items-center gap-3">
                <X className="w-6 h-6" />
                <div className="text-left flex-1">
                  <h3 className="text-lg font-bold">Quit Game</h3>
                  <p className="text-white/80 text-sm">Exit application</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block">
          {/* Top Section - High Score and Title */}
          <div className="flex justify-between items-start p-6">
            {/* High Score (Clickable) */}
            <button
              onClick={() => updateGameState({ currentScreen: 'leaderboard' })}
              className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-white hover:bg-white/30 transition-all duration-300 transform hover:scale-105 group"
            >
              <div className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-400 group-hover:animate-bounce" />
                <div>
                  <p className="text-sm opacity-90">High Score</p>
                  <p className="text-2xl font-bold">{gameState.highScore}</p>
                </div>
              </div>
              <p className="text-xs opacity-75 mt-1">Click to view leaderboard</p>
            </button>

            {/* Title - Centered */}
            <div className="text-center">
              <h1 className="text-7xl font-bold text-white mb-2 animate-pulse drop-shadow-2xl">
                Follow the Track
              </h1>
              <p className="text-white text-xl opacity-90 drop-shadow-lg">
                Master Traffic Safety Through Fun Games!
              </p>
              {gameState.playerName && (
                <div className="mt-4 bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 inline-flex items-center gap-2">
                  <Crown className="w-5 h-5 text-yellow-400" />
                  <span className="text-white font-semibold">Welcome, {gameState.playerName}!</span>
                </div>
              )}
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="bg-red-500/20 backdrop-blur-sm hover:bg-red-500/30 text-white p-4 rounded-lg transition-all duration-300 transform hover:scale-105 group"
            >
              <div className="flex items-center gap-2">
                <LogOut className="w-6 h-6 text-red-400 group-hover:animate-pulse" />
                <div>
                  <p className="text-sm opacity-90">Logout</p>
                  <p className="text-xs opacity-75">Clear data</p>
                </div>
              </div>
            </button>
          </div>

          {/* Right Side Menu - Vertical Stack */}
          <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
            <div className="flex flex-col space-y-4">
              {/* Level 1 Button */}
              <button
                onClick={() => handleLevelSelect(1)}
                className="bg-white/15 backdrop-blur-sm hover:bg-white/25 text-white p-4 rounded-xl transform hover:scale-105 transition-all duration-300 shadow-lg group w-56"
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl group-hover:animate-bounce">🃏</div>
                  <div className="text-left">
                    <h3 className="text-lg font-bold">Level 1</h3>
                    <p className="text-white/80 text-sm">Memory Match</p>
                    {gameState.level1Score > 0 && (
                      <div className="mt-1 px-2 py-1 bg-blue-500/50 rounded-full text-xs inline-block">
                        Best: {gameState.level1Score}
                      </div>
                    )}
                  </div>
                </div>
              </button>

              {/* Level 2 Button */}
              <button
                onClick={() => handleLevelSelect(2)}
                disabled={isLevel2Locked}
                className={`
                  ${isLevel2Locked 
                    ? 'bg-gray-500/20 cursor-not-allowed' 
                    : 'bg-white/15 hover:bg-white/25 transform hover:scale-105'
                  } 
                  backdrop-blur-sm text-white p-4 rounded-xl transition-all duration-300 shadow-lg group w-56
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`text-2xl ${!isLevel2Locked && 'group-hover:animate-bounce'}`}>
                    {isLevel2Locked ? <Lock className="w-6 h-6" /> : '🚦'}
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-bold">Level 2</h3>
                    <p className="text-white/80 text-sm">
                      {isLevel2Locked ? 'Complete Level 1 first' : 'Quiz Challenge'}
                    </p>
                    {gameState.level2Score > 0 && !isLevel2Locked && (
                      <div className="mt-1 px-2 py-1 bg-green-500/50 rounded-full text-xs inline-block">
                        Best: {gameState.level2Score}
                      </div>
                    )}
                  </div>
                </div>
              </button>

              {/* Settings Button */}
              <button
                onClick={() => updateGameState({ currentScreen: 'settings' })}
                className="bg-white/15 backdrop-blur-sm hover:bg-white/25 text-white p-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg w-56"
              >
                <div className="flex items-center gap-3">
                  <Settings className="w-6 h-6" />
                  <div className="text-left">
                    <h3 className="text-lg font-bold">Settings</h3>
                    <p className="text-white/80 text-sm">Audio & display options</p>
                  </div>
                </div>
              </button>

              {/* Credits Button */}
              <button
                onClick={() => updateGameState({ currentScreen: 'credits' })}
                className="bg-white/15 backdrop-blur-sm hover:bg-white/25 text-white p-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg w-56"
              >
                <div className="flex items-center gap-3">
                  <Info className="w-6 h-6" />
                  <div className="text-left">
                    <h3 className="text-lg font-bold">Credits</h3>
                    <p className="text-white/80 text-sm">About the game</p>
                  </div>
                </div>
              </button>

              {/* Quit Button */}
              <button
                onClick={() => window.close()}
                className="bg-red-500/20 backdrop-blur-sm hover:bg-red-500/30 text-white p-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg w-56"
              >
                <div className="flex items-center gap-3">
                  <X className="w-6 h-6" />
                  <div className="text-left">
                    <h3 className="text-lg font-bold">Quit Game</h3>
                    <p className="text-white/80 text-sm">Exit application</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainMenu;