import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { ArrowLeft, Trophy, Medal, Award, User, Target, Crown, RefreshCw, Wifi, WifiOff, Clock, Shield } from 'lucide-react';

const LeaderboardScreen: React.FC = () => {
  const { gameState, updateGameState, getLeaderboard, getPlayerScores } = useGame();
  const [viewMode, setViewMode] = useState<'global' | 'personal'>('global');
  const [levelFilter, setLevelFilter] = useState<'all' | 1 | 2>('all');
  const [globalLeaderboard, setGlobalLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isOnline, setIsOnline] = useState(true);
  
  const personalScores = gameState.playerName ? getPlayerScores(gameState.playerName) : [];

  const fetchLeaderboard = async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);
    
    try {
      const data = await getLeaderboard();
      setGlobalLeaderboard(data);
      setLastUpdated(new Date());
      setIsOnline(true);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setError('Failed to load latest data. Showing cached scores.');
      setIsOnline(false);
      // Don't clear existing data on error
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const handleRefresh = () => {
    fetchLeaderboard(true);
  };

  // Filter data based on level
  const filterByLevel = (data: any[]) => {
    if (levelFilter === 'all') return data;
    return data.filter(entry => entry.level === levelFilter);
  };

  // Get combined scores for "all" view
  const getCombinedScores = (data: any[]) => {
    if (levelFilter !== 'all') return filterByLevel(data);
    
    const playerTotals = new Map();
    
    data.forEach(entry => {
      const key = `${entry.name}`;
      if (!playerTotals.has(key)) {
        playerTotals.set(key, {
          name: entry.name,
          level1Score: 0,
          level2Score: 0,
          totalScore: 0,
          date: entry.date,
          level: 'combined'
        });
      }
      
      const player = playerTotals.get(key);
      if (entry.level === 1) {
        player.level1Score = Math.max(player.level1Score, entry.score);
      } else if (entry.level === 2) {
        player.level2Score = Math.max(player.level2Score, entry.score);
      }
      player.totalScore = player.level1Score + player.level2Score;
      
      // Update date to most recent
      if (new Date(entry.date) > new Date(player.date)) {
        player.date = entry.date;
      }
    });
    
    return Array.from(playerTotals.values())
      .filter(player => player.totalScore > 0)
      .sort((a, b) => b.totalScore - a.totalScore);
  };

  const getDisplayData = () => {
    const baseData = viewMode === 'global' ? globalLeaderboard : personalScores;
    
    if (levelFilter === 'all') {
      return getCombinedScores(baseData);
    } else {
      return filterByLevel(baseData).sort((a, b) => b.score - a.score);
    }
  };

  const displayData = getDisplayData();

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-6 sm:w-8 h-6 sm:h-8 text-yellow-500" />;
      case 1:
        return <Medal className="w-6 sm:w-8 h-6 sm:h-8 text-gray-400" />;
      case 2:
        return <Award className="w-6 sm:w-8 h-6 sm:h-8 text-amber-600" />;
      default:
        return <div className="w-6 sm:w-8 h-6 sm:h-8 flex items-center justify-center text-gray-600 font-bold text-sm sm:text-lg">#{index + 1}</div>;
    }
  };

  const getRankColor = (index: number) => {
    switch (index) {
      case 0:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      case 1:
        return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
      case 2:
        return 'bg-gradient-to-r from-amber-500 to-amber-700 text-white';
      default:
        return 'bg-white/80 text-gray-800';
    }
  };

  const getLevelIcon = (level: any) => {
    if (level === 'combined') return <Crown className="w-4 sm:w-5 h-4 sm:h-5 text-purple-500" />;
    if (level === 1) return <span className="text-blue-500">🃏</span>;
    if (level === 2) return <span className="text-green-500">🚦</span>;
    return <Target className="w-4 sm:w-5 h-4 sm:h-5 text-gray-500" />;
  };

  const getLevelText = (entry: any) => {
    if (entry.level === 'combined') {
      return `Combined Score`;
    }
    return `Level ${entry.level}`;
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return diffInMinutes < 1 ? 'Just now' : `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 flex items-center justify-center p-4">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 sm:p-8 text-center max-w-sm sm:max-w-md w-full">
          <div className="w-12 sm:w-16 h-12 sm:h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4 sm:mb-6"></div>
          
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Loading Leaderboard</h3>
          
          <div className="space-y-3 text-xs sm:text-sm">
            <div className="flex items-center justify-center gap-2 text-blue-600">
              <Wifi className="w-3 sm:w-4 h-3 sm:h-4" />
              <span className="font-semibold">🌐 Connecting to secure database...</span>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-2 sm:p-3">
              <p className="text-blue-700 font-medium">✨ Scores are stored safely for 7 days</p>
              <p className="text-blue-600 text-xs mt-1">🔒 Your data is protected and automatically expires for privacy</p>
            </div>
            
            <div className="bg-green-50 rounded-lg p-2 sm:p-3">
              <p className="text-green-700 font-medium">🏆 Real-time global rankings</p>
              <p className="text-green-600 text-xs mt-1">📊 See how you compare with players worldwide</p>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-2 sm:p-3">
              <p className="text-purple-700 font-medium">⚡ Lightning-fast updates</p>
              <p className="text-purple-600 text-xs mt-1">🔄 Scores sync instantly across all devices</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 p-2 sm:p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header - Responsive */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 sm:mb-8 gap-3 sm:gap-0">
          <button
            onClick={() => updateGameState({ currentScreen: 'menu' })}
            className="flex items-center gap-2 text-white hover:bg-white/20 px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 sm:w-5 h-4 sm:h-5" />
            Back to Menu
          </button>

          {/* Connection Status & Refresh Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm ${
              isOnline ? 'bg-green-500/20 text-green-100' : 'bg-red-500/20 text-red-100'
            }`}>
              {isOnline ? <Wifi className="w-3 sm:w-4 h-3 sm:h-4" /> : <WifiOff className="w-3 sm:w-4 h-3 sm:h-4" />}
              {isOnline ? 'Online' : 'Offline'}
            </div>
            
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-1 sm:gap-2 text-white hover:bg-white/20 px-3 sm:px-4 py-2 rounded-lg transition-colors disabled:opacity-50 text-xs sm:text-sm"
            >
              <RefreshCw className={`w-3 sm:w-5 h-3 sm:h-5 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Leaderboard Content */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8">
          <div className="text-center mb-6 sm:mb-8">
            <Trophy className="w-12 sm:w-16 h-12 sm:h-16 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">Leaderboard</h1>
            <p className="text-gray-600 mb-4 text-sm sm:text-base">
              {viewMode === 'global' ? 'Top players of Follow the Track' : `${gameState.playerName}'s Score History`}
            </p>
            
            {/* Status Messages */}
            {error && (
              <div className="mb-4 text-xs sm:text-sm text-orange-600 bg-orange-100 rounded-lg px-3 sm:px-4 py-2 inline-block">
                ⚠️ {error}
              </div>
            )}
            
            {!error && isOnline && (
              <div className="mb-4 text-xs sm:text-sm text-green-600 bg-green-100 rounded-lg px-3 sm:px-4 py-2 inline-block">
                ✅ Connected to live leaderboard
              </div>
            )}
          </div>

          {/* Controls - Responsive */}
          <div className="flex flex-col gap-3 sm:gap-4 justify-center mb-4 sm:mb-6">
            {/* View Mode Toggle */}
            <div className="bg-gray-200 rounded-lg p-1 flex mx-auto">
              <button
                onClick={() => setViewMode('global')}
                className={`px-3 sm:px-4 py-2 rounded-md transition-colors text-xs sm:text-sm ${
                  viewMode === 'global' 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Trophy className="w-3 sm:w-4 h-3 sm:h-4 inline mr-1 sm:mr-2" />
                Global
              </button>
              <button
                onClick={() => setViewMode('personal')}
                className={`px-3 sm:px-4 py-2 rounded-md transition-colors text-xs sm:text-sm ${
                  viewMode === 'personal' 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                disabled={!gameState.playerName}
              >
                <User className="w-3 sm:w-4 h-3 sm:h-4 inline mr-1 sm:mr-2" />
                Personal
              </button>
            </div>

            {/* Level Filter */}
            <div className="bg-gray-200 rounded-lg p-1 flex mx-auto">
              <button
                onClick={() => setLevelFilter('all')}
                className={`px-2 sm:px-3 py-2 rounded-md transition-colors text-xs sm:text-sm ${
                  levelFilter === 'all' 
                    ? 'bg-purple-500 text-white' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Crown className="w-3 sm:w-4 h-3 sm:h-4 inline mr-1" />
                Combined
              </button>
              <button
                onClick={() => setLevelFilter(1)}
                className={`px-2 sm:px-3 py-2 rounded-md transition-colors text-xs sm:text-sm ${
                  levelFilter === 1 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                🃏 Level 1
              </button>
              <button
                onClick={() => setLevelFilter(2)}
                className={`px-2 sm:px-3 py-2 rounded-md transition-colors text-xs sm:text-sm ${
                  levelFilter === 2 
                    ? 'bg-green-500 text-white' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                🚦 Level 2
              </button>
            </div>
          </div>

          {displayData.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <div className="text-4xl sm:text-6xl mb-4">🏆</div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                {viewMode === 'global' ? 'No scores yet!' : 'No personal scores yet!'}
              </h3>
              <p className="text-gray-600 mb-4 text-sm sm:text-base">
                {viewMode === 'global' 
                  ? 'Be the first to set a high score!' 
                  : 'Play some games to see your scores here!'
                }
              </p>
              {error && (
                <button
                  onClick={handleRefresh}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-lg transition-colors text-sm sm:text-base"
                >
                  Try Again
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {displayData.map((entry, index) => (
                <div
                  key={`${entry.name}-${entry.date}-${entry.level}-${index}`}
                  className={`
                    ${viewMode === 'global' && index < 3 ? getRankColor(index) : 'bg-white/80 text-gray-800'}
                    rounded-xl p-3 sm:p-4 md:p-6 flex items-center justify-between
                    transform transition-all duration-300 hover:scale-105
                    ${index < 3 && viewMode === 'global' ? 'shadow-lg' : 'shadow-md'}
                  `}
                >
                  <div className="flex items-center gap-2 sm:gap-4">
                    {viewMode === 'global' ? getRankIcon(index) : getLevelIcon(entry.level)}
                    <div>
                      <h3 className="text-sm sm:text-lg md:text-xl font-bold">{entry.name}</h3>
                      <p className={`text-xs sm:text-sm ${
                        viewMode === 'global' && index < 3 ? 'text-white/80' : 'text-gray-500'
                      }`}>
                        {getLevelText(entry)} • {formatDateTime(entry.date)}
                      </p>
                      {entry.level === 'combined' && (
                        <p className={`text-xs ${
                          viewMode === 'global' && index < 3 ? 'text-white/60' : 'text-gray-400'
                        }`}>
                          Memory: {entry.level1Score} + Quiz: {entry.level2Score}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg sm:text-xl md:text-2xl font-bold">
                      {entry.level === 'combined' ? entry.totalScore : entry.score}
                    </div>
                    <div className={`text-xs sm:text-sm ${
                      viewMode === 'global' && index < 3 ? 'text-white/80' : 'text-gray-500'
                    }`}>
                      points
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer Information - Responsive */}
          {displayData.length > 0 && (
            <div className="mt-6 sm:mt-8 space-y-4">
              {/* Statistics */}
              <div className="text-center text-gray-500 text-xs sm:text-sm space-y-1">
                <p className="font-medium">
                  {viewMode === 'global' 
                    ? `Showing top ${displayData.length} ${levelFilter === 'all' ? 'combined scores' : `level ${levelFilter} scores`}`
                    : `Showing ${displayData.length} ${levelFilter === 'all' ? 'combined scores' : `level ${levelFilter} scores`}`
                  }
                </p>
                {viewMode === 'global' && levelFilter !== 'all' && (
                  <p className="text-xs text-gray-400">Only first scores per player are shown in global leaderboard</p>
                )}
              </div>
              
              {/* Security & Privacy Information - Responsive */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 sm:p-6 space-y-3">
                <div className="flex items-center justify-center gap-2 text-blue-700">
                  <Shield className="w-4 sm:w-5 h-4 sm:h-5" />
                  <h4 className="font-bold text-sm sm:text-lg">Data Security & Privacy</h4>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                  <div className="bg-white/60 rounded-lg p-2 sm:p-3">
                    <p className="text-blue-700 font-semibold flex items-center gap-2">
                      🌐 <span>Secure Cloud Storage</span>
                    </p>
                    <p className="text-blue-600 text-xs mt-1">
                      Scores are stored securely and persist for 7 days
                    </p>
                  </div>
                  
                  <div className="bg-white/60 rounded-lg p-2 sm:p-3">
                    <p className="text-purple-700 font-semibold flex items-center gap-2">
                      🔒 <span>Privacy Protected</span>
                    </p>
                    <p className="text-purple-600 text-xs mt-1">
                      Your data automatically expires for privacy
                    </p>
                  </div>
                  
                  <div className="bg-white/60 rounded-lg p-2 sm:p-3">
                    <p className="text-green-700 font-semibold flex items-center gap-2">
                      ⚡ <span>Real-time Updates</span>
                    </p>
                    <p className="text-green-600 text-xs mt-1">
                      Scores sync instantly across all devices
                    </p>
                  </div>
                  
                  <div className="bg-white/60 rounded-lg p-2 sm:p-3">
                    <p className="text-orange-700 font-semibold flex items-center gap-2">
                      <Clock className="w-3 sm:w-4 h-3 sm:h-4" />
                      <span>Last Updated</span>
                    </p>
                    <p className="text-orange-600 text-xs mt-1">
                      {lastUpdated.toLocaleTimeString()} • {refreshing ? 'Refreshing...' : 'Click refresh for latest'}
                    </p>
                  </div>
                </div>
                
                <div className="text-center pt-2 border-t border-white/30">
                  <p className="text-xs text-gray-500">
                    🏆 Compete fairly • 🌍 Global rankings • 📊 Track your progress
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardScreen;