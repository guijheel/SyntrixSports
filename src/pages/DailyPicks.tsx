import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Lock, Calendar, Eye, Trophy, Filter } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { MatchCard } from '@/components/MatchCard';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { PredictionDetailDialog } from '@/components/PredictionDetailDialog';

interface Prediction {
  id: string;
  match_title: string;
  league: string;
  prediction: string;
  odds: number;
  confidence: number;
  match_date: string;
  is_premium: boolean | null;
  result: string | null;
}

const LEAGUE_ICONS: Record<string, string> = {
  'champions league': '🏆',
  'premier league': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  'ligue 1': '🇫🇷',
  'la liga': '🇪🇸',
  'serie a': '🇮🇹',
  'bundesliga': '🇩🇪',
  'ligue des champions': '🏆',
  'nba': '🏀',
  'atp': '🎾',
  'wta': '🎾',
  'europa league': '🌍',
  'mls': '🇺🇸',
};

const getLeagueIcon = (league: string) => {
  const lower = league.toLowerCase();
  for (const [key, icon] of Object.entries(LEAGUE_ICONS)) {
    if (lower.includes(key)) return icon;
  }
  return '⚽';
};

const getSportFromLeague = (league: string): 'football' | 'basketball' | 'tennis' => {
  const lower = league.toLowerCase();
  if (lower.includes('nba') || lower.includes('basketball') || lower.includes('euroleague')) return 'basketball';
  if (lower.includes('atp') || lower.includes('wta') || lower.includes('tennis')) return 'tennis';
  return 'football';
};

const DailyPicks = () => {
  const { t } = useTranslation();
  const { user, loading: authLoading, subscription } = useAuth();
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [filteredPredictions, setFilteredPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrediction, setSelectedPrediction] = useState<Prediction | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedLeague, setSelectedLeague] = useState<string>('all');
  const [selectedSport, setSelectedSport] = useState<string>('all');
  const [leagues, setLeagues] = useState<string[]>([]);

  useEffect(() => {
    fetchPredictions();
  }, []);

  useEffect(() => {
    let filtered = predictions;
    if (selectedLeague !== 'all') {
      filtered = filtered.filter(p => p.league === selectedLeague);
    }
    if (selectedSport !== 'all') {
      filtered = filtered.filter(p => getSportFromLeague(p.league) === selectedSport);
    }
    setFilteredPredictions(filtered);
  }, [predictions, selectedLeague, selectedSport]);

  const fetchPredictions = async () => {
    try {
      // Only fetch today + future predictions, not past ones
      const now = new Date();
      now.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from('predictions')
        .select('*')
        .or('archived.is.null,archived.eq.false')
        .gte('match_date', now.toISOString())
        .order('match_date', { ascending: true });

      if (error) throw error;
      const preds = data || [];
      setPredictions(preds);

      // Extract unique leagues
      const uniqueLeagues = [...new Set(preds.map(p => p.league))];
      setLeagues(uniqueLeagues);
    } catch (error) {
      console.error('Error fetching predictions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (prediction: Prediction) => {
    if (prediction.is_premium && !subscription.subscribed) return;
    setSelectedPrediction(prediction);
    setDialogOpen(true);
  };

  // Group by date
  const groupByDate = (preds: Prediction[]) => {
    const groups: Record<string, Prediction[]> = {};
    preds.forEach(p => {
      const dateKey = new Date(p.match_date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(p);
    });
    return groups;
  };

  if (authLoading) {
    return (
      <Layout>
        <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen pt-32 pb-20">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md mx-auto text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Lock className="w-10 h-10 text-primary" />
              </div>
              <h1 className="font-display text-3xl font-bold mb-4">{t('auth.loginRequired')}</h1>
              <p className="text-muted-foreground mb-8">
                Connectez-vous pour accéder aux pronostics du jour et maximiser vos gains.
              </p>
              <div className="flex gap-4 justify-center">
                <Link to="/auth"><Button variant="outline">{t('nav.login')}</Button></Link>
                <Link to="/auth"><Button className="btn-gradient text-primary-foreground">{t('nav.signup')}</Button></Link>
              </div>
            </motion.div>
          </div>
        </div>
      </Layout>
    );
  }

  const grouped = groupByDate(filteredPredictions);

  return (
    <Layout>
      <div className="min-h-screen pt-32 pb-20">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="font-display text-4xl font-bold mb-2">{t('nav.dailyPicks')}</h1>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full ml-2">
                    {filteredPredictions.length} pronostic{filteredPredictions.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 mb-6">
              {/* Sport filter */}
              <div className="flex items-center gap-1 flex-wrap">
                <Filter className="w-4 h-4 text-muted-foreground mr-1" />
                {['all', 'football', 'basketball', 'tennis'].map(sport => (
                  <button
                    key={sport}
                    onClick={() => setSelectedSport(sport)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      selectedSport === sport
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {sport === 'all' ? '🌐 Tous sports' : sport === 'football' ? '⚽ Football' : sport === 'basketball' ? '🏀 Basketball' : '🎾 Tennis'}
                  </button>
                ))}
              </div>
            </div>

            {/* League filter */}
            {leagues.length > 1 && (
              <div className="flex flex-wrap gap-2 mb-6">
                <button
                  onClick={() => setSelectedLeague('all')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1 ${
                    selectedLeague === 'all' ? 'bg-secondary text-secondary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  Toutes les ligues
                </button>
                {leagues.map(league => (
                  <button
                    key={league}
                    onClick={() => setSelectedLeague(league)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1 ${
                      selectedLeague === league ? 'bg-secondary text-secondary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {getLeagueIcon(league)} {league}
                  </button>
                ))}
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : filteredPredictions.length === 0 ? (
              <div className="text-center py-20">
                <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">Aucun pronostic à venir pour le moment.</p>
                <p className="text-sm text-muted-foreground mt-2">Revenez bientôt pour de nouveaux pronostics !</p>
              </div>
            ) : (
              <div className="space-y-10">
                {Object.entries(grouped).map(([date, dayPredictions]) => (
                  <div key={date}>
                    <div className="flex items-center gap-3 mb-4">
                      <Calendar className="w-4 h-4 text-primary" />
                      <h2 className="font-display text-lg font-semibold capitalize">{date}</h2>
                      <div className="flex-1 h-px bg-border" />
                      <span className="text-xs text-muted-foreground">{dayPredictions.length} match{dayPredictions.length > 1 ? 's' : ''}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {dayPredictions.map((prediction, i) => {
                        const teams = prediction.match_title.split(' vs ');
                        const isPremiumLocked = prediction.is_premium && !subscription.subscribed;
                        return (
                          <motion.div
                            key={prediction.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            onClick={() => handleCardClick(prediction)}
                            className="cursor-pointer relative group"
                          >
                            <MatchCard
                              homeTeam={teams[0] || prediction.match_title}
                              awayTeam={teams[1] || ''}
                              league={prediction.league}
                              time={new Date(prediction.match_date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                              prediction={isPremiumLocked ? undefined : prediction.prediction}
                              odds={isPremiumLocked ? undefined : prediction.odds}
                              confidence={isPremiumLocked ? undefined : prediction.confidence * 20}
                              isPremium={!!isPremiumLocked}
                              sport={getSportFromLeague(prediction.league)}
                              result={prediction.result}
                            />
                            {!isPremiumLocked && (
                              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="bg-primary/90 text-primary-foreground rounded-full p-1.5">
                                  <Eye className="w-3.5 h-3.5" />
                                </div>
                              </div>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <PredictionDetailDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        prediction={selectedPrediction ? { ...selectedPrediction, is_premium: selectedPrediction.is_premium || false } : null}
      />
    </Layout>
  );
};

export default DailyPicks;
