import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Trophy, Target, BarChart3, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface GlobalStats {
  totalQuizGames: number;
  totalCorrectAnswers: number;
  totalPredictions: number;
  totalAccumulators: number;
}

interface TopPlayer {
  user_id: string;
  display_name: string | null;
  total_points: number;
  quiz_correct_answers: number;
}

export const StatsTab = () => {
  const { t } = useTranslation();
  
  const [globalStats, setGlobalStats] = useState<GlobalStats>({
    totalQuizGames: 0,
    totalCorrectAnswers: 0,
    totalPredictions: 0,
    totalAccumulators: 0,
  });
  const [topPlayers, setTopPlayers] = useState<TopPlayer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch all game stats
      const { data: allStats } = await supabase
        .from('user_game_stats')
        .select('*');

      if (allStats) {
        const stats = allStats.reduce(
          (acc, stat) => ({
            totalQuizGames: acc.totalQuizGames + (stat.quiz_games_played || 0),
            totalCorrectAnswers: acc.totalCorrectAnswers + (stat.quiz_correct_answers || 0),
            totalPredictions: acc.totalPredictions + (stat.score_predictions_made || 0),
            totalAccumulators: acc.totalAccumulators + (stat.accumulators_created || 0),
          }),
          { totalQuizGames: 0, totalCorrectAnswers: 0, totalPredictions: 0, totalAccumulators: 0 }
        );
        setGlobalStats(stats);
      }

      // Fetch top players
      const { data: topStats } = await supabase
        .from('user_game_stats')
        .select('user_id, total_points, quiz_correct_answers')
        .order('total_points', { ascending: false })
        .limit(10);

      if (topStats) {
        // Get profile info for top players
        const playerIds = topStats.map(s => s.user_id);
        const { data: profiles } = await supabase
          .from('profiles')
          .select('user_id, display_name')
          .in('user_id', playerIds);

        const playersWithNames = topStats.map(stat => ({
          ...stat,
          display_name: profiles?.find(p => p.user_id === stat.user_id)?.display_name || 'Joueur anonyme',
        }));

        setTopPlayers(playersWithNames);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Global Stats */}
      <div className="card-elevated p-6">
        <h2 className="font-display text-xl font-semibold mb-6 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          {t('admin.globalGameStats')}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <Target className="w-6 h-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">{globalStats.totalQuizGames}</div>
            <div className="text-xs text-muted-foreground">{t('admin.totalQuizGames')}</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <TrendingUp className="w-6 h-6 text-success mx-auto mb-2" />
            <div className="text-2xl font-bold">{globalStats.totalCorrectAnswers}</div>
            <div className="text-xs text-muted-foreground">{t('admin.totalCorrectAnswers')}</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <BarChart3 className="w-6 h-6 text-secondary mx-auto mb-2" />
            <div className="text-2xl font-bold">{globalStats.totalPredictions}</div>
            <div className="text-xs text-muted-foreground">{t('admin.totalScorePredictions')}</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <Trophy className="w-6 h-6 text-gold mx-auto mb-2" />
            <div className="text-2xl font-bold">{globalStats.totalAccumulators}</div>
            <div className="text-xs text-muted-foreground">{t('admin.totalAccumulators')}</div>
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="card-elevated p-6">
        <h2 className="font-display text-xl font-semibold mb-6 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-gold" />
          {t('admin.topPlayers')}
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 font-medium text-muted-foreground">{t('admin.rank')}</th>
                <th className="text-left p-3 font-medium text-muted-foreground">{t('admin.player')}</th>
                <th className="text-center p-3 font-medium text-muted-foreground">{t('admin.points')}</th>
                <th className="text-center p-3 font-medium text-muted-foreground">{t('admin.correctAnswers')}</th>
              </tr>
            </thead>
            <tbody>
              {topPlayers.map((player, index) => (
                <tr key={player.user_id} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="p-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      index === 0 ? 'bg-gold/20 text-gold' :
                      index === 1 ? 'bg-muted-foreground/20 text-muted-foreground' :
                      index === 2 ? 'bg-warning/20 text-warning' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {index + 1}
                    </div>
                  </td>
                  <td className="p-3 font-medium">{player.display_name}</td>
                  <td className="p-3 text-center">
                    <span className="stat-badge-gold">{player.total_points}</span>
                  </td>
                  <td className="p-3 text-center text-muted-foreground">{player.quiz_correct_answers}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {topPlayers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {t('admin.noPlayers')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
