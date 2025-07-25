import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { quizQuestions } from '../data/gameData';
import { ArrowLeft, Clock, X } from 'lucide-react';
import { AudioManager } from '../utils/AudioManager';

const QuizGame: React.FC = () => {
  const { gameState, updateGameState } = useGame();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); // 1 minutes per question
  const [showVideoPopup, setShowVideoPopup] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const totalQuestions = quizQuestions.length;

  useEffect(() => {
    if (timeLeft > 0 && !showResult && selectedAnswer === null && !showVideoPopup) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && selectedAnswer === null && !showVideoPopup) {
      handleTimeUp();
    }
  }, [timeLeft, showResult, selectedAnswer, showVideoPopup]);

  const handleTimeUp = () => {
    setSelectedAnswer(-1); // Indicates time up
    setScore(prev => prev - 50); // Deduct 50 points for timeout
    setTimeout(() => {
      nextQuestion();
    }, 2000);
  };

  const getVideoPath = (questionIndex: number, isCorrect: boolean) => {
    const questionNumber = questionIndex + 1;
    const option = isCorrect ? 'rightOption' : 'wrongOption';
    return `/Quiz-Animations/Q${questionNumber}_${option}.mp4`;
  };

  const hasVideo = (questionIndex: number) => {
    // This function will automatically detect if videos exist for any question
    // You can add more question numbers here as you add more videos
    const questionsWithVideos = [2, 3, 5, 6, 7, 9, 13]; // Q3 (0-indexed), add more as needed: [2, 4, 7, etc.]
    return questionsWithVideos.includes(questionIndex);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    const correct = answerIndex === currentQuestion.correctAnswer;
    setIsCorrectAnswer(correct);
    
    if (correct) {
      setScore(prev => prev + 100); // +100 for correct answer
    } else {
      setScore(prev => prev - 50); // -50 for wrong answer
    }

    // Check if this question has video animations
    if (hasVideo(currentQuestionIndex)) {
      const videoPath = getVideoPath(currentQuestionIndex, correct);
      setCurrentVideo(videoPath);
      setShowVideoPopup(true);
      // Duck background music during video
      AudioManager.duck();
    } else {
      // For questions without videos, show result and move to next question
      setTimeout(() => {
        nextQuestion();
      }, 2000);
    }
  };

  const closeVideoPopup = () => {
    setShowVideoPopup(false);
    setCurrentVideo(null);
    // Restore background music with fade-in
    AudioManager.unduck();
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    setTimeout(() => {
      nextQuestion();
    }, 500);
  };

  const handleVideoEnd = () => {
    // Restore background music when video ends naturally
    AudioManager.unduck();
    setTimeout(() => {
      closeVideoPopup();
    }, 1000); // Small delay before auto-closing
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setTimeLeft(60); // Reset timer for next question
    } else {
      endGame();
    }
  };

  const endGame = () => {
    const finalScore = Math.max(0, score); // Ensure score doesn't go below 0
    const newHighScore = Math.max(gameState.highScore, finalScore);
    const newLevel2Score = Math.max(gameState.level2Score, finalScore);
    
    updateGameState({ 
      score: finalScore,
      highScore: newHighScore,
      level2Score: newLevel2Score,
      currentLevel: 2,
      currentScreen: 'results' 
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 to-teal-600 p-2 sm:p-4 relative">
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
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Quiz Challenge</h1>
            <p className="text-green-100 text-sm sm:text-base">Question {currentQuestionIndex + 1} of {totalQuestions}</p>
          </div>

          <div className="flex sm:flex-col gap-2 sm:gap-0 text-right text-white">
            <div className="flex items-center gap-2 text-sm sm:text-lg font-semibold">
              <Clock className="w-4 sm:w-5 h-4 sm:h-5" />
              {formatTime(timeLeft)}
            </div>
            <div className="text-xs sm:text-sm text-green-100">Score: {score}</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4 sm:mb-6">
          <div className="w-full bg-white/20 rounded-full h-2 sm:h-3">
            <div 
              className="bg-white h-2 sm:h-3 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-6 sm:mb-8 text-center">
            {currentQuestion.question}
          </h2>

          {/* Answer Options - Left/Right Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 max-w-4xl mx-auto">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={selectedAnswer !== null || showVideoPopup}
                className={`
                  p-3 sm:p-4 md:p-5 rounded-xl text-sm sm:text-base md:text-lg font-semibold transition-all duration-300 transform hover:scale-105
                  min-h-[67px] sm:min-h-[80px] md:min-h-[93px] flex items-center justify-center text-center
                  ${selectedAnswer === null && !showVideoPopup
                    ? 'bg-gray-100 hover:bg-gray-200 text-gray-800 shadow-lg hover:shadow-xl' 
                    : selectedAnswer === index
                      ? index === currentQuestion.correctAnswer
                        ? 'bg-green-500 text-white shadow-lg'
                        : 'bg-red-500 text-white shadow-lg'
                      : index === currentQuestion.correctAnswer && selectedAnswer !== index
                        ? 'bg-green-500 text-white shadow-lg'
                        : 'bg-gray-300 text-gray-600'
                  }
                  ${selectedAnswer !== null || showVideoPopup ? 'cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                <div>
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">
                    {String.fromCharCode(65 + index)}.
                  </div>
                  <div className="leading-relaxed">
                    {option}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Result Message */}
          {selectedAnswer !== null && !showVideoPopup && (
            <div className="mt-6 sm:mt-8 text-center">
              {selectedAnswer === -1 ? (
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-red-600">⏰ Time's Up! -50 points</p>
              ) : selectedAnswer === currentQuestion.correctAnswer ? (
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-green-600">✅ Correct! +100 points</p>
              ) : (
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-red-600">❌ Wrong Answer! -50 points</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Video Popup Overlay */}
      {showVideoPopup && currentVideo && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl w-full">
            {/* Result Text Above Video */}
            <div className="text-center mb-4">
              <div className={`inline-block px-6 py-3 rounded-xl text-white font-bold text-xl sm:text-2xl ${
                isCorrectAnswer ? 'bg-green-500' : 'bg-red-500'
              }`}>
                {isCorrectAnswer ? '✅ Correct Answer!' : '❌ Wrong Answer!'}
              </div>
            </div>

            {/* Video Container */}
            <div className={`relative rounded-2xl overflow-hidden border-4 ${
              isCorrectAnswer ? 'border-green-500' : 'border-red-500'
            } shadow-2xl`}>
              {/* Skip/Close Button */}
              <button
                onClick={closeVideoPopup}
                className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Video Element */}
              <video
                ref={videoRef}
                src={currentVideo}
                autoPlay
                controls
                onEnded={handleVideoEnd}
                className="w-full h-auto max-h-[70vh] object-contain bg-black"
                style={{ aspectRatio: '16/9' }}
              >
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Skip Text */}
            <div className="text-center mt-4">
              <p className="text-white/80 text-sm">
                Video will auto-close when finished, or click the X to skip
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizGame;