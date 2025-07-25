import React, { useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';
import { Trophy, Star, Home, RotateCcw, Upload, CheckCircle, AlertCircle } from 'lucide-react';

const ResultsScreen: React.FC = () => {
  const { gameState, updateGameState, resetGame, addToLeaderboard } = useGame();
  const [hasAddedToLeaderboard, setHasAddedToLeaderboard] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'pending' | 'success' | 'error' | null>(null);

  useEffect(() => {
    // Add score to leaderboard when results screen loads (only once)
    if (gameState.playerName && gameState.score > 0 && !hasAddedToLeaderboard) {
      setSubmissionStatus('pending');
      
      addToLeaderboard(gameState.playerName, gameState.score, gameState.currentLevel)
        .then(() => {
          setSubmissionStatus('success');
          setHasAddedToLeaderboard(true);
        })
        .catch((error) => {
          console.error('Failed to submit score:', error);
          setSubmissionStatus('error');
          setHasAddedToLeaderboard(true); // Still mark as attempted
        });
    }
  }, []); // Empty dependency array to run only once when component mounts

  const getPerformanceMessage = () => {
    const score = gameState.score;
    if (score >= 800) return "Excellent! You're a traffic safety expert! 🌟";
    if (score >= 600) return "Great job! You know your traffic rules well! 👍";
    if (score >= 400) return "Good work! Keep practicing to improve! 📚";
    return "Better luck next time! Please don't drive till then!!! 🚗";
  };

  const getStarRating = () => {
    const score = gameState.score;
    if (score >= 800) return 3;
    if (score >= 600) return 2;
    if (score >= 400) return 1;
    return 0;
  };

  const playAgain = () => {
    setHasAddedToLeaderboard(false); // Reset for next game
    setSubmissionStatus(null);
    updateGameState({ 
      currentScreen: gameState.currentLevel === 1 ? 'level1' : 'level2',
      score: 0 
    });
  };

  const goToMenu = () => {
    setHasAddedToLeaderboard(false); // Reset for next game
    setSubmissionStatus(null);
    updateGameState({ 
      currentScreen: 'menu',
      score: 0 
    });
  };

  const retrySubmission = async () => {
    if (gameState.playerName && gameState.score > 0) {
      setSubmissionStatus('pending');
      
      try {
        await addToLeaderboard(gameState.playerName, gameState.score, gameState.currentLevel);
        setSubmissionStatus('success');
      } catch (error) {
        console.error('Retry failed:', error);
        setSubmissionStatus('error');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-green-600 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 sm:p-8 max-w-sm sm:max-w-md w-full text-center shadow-2xl">
        {/* Trophy Animation */}
        <div className="mb-4 sm:mb-6">
          <Trophy className="w-16 sm:w-20 h-16 sm:h-20 text-yellow-500 mx-auto animate-bounce" />
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          {gameState.currentLevel === 1 ? 'Memory Game' : 'Quiz Challenge'}
        </h1>
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-600 mb-4 sm:mb-6">Complete!</h2>

        {/* Player Name */}
        {gameState.playerName && (
          <div className="bg-blue-100 rounded-xl p-3 mb-4">
            <p className="text-blue-800 font-semibold text-sm sm:text-base">Let's see what you've got, {gameState.playerName}!</p>
          </div>
        )}

        {/* Score Display */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 text-white">
          <p className="text-base sm:text-lg mb-2">Your Score</p>
          <p className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">{gameState.score}</p>
          
          {/* Stars */}
          <div className="flex justify-center gap-1 sm:gap-2 mb-3">
            {[...Array(3)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-6 sm:w-8 h-6 sm:h-8 ${i < getStarRating() ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
              />
            ))}
          </div>
          
          <p className="text-blue-100 text-sm sm:text-base">{getPerformanceMessage()}</p>
        </div>

        {/* Submission Status */}
        {gameState.score > 0 && (
          <div className="mb-4 sm:mb-6">
            {submissionStatus === 'pending' && (
              <div className="bg-blue-100 border border-blue-300 rounded-xl p-3 flex items-center justify-center gap-2">
                <Upload className="w-4 sm:w-5 h-4 sm:h-5 text-blue-600 animate-pulse" />
                <span className="text-blue-800 text-sm sm:text-base">Submitting score to leaderboard...</span>
              </div>
            )}
            
            {submissionStatus === 'success' && (
              <div className="bg-green-100 border border-green-300 rounded-xl p-3 flex items-center justify-center gap-2">
                <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 text-green-600" />
                <span className="text-green-800 text-sm sm:text-base">Score submitted successfully!</span>
              </div>
            )}
            
            {submissionStatus === 'error' && (
              <div className="bg-orange-100 border border-orange-300 rounded-xl p-3">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <AlertCircle className="w-4 sm:w-5 h-4 sm:h-5 text-orange-600" />
                  <span className="text-orange-800 text-sm sm:text-base">Score saved locally</span>
                </div>
                <button
                  onClick={retrySubmission}
                  className="text-xs sm:text-sm text-orange-700 hover:text-orange-900 underline"
                >
                  Retry online submission
                </button>
              </div>
            )}
          </div>
        )}

        {/* High Score */}
        {gameState.score === gameState.highScore && gameState.score > 0 && (
          <div className="bg-yellow-100 border-2 border-yellow-400 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
            <p className="text-yellow-800 font-bold text-sm sm:text-base">🎉 New High Score! 🎉</p>
          </div>
        )}

        {/* Level 2 Unlock Message */}
        {gameState.currentLevel === 1 && gameState.score > 0 && gameState.level2Score === 0 && (
          <div className="bg-green-100 border-2 border-green-400 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
            <p className="text-green-800 font-bold text-sm sm:text-base">🎉 Level 2 Unlocked! 🎉</p>
            <p className="text-green-600 text-xs sm:text-sm">You can now play the Quiz Challenge!</p>
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6 text-xs sm:text-sm">
          <div className="bg-gray-100 rounded-xl p-2 sm:p-3">
            <p className="text-gray-600">High Score</p>
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">{gameState.highScore}</p>
          </div>
          <div className="bg-gray-100 rounded-xl p-2 sm:p-3">
            <p className="text-gray-600">Level {gameState.currentLevel} Best</p>
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
              {gameState.currentLevel === 1 ? gameState.level1Score : gameState.level2Score}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={playAgain}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 sm:py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
          >
            <RotateCcw className="w-4 sm:w-5 h-4 sm:h-5" />
            Play Again
          </button>
          
          <button
            onClick={goToMenu}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 sm:py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
          >
            <Home className="w-4 sm:w-5 h-4 sm:h-5" />
            Main Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsScreen;