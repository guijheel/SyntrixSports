import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowLeft, Target, Trophy, Minus, Plus, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Match {
  id: string;
  home_team: string;
  away_team: string;
  league: string;
  match_date: string;
}

const ScorePrediction = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [matches, setMatches] = useState<Match[]>([]);
  const [predictions, setPredictions] = useState<{[key: number]: {home: number, away: number}}>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUpcomingMatches();
  }, []);

  const fetchUpcomingMatches = async () => {
    try {
      const { data } = await supabase
        .from('matches')
        .select('id, home_team, away_team, league, match_date')
        .eq('status', 'upcoming')
        .gte('match_date', new Date().toISOString())
        .order('match_date', { ascending: true })
        .limit(5);

      setMatches(data || []);
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateScore = (matchIndex: number, team: 'home' | 'away', delta: number) => {
    setPredictions(prev => ({
      ...prev,
      [matchIndex]: {
        home: team === 'home' 
          ? Math.max(0, (prev[matchIndex]?.home || 0) + delta)
          : (prev[matchIndex]?.home || 0),
        away: team === 'away'
          ? Math.max(0, (prev[matchIndex]?.away || 0) + delta)
          : (prev[matchIndex]?.away || 0)
      }
    }));
  };

  const handleSubmit = async () => {
    setSubmitted(true);

    if (!user) return;

    try {
      const { data: currentStats } = await supabase
        .from('user_game_stats')
        .select('score_predictions_made, total_points')
        .eq('user_id', user.id)
        .single();

      const predictionsCount = Object.keys(predictions).length || matches.length;
      const pointsEarned = predictionsCount * 5;

      await supabase
        .from('user_game_stats')
        .update({
          score_predictions_made: (currentStats?.score_predictions_made || 0) + predictionsCount,
          total_points: (currentStats?.total_points || 0) + pointsEarned,
        })
        .eq('user_id', user.id);

      toast({
        title: 'Prédictions enregistrées !',
        description: `+${pointsEarned} points ajoutés.`,
      });
    } catch (error) {
      console.error('Error saving predictions:', error);
    }
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (submitted) {
    return (
      <Layout>
        <div className="min-h-screen pt-32 pb-20">
          <div className="container mx-auto px-4 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card-elevated p-8 text-center"
            >
              <Trophy className="w-20 h-20 text-gold mx-auto mb-6" />
              <h1 className="font-display text-3xl font-bold mb-4">{t('games.scorePrediction.submitted')}</h1>
              <p className="text-muted-foreground mb-8">
                {t('games.scorePrediction.checkBack')}
              </p>
              
              <div className="space-y-4 mb-8">
                {matches.map((match, i) => (
                  <div key={match.id} className="bg-muted/30 rounded-lg p-4">
                    <div className="flex items-center justify-center gap-4">
                      <span className="font-medium">{match.home_team}</span>
                      <span className="text-xl font-bold text-primary">
                        {predictions[i]?.home || 0} - {predictions[i]?.away || 0}
                      </span>
                      <span className="font-medium">{match.away_team}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-4 justify-center">
                <Button onClick={() => setSubmitted(false)} variant="outline">
                  {t('games.scorePrediction.modify')}
                </Button>
                <Link to="/games">
                  <Button className="btn-gradient text-primary-foreground">{t('games.scorePrediction.backToGames')}</Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-2xl">
          <Link to="/games" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            {t('games.scorePrediction.backToGames')}
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-10 h-10 text-primary" />
              <div>
                <h1 className="font-display text-3xl font-bold">{t('games.scorePrediction.title')}</h1>
                <p className="text-muted-foreground">{t('games.scorePrediction.subtitle')}</p>
              </div>
            </div>

            {matches.length === 0 ? (
              <div className="card-elevated p-8 text-center text-muted-foreground">
                Aucun match à venir pour le moment. Revenez plus tard !
              </div>
            ) : (
              <div className="space-y-6">
                {matches.map((match, i) => (
                  <motion.div
                    key={match.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="card-elevated p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-muted-foreground">{match.league}</span>
                      <span className="text-sm text-muted-foreground">{formatTime(match.match_date)}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex-1 text-center">
                        <p className="font-semibold mb-3">{match.home_team}</p>
                        <div className="flex items-center justify-center gap-3">
                          <Button variant="outline" size="icon" onClick={() => updateScore(i, 'home', -1)}>
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="text-3xl font-bold w-12">{predictions[i]?.home || 0}</span>
                          <Button variant="outline" size="icon" onClick={() => updateScore(i, 'home', 1)}>
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="text-2xl font-bold text-muted-foreground px-4">-</div>

                      <div className="flex-1 text-center">
                        <p className="font-semibold mb-3">{match.away_team}</p>
                        <div className="flex items-center justify-center gap-3">
                          <Button variant="outline" size="icon" onClick={() => updateScore(i, 'away', -1)}>
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="text-3xl font-bold w-12">{predictions[i]?.away || 0}</span>
                          <Button variant="outline" size="icon" onClick={() => updateScore(i, 'away', 1)}>
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {matches.length > 0 && (
              <Button 
                onClick={handleSubmit} 
                className="w-full mt-8 btn-gradient text-primary-foreground"
              >
                {t('games.scorePrediction.submit')}
              </Button>
            )}
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default ScorePrediction;
