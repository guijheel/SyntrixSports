import { useState } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { RefreshCw, Database, Wifi, AlertTriangle, CheckCircle, Clock, Trophy } from 'lucide-react';

interface MatchOddsOutcome {
  name: string;
  price: number;
  point?: number;
}

interface MatchOddsMarket {
  key: string;
  outcomes: MatchOddsOutcome[];
}

interface MatchOddsBookmaker {
  bookmaker: string;
  markets: MatchOddsMarket[];
  last_update: string;
}

interface MatchData {
  id: string;
  external_id: string;
  match_date: string;
  status: string;
  league: string;
  sport: string;
  home_team: string;
  away_team: string;
  home_score: number | null;
  away_score: number | null;
  home_logo: string | null;
  away_logo: string | null;
  home_ranking: number | null;
  away_ranking: number | null;
  odds: MatchOddsBookmaker[];
  stats: Record<string, unknown>;
  data_source: string;
  created_at: string;
}

const sportEmojis: Record<string, string> = {
  football: '⚽',
  basketball: '🏀',
  tennis: '🎾',
};

const statusColors: Record<string, string> = {
  upcoming: 'bg-secondary/20 text-secondary',
  live: 'bg-destructive/20 text-destructive',
  finished: 'bg-muted text-muted-foreground',
};

const ApiTest = () => {
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [result, setResult] = useState<{ success: boolean; fetched: number; upserted: number; errors: string[] } | null>(null);

  const fetchFromAPIs = async () => {
    setFetching(true);
    setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-matches');
      if (error) throw error;
      setResult(data);
      // After fetching, load from DB
      await loadFromDB();
    } catch (e: any) {
      setResult({ success: false, fetched: 0, upserted: 0, errors: [e.message] });
    } finally {
      setFetching(false);
    }
  };

  const loadFromDB = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .order('match_date', { ascending: true })
        .limit(50);
      if (error) throw error;
      setMatches((data as unknown as MatchData[]) || []);
    } catch (e) {
      console.error('Error loading matches:', e);
    } finally {
      setLoading(false);
    }
  };

  const getH2HOdds = (odds: MatchOddsBookmaker[]) => {
    if (!odds?.length) return null;
    const bk = odds[0];
    const h2h = bk.markets?.find((m) => m.key === 'h2h');
    return h2h ? { bookmaker: bk.bookmaker, outcomes: h2h.outcomes } : null;
  };

  const getTotalsOdds = (odds: MatchOddsBookmaker[]) => {
    if (!odds?.length) return null;
    const bk = odds[0];
    const totals = bk.markets?.find((m) => m.key === 'totals');
    return totals ? { bookmaker: bk.bookmaker, outcomes: totals.outcomes } : null;
  };

  return (
    <Layout>
      <div className="min-h-screen pt-32 pb-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="font-display text-4xl font-bold mb-2">🔧 Page de Test API</h1>
            <p className="text-muted-foreground">
              Test de récupération des matchs depuis les APIs externes (Odds-API, etc.)
            </p>
          </motion.div>

          {/* Actions */}
          <div className="flex flex-wrap gap-4 mb-8">
            <Button
              onClick={fetchFromAPIs}
              disabled={fetching}
              className="btn-gradient text-primary-foreground gap-2"
            >
              <Wifi className={`w-4 h-4 ${fetching ? 'animate-spin' : ''}`} />
              {fetching ? 'Récupération...' : 'Récupérer depuis les APIs'}
            </Button>
            <Button
              onClick={loadFromDB}
              disabled={loading}
              variant="outline"
              className="gap-2"
            >
              <Database className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Chargement...' : 'Charger depuis la BDD'}
            </Button>
          </div>

          {/* Result */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <Card className={`p-4 border ${result.success ? 'border-success/50' : 'border-destructive/50'}`}>
                <div className="flex items-center gap-2 mb-2">
                  {result.success ? (
                    <CheckCircle className="w-5 h-5 text-success" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                  )}
                  <span className="font-semibold">
                    {result.success ? 'Succès' : 'Erreur'}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>Matchs récupérés: <strong>{result.fetched}</strong></p>
                  <p>Matchs enregistrés: <strong>{result.upserted}</strong></p>
                  {result.errors?.length > 0 && (
                    <div className="mt-2">
                      <p className="text-warning font-medium">Avertissements:</p>
                      {result.errors.map((err, i) => (
                        <p key={i} className="text-xs text-warning/80">• {err}</p>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Stats */}
          {matches.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold">{matches.length}</div>
                <div className="text-xs text-muted-foreground">Total matchs</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold">
                  {new Set(matches.map((m) => m.league)).size}
                </div>
                <div className="text-xs text-muted-foreground">Ligues</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold">
                  {matches.filter((m) => m.odds?.length > 0).length}
                </div>
                <div className="text-xs text-muted-foreground">Avec cotes</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold">
                  {new Set(matches.map((m) => m.data_source)).size}
                </div>
                <div className="text-xs text-muted-foreground">Sources</div>
              </Card>
            </div>
          )}

          {/* Match Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {matches.map((match, i) => {
              const h2h = getH2HOdds(match.odds);
              const totals = getTotalsOdds(match.odds);
              return (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <Card className="p-5 hover:border-primary/30 transition-colors">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{sportEmojis[match.sport] || '🏅'}</span>
                        <span className="text-xs font-medium text-muted-foreground">
                          {match.league}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={`text-[10px] ${statusColors[match.status] || ''}`}>
                          {match.status}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">
                          {match.data_source}
                        </span>
                      </div>
                    </div>

                    {/* Teams */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex-1">
                        <div className="font-semibold">{match.home_team}</div>
                        <div className="text-muted-foreground text-sm my-1">vs</div>
                        <div className="font-semibold">{match.away_team}</div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                          <Clock className="w-3 h-3" />
                          {new Date(match.match_date).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                        {match.home_score !== null && (
                          <div className="text-xl font-bold">
                            {match.home_score} - {match.away_score}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Odds 1X2 */}
                    {h2h && (
                      <div className="mb-3">
                        <div className="text-[10px] text-muted-foreground mb-1 flex items-center gap-1">
                          <Trophy className="w-3 h-3" />
                          1X2 — {h2h.bookmaker}
                        </div>
                        <div className="flex gap-2">
                          {h2h.outcomes.map((o) => (
                            <div
                              key={o.name}
                              className="flex-1 bg-muted/50 rounded-lg p-2 text-center"
                            >
                              <div className="text-[10px] text-muted-foreground">{o.name}</div>
                              <div className="font-bold text-sm">{o.price.toFixed(2)}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Over/Under */}
                    {totals && (
                      <div>
                        <div className="text-[10px] text-muted-foreground mb-1">
                          Over/Under — {totals.bookmaker}
                        </div>
                        <div className="flex gap-2">
                          {totals.outcomes.map((o) => (
                            <div
                              key={o.name}
                              className="flex-1 bg-muted/50 rounded-lg p-2 text-center"
                            >
                              <div className="text-[10px] text-muted-foreground">
                                {o.name} {o.point}
                              </div>
                              <div className="font-bold text-sm">{o.price.toFixed(2)}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* No odds message */}
                    {!h2h && !totals && (
                      <div className="text-xs text-muted-foreground italic">
                        Aucune cote disponible
                      </div>
                    )}
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {matches.length === 0 && !loading && (
            <div className="text-center py-20">
              <RefreshCw className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Aucun match chargé. Cliquez sur "Récupérer depuis les APIs" ou "Charger depuis la BDD".
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ApiTest;
