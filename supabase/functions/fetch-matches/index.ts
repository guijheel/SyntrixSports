import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const LEAGUES_ALLOWED: Record<string, string[]> = {
  football: [
    "soccer_epl",
    "soccer_spain_la_liga",
    "soccer_italy_serie_a",
    "soccer_france_ligue_one",
    "soccer_germany_bundesliga",
  ],
  basketball: [
    "basketball_nba",
    "basketball_euroleague",
  ],
};

const LEAGUE_DISPLAY: Record<string, string> = {
  soccer_epl: "Premier League",
  soccer_spain_la_liga: "La Liga",
  soccer_italy_serie_a: "Serie A",
  soccer_france_ligue_one: "Ligue 1",
  soccer_germany_bundesliga: "Bundesliga",
  basketball_nba: "NBA",
  basketball_euroleague: "EuroLeague",
};

interface NormalizedMatch {
  external_id: string;
  match_date: string;
  status: string;
  league: string;
  sport: string;
  home_team: string;
  away_team: string;
  home_score?: number;
  away_score?: number;
  odds: any[];
  stats: any;
  data_source: string;
  source_priority: number;
}

async function fetchWithRetry(url: string, maxRetries = 3): Promise<Response> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const response = await fetch(url);
    if (response.ok) return response;
    if (response.status === 429) {
      const delay = Math.pow(2, attempt) * 1000;
      console.log(`Rate limited, waiting ${delay}ms`);
      await new Promise((r) => setTimeout(r, delay));
      continue;
    }
    throw new Error(`API request failed: ${response.status} ${await response.text()}`);
  }
  throw new Error("Max retries exceeded");
}

async function fetchOddsAPI(apiKey: string): Promise<NormalizedMatch[]> {
  const allMatches: NormalizedMatch[] = [];
  const allLeagues = [...LEAGUES_ALLOWED.football, ...LEAGUES_ALLOWED.basketball];

  for (const league of allLeagues) {
    try {
      const url = `https://api.the-odds-api.com/v4/sports/${league}/odds/?apiKey=${apiKey}&regions=eu&markets=h2h,totals,spreads&oddsFormat=decimal`;
      const res = await fetchWithRetry(url);
      const data = await res.json();
      const sport = LEAGUES_ALLOWED.football.includes(league) ? "football" : "basketball";

      for (const event of data) {
        const oddsData = event.bookmakers?.map((bk: any) => ({
          bookmaker: bk.title,
          markets: bk.markets?.map((m: any) => ({
            key: m.key,
            outcomes: m.outcomes?.map((o: any) => ({
              name: o.name,
              price: o.price,
              point: o.point,
            })),
          })),
          last_update: bk.last_update,
        })) || [];

        allMatches.push({
          external_id: event.id,
          match_date: event.commence_time,
          status: new Date(event.commence_time) > new Date() ? "upcoming" : "live",
          league: LEAGUE_DISPLAY[league] || league,
          sport,
          home_team: event.home_team,
          away_team: event.away_team,
          odds: oddsData,
          stats: {},
          data_source: "odds-api",
          source_priority: 1,
        });
      }
      console.log(`${league}: ${data.length} events`);
    } catch (e) {
      console.error(`Error fetching ${league}:`, e.message);
    }
  }
  return allMatches;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const ODDS_API_KEY = Deno.env.get("ODDS_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    let matches: NormalizedMatch[] = [];
    const errors: string[] = [];

    if (ODDS_API_KEY) {
      try {
        const oddsMatches = await fetchOddsAPI(ODDS_API_KEY);
        matches = [...matches, ...oddsMatches];
        console.log(`Total fetched: ${oddsMatches.length} matches`);
      } catch (e) {
        errors.push(`Odds API error: ${e.message}`);
      }
    } else {
      errors.push("ODDS_API_KEY not configured");
    }

    let upserted = 0;
    for (const match of matches) {
      const { error } = await supabase.from("matches").upsert(
        {
          external_id: match.external_id,
          match_date: match.match_date,
          status: match.status,
          league: match.league,
          sport: match.sport,
          home_team: match.home_team,
          away_team: match.away_team,
          home_score: match.home_score ?? null,
          away_score: match.away_score ?? null,
          odds: match.odds,
          stats: match.stats,
          data_source: match.data_source,
          source_priority: match.source_priority,
        },
        { onConflict: "external_id,data_source" }
      );
      if (error) {
        console.error("Upsert error:", error);
        errors.push(`DB error: ${error.message}`);
      } else {
        upserted++;
      }
    }

    return new Response(
      JSON.stringify({ success: true, fetched: matches.length, upserted, errors }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Fatal error:", error);
    return new Response(
      JSON.stringify({ success: false, fetched: 0, upserted: 0, errors: [error.message] }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
