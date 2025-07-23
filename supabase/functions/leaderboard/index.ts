import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

interface LeaderboardEntry {
  player_name: string;
  score: number;
  level: number;
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const url = new URL(req.url);
    const method = req.method;

    if (method === 'GET') {
      // Get leaderboard data
      const level = url.searchParams.get('level');
      const limit = parseInt(url.searchParams.get('limit') || '50');

      let query = supabaseClient
        .from('leaderboard')
        .select('*')
        .gt('expires_at', new Date().toISOString())
        .order('score', { ascending: false })
        .limit(limit);

      if (level && level !== 'all') {
        query = query.eq('level', parseInt(level));
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching leaderboard:', error);
        return new Response(
          JSON.stringify({ error: 'Failed to fetch leaderboard' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      return new Response(
        JSON.stringify(data || []),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );

    } else if (method === 'POST') {
      // Add new score to leaderboard
      const body: LeaderboardEntry = await req.json();
      
      // Validate input
      if (!body.player_name || typeof body.score !== 'number' || typeof body.level !== 'number') {
        return new Response(
          JSON.stringify({ error: 'Invalid input data' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Only add scores > 0
      if (body.score <= 0) {
        return new Response(
          JSON.stringify({ error: 'Score must be greater than 0' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Check if player already has a better score for this level
      const { data: existingScores } = await supabaseClient
        .from('leaderboard')
        .select('score')
        .eq('player_name', body.player_name)
        .eq('level', body.level)
        .gt('expires_at', new Date().toISOString())
        .order('score', { ascending: false })
        .limit(1);

      // Only insert if this is a new high score for this player/level
      if (!existingScores || existingScores.length === 0 || existingScores[0].score < body.score) {
        const { data, error } = await supabaseClient
          .from('leaderboard')
          .insert([{
            player_name: body.player_name,
            score: body.score,
            level: body.level,
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
          }])
          .select();

        if (error) {
          console.error('Error inserting score:', error);
          return new Response(
            JSON.stringify({ error: 'Failed to save score' }),
            { 
              status: 500, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }

        return new Response(
          JSON.stringify({ success: true, data: data?.[0] }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      } else {
        return new Response(
          JSON.stringify({ success: false, message: 'Score not high enough' }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

    } else {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});