import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Lightbulb, Clock, ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';

const tips = [
  {
    slug: 'bankroll-management',
    title: 'Gérer sa Bankroll comme un Pro',
    excerpt: 'Découvrez les stratégies de gestion de capital utilisées par les parieurs professionnels pour maximiser vos gains sur le long terme.',
    category: 'Gestion',
    readTime: '8 min',
    featured: true,
  },
  {
    slug: 'value-bets',
    title: 'Comprendre les Value Bets',
    excerpt: 'Apprenez à identifier les cotes sous-évaluées et à exploiter les erreurs des bookmakers.',
    category: 'Stratégie',
    readTime: '6 min',
  },
  {
    slug: 'advanced-stats',
    title: 'Analyse des Statistiques Avancées',
    excerpt: 'Les métriques clés à surveiller pour faire des pronostics plus précis sur le football.',
    category: 'Analyse',
    readTime: '10 min',
  },
  {
    slug: 'beginner-mistakes',
    title: 'Éviter les Erreurs de Débutant',
    excerpt: 'Les pièges les plus courants dans les paris sportifs et comment les éviter.',
    category: 'Conseils',
    readTime: '5 min',
  },
  {
    slug: 'live-betting',
    title: 'Le Live Betting Expliqué',
    excerpt: 'Maîtrisez l\'art des paris en direct et profitez des opportunités en temps réel.',
    category: 'Stratégie',
    readTime: '7 min',
  },
  {
    slug: 'psychology',
    title: 'Psychologie du Parieur',
    excerpt: 'Comment garder son calme et prendre des décisions rationnelles dans les moments critiques.',
    category: 'Mindset',
    readTime: '9 min',
  },
  {
    slug: 'odds-comparison',
    title: 'Comparer les Cotes Efficacement',
    excerpt: 'Maximisez vos profits en trouvant toujours les meilleures cotes disponibles sur le marché.',
    category: 'Stratégie',
    readTime: '6 min',
  },
  {
    slug: 'asian-handicap',
    title: 'Maîtriser le Handicap Asiatique',
    excerpt: 'Guide complet pour comprendre et exploiter les paris à handicap asiatique.',
    category: 'Avancé',
    readTime: '12 min',
  },
  {
    slug: 'football-formations',
    title: 'Analyser les Formations Tactiques',
    excerpt: 'Comment les schémas tactiques influencent les résultats et comment en tirer parti.',
    category: 'Analyse',
    readTime: '11 min',
  },
  {
    slug: 'injury-impact',
    title: 'Impact des Blessures sur les Paris',
    excerpt: 'Évaluez correctement l\'impact des absences sur les performances d\'une équipe.',
    category: 'Analyse',
    readTime: '7 min',
  },
  {
    slug: 'weather-betting',
    title: 'Météo et Paris Sportifs',
    excerpt: 'Comment les conditions météorologiques affectent les matchs et vos pronostics.',
    category: 'Conseils',
    readTime: '5 min',
  },
  {
    slug: 'discipline-patience',
    title: 'Discipline et Patience : Les Clés du Succès',
    excerpt: 'Pourquoi la régularité et le sang-froid sont essentiels pour réussir sur le long terme.',
    category: 'Mindset',
    readTime: '8 min',
  },
];

const Tips = () => {
  const { t } = useTranslation();

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
              <Lightbulb className="w-10 h-10 text-gold" />
              <h1 className="font-display text-4xl md:text-5xl font-bold">
                {t('nav.tips')}
              </h1>
            </div>
            <p className="text-muted-foreground text-lg max-w-2xl">
              {t('tips.subtitle')}
            </p>
          </motion.div>

          {/* Featured Article */}
          {tips.filter(t => t.featured).map((tip, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Link to={`/tips/${tip.slug}`} className="block">
                <div className="card-elevated p-8 mb-8 relative overflow-hidden group cursor-pointer">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl" />
                  <div className="relative">
                    <span className="stat-badge-gold mb-4 inline-block">{t('tips.featured')}</span>
                    <h2 className="font-display text-2xl md:text-3xl font-bold mb-4 group-hover:text-primary transition-colors">
                      {tip.title}
                    </h2>
                    <p className="text-muted-foreground mb-6 max-w-2xl">
                      {tip.excerpt}
                    </p>
                    <div className="flex items-center gap-4">
                      <Button className="btn-gradient text-primary-foreground group/btn">
                        {t('tips.readArticle')}
                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                      <span className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {tip.readTime}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tips.filter(t => !t.featured).map((tip, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                whileHover={{ y: -4 }}
              >
                <Link to={`/tips/${tip.slug}`} className="block h-full">
                  <div className="card-elevated p-6 cursor-pointer group h-full flex flex-col">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary font-medium">
                        {tip.category}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {tip.readTime}
                      </span>
                    </div>
                    <h3 className="font-display text-lg font-semibold mb-3 group-hover:text-primary transition-colors">
                      {tip.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-1">
                      {tip.excerpt}
                    </p>
                    <div className="flex items-center gap-2 text-primary text-sm font-medium group-hover:gap-3 transition-all">
                      <BookOpen className="w-4 h-4" />
                      {t('tips.readMore')}
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Tips;
