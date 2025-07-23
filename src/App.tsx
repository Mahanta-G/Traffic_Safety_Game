import React from 'react';
import { GameProvider, useGame } from './context/GameContext';
import LoadingScreen from './components/LoadingScreen';
import NameInputScreen from './components/NameInputScreen';
import MainMenu from './components/MainMenu';
import MemoryGame from './components/MemoryGame';
import QuizGame from './components/QuizGame';
import ResultsScreen from './components/ResultsScreen';
import CreditsScreen from './components/CreditsScreen';
import LeaderboardScreen from './components/LeaderboardScreen';
import SettingsScreen from './components/SettingsScreen';

const GameContent: React.FC = () => {
  const { gameState } = useGame();

  const renderCurrentScreen = () => {
    switch (gameState.currentScreen) {
      case 'loading':
        return <LoadingScreen />;
      case 'name-input':
        return <NameInputScreen />;
      case 'menu':
        return <MainMenu />;
      case 'level1':
        return <MemoryGame />;
      case 'level2':
        return <QuizGame />;
      case 'results':
        return <ResultsScreen />;
      case 'credits':
        return <CreditsScreen />;
      case 'leaderboard':
        return <LeaderboardScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <MainMenu />;
    }
  };

  return <div>{renderCurrentScreen()}</div>;
};

function App() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
}

export default App;