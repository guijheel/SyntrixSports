import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { TrendingUp, Target, Trophy, BarChart3, Loader2, Calendar, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

interface MonthStats {
  month: string;
  year: number;
  monthNum: number;
  wins: number;
  losses: number;
  pending: number;
  total: number;
  winRate: string;
  roi: string;
}

interface LeagueStat {
  league: string;
  wins: number;
  losses: number;
  total: number;
  winRate: number;
  roi: string;
  icon: string;
}

interface OverallStats {
  totalPredictions: number;
  wins: number;
  losses: number;
  pending: number;
  roi: string;
  winRate: string;
}

interface PredictionRow {
  id: string;
  match_title: string;
  league: string;
  prediction: string;
  odds: number;
  result: string | null;
  match_date: string;
  is_premium: boolean | null;
}

const detectSport = (league: string): string => {
  const lower = league.toLowerCase();
  if (lower.includes('nba') || lower.includes('basket')) return 'basketball';
  if (lower.includes('atp') || lower.includes('wta') || lower.includes('tennis')) return 'tennis';
  return 'football';
};

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
};

const getLeagueIcon = (league: string) => {
  const lower = league.toLowerCase();
  for (const [key, icon] of Object.entries(LEAGUE_ICONS)) {
    if (lower.includes(key)) return icon;
  }
  return '⚽';
};

const MONTHS_FR = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

const Stats = () => {
  const { t } = useTranslation();
  const [overall, setOverall] = useState<OverallStats | null>(null);
  const [leagueStats, setLeagueStats] = useState<LeagueStat[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<MonthStats[]>([]);
  const [selectedMonthIdx, setSelectedMonthIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overall' | 'monthly' | 'leagues'>('overall');
  const [selectedLeagueFilter, setSelectedLeagueFilter] = useState<string>('all');
  const [allPredictions, setAllPredictions] = useState<PredictionRow[]>([]);
  const [monthSort, setMonthSort] = useState<'league' | 'sport' | 'date'>('date');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data: predictions } = await supabase
        .from('predictions')
        .select('id, match_title, league, prediction, odds, result, match_date, is_premium')
        .or('archived.is.null,archived.eq.false')
        .order('match_date', { ascending: false });

      if (predictions) {
        setAllPredictions(predictions as PredictionRow[]);
        const wins = predictions.filter(p => p.result === 'won').length;
        const losses = predictions.filter(p => p.result === 'lost').length;
        const pending = predictions.filter(p => !p.result || p.result === 'pending').length;
        const decided = wins + losses;
        const winRate = decided > 0 ? ((wins / decided) * 100).toFixed(1) : '0';
        const totalReturn = predictions.filter(p => p.result === 'won').reduce((sum, p) => sum + (p.odds || 1), 0);
        const roi = decided > 0 ? (((totalReturn - decided) / decided) * 100).toFixed(1) : '0';

        setOverall({ totalPredictions: predictions.length, wins, losses, pending, roi: `${Number(roi) >= 0 ? '+' : ''}${roi}%`, winRate: `${winRate}%` });

        // Group by league
        const byLeague: Record<string, { wins: number; losses: number; returnSum: number }> = {};
        predictions.forEach(p => {
          if (!byLeague[p.league]) byLeague[p.league] = { wins: 0, losses: 0, returnSum: 0 };
          if (p.result === 'won') { byLeague[p.league].wins++; byLeague[p.league].returnSum += (p.odds || 1); }
          else if (p.result === 'lost') { byLeague[p.league].losses++; }
        });

        const leagues: LeagueStat[] = Object.entries(byLeague).map(([league, data]) => {
          const total = data.wins + data.losses;
          const leagueRoi = total > 0 ? (((data.returnSum - total) / total) * 100).toFixed(1) : '0';
          const winRate = total > 0 ? Math.round((data.wins / total) * 100) : 0;
          return { league, wins: data.wins, losses: data.losses, total, winRate, roi: `${Number(leagueRoi) >= 0 ? '+' : ''}${leagueRoi}%`, icon: getLeagueIcon(league) };
        }).sort((a, b) => b.total - a.total);
        setLeagueStats(leagues);

        // Group by month
        const byMonth: Record<string, { wins: number; losses: number; pending: number; returnSum: number; year: number; monthNum: number }> = {};
        predictions.forEach(p => {
          const d = new Date(p.match_date);
          const key = `${d.getFullYear()}-${d.getMonth()}`;
          if (!byMonth[key]) byMonth[key] = { wins: 0, losses: 0, pending: 0, returnSum: 0, year: d.getFullYear(), monthNum: d.getMonth() };
          if (p.result === 'won') { byMonth[key].wins++; byMonth[key].returnSum += (p.odds || 1); }
          else if (p.result === 'lost') { byMonth[key].losses++; }
          else { byMonth[key].pending++; }
        });

        const months: MonthStats[] = Object.entries(byMonth).map(([, data]) => {
          const decided = data.wins + data.losses;
          const wr = decided > 0 ? ((data.wins / decided) * 100).toFixed(1) : '0';
          const r = decided > 0 ? (((data.returnSum - decided) / decided) * 100).toFixed(1) : '0';
          return {
            month: MONTHS_FR[data.monthNum],
            year: data.year,
            monthNum: data.monthNum,
            wins: data.wins,
            losses: data.losses,
            pending: data.pending,
            total: data.wins + data.losses + data.pending,
            winRate: `${wr}%`,
            roi: `${Number(r) >= 0 ? '+' : ''}${r}%`,
          };
        }).sort((a, b) => b.year - a.year || b.monthNum - a.monthNum);
        setMonthlyStats(months);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const overallCards = overall ? [
    { label: t('stats.winRate'), value: overall.winRate, icon: Target, color: 'text-success', bg: 'bg-success/10' },
    { label: t('stats.totalPredictions'), value: String(overall.totalPredictions), icon: TrendingUp, color: 'text-primary', bg: 'bg-primary/10' },
    { label: t('stats.roi'), value: overall.roi, icon: BarChart3, color: 'text-gold', bg: 'bg-gold/10' },
    { label: t('stats.victories'), value: String(overall.wins), icon: Trophy, color: 'text-secondary', bg: 'bg-secondary/10' },
  ] : [];

  const currentMonth = monthlyStats[selectedMonthIdx];
  const filteredLeagues = selectedLeagueFilter === 'all' ? leagueStats : leagueStats.filter(l => l.league === selectedLeagueFilter);

  const last20Predictions = allPredictions.slice(0, 20);

  const predictionsForSelectedMonth = currentMonth
    ? allPredictions.filter(p => {
        const d = new Date(p.match_date);
        return d.getFullYear() === currentMonth.year && d.getMonth() === currentMonth.monthNum;
      })
    : [];
  const sortedMonthPredictions = [...predictionsForSelectedMonth].sort((a, b) => {
    if (monthSort === 'league') return (a.league || '').localeCompare(b.league || '');
    if (monthSort === 'sport') return detectSport(a.league).localeCompare(detectSport(b.league));
    return new Date(b.match_date).getTime() - new Date(a.match_date).getTime();
  });

  return (
    <Layout>
      <div className="min-h-screen pt-32 pb-20">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-2">{t('nav.stats')}</h1>
            <p className="text-muted-foreground text-lg">{t('stats.subtitle')}</p>
          </motion.div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {/* Overall Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {overallCards.map((stat, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="card-elevated p-6">
                    <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <div className="text-3xl font-display font-bold mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* Tabs */}
              <div className="flex gap-2 mb-6">
                {[
                  { id: 'overall', label: `📊 ${t('stats.viewGlobal')}` },
                  { id: 'monthly', label: `📅 ${t('stats.viewMonthly')}` },
                  { id: 'leagues', label: `🏆 ${t('stats.viewLeagues')}` },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeTab === tab.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Overall tab */}
              {activeTab === 'overall' && overall && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div className="card-elevated p-6">
                    <h2 className="font-display text-xl font-semibold mb-6">{t('stats.bilanGlobal')}</h2>
                    <div className="grid grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-success">{overall.wins}</div>
                        <div className="text-muted-foreground mt-1">✅ {t('stats.won')}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-4xl font-bold text-destructive">{overall.losses}</div>
                        <div className="text-muted-foreground mt-1">❌ {t('stats.lost')}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-4xl font-bold text-warning">{overall.pending}</div>
                        <div className="text-muted-foreground mt-1">⏳ {t('stats.pending')}</div>
                      </div>
                    </div>
                    {overall.wins + overall.losses > 0 && (
                      <div className="mt-6">
                        <div className="flex justify-between text-sm text-muted-foreground mb-2">
                          <span>{t('stats.winRateGlobal')}</span>
                          <span className="font-semibold text-foreground">{overall.winRate}</span>
                        </div>
                        <div className="h-3 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary to-success rounded-full"
                            style={{ width: overall.winRate }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  {/* 20 derniers pronostics */}
                  <div className="card-elevated overflow-hidden">
                    <h3 className="font-display text-lg font-semibold p-4 border-b border-border">{t('stats.last20Predictions')}</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-muted/50">
                          <tr>
                            <th className="text-left p-3 text-sm font-medium text-muted-foreground">{t('stats.match')}</th>
                            <th className="text-left p-3 text-sm font-medium text-muted-foreground">{t('admin.league')}</th>
                            <th className="text-left p-3 text-sm font-medium text-muted-foreground">{t('admin.prediction')}</th>
                            <th className="text-center p-3 text-sm font-medium text-muted-foreground">{t('admin.odds')}</th>
                            <th className="text-center p-3 text-sm font-medium text-muted-foreground">{t('admin.result')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {last20Predictions.map((p) => {
                            const teams = (p.match_title || '').split(' vs ');
                            const res = p.result || 'pending';
                            return (
                              <tr key={p.id} className="border-b border-border/50 hover:bg-muted/30">
                                <td className="p-3">
                                  <div className="font-medium text-sm">{teams[0] || p.match_title}</div>
                                  <div className="text-xs text-muted-foreground">{teams[1] ? `vs ${teams[1]}` : ''} · {new Date(p.match_date).toLocaleDateString('fr-FR')}</div>
                                </td>
                                <td className="p-3 text-sm">{getLeagueIcon(p.league)}{' '}{p.league}</td>
                                <td className="p-3 text-sm">{p.prediction}</td>
                                <td className="p-3 text-center font-bold text-primary">{p.odds?.toFixed(2)}</td>
                                <td className="p-3 text-center">
                                  <span className={`text-xs font-medium ${res === 'won' ? 'text-success' : res === 'lost' ? 'text-destructive' : 'text-warning'}`}>
                                    {res === 'won' ? '✅' : res === 'lost' ? '❌' : '⏳'}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    {last20Predictions.length === 0 && (
                      <div className="p-8 text-center text-muted-foreground text-sm">{t('admin.noPredictions')}</div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Monthly tab */}
              {activeTab === 'monthly' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  {monthlyStats.length === 0 ? (
                    <div className="card-elevated p-8 text-center text-muted-foreground">{t('stats.noDataMonthly')}</div>
                  ) : (
                    <>
                      {/* Month navigator */}
                      <div className="flex items-center justify-between card-elevated p-4">
                        <Button variant="ghost" size="icon" onClick={() => setSelectedMonthIdx(Math.min(selectedMonthIdx + 1, monthlyStats.length - 1))} disabled={selectedMonthIdx >= monthlyStats.length - 1}>
                          <ChevronLeft className="w-5 h-5" />
                        </Button>
                        <div className="text-center">
                          <div className="font-display text-xl font-bold">{currentMonth?.month} {currentMonth?.year}</div>
                          <div className="text-sm text-muted-foreground">{currentMonth?.total} pronostic{currentMonth?.total !== 1 ? 's' : ''}</div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setSelectedMonthIdx(Math.max(selectedMonthIdx - 1, 0))} disabled={selectedMonthIdx <= 0}>
                          <ChevronRight className="w-5 h-5" />
                        </Button>
                      </div>

                      {currentMonth && (
                        <div className="card-elevated p-6">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-success/10 rounded-xl p-4 text-center">
                              <div className="text-3xl font-bold text-success">{currentMonth.wins}</div>
                              <div className="text-sm text-muted-foreground">✅ Gagnés</div>
                            </div>
                            <div className="bg-destructive/10 rounded-xl p-4 text-center">
                              <div className="text-3xl font-bold text-destructive">{currentMonth.losses}</div>
                              <div className="text-sm text-muted-foreground">❌ Perdus</div>
                            </div>
                            <div className="bg-primary/10 rounded-xl p-4 text-center">
                              <div className="text-3xl font-bold text-primary">{currentMonth.winRate}</div>
                              <div className="text-sm text-muted-foreground">🎯 Réussite</div>
                            </div>
                            <div className="bg-gold/10 rounded-xl p-4 text-center">
                              <div className="text-3xl font-bold text-gold">{currentMonth.roi}</div>
                              <div className="text-sm text-muted-foreground">📈 ROI</div>
                            </div>
                          </div>

                          {/* Pronos du mois avec tri */}
                          {sortedMonthPredictions.length > 0 && (
                            <div className="mt-6 pt-6 border-t border-border">
                              <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
                                <h3 className="font-semibold text-sm text-muted-foreground">{t('stats.predictionsOfMonth')}</h3>
                                <div className="flex gap-2">
                                  <button onClick={() => setMonthSort('date')} className={`px-3 py-1 rounded-full text-xs font-medium ${monthSort === 'date' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
                                    {t('stats.sortByDate')}
                                  </button>
                                  <button onClick={() => setMonthSort('league')} className={`px-3 py-1 rounded-full text-xs font-medium ${monthSort === 'league' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
                                    {t('stats.sortByLeague')}
                                  </button>
                                  <button onClick={() => setMonthSort('sport')} className={`px-3 py-1 rounded-full text-xs font-medium ${monthSort === 'sport' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
                                    {t('stats.sortBySport')}
                                  </button>
                                </div>
                              </div>
                              <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                  <thead className="bg-muted/50">
                                    <tr>
                                      <th className="text-left p-2 font-medium text-muted-foreground">{t('stats.match')}</th>
                                      <th className="text-left p-2 font-medium text-muted-foreground">{t('admin.league')}</th>
                                      <th className="text-left p-2 font-medium text-muted-foreground">{t('stats.sport')}</th>
                                      <th className="text-left p-2 font-medium text-muted-foreground">{t('admin.prediction')}</th>
                                      <th className="text-center p-2 font-medium text-muted-foreground">{t('admin.odds')}</th>
                                      <th className="text-center p-2 font-medium text-muted-foreground">{t('admin.result')}</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {sortedMonthPredictions.map((p) => {
                                      const teams = (p.match_title || '').split(' vs ');
                                      const res = p.result || 'pending';
                                      return (
                                        <tr key={p.id} className="border-b border-border/50 hover:bg-muted/30">
                                          <td className="p-2"><span className="font-medium">{teams[0] || p.match_title}</span>{teams[1] ? ` vs ${teams[1]}` : ''}</td>
                                          <td className="p-2">{getLeagueIcon(p.league)} {p.league}</td>
                                          <td className="p-2">{detectSport(p.league)}</td>
                                          <td className="p-2">{p.prediction}</td>
                                          <td className="p-2 text-center font-bold text-primary">{p.odds?.toFixed(2)}</td>
                                          <td className="p-2 text-center">{res === 'won' ? '✅' : res === 'lost' ? '❌' : '⏳'}</td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}

                          {/* All months summary */}
                          <h3 className="font-semibold text-sm text-muted-foreground mb-3 mt-6">Tous les mois</h3>
                          <div className="space-y-2">
                            {monthlyStats.map((m, i) => (
                              <button key={i} onClick={() => setSelectedMonthIdx(i)} className={`w-full flex items-center justify-between p-3 rounded-lg transition-all text-left ${i === selectedMonthIdx ? 'bg-primary/10 border border-primary/20' : 'hover:bg-muted/50'}`}>
                                <div className="flex items-center gap-3">
                                  <Calendar className="w-4 h-4 text-muted-foreground" />
                                  <span className="font-medium text-sm">{m.month} {m.year}</span>
                                  <span className="text-xs text-muted-foreground">{m.total} pronos</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                  <span className="text-success">{m.wins}W</span>
                                  <span className="text-destructive">{m.losses}L</span>
                                  <span className={`font-bold ${Number(m.roi.replace('%','').replace('+','')) >= 0 ? 'text-gold' : 'text-destructive'}`}>{m.roi}</span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </motion.div>
              )}

              {/* Leagues tab */}
              {activeTab === 'leagues' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card-elevated overflow-hidden">
                  <div className="p-6 border-b border-border flex items-center justify-between flex-wrap gap-3">
                    <h2 className="font-display text-xl font-semibold">{t('stats.performanceByLeague')}</h2>
                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => setSelectedLeagueFilter('all')} className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${selectedLeagueFilter === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
                        {t('stats.all')}
                      </button>
                      {leagueStats.map(l => (
                        <button key={l.league} onClick={() => setSelectedLeagueFilter(l.league)} className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1 ${selectedLeagueFilter === l.league ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
                          {l.icon} {l.league}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="text-left p-4 font-medium text-muted-foreground">Ligue</th>
                          <th className="text-center p-4 font-medium text-muted-foreground">Total</th>
                          <th className="text-center p-4 font-medium text-muted-foreground">✅ Gagnés</th>
                          <th className="text-center p-4 font-medium text-muted-foreground">❌ Perdus</th>
                          <th className="text-center p-4 font-medium text-muted-foreground">Taux</th>
                          <th className="text-right p-4 font-medium text-muted-foreground">ROI</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredLeagues.map((league, i) => (
                          <tr key={i} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <span className="text-xl">{league.icon}</span>
                                <span className="font-medium">{league.league}</span>
                              </div>
                            </td>
                            <td className="p-4 text-center text-muted-foreground">{league.total}</td>
                            <td className="p-4 text-center text-success font-semibold">{league.wins}</td>
                            <td className="p-4 text-center text-destructive font-semibold">{league.losses}</td>
                            <td className="p-4 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                                  <div className="h-full bg-success rounded-full" style={{ width: `${league.winRate}%` }} />
                                </div>
                                <span className="text-sm font-medium">{league.winRate}%</span>
                              </div>
                            </td>
                            <td className={`p-4 text-right font-bold ${Number(league.roi.replace('%','').replace('+','')) >= 0 ? 'text-gold' : 'text-destructive'}`}>
                              {league.roi}
                            </td>
                          </tr>
                        ))}
                        {filteredLeagues.length === 0 && (
                          <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">{t('stats.noData')}</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Stats;
