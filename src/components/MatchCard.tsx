import { motion } from 'framer-motion';
import { Lock, Clock, TrendingUp, CheckCircle, XCircle, Timer } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface MatchCardProps {
  homeTeam: string;
  awayTeam: string;
  league: string;
  time: string;
  prediction?: string;
  odds?: number;
  confidence?: number;
  isPremium?: boolean;
  sport?: 'football' | 'basketball' | 'tennis';
  result?: string | null;
}

const sportEmojis = {
  football: '⚽',
  basketball: '🏀',
  tennis: '🎾',
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
  return null;
};

export function MatchCard({
  homeTeam,
  awayTeam,
  league,
  time,
  prediction,
  odds,
  confidence,
  isPremium = false,
  sport = 'football',
  result,
}: MatchCardProps) {
  const { t } = useTranslation();
  const leagueIcon = getLeagueIcon(league);

  const resultConfig = {
    won: { icon: CheckCircle, label: 'Gagné ✅', cls: 'text-success border-success/30 bg-success/10' },
    lost: { icon: XCircle, label: 'Perdu ❌', cls: 'text-destructive border-destructive/30 bg-destructive/10' },
    pending: { icon: Timer, label: 'En cours ⏳', cls: 'text-warning border-warning/30 bg-warning/10' },
  };

  const resultInfo = result && result !== 'pending' ? resultConfig[result as keyof typeof resultConfig] : result === 'pending' ? resultConfig.pending : null;

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className={`card-elevated p-5 transition-all duration-300 ${
        isPremium ? 'border-gold/30 hover:border-gold/50' : 'hover:border-primary/30'
      } ${result === 'won' ? 'border-success/20' : result === 'lost' ? 'border-destructive/20' : ''}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">{leagueIcon || sportEmojis[sport]}</span>
          <span className="text-xs text-muted-foreground font-medium truncate max-w-[120px]">{league}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground font-mono">{time}</span>
        </div>
      </div>

      {/* Teams */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <div className="font-semibold mb-1 text-sm">{homeTeam}</div>
          <div className="text-muted-foreground text-xs font-medium">VS</div>
          <div className="font-semibold mt-1 text-sm">{awayTeam}</div>
        </div>
        {resultInfo && (
          <div className={`text-xs font-medium px-2 py-1 rounded-lg border ${resultInfo.cls}`}>
            {resultInfo.label}
          </div>
        )}
      </div>

      {/* Prediction */}
      <div className={`rounded-lg p-3 ${isPremium ? 'bg-gold/10' : 'bg-primary/10'}`}>
        {isPremium ? (
          <div className="flex items-center justify-center gap-2 text-gold">
            <Lock className="w-4 h-4" />
            <span className="text-sm font-medium">{t('matches.premium')}</span>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Pronostic</div>
              <div className="font-semibold text-primary text-sm">{prediction}</div>
            </div>
            {odds && (
              <div className="text-right">
                <div className="text-xs text-muted-foreground mb-1">Cote</div>
                <div className="font-bold text-lg">{odds.toFixed(2)}</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Confidence */}
      {confidence && !isPremium && (
        <div className="mt-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-success" />
          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-success rounded-full transition-all duration-500"
              style={{ width: `${Math.min(confidence, 100)}%` }}
            />
          </div>
          <span className="text-xs font-medium text-success">{Math.min(Math.round(confidence), 100)}%</span>
        </div>
      )}

      {/* Badge */}
      <div className="mt-3 flex justify-end">
        <span className={isPremium ? 'stat-badge-gold' : 'stat-badge-success'}>
          {isPremium ? t('matches.premium') : t('matches.free')}
        </span>
      </div>
    </motion.div>
  );
}
