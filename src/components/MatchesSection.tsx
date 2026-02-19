import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MatchCard } from './MatchCard';
import { PredictionDetailDialog } from './PredictionDetailDialog';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';

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

export function MatchesSection() {
  const { t } = useTranslation();
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrediction, setSelectedPrediction] = useState<Prediction | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchTodayFreePredictions();
  }, []);

  const fetchTodayFreePredictions = async () => {
    try {
      const now = new Date();
      const { data } = await supabase
        .from('predictions')
        .select('*')
        .eq('is_premium', false)
        .or('archived.is.null,archived.eq.false')
        .gte('match_date', now.toISOString())
        .order('match_date', { ascending: true })
        .limit(4);

      if (data && data.length > 0) {
        setPredictions(data);
      } else {
        // Fallback: today's free predictions regardless of time
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const { data: todayData } = await supabase
          .from('predictions')
          .select('*')
          .eq('is_premium', false)
          .or('archived.is.null,archived.eq.false')
          .gte('match_date', today.toISOString())
          .order('match_date', { ascending: true })
          .limit(4);
        setPredictions(todayData || []);
      }
    } catch (error) {
      console.error('Error fetching predictions:', error);
    } finally {
      setLoading(false);
    }
  };

  const detectSport = (league: string): 'football' | 'basketball' | 'tennis' => {
    const lower = league.toLowerCase();
    if (lower.includes('nba') || lower.includes('basketball') || lower.includes('euroleague')) return 'basketball';
    if (lower.includes('atp') || lower.includes('wta') || lower.includes('tennis')) return 'tennis';
    return 'football';
  };

  const handleCardClick = (prediction: Prediction) => {
    setSelectedPrediction(prediction);
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        </div>
      </section>
    );
  }

  if (predictions.length === 0) {
    return (
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">{t('matches.title')}</h2>
          <p className="text-muted-foreground">Aucun pronostic gratuit disponible pour le moment.</p>
          <div className="mt-8">
            <Link to="/daily-picks">
              <Button size="lg" className="btn-gradient text-primary-foreground">
                Voir tous les pronostics
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <Calendar className="w-5 h-5 text-primary" />
            <span className="text-sm text-primary font-medium">
              {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            {t('matches.title')}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            4 pronostics gratuits sélectionnés par nos experts — cliquez pour voir l'analyse détaillée.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {predictions.map((prediction, i) => {
            const teams = prediction.match_title.split(' vs ');
            return (
              <motion.div
                key={prediction.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                onClick={() => handleCardClick(prediction)}
                className="cursor-pointer"
              >
                <MatchCard
                  homeTeam={teams[0] || prediction.match_title}
                  awayTeam={teams[1] || ''}
                  league={prediction.league}
                  time={new Date(prediction.match_date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  prediction={prediction.prediction}
                  odds={prediction.odds}
                  confidence={prediction.confidence * 20}
                  isPremium={false}
                  sport={detectSport(prediction.league)}
                />
              </motion.div>
            );
          })}
        </div>

        <div className="text-center">
          <Link to="/daily-picks">
            <Button size="lg" variant="outline" className="group">
              {t('matches.viewAll')}
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>

      <PredictionDetailDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        prediction={selectedPrediction ? { ...selectedPrediction, is_premium: selectedPrediction.is_premium || false } : null}
      />
    </section>
  );
}
