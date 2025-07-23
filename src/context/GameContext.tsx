import React, { createContext, useContext, useState, useEffect } from 'react';
import { GameState, GameContextType, LeaderboardEntry } from '../types/game';
import { leaderboardService } from '../services/leaderboardService';
import { AudioManager } from '../utils/AudioManager';

const initialGameState: GameState = {
  currentScreen: 'loading',
  currentLevel: 1,
  score: 0,
  highScore: 0,
  level1Score: 0,
  level2Score: 0,
  playerName: '',
  hasEnteredName: false,
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem('trafficGameState');
    return saved ? { ...initialGameState, ...JSON.parse(saved) } : initialGameState;
  });

  // Initialize audio manager
  useEffect(() => {
    AudioManager.initialize();
    return () => {
      AudioManager.cleanup();
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('trafficGameState', JSON.stringify(gameState));
  }, [gameState]);

  const updateGameState = (updates: Partial<GameState>) => {
    setGameState(prev => ({ ...prev, ...updates }));
  };

  const resetGame = () => {
    setGameState(prev => ({
      ...initialGameState,
      highScore: prev.highScore,
      playerName: prev.playerName,
      hasEnteredName: prev.hasEnteredName,
    }));
  };

  const logout = () => {
    // Clear all localStorage data
    localStorage.removeItem('trafficGameState');
    localStorage.removeItem('trafficGameLeaderboard');
    
    // Clear all player history data
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('trafficGameHistory_')) {
        localStorage.removeItem(key);
      }
    });
    
    // Reset to initial state and go to name input
    setGameState({
      ...initialGameState,
      currentScreen: 'name-input'
    });
  };

  const addToLeaderboard = async (name: string, score: number, level: number) => {
    // Only add to leaderboard if score is greater than 0
    if (score <= 0) return;

    console.log(`Adding to leaderboard: ${name}, Score: ${score}, Level: ${level}`);

    // Try to add to backend first, fallback to localStorage
    try {
      const success = await leaderboardService.addScoreWithFallback(name, score, level);
      if (success) {
        console.log('Score successfully added to leaderboard');
      } else {
        console.log('Score not added (not high enough or duplicate)');
      }
    } catch (error) {
      console.error('Error adding to leaderboard:', error);
    }

    // Always add to player's personal history (localStorage)
    const playerHistory = getPlayerScores(name);
    
    // Check if this exact score already exists for this level and date (within same hour)
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    
    const existingRecentScore = playerHistory.find(entry => 
      entry.level === level && 
      entry.score === score &&
      new Date(entry.date) > oneHourAgo
    );
    
    // Only add if it's not a recent duplicate
    if (!existingRecentScore) {
      const newHistoryEntry: LeaderboardEntry = {
        name,
        score,
        level,
        date: new Date().toISOString(),
      };
      
      playerHistory.push(newHistoryEntry);
      // Sort by date (newest first)
      playerHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      localStorage.setItem(`trafficGameHistory_${name}`, JSON.stringify(playerHistory));
    }
  };

  const getLeaderboard = async (): Promise<LeaderboardEntry[]> => {
    try {
      const backendData = await leaderboardService.getLeaderboardWithFallback();
      
      // Convert backend format to frontend format if needed
      return backendData.map(entry => ({
        name: entry.player_name || entry.name,
        score: entry.score,
        level: entry.level,
        date: entry.created_at || entry.date || new Date().toISOString(),
      }));
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      
      // Final fallback to localStorage
      const saved = localStorage.getItem('trafficGameLeaderboard');
      return saved ? JSON.parse(saved) : [];
    }
  };

  const getPlayerScores = (playerName: string): LeaderboardEntry[] => {
    const saved = localStorage.getItem(`trafficGameHistory_${playerName}`);
    return saved ? JSON.parse(saved) : [];
  };

  const value = {
    gameState,
    updateGameState,
    resetGame,
    logout,
    addToLeaderboard,
    getLeaderboard,
    getPlayerScores,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};