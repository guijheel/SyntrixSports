import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, Calendar, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import heroImage from '@/assets/hero-stadium.jpg';

export function HeroSection() {
  const { t } = useTranslation();
  const [dynamicStats, setDynamicStats] = useState({
    successRate: '—',
    monthlyPicks: '—',
    members: '—',
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Taux de réussite = uniquement gagnés / (gagnés + perdus), pas les pending
      const { data: predictions } = await supabase
        .from('predictions')
        .select('result')
        .in('result', ['won', 'lost'])
        .or('archived.is.null,archived.eq.false');

      const total = predictions?.length || 0;
      const won = predictions?.filter(p => p.result === 'won').length || 0;
      const rate = total > 0 ? Math.round((won / total) * 100) : 0;

      // Get this month's predictions count
      const firstOfMonth = new Date();
      firstOfMonth.setDate(1);
      firstOfMonth.setHours(0, 0, 0, 0);
      const { count: monthlyCount } = await supabase
        .from('predictions')
        .select('*', { count: 'exact', head: true })
        .or('archived.is.null,archived.eq.false')
        .gte('match_date', firstOfMonth.toISOString());

      // Get total members
      const { count: membersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      setDynamicStats({
        successRate: total > 0 ? `${rate}%` : '87%',
        monthlyPicks: monthlyCount ? `${monthlyCount}+` : '150+',
        members: membersCount ? (membersCount >= 1000 ? `${(membersCount / 1000).toFixed(1)}K+` : `${membersCount}+`) : '25K+',
      });
    } catch (error) {
      console.error('Error fetching hero stats:', error);
      setDynamicStats({ successRate: '87%', monthlyPicks: '150+', members: '25K+' });
    }
  };

  const stats = [
    { icon: TrendingUp, value: dynamicStats.successRate, label: t('hero.stats.successRate') },
    { icon: Calendar, value: dynamicStats.monthlyPicks, label: t('hero.stats.monthlyPicks') },
    { icon: Users, value: dynamicStats.members, label: t('hero.stats.members') },
  ];

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img src={heroImage} alt="Stadium" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-hero-pattern" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
      </div>

      {/* Animated Orbs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Live predictions available
            </span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }} className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
            {t('hero.title')}
            <br />
            <span className="gradient-text">{t('hero.subtitle')}</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-xl text-muted-foreground mb-8 max-w-xl">
            {t('hero.description')}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="flex flex-wrap gap-4 mb-12">
            <Link to="/auth">
              <Button size="lg" className="btn-gradient text-primary-foreground group">
                {t('hero.cta')}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/daily-picks">
              <Button size="lg" variant="outline" className="border-primary/30 hover:bg-primary/10">
                {t('matches.viewAll')}
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="grid grid-cols-3 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="glass-card p-4 rounded-xl">
                <stat.icon className="w-6 h-6 text-primary mb-2" />
                <div className="text-2xl md:text-3xl font-display font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
