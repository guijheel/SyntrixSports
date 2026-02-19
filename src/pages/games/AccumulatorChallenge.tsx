import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, Check, Trophy, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Json } from '@/integrations/supabase/types';

interface OddsEntry {
  market?: string;
  outcome?: string;
  price?: number;
  bookmaker?: string;
}

interface MatchBet {
  id: string;
  match: string;
  bet: string;
  odds: number;
}

const AccumulatorChallenge = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [availableBets, setAvailableBets] = useState<MatchBet[]>([]);
  const [selectedBets, setSelectedBets] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatchesWithOdds();
  }, []);

  const fetchMatchesWithOdds = async () => {
    try {
      const { data } = await supabase
        .from('matches')
        .select('id, home_team, away_team, odds')
        .eq('status', 'upcoming')
        .gte('match_date', new Date().toISOString())
        .order('match_date', { ascending: true })
        .limit(10);

      if (data) {
        const bets: MatchBet[] = [];
        data.forEach(match => {
          const matchName = `${match.home_team} vs ${match.away_team}`;
          
          // Parse odds from JSON
          const oddsData = match.odds as Json;
          if (Array.isArray(oddsData) && oddsData.length > 0) {
            (oddsData as OddsEntry[]).forEach(odd => {
              if (odd.price && odd.outcome) {
                bets.push({
                  id: match.id,
                  match: matchName,
                  bet: odd.outcome,
                  odds: odd.price,
                });
              }
            });
          } else {
            // Default bets if no odds available
            bets.push({
              id: match.id,
              match: matchName,
              bet: `${match.home_team} Win`,
              odds: 1.5 + Math.random() * 2,
            });
          }
        });
        setAvailableBets(bets.slice(0, 12));
      }
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleBet = (index: number) => {
    if (selectedBets.includes(index)) {
      setSelectedBets(selectedBets.filter(i => i !== index));
    } else if (selectedBets.length < 5) {
      setSelectedBets([...selectedBets, index]);
    }
  };

  const totalOdds = selectedBets.reduce((acc, i) => acc * availableBets[i].odds, 1);

  const handleSubmit = async () => {
    if (selectedBets.length < 3) return;
    setSubmitted(true);

    if (!user) return;

    try {
      const { data: currentStats } = await supabase
        .from('user_game_stats')
        .select('accumulators_created, total_points')
        .eq('user_id', user.id)
        .single();

      const pointsEarned = 15;

      await supabase
        .from('user_game_stats')
        .update({
          accumulators_created: (currentStats?.accumulators_created || 0) + 1,
          total_points: (currentStats?.total_points || 0) + pointsEarned,
        })
        .eq('user_id', user.id);

      toast({
        title: 'Accumulateur enregistré !',
        description: `+${pointsEarned} points ajoutés.`,
      });
    } catch (error) {
      console.error('Error saving accumulator:', error);
    }
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
              <h1 className="font-display text-3xl font-bold mb-4">{t('games.accumulator.submitted')}</h1>
              <p className="text-muted-foreground mb-4">
                {t('games.accumulator.yourAccumulator')}
              </p>
              <p className="text-4xl font-bold text-primary mb-8">
                {t('games.accumulator.totalOdds')}: {totalOdds.toFixed(2)}
              </p>
              
              <div className="space-y-2 mb-8 text-left">
                {selectedBets.map(i => (
                  <div key={i} className="bg-muted/30 rounded-lg p-3 flex justify-between">
                    <span>{availableBets[i].match} - {availableBets[i].bet}</span>
                    <span className="font-bold text-primary">{availableBets[i].odds.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-4 justify-center">
                <Button onClick={() => { setSubmitted(false); setSelectedBets([]); }} variant="outline">
                  {t('games.accumulator.newAccumulator')}
                </Button>
                <Link to="/games">
                  <Button className="btn-gradient text-primary-foreground">{t('games.accumulator.backToGames')}</Button>
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
            {t('games.accumulator.backToGames')}
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-10 h-10 text-primary" />
              <h1 className="font-display text-3xl font-bold">{t('games.accumulator.title')}</h1>
            </div>
            <p className="text-muted-foreground mb-6">{t('games.accumulator.subtitle')}</p>

            {availableBets.length === 0 ? (
              <div className="card-elevated p-8 text-center text-muted-foreground">
                Aucun match disponible pour le moment. Revenez plus tard !
              </div>
            ) : (
              <>
                {/* Selection Summary */}
                <div className="card-elevated p-4 mb-6 flex justify-between items-center">
                  <div>
                    <span className="text-sm text-muted-foreground">{t('games.accumulator.selected')}</span>
                    <span className="font-bold ml-2">{selectedBets.length}/5</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-muted-foreground">{t('games.accumulator.totalOdds')}</span>
                    <span className="font-bold text-primary ml-2">{totalOdds.toFixed(2)}</span>
                  </div>
                </div>

                {/* Available Bets */}
                <div className="space-y-3">
                  {availableBets.map((bet, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => toggleBet(i)}
                      className={`w-full p-4 rounded-xl text-left transition-all ${
                        selectedBets.includes(i)
                          ? 'bg-primary/20 border-2 border-primary'
                          : 'bg-muted/50 border-2 border-transparent hover:border-muted-foreground/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{bet.match}</p>
                          <p className="text-sm text-muted-foreground">{bet.bet}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-primary">{bet.odds.toFixed(2)}</span>
                          {selectedBets.includes(i) && (
                            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                              <Check className="w-4 h-4 text-primary-foreground" />
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>

                <Button 
                  onClick={handleSubmit} 
                  disabled={selectedBets.length < 3}
                  className="w-full mt-8 btn-gradient text-primary-foreground"
                >
                  {selectedBets.length < 3 
                    ? t('games.accumulator.selectMinimum')
                    : t('games.accumulator.submitAccumulator')
                  }
                </Button>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default AccumulatorChallenge;
