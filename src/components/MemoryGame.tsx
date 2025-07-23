import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { trafficSigns } from '../data/gameData';
import { ArrowLeft, Clock, Move } from 'lucide-react';

interface Card {
  id: string;
  content: string;
  type: 'sign' | 'name';
  signId: string;
  flipped: boolean;
  matched: boolean;
}

const MemoryGame: React.FC = () => {
  const { gameState, updateGameState } = useGame();
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [moves, setMoves] = useState(25); // 25 moves per part
  const [timeLeft, setTimeLeft] = useState(300); // 300 seconds = 5 minutes per part
  const [gameCompleted, setGameCompleted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [showCorrectAnimation, setShowCorrectAnimation] = useState(false);
  const [showIncorrectAnimation, setShowIncorrectAnimation] = useState(false);
  const [correctAnimationIndex, setCorrectAnimationIndex] = useState(1);
  const [incorrectAnimationIndex, setIncorrectAnimationIndex] = useState(1);
  
  // New state for two-part system
  const [currentPart, setCurrentPart] = useState(1);
  const [part1Score, setPart1Score] = useState(0);
  const [part2Score, setPart2Score] = useState(0);
  const [showPartTransition, setShowPartTransition] = useState(false);

  useEffect(() => {
    initializeGame();
  }, [currentPart]);

  useEffect(() => {
    if (timeLeft > 0 && !gameCompleted && !gameOver && !showPartTransition) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !gameCompleted && !showPartTransition) {
      setGameOver(true);
      handlePartEnd();
    }
  }, [timeLeft, gameCompleted, gameOver, showPartTransition]);

  useEffect(() => {
    if (flippedCards.length === 2) {
      const timer = setTimeout(() => {
        checkMatch();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [flippedCards]);

  useEffect(() => {
    if (moves === 0 && !gameCompleted && !showPartTransition) {
      setGameOver(true);
      handlePartEnd();
    }
  }, [moves, gameCompleted, showPartTransition]);

  const initializeGame = () => {
    // Select 8 signs for each part
    const startIndex = (currentPart - 1) * 8;
    const selectedSigns = trafficSigns.slice(startIndex, startIndex + 8);
    const gameCards: Card[] = [];

    selectedSigns.forEach(sign => {
      gameCards.push({
        id: `sign-${sign.id}`,
        content: sign.image,
        type: 'sign',
        signId: sign.id,
        flipped: false,
        matched: false
      });
      gameCards.push({
        id: `name-${sign.id}`,
        content: sign.name,
        type: 'name',
        signId: sign.id,
        flipped: false,
        matched: false
      });
    });

    setCards(shuffleArray(gameCards));
    setMatchedPairs(0);
    setMoves(25); // Reset moves for new part
    setTimeLeft(300); // Reset time for new part
    setGameOver(false);
    setGameCompleted(false);
    setShowPartTransition(false);
  };

  const shuffleArray = (array: Card[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const handleCardClick = (cardId: string) => {
    if (flippedCards.length >= 2) return;
    if (flippedCards.includes(cardId)) return;
    if (moves === 0) return;
    if (gameOver || gameCompleted) return;
    if (showPartTransition) return;

    const clickedCard = cards.find(card => card.id === cardId);
    if (clickedCard && clickedCard.matched) return;

    setCards(prev => 
      prev.map(card => 
        card.id === cardId ? { ...card, flipped: true } : card
      )
    );
    setFlippedCards(prev => [...prev, cardId]);
  };

  const checkMatch = () => {
    setMoves(prev => Math.max(0, prev - 1));
    const [firstId, secondId] = flippedCards;
    const firstCard = cards.find(c => c.id === firstId);
    const secondCard = cards.find(c => c.id === secondId);

    if (firstCard && secondCard && firstCard.signId === secondCard.signId) {
      // Match found - show correct animation
      setCorrectAnimationIndex(Math.floor(Math.random() * 3) + 1);
      setShowCorrectAnimation(true);
      setTimeout(() => setShowCorrectAnimation(false), 2000);

      setCards(prev => 
        prev.map(card => 
          card.signId === firstCard.signId 
            ? { ...card, matched: true, flipped: true }
            : card
        )
      );
      
      const newMatchedPairs = matchedPairs + 1;
      setMatchedPairs(newMatchedPairs);
      
      // Check if current part is completed (8 pairs)
      if (newMatchedPairs === 8) {
        setGameCompleted(true);
        
        // Handle part completion
        if (currentPart === 1) {
          // Part 1 completed - transition to Part 2
          const partScore = calculatePartScore();
          setPart1Score(partScore);
          
          setShowPartTransition(true);
          setTimeout(() => {
            setCurrentPart(2);
          }, 2000);
        } else {
          // Part 2 completed - end game
          handlePartEnd();
        }
      }
    } else {
      // No match - show incorrect animation
      setIncorrectAnimationIndex(Math.floor(Math.random() * 3) + 1);
      setShowIncorrectAnimation(true);
      setTimeout(() => setShowIncorrectAnimation(false), 2000);

      setCards(prev => 
        prev.map(card => 
          [firstId, secondId].includes(card.id) 
            ? { ...card, flipped: false }
            : card
        )
      );
    }

    setFlippedCards([]);
  };

  const calculatePartScore = () => {
    // Base score: 100 points per matched pair
    // Bonus: time left * 2 + moves left * 5
    // Minimum score: matched pairs * 50
    
    const baseScore = matchedPairs * 100;
    const timeBonus = gameCompleted ? timeLeft * 2 : 0;
    const movesBonus = gameCompleted ? moves * 5 : 0;
    const minimumScore = matchedPairs * 50;
    
    const calculatedScore = baseScore + timeBonus + movesBonus;
    return Math.max(calculatedScore, minimumScore);
  };

  const handlePartEnd = () => {
    const partScore = calculatePartScore();
    
    if (currentPart === 1) {
      // Part 1 failed, end game with only part 1 score
      endGame(partScore, 0);
    } else {
      // Part 2 completed or failed
      setPart2Score(partScore);
      endGame(part1Score, partScore);
    }
  };

  const endGame = (finalPart1Score: number, finalPart2Score: number) => {
    const totalScore = finalPart1Score + finalPart2Score;
    
    console.log(`Memory Game Final Score Calculation:
      - Part 1 Score: ${finalPart1Score}
      - Part 2 Score: ${finalPart2Score}
      - Total Score: ${totalScore}`);
    
    const newHighScore = Math.max(gameState.highScore, totalScore);
    const newLevel1Score = Math.max(gameState.level1Score, totalScore);
    
    updateGameState({ 
      score: totalScore,
      highScore: newHighScore,
      level1Score: newLevel1Score,
      currentLevel: 1,
      currentScreen: 'results' 
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCorrectAnimationSrc = () => {
    return `/Correct-Incorrect/correct ${correctAnimationIndex}.gif`;
  };

  const getIncorrectAnimationSrc = () => {
    if (incorrectAnimationIndex === 1) return '/Correct-Incorrect/Incorrect.gif';
    return `/Correct-Incorrect/Incorrect ${incorrectAnimationIndex}.gif`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 p-2 sm:p-4 relative">
      <div className="max-w-6xl mx-auto">
        {/* Header - Responsive */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 gap-3 sm:gap-0">
          <button
            onClick={() => updateGameState({ currentScreen: 'menu' })}
            className="flex items-center gap-2 text-white hover:bg-white/20 px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 sm:w-5 h-4 sm:h-5" />
            Back to Menu
          </button>
          
          <div className="text-center text-white">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Memory Match - Part {currentPart}</h1>
            <p className="text-blue-100 text-sm sm:text-base">Match traffic signs with their names</p>
            <p className="text-xs sm:text-sm text-blue-200">Matched: {matchedPairs}/8 pairs</p>
            {currentPart === 1 && part1Score === 0 && (
              <p className="text-xs text-blue-300">Complete Part 1 to unlock Part 2</p>
            )}
          </div>

          <div className="flex sm:flex-col gap-2 sm:gap-0 text-right text-white space-y-0 sm:space-y-2">
            <div className="flex items-center gap-2 text-sm sm:text-lg font-semibold">
              <Clock className="w-4 sm:w-5 h-4 sm:h-5" />
              {formatTime(timeLeft)}
            </div>
            <div className="flex items-center gap-2 text-sm sm:text-lg font-semibold">
              <Move className="w-4 sm:w-5 h-4 sm:h-5" />
              {moves} moves left
            </div>
          </div>
        </div>

        {/* Game Board - Responsive grid */}
        <div className="grid grid-cols-4 gap-2 sm:gap-4 md:gap-6 max-w-xs sm:max-w-lg md:max-w-2xl mx-auto">
          {cards.map(card => (
            <div
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={`
                aspect-square rounded-lg sm:rounded-xl flex items-center justify-center cursor-pointer
                transform transition-all duration-300 hover:scale-105 relative overflow-hidden
                ${card.flipped || card.matched ? 'bg-white/90 text-gray-800' : 'hover:bg-white/30'}
                ${card.matched ? 'ring-2 sm:ring-4 ring-green-400' : ''}
                ${(moves === 0 || gameOver || showPartTransition) && !card.matched ? 'cursor-not-allowed opacity-50' : ''}
                ${card.matched ? 'cursor-not-allowed' : ''}
              `}
              style={{
                backgroundImage: card.flipped || card.matched ? 'none' : 'url(/crosswalk.jpeg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              {/* Dark overlay for unflipped cards */}
              {!(card.flipped || card.matched) && (
                <div className="absolute inset-0 bg-black/40 rounded-lg sm:rounded-xl"></div>
              )}
              
              <div className="text-center p-1 sm:p-2 w-full h-full flex items-center justify-center relative z-10">
                {card.flipped || card.matched ? (
                  card.type === 'sign' ? (
                    <img 
                      src={card.content} 
                      alt="Traffic Sign" 
                      className="w-full h-full object-contain rounded-md sm:rounded-lg"
                      onError={(e) => {
                        console.error('Image failed to load:', card.content);
                        e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zNSA2NUw2NSAzNU0zNSAzNUw2NSA2NSIgc3Ryb2tlPSIjOUI5QkEwIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4K';
                      }}
                    />
                  ) : (
                    <div 
                      className="text-xs sm:text-base md:text-xl font-black text-center px-1 leading-tight tracking-wider"
                      style={{ 
                        fontFamily: '"Times New Roman", "Trajan Pro", "Copperplate", serif',
                        fontWeight: '900',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                        letterSpacing: '0.5px'
                      }}
                    >
                      {card.content}
                    </div>
                  )
                ) : null}
              </div>
            </div>
          ))}
        </div>

        {/* Part Transition Message */}
        {showPartTransition && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 p-4">
            <div className="bg-white rounded-2xl p-6 sm:p-8 text-center animate-pulse max-w-sm w-full">
              <h2 className="text-2xl sm:text-3xl font-bold text-green-600 mb-4">Part 1 Complete!</h2>
              <p className="text-gray-600 text-base sm:text-lg">Loading Part 2...</p>
              <div className="mt-4">
                <div className="w-12 sm:w-16 h-12 sm:h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Left Side - Correct Animation (Responsive) */}
      {showCorrectAnimation && (
        <div className="fixed top-1/2 left-2 sm:left-8 transform -translate-y-1/2 z-50">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-2xl border-2 sm:border-4 border-green-400">
            <div className="text-center">
              <h3 className="text-xl sm:text-3xl font-bold text-green-600 mb-2 sm:mb-4">CORRECT!</h3>
              <img 
                src={getCorrectAnimationSrc()}
                alt="Correct!"
                className="w-16 sm:w-32 h-16 sm:h-32 object-contain animate-bounce"
              />
              <p className="text-green-600 font-semibold mt-1 sm:mt-2 text-sm sm:text-base">Great Match!</p>
            </div>
          </div>
        </div>
      )}

      {/* Right Side - Incorrect Animation (Responsive) */}
      {showIncorrectAnimation && (
        <div className="fixed top-1/2 right-2 sm:right-8 transform -translate-y-1/2 z-50">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-2xl border-2 sm:border-4 border-red-400">
            <div className="text-center">
              <h3 className="text-xl sm:text-3xl font-bold text-red-600 mb-2 sm:mb-4">TRY AGAIN!</h3>
              <img 
                src={getIncorrectAnimationSrc()}
                alt="Incorrect!"
                className="w-16 sm:w-32 h-16 sm:h-32 object-contain animate-bounce"
              />
              <p className="text-red-600 font-semibold mt-1 sm:mt-2 text-sm sm:text-base">Keep Trying!</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemoryGame;