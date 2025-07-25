import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { ArrowLeft, Volume2, VolumeX, Sun, Moon } from 'lucide-react';
import { AudioManager } from '../utils/AudioManager';

const SettingsScreen: React.FC = () => {
  const { updateGameState } = useGame();
  const [volume, setVolume] = useState(0.5);
  const [brightness, setBrightness] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    // Load saved settings
    const savedVolume = localStorage.getItem('gameVolume');
    const savedBrightness = localStorage.getItem('gameBrightness');
    
    if (savedVolume) {
      const vol = parseFloat(savedVolume);
      setVolume(vol);
      setIsMuted(vol === 0);
    }
    
    if (savedBrightness) {
      const bright = parseFloat(savedBrightness);
      setBrightness(bright);
      applyBrightness(bright);
    }
  }, []);

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    AudioManager.setVolume(newVolume);
  };

  const toggleMute = () => {
    if (isMuted) {
      const newVolume = 0.5;
      setVolume(newVolume);
      setIsMuted(false);
      AudioManager.setVolume(newVolume);
    } else {
      setVolume(0);
      setIsMuted(true);
      AudioManager.setVolume(0);
    }
  };

  const applyBrightness = (brightnessValue: number) => {
    document.documentElement.style.filter = `brightness(${brightnessValue})`;
  };

  const handleBrightnessChange = (newBrightness: number) => {
    setBrightness(newBrightness);
    applyBrightness(newBrightness);
    localStorage.setItem('gameBrightness', newBrightness.toString());
  };

  const resetSettings = () => {
    handleVolumeChange(0.5);
    handleBrightnessChange(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-2 sm:p-4">
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

        {/* Settings Content */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">Settings</h1>
            <p className="text-gray-600 text-sm sm:text-base">Customize your game experience</p>
          </div>

          <div className="space-y-6 sm:space-y-8">
            {/* Volume Control */}
            <div className="bg-blue-50 rounded-xl p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <button
                  onClick={toggleMute}
                  className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                >
                  {isMuted ? <VolumeX className="w-5 sm:w-6 h-5 sm:h-6" /> : <Volume2 className="w-5 sm:w-6 h-5 sm:h-6" />}
                </button>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800">Background Music</h3>
                  <p className="text-gray-600 text-sm sm:text-base">Adjust the volume of background music</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-600 w-12">0%</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${volume * 100}%, #e5e7eb ${volume * 100}%, #e5e7eb 100%)`
                    }}
                  />
                  <span className="text-sm font-medium text-gray-600 w-12">100%</span>
                </div>
                <div className="text-center">
                  <span className="text-lg font-bold text-blue-600">{Math.round(volume * 100)}%</span>
                </div>
              </div>
            </div>

            {/* Brightness Control */}
            <div className="bg-yellow-50 rounded-xl p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-yellow-500 text-white">
                  {brightness < 0.7 ? <Moon className="w-5 sm:w-6 h-5 sm:h-6" /> : <Sun className="w-5 sm:w-6 h-5 sm:h-6" />}
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800">Screen Brightness</h3>
                  <p className="text-gray-600 text-sm sm:text-base">Adjust the screen brightness level</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-600 w-12">Dark</span>
                  <input
                    type="range"
                    min="0.3"
                    max="1.5"
                    step="0.1"
                    value={brightness}
                    onChange={(e) => handleBrightnessChange(parseFloat(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #eab308 0%, #eab308 ${((brightness - 0.3) / 1.2) * 100}%, #e5e7eb ${((brightness - 0.3) / 1.2) * 100}%, #e5e7eb 100%)`
                    }}
                  />
                  <span className="text-sm font-medium text-gray-600 w-12">Bright</span>
                </div>
                <div className="text-center">
                  <span className="text-lg font-bold text-yellow-600">{Math.round(brightness * 100)}%</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <button
                  onClick={resetSettings}
                  className="bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors text-sm sm:text-base"
                >
                  Reset to Default
                </button>
                <button
                  onClick={toggleMute}
                  className={`${isMuted ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'} text-white py-3 px-4 rounded-lg font-semibold transition-colors text-sm sm:text-base`}
                >
                  {isMuted ? 'Unmute Audio' : 'Mute Audio'}
                </button>
              </div>
            </div>

            {/* Info Section */}
            <div className="bg-purple-50 rounded-xl p-4 sm:p-6 text-center">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Settings Info</h3>
              <div className="text-sm sm:text-base text-gray-600 space-y-1">
                <p>🎵 Background music enhances your gaming experience</p>
                <p>🔆 Adjust brightness for comfortable viewing</p>
                <p>💾 Your settings are automatically saved</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;