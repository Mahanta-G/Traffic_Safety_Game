import React from 'react';
import { useGame } from '../context/GameContext';
import { ArrowLeft, Heart, Code, Gamepad2 } from 'lucide-react';

const CreditsScreen: React.FC = () => {
  const { updateGameState } = useGame();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-600 p-2 sm:p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6 sm:mb-8">
          <button
            onClick={() => updateGameState({ currentScreen: 'menu' })}
            className="flex items-center gap-2 text-white hover:bg-white/20 px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 sm:w-5 h-4 sm:h-5" />
            Back to Menu
          </button>
        </div>

        {/* Credits Content */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-6 sm:mb-8">Credits</h1>
          
          <div className="space-y-6 sm:space-y-8">
            {/* Game Title */}
            <div>
              <Gamepad2 className="w-12 sm:w-16 h-12 sm:h-16 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Follow the Track</h2>
              <p className="text-gray-600 text-sm sm:text-base">Interactive Traffic Safety Learning Game</p>
            </div>

            {/* Development */}
            <div className="bg-blue-50 rounded-xl p-4 sm:p-6">
              <Code className="w-8 sm:w-12 h-8 sm:h-12 text-blue-600 mx-auto mb-3" />
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Development</h3>
              <p className="text-gray-600 mb-2 text-sm sm:text-base">Built with React, TypeScript & Tailwind CSS</p>
              <p className="text-xs sm:text-sm text-gray-500">Modern web technologies for optimal performance</p>
            </div>

            {/* Purpose */}
            <div className="bg-green-50 rounded-xl p-4 sm:p-6">
              <Heart className="w-8 sm:w-12 h-8 sm:h-12 text-green-600 mx-auto mb-3" />
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Mission</h3>
              <p className="text-gray-600 mb-2 text-sm sm:text-base">Making traffic safety education fun and engaging</p>
              <p className="text-xs sm:text-sm text-gray-500">Learn through interactive games and animations</p>
            </div>

            {/* Features */}
            <div className="bg-purple-50 rounded-xl p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Game Features</h3>
              <div className="grid grid-cols-1 gap-4 text-xs sm:text-sm text-gray-600">
                <div className="text-left">
                  <h4 className="font-semibold text-gray-800 mb-2">Level 1: Memory Match</h4>
                  <ul className="space-y-1">
                    <li>• Interactive card matching</li>
                    <li>• Traffic sign recognition</li>
                    <li>• Time-based scoring</li>
                  </ul>
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-gray-800 mb-2">Level 2: Quiz Challenge</h4>
                  <ul className="space-y-1">
                    <li>• Animated scenarios</li>
                    <li>• Interactive traffic lights</li>
                    <li>• Real-world situations</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Technical Details */}
            <div className="bg-gray-50 rounded-xl p-4 sm:p-6 text-xs sm:text-sm text-gray-600">
              <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3">Technical Specifications</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                <div>
                  <p><strong>Frontend:</strong> React 18</p>
                  <p><strong>Language:</strong> TypeScript</p>
                  <p><strong>Styling:</strong> Tailwind CSS</p>
                </div>
                <div>
                  <p><strong>Icons:</strong> Lucide React</p>
                  <p><strong>Storage:</strong> localStorage</p>
                  <p><strong>Build Tool:</strong> Vite</p>
                </div>
              </div>
            </div>
            
             {/* Team Details */}
            <div className="bg-gray-50 rounded-xl p-4 sm:p-6 text-xs sm:text-sm text-gray-600">
              <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3">The Team Behind</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                <div>
                  <p><strong>Dr. Lily Podder</strong></p>
                  <p><strong>Choudhary Sarla</strong></p>
                  <p><strong>Deepanjali Chandel</strong></p>
                  <p><strong>Dikhchya Pokhrel</strong></p>
                  <p><strong>Diksha Riju Zade</strong></p>
                </div>
                <div>
                  <p><strong>Dimple Garg</strong></p>
                  <p><strong>Diya Kumari Malav</strong></p>
                  <p><strong>Diya Nagar</strong></p>
                  <p><strong>Dona Benny</strong></p>
                  <p><strong>Gaurab Kr. Mahanta</strong></p>
                </div>
              </div>
            </div>
            
            {/* Version */}
            <div className="text-center text-gray-500 text-xs sm:text-sm">
              <p>Version 1.0.0</p>
              <p>© 2025 Follow the Track - Educational Traffic Safety Game made as a project</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditsScreen;