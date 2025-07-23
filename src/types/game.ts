export interface GameState {
  currentScreen: 'loading' | 'menu' | 'level1' | 'level2' | 'credits' | 'results' | 'name-input' | 'leaderboard' | 'settings';
  currentLevel: number;
  score: number;
  highScore: number;
  level1Score: number;
  level2Score: number;
  playerName: string;
  hasEnteredName: boolean;
}

export interface TrafficSign {
  id: string;
  name: string;
  image: string;
  matched: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'animated-scenario';
  options: string[];
  correctAnswer: number;
  animation?: {
    type: 'traffic-light' | 'car-scenario' | 'medical-scenario';
    scenario: string;
  };
}

export interface LeaderboardEntry {
  name: string;
  score: number;
  date: string;
  level: number;
  level1Score?: number;
  level2Score?: number;
  totalScore?: number;
}

export interface GameContextType {
  gameState: GameState;
  updateGameState: (updates: Partial<GameState>) => void;
  resetGame: () => void;
  logout: () => void;
  addToLeaderboard: (name: string, score: number, level: number) => void;
  getLeaderboard: () => LeaderboardEntry[];
  getPlayerScores: (playerName: string) => LeaderboardEntry[];
}