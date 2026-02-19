import { useTranslation } from 'react-i18next';
import { TrendingUp, BarChart3, Target, Calendar, Star, Shield, Clock, Trophy, AlertTriangle, UserX, Cloud, Zap, FileText } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface PredictionDetailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prediction: {
    match_title: string;
    league: string;
    prediction: string;
    odds: number;
    confidence: number;
    match_date: string;
    is_premium: boolean;
    result: string | null;
    absents?: string | null;
    meteo?: string | null;
    enjeux?: string | null;
    description?: string | null;
  } | null;
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
};

const getLeagueIcon = (league: string) => {
  const lower = league.toLowerCase();
  for (const [key, icon] of Object.entries(LEAGUE_ICONS)) {
    if (lower.includes(key)) return icon;
  }
  return '⚽';
};

const getRiskLabel = (odds: number) => {
  if (odds < 1.4) return { label: 'Très faible risque', color: 'text-success', icon: '🟢' };
  if (odds < 1.8) return { label: 'Faible risque', color: 'text-success', icon: '🟢' };
  if (odds < 2.5) return { label: 'Risque modéré', color: 'text-warning', icon: '🟡' };
  if (odds < 4) return { label: 'Risque élevé', color: 'text-destructive', icon: '🟠' };
  return { label: 'Très haut risque', color: 'text-destructive', icon: '🔴' };
};

const getPotentialGain = (odds: number, stake = 10) => {
  return (odds * stake).toFixed(2);
};

export function PredictionDetailDialog({ open, onOpenChange, prediction }: PredictionDetailProps) {
  if (!prediction) return null;

  const teams = prediction.match_title.split(' vs ');
  const homeTeam = teams[0] || prediction.match_title;
  const awayTeam = teams[1] || '';
  const matchDate = new Date(prediction.match_date);
  const confidencePercent = Math.min(prediction.confidence * 20, 100);
  const risk = getRiskLabel(prediction.odds);
  const leagueIcon = getLeagueIcon(prediction.league);

  const isToday = new Date().toDateString() === matchDate.toDateString();
  const isFuture = matchDate > new Date();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            Analyse détaillée du pronostic
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Match Header */}
          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">{leagueIcon}</span>
                <span className="text-sm font-semibold text-primary">{prediction.league}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="w-3.5 h-3.5" />
                {isToday ? "Aujourd'hui" : matchDate.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}
                <Clock className="w-3.5 h-3.5 ml-1" />
                {matchDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-center flex-1">
                <div className="font-display text-base font-bold">{homeTeam}</div>
                <div className="text-xs text-muted-foreground mt-0.5">Domicile</div>
              </div>
              <div className="px-4">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-xs font-bold text-muted-foreground">VS</span>
                </div>
              </div>
              <div className="text-center flex-1">
                <div className="font-display text-base font-bold">{awayTeam}</div>
                <div className="text-xs text-muted-foreground mt-0.5">Extérieur</div>
              </div>
            </div>
          </div>

          {/* Main Prediction */}
          <div className="bg-primary/5 border border-primary/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-primary" />
              <span className="font-semibold text-sm text-muted-foreground">Notre Pronostic</span>
            </div>
            <div className="text-2xl font-display font-bold text-primary">
              {prediction.prediction}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-muted/50 rounded-xl p-3 text-center">
              <BarChart3 className="w-5 h-5 text-primary mx-auto mb-1" />
              <div className="text-xs text-muted-foreground mb-1">Cote</div>
              <div className="text-xl font-bold font-display">{prediction.odds.toFixed(2)}</div>
            </div>
            <div className="bg-muted/50 rounded-xl p-3 text-center">
              <TrendingUp className="w-5 h-5 text-success mx-auto mb-1" />
              <div className="text-xs text-muted-foreground mb-1">Confiance</div>
              <div className="text-xl font-bold font-display text-success">{prediction.confidence}/5</div>
            </div>
            <div className="bg-muted/50 rounded-xl p-3 text-center">
              <Star className="w-5 h-5 text-gold mx-auto mb-1" />
              <div className="text-xs text-muted-foreground mb-1">Gain 10€</div>
              <div className="text-xl font-bold font-display text-gold">{getPotentialGain(prediction.odds)}€</div>
            </div>
          </div>

          {/* Confidence Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5" /> Niveau de confiance</span>
              <span className="font-semibold text-foreground">{confidencePercent}%</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-success rounded-full transition-all duration-700"
                style={{ width: `${confidencePercent}%` }}
              />
            </div>
          </div>

          {/* Optionnels : absents, météo, enjeux, description - affichés seulement si renseignés */}
          {(prediction.absents || prediction.meteo || prediction.enjeux || prediction.description) && (
            <div className="space-y-3">
              {prediction.absents && (
                <div className="flex items-start gap-2 bg-muted/30 rounded-xl p-3">
                  <UserX className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-medium text-muted-foreground mb-0.5">Absents</div>
                    <p className="text-sm text-foreground">{prediction.absents}</p>
                  </div>
                </div>
              )}
              {prediction.meteo && (
                <div className="flex items-start gap-2 bg-muted/30 rounded-xl p-3">
                  <Cloud className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-medium text-muted-foreground mb-0.5">Météo</div>
                    <p className="text-sm text-foreground">{prediction.meteo}</p>
                  </div>
                </div>
              )}
              {prediction.enjeux && (
                <div className="flex items-start gap-2 bg-muted/30 rounded-xl p-3">
                  <Zap className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-medium text-muted-foreground mb-0.5">Enjeux</div>
                    <p className="text-sm text-foreground">{prediction.enjeux}</p>
                  </div>
                </div>
              )}
              {prediction.description && (
                <div className="flex items-start gap-2 bg-muted/30 rounded-xl p-3">
                  <FileText className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-medium text-muted-foreground mb-0.5">Description</div>
                    <p className="text-sm text-foreground whitespace-pre-wrap">{prediction.description}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Risk Level */}
          <div className="flex items-center justify-between bg-muted/30 rounded-xl p-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Niveau de risque</span>
            </div>
            <span className={`text-sm font-semibold ${risk.color}`}>
              {risk.icon} {risk.label}
            </span>
          </div>

          {/* Analysis */}
          <div className="bg-muted/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-4 h-4 text-gold" />
              <span className="font-semibold text-sm">Analyse de nos experts</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Ce pronostic <strong className="text-foreground">"{prediction.prediction}"</strong> sur le match 
              <strong className="text-foreground"> {homeTeam} vs {awayTeam}</strong> en <strong className="text-foreground">{prediction.league}</strong> 
              {' '}est basé sur l'analyse approfondie des performances récentes, les statistiques de confrontations directes 
              et les conditions actuelles des équipes. La cote de{' '}
              <strong className="text-foreground">{prediction.odds.toFixed(2)}</strong> offre un rapport 
              risque/récompense{' '}
              {prediction.odds < 1.5 ? 'conservateur — idéal pour les paris sécurisés' : 
               prediction.odds < 2.5 ? 'équilibré — bon compromis performance/gain' : 
               'agressif — potentiel de gain élevé avec risque accru'}.
            </p>
            {isFuture && (
              <div className="mt-3 text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Match prévu dans {Math.ceil((matchDate.getTime() - Date.now()) / (1000 * 60 * 60))}h
              </div>
            )}
          </div>

          {/* Result if available */}
          {prediction.result && prediction.result !== 'pending' && (
            <div className={`rounded-xl p-4 text-center font-semibold border ${
              prediction.result === 'won' 
                ? 'bg-success/10 text-success border-success/20' 
                : 'bg-destructive/10 text-destructive border-destructive/20'
            }`}>
              <Shield className="w-6 h-6 mx-auto mb-1" />
              {prediction.result === 'won' ? '✅ Pronostic gagné !' : '❌ Pronostic perdu'}
            </div>
          )}

          {prediction.result === 'pending' && (
            <div className="rounded-xl p-3 text-center text-sm text-warning bg-warning/10 border border-warning/20">
              ⏳ Match en cours — résultat en attente
            </div>
          )}

          {/* Premium badge */}
          {prediction.is_premium && (
            <div className="text-center text-xs text-gold bg-gold/10 rounded-lg py-2 border border-gold/20">
              ⭐ Pronostic Premium exclusif
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
