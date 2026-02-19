import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Gamepad2, Trophy, Users, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

interface LeaderboardPlayer {
  rank: number;
  name: string;
  points: number;
  avatar: string;
}

const games = [
  {
    id: 'quiz',
    title: 'Quiz Football',
    description: 'Testez vos connaissances sur le football mondial.',
    icon: '⚽',
    difficulty: 'Facile',
    path: '/games/quiz'
  },
  {
    id: 'score-prediction',
    title: 'Prédiction Score',
    description: 'Devinez le score exact des matchs du jour.',
    icon: '🎯',
    difficulty: 'Difficile',
    path: '/games/score-prediction'
  },
  {
    id: 'accumulator',
    title: 'Accumulator Challenge',
    description: 'Construisez le meilleur combiné de la semaine.',
    icon: '📊',
    difficulty: 'Expert',
    path: '/games/accumulator'
  },
];

const rankAvatars = ['👑', '🥈', '🥉', '🎰', '⚽', '🏆', '🌟', '💎', '🔥', '⭐'];

const Games = () => {
  const { t } = useTranslation();
  const [leaderboard, setLeaderboard] = useState<LeaderboardPlayer[]>([]);
  const [playerCounts, setPlayerCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchLeaderboard();
    fetchPlayerCounts();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const { data: topStats } = await supabase
        .from('user_game_stats')
        .select('user_id, total_points')
        .order('total_points', { ascending: false })
        .limit(10);

      if (topStats && topStats.length > 0) {
        const playerIds = topStats.map(s => s.user_id);
        const { data: profiles } = await supabase
          .from('profiles')
          .select('user_id, display_name')
          .in('user_id', playerIds);

        const players = topStats.map((stat, index) => ({
          rank: index + 1,
          name: profiles?.find(p => p.user_id === stat.user_id)?.display_name || 'Joueur anonyme',
          points: stat.total_points || 0,
          avatar: rankAvatars[index] || '⭐',
        }));
        setLeaderboard(players);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };

  const fetchPlayerCounts = async () => {
    try {
      // Count total players who have played games
      const { count: quizPlayers } = await supabase
        .from('user_game_stats')
        .select('*', { count: 'exact', head: true })
        .gt('quiz_games_played', 0);

      const { count: predictionPlayers } = await supabase
        .from('user_game_stats')
        .select('*', { count: 'exact', head: true })
        .gt('score_predictions_made', 0);

      const { count: accumulatorPlayers } = await supabase
        .from('user_game_stats')
        .select('*', { count: 'exact', head: true })
        .gt('accumulators_created', 0);

      setPlayerCounts({
        quiz: quizPlayers || 0,
        'score-prediction': predictionPlayers || 0,
        accumulator: accumulatorPlayers || 0,
      });
    } catch (error) {
      console.error('Error fetching player counts:', error);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen pt-32 pb-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-4">
              <Gamepad2 className="w-10 h-10 text-primary" />
              <h1 className="font-display text-4xl md:text-5xl font-bold">
                {t('nav.games')}
              </h1>
            </div>
            <p className="text-muted-foreground text-lg">
              {t('games.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Games Grid */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {games.map((game, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -4 }}
                  >
                    <Link to={game.path} className="block">
                      <div className="card-elevated p-6 cursor-pointer group h-full">
                        <div className="text-4xl mb-4">{game.icon}</div>
                        <h3 className="font-display text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                          {game.title}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-4">
                          {game.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="w-4 h-4" />
                            {playerCounts[game.id] || 0} {t('games.players')}
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            game.difficulty === 'Facile' ? 'bg-success/20 text-success' :
                            game.difficulty === 'Moyen' ? 'bg-warning/20 text-warning' :
                            game.difficulty === 'Difficile' ? 'bg-destructive/20 text-destructive' :
                            'bg-primary/20 text-primary'
                          }`}>
                            {game.difficulty}
                          </span>
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-primary text-sm font-medium group-hover:gap-3 transition-all">
                          {t('games.play')}
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Leaderboard */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="card-elevated p-6"
            >
              <div className="flex items-center gap-2 mb-6">
                <Trophy className="w-6 h-6 text-gold" />
                <h2 className="font-display text-xl font-semibold">{t('games.leaderboard')}</h2>
              </div>
              <div className="space-y-3">
                {leaderboard.map((player, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      player.rank <= 3 ? 'bg-gold/5 border border-gold/20' : 'bg-muted/30'
                    }`}
                  >
                    <span className="text-xl">{player.avatar}</span>
                    <div className="flex-1">
                      <div className="font-medium">{player.name}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Star className="w-3 h-3 text-gold" />
                        {player.points.toLocaleString()} pts
                      </div>
                    </div>
                    <span className="text-lg font-bold text-muted-foreground">#{player.rank}</span>
                  </div>
                ))}
                {leaderboard.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    Aucun joueur pour le moment. Soyez le premier !
                  </div>
                )}
              </div>
              <Button className="w-full mt-6" variant="outline">
                {t('games.viewFullLeaderboard')}
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Games;
