const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export interface LeaderboardEntry {
  id?: string;
  player_name?: string;
  name?: string;
  score: number;
  level: number;
  created_at?: string;
  date?: string;
  expires_at?: string;
}

class LeaderboardService {
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor() {
    this.baseUrl = `${SUPABASE_URL}/functions/v1/leaderboard`;
    this.headers = {
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    };
  }

  async getLeaderboard(level?: number | 'all', limit: number = 50): Promise<LeaderboardEntry[]> {
    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
      });
      
      if (level && level !== 'all') {
        params.append('level', level.toString());
      }

      const response = await fetch(`${this.baseUrl}?${params}`, {
        method: 'GET',
        headers: this.headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data || [];
    } catch (error) {
      console.error('Error fetching leaderboard from backend:', error);
      throw error;
    }
  }

  async addScore(playerName: string, score: number, level: number): Promise<boolean> {
    try {
      // Only add scores > 0
      if (score <= 0) {
        return false;
      }

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          player_name: playerName,
          score: score,
          level: level,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.success || false;
    } catch (error) {
      console.error('Error adding score to backend:', error);
      throw error;
    }
  }

  // Fallback to localStorage if backend is unavailable
  async getLeaderboardWithFallback(level?: number | 'all', limit: number = 50): Promise<LeaderboardEntry[]> {
    try {
      // Try backend first
      const backendData = await this.getLeaderboard(level, limit);
      if (backendData && backendData.length >= 0) {
        console.log('Successfully fetched leaderboard from backend');
        
        // For global leaderboard, filter to show only the FIRST score per player per level
        if (level !== 'all') {
          return this.filterFirstScoresPerPlayer(backendData);
        }
        
        return backendData;
      }
    } catch (error) {
      console.warn('Backend unavailable, falling back to localStorage:', error);
    }

    // Fallback to localStorage
    console.log('Using localStorage fallback for leaderboard');
    const saved = localStorage.getItem('trafficGameLeaderboard');
    const localData: LeaderboardEntry[] = saved ? JSON.parse(saved) : [];
    
    let filteredData = localData;
    if (level && level !== 'all') {
      filteredData = localData.filter(entry => entry.level === level);
      // For global leaderboard, filter to show only the FIRST score per player per level
      filteredData = this.filterFirstScoresPerPlayer(filteredData);
    }
    
    return filteredData
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  // Filter to show only the FIRST score per player per level for global leaderboard
  private filterFirstScoresPerPlayer(data: LeaderboardEntry[]): LeaderboardEntry[] {
    const playerFirstScores = new Map<string, LeaderboardEntry>();
    
    // Sort by date first (oldest first) to get the first score
    const sortedData = data.sort((a, b) => {
      const dateA = new Date(a.created_at || a.date || '').getTime();
      const dateB = new Date(b.created_at || b.date || '').getTime();
      return dateA - dateB;
    });
    
    sortedData.forEach(entry => {
      const playerName = entry.player_name || entry.name || '';
      const key = `${playerName}_${entry.level}`;
      
      // Only keep the first score for each player/level combination
      if (!playerFirstScores.has(key)) {
        playerFirstScores.set(key, entry);
      }
    });
    
    return Array.from(playerFirstScores.values())
      .sort((a, b) => b.score - a.score);
  }

  async addScoreWithFallback(playerName: string, score: number, level: number): Promise<boolean> {
    // Only add scores > 0
    if (score <= 0) return false;

    let backendSuccess = false;
    
    try {
      // Try backend first
      backendSuccess = await this.addScore(playerName, score, level);
      if (backendSuccess) {
        console.log('Score successfully added to backend');
        return true;
      }
    } catch (error) {
      console.warn('Backend unavailable for score submission, using localStorage fallback:', error);
    }

    // Fallback to localStorage (always do this as backup)
    console.log('Using localStorage fallback for score submission');
    const saved = localStorage.getItem('trafficGameLeaderboard');
    const localData: LeaderboardEntry[] = saved ? JSON.parse(saved) : [];
    
    // Check if this is a better score
    const existingScores = localData.filter(entry => 
      (entry.player_name || entry.name) === playerName && entry.level === level
    );
    
    const shouldAdd = existingScores.length === 0 || 
      existingScores.every(entry => entry.score < score);
    
    if (shouldAdd) {
      // Remove lower scores for this player/level
      const filteredData = localData.filter(entry => 
        !((entry.player_name || entry.name) === playerName && entry.level === level && entry.score < score)
      );
      
      filteredData.push({
        player_name: playerName,
        name: playerName,
        score: score,
        level: level,
        created_at: new Date().toISOString(),
        date: new Date().toISOString(),
      });
      
      // Keep only top 50
      filteredData.sort((a, b) => b.score - a.score);
      const topEntries = filteredData.slice(0, 50);
      
      localStorage.setItem('trafficGameLeaderboard', JSON.stringify(topEntries));
      console.log('Score added to localStorage');
      return true;
    }
    
    return backendSuccess;
  }
}

export const leaderboardService = new LeaderboardService();