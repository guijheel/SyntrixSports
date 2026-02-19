import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Plus, Edit, Trash2, Check, X, Crown, Search, Filter, Archive, CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface Prediction {
  id: string;
  match_title: string;
  league: string;
  prediction: string;
  odds: number;
  confidence: number;
  result: string | null;
  match_date: string;
  is_premium: boolean;
  absents?: string | null;
  meteo?: string | null;
  enjeux?: string | null;
  description?: string | null;
  archived?: boolean | null;
}

const LEAGUES = [
  'Champions League', 'Premier League', 'Ligue 1', 'La Liga', 'Serie A', 'Bundesliga',
  'Europa League', 'Ligue 2', 'Championship', 'MLS', 'NBA', 'ATP', 'WTA', 'Autre'
];

const COMMON_TEAMS = [
  'PSG', 'Real Madrid', 'Barcelona', 'Bayern Munich', 'Manchester City', 'Liverpool', 'Juventus', 'Inter', 'AC Milan',
  'Chelsea', 'Arsenal', 'Manchester United', 'Tottenham', 'Atletico Madrid', 'Sevilla', 'Napoli', 'Lyon', 'Marseille',
  'Monaco', 'Lille', 'Rennes', 'Nice', 'Dortmund', 'Leipzig', 'Benfica', 'Porto', 'Ajax'
];

const COMMON_PREDICTIONS = [
  'Victoire domicile', 'Victoire extérieur', 'Match nul', 'Plus de 2.5 buts', 'Moins de 2.5 buts',
  'Double chance 1X', 'Double chance X2', 'Les deux marquent', 'But en 2e mi-temps'
];

const resultConfig = {
  won: { label: '✅ Gagné', cls: 'bg-success/20 text-success border-success/30' },
  lost: { label: '❌ Perdu', cls: 'bg-destructive/20 text-destructive border-destructive/30' },
  pending: { label: '⏳ En cours', cls: 'bg-warning/20 text-warning border-warning/30' },
};

export const PredictionsTab = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPrediction, setEditingPrediction] = useState<Prediction | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterResult, setFilterResult] = useState('all');
  const [filterMonth, setFilterMonth] = useState<string>('all');
  const [showArchived, setShowArchived] = useState(false);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [teamSuggestions, setTeamSuggestions] = useState<string[]>([]);
  const [predictionSuggestions, setPredictionSuggestions] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    home_team: '',
    away_team: '',
    league: '',
    prediction: '',
    odds: '',
    confidence: '3',
    match_date: '',
    match_time: '15:00',
    is_premium: false,
    result: 'pending',
    analysis: '',
    absents: '',
    meteo: '',
    enjeux: '',
    description: '',
  });

  useEffect(() => {
    fetchPredictions();
  }, []);

  const fetchPredictions = async () => {
    try {
      const { data, error } = await supabase
        .from('predictions')
        .select('*')
        .order('match_date', { ascending: sortDir === 'asc' });
      if (error) throw error;
      const list = data || [];
      setPredictions(list);
      const teams = new Set<string>();
      const preds = new Set<string>();
      list.forEach((p: Prediction) => {
        const parts = (p.match_title || '').split(' vs ');
        if (parts[0]?.trim()) teams.add(parts[0].trim());
        if (parts[1]?.trim()) teams.add(parts[1].trim());
        if (p.prediction?.trim()) preds.add(p.prediction.trim());
      });
      setTeamSuggestions([...COMMON_TEAMS, ...teams].filter(Boolean));
      setPredictionSuggestions([...COMMON_PREDICTIONS, ...preds].filter(Boolean));
    } catch (error) {
      console.error('Error fetching predictions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const matchTitle = formData.away_team 
        ? `${formData.home_team} vs ${formData.away_team}`
        : formData.home_team;
      
      const matchDatetime = formData.match_date && formData.match_time
        ? new Date(`${formData.match_date}T${formData.match_time}`).toISOString()
        : formData.match_date;

      const predictionData: Record<string, unknown> = {
        match_title: matchTitle,
        league: formData.league,
        prediction: formData.prediction,
        odds: parseFloat(formData.odds),
        confidence: parseInt(formData.confidence),
        match_date: matchDatetime,
        is_premium: formData.is_premium,
        result: formData.result,
        created_by: user?.id,
        absents: formData.absents.trim() || null,
        meteo: formData.meteo.trim() || null,
        enjeux: formData.enjeux.trim() || null,
        description: formData.description.trim() || null,
      };

      if (editingPrediction) {
        const { error } = await supabase.from('predictions').update(predictionData).eq('id', editingPrediction.id);
        if (error) throw error;
        toast({ title: t('admin.predictionUpdated') });
      } else {
        const { error } = await supabase.from('predictions').insert(predictionData);
        if (error) throw error;
        toast({ title: t('admin.predictionCreated') });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchPredictions();
    } catch (error) {
      console.error('Error saving prediction:', error);
      toast({ title: t('admin.error'), variant: 'destructive' });
    }
  };

  const handleEdit = (prediction: Prediction) => {
    setEditingPrediction(prediction);
    const teams = prediction.match_title.split(' vs ');
    const dateObj = new Date(prediction.match_date);
    setFormData({
      home_team: teams[0] || prediction.match_title,
      away_team: teams[1] || '',
      league: prediction.league,
      prediction: prediction.prediction,
      odds: prediction.odds.toString(),
      confidence: prediction.confidence.toString(),
      match_date: dateObj.toISOString().split('T')[0],
      match_time: dateObj.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      is_premium: prediction.is_premium,
      result: prediction.result || 'pending',
      analysis: '',
      absents: prediction.absents || '',
      meteo: prediction.meteo || '',
      enjeux: prediction.enjeux || '',
      description: prediction.description || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('admin.confirmDelete'))) return;
    try {
      const { error } = await supabase.from('predictions').delete().eq('id', id);
      if (error) throw error;
      toast({ title: t('admin.predictionDeleted') });
      fetchPredictions();
    } catch (error) {
      console.error('Error deleting prediction:', error);
      toast({ title: t('admin.error'), variant: 'destructive' });
    }
  };

  const handleQuickResult = async (id: string, result: string) => {
    try {
      const { error } = await supabase.from('predictions').update({ result }).eq('id', id);
      if (error) throw error;
      setPredictions(prev => prev.map(p => p.id === id ? { ...p, result } : p));
      toast({ title: `Résultat mis à jour : ${result}` });
    } catch (error) {
      toast({ title: t('admin.error'), variant: 'destructive' });
    }
  };

  const resetForm = () => {
    setEditingPrediction(null);
    setFormData({ home_team: '', away_team: '', league: '', prediction: '', odds: '', confidence: '3', match_date: '', match_time: '15:00', is_premium: false, result: 'pending', analysis: '', absents: '', meteo: '', enjeux: '', description: '' });
  };

  const handleArchive = async (id: string, archive: boolean) => {
    try {
      const { error } = await supabase.from('predictions').update({ archived: archive }).eq('id', id);
      if (error) throw error;
      toast({ title: archive ? 'Pronostic archivé' : 'Pronostic désarchivé' });
      fetchPredictions();
    } catch (error) {
      toast({ title: t('admin.error'), variant: 'destructive' });
    }
  };

  const monthsList = useMemo(() => {
    const out: { value: string; label: string }[] = [{ value: 'all', label: 'Tous les mois' }];
    for (let i = 0; i < 24; i++) {
      const d = subMonths(new Date(), i);
      out.push({ value: format(d, 'yyyy-MM'), label: format(d, 'MMMM yyyy', { locale: fr }) });
    }
    return out;
  }, []);

  const filtered = predictions.filter(p => {
    const matchSearch = p.match_title.toLowerCase().includes(searchQuery.toLowerCase()) || p.league.toLowerCase().includes(searchQuery.toLowerCase());
    const matchResult = filterResult === 'all' || p.result === filterResult || (!p.result && filterResult === 'pending');
    const archived = p.archived === true;
    if (showArchived && !archived) return false;
    if (!showArchived && archived) return false;
    if (filterMonth !== 'all') {
      const d = new Date(p.match_date);
      const monthKey = format(d, 'yyyy-MM');
      if (monthKey !== filterMonth) return false;
    }
    return matchSearch && matchResult;
  });

  return (
    <div className="card-elevated p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-xl font-semibold">{t('admin.managePredictions')}</h2>
          <p className="text-sm text-muted-foreground mt-1">{predictions.length} pronostic{predictions.length !== 1 ? 's' : ''} au total</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="btn-gradient">
              <Plus className="w-4 h-4 mr-2" />
              {t('admin.addPrediction')}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPrediction ? t('admin.editPrediction') : t('admin.addPrediction')}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Teams - autocomplete */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Équipe domicile *</label>
                  <Input
                    list="home-teams-list"
                    value={formData.home_team}
                    onChange={(e) => setFormData({ ...formData, home_team: e.target.value })}
                    placeholder="PSG"
                    required
                  />
                  <datalist id="home-teams-list">
                    {teamSuggestions.map(t => <option key={t} value={t} />)}
                  </datalist>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Équipe extérieur</label>
                  <Input
                    list="away-teams-list"
                    value={formData.away_team}
                    onChange={(e) => setFormData({ ...formData, away_team: e.target.value })}
                    placeholder="Real Madrid"
                  />
                  <datalist id="away-teams-list">
                    {teamSuggestions.map(t => <option key={t} value={t} />)}
                  </datalist>
                </div>
              </div>

              {/* League + Date (calendar) + Time */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">{t('admin.league')} *</label>
                  <Select value={formData.league} onValueChange={(v) => setFormData({ ...formData, league: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir..." />
                    </SelectTrigger>
                    <SelectContent>
                      {LEAGUES.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">{t('admin.matchDate')} *</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn('w-full justify-start text-left font-normal', !formData.match_date && 'text-muted-foreground')}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.match_date ? format(new Date(formData.match_date), 'PPP', { locale: fr }) : 'Choisir une date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.match_date ? new Date(formData.match_date) : undefined}
                        onSelect={(d) => setFormData({ ...formData, match_date: d ? format(d, 'yyyy-MM-dd') : '' })}
                        locale={fr}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Heure</label>
                  <Input
                    type="time"
                    value={formData.match_time}
                    onChange={(e) => setFormData({ ...formData, match_time: e.target.value })}
                  />
                </div>
              </div>

              {/* Prediction - autocomplete */}
              <div>
                <label className="text-sm font-medium mb-1.5 block">{t('admin.prediction')} *</label>
                <Input
                  list="prediction-list"
                  value={formData.prediction}
                  onChange={(e) => setFormData({ ...formData, prediction: e.target.value })}
                  placeholder="Victoire PSG, Plus de 2.5 buts, Double chance..."
                  required
                />
                <datalist id="prediction-list">
                  {predictionSuggestions.map(p => <option key={p} value={p} />)}
                </datalist>
              </div>

              {/* Optionnels: absents, météo, enjeux, description */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Absents (optionnel)</label>
                  <Input
                    value={formData.absents}
                    onChange={(e) => setFormData({ ...formData, absents: e.target.value })}
                    placeholder="Joueurs absents..."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Météo (optionnel)</label>
                  <Input
                    value={formData.meteo}
                    onChange={(e) => setFormData({ ...formData, meteo: e.target.value })}
                    placeholder="Conditions météo..."
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Enjeux (optionnel)</label>
                <Input
                  value={formData.enjeux}
                  onChange={(e) => setFormData({ ...formData, enjeux: e.target.value })}
                  placeholder="Enjeux du match..."
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Description (optionnel)</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Analyse ou commentaire..."
                  rows={2}
                />
              </div>

              {/* Odds + Confidence + Result */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">{t('admin.odds')} *</label>
                  <Input
                    type="number"
                    step="0.01"
                    min="1"
                    max="100"
                    value={formData.odds}
                    onChange={(e) => setFormData({ ...formData, odds: e.target.value })}
                    placeholder="1.85"
                    required
                  />
                  {formData.odds && !isNaN(parseFloat(formData.odds)) && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Gain 10€ → {(parseFloat(formData.odds) * 10).toFixed(2)}€
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">{t('admin.confidence')} (1-5)</label>
                  <Select value={formData.confidence} onValueChange={(v) => setFormData({ ...formData, confidence: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <SelectItem key={n} value={n.toString()}>
                          {'⭐'.repeat(n)} {n}/5
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">{t('admin.result')}</label>
                  <Select value={formData.result} onValueChange={(v) => setFormData({ ...formData, result: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">⏳ En cours</SelectItem>
                      <SelectItem value="won">✅ Gagné</SelectItem>
                      <SelectItem value="lost">❌ Perdu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Premium toggle */}
              <div className="flex items-center gap-3 p-3 bg-gold/10 border border-gold/20 rounded-lg">
                <input
                  type="checkbox"
                  id="is_premium"
                  checked={formData.is_premium}
                  onChange={(e) => setFormData({ ...formData, is_premium: e.target.checked })}
                  className="rounded w-4 h-4"
                />
                <label htmlFor="is_premium" className="text-sm font-medium flex items-center gap-2 cursor-pointer">
                  <Crown className="w-4 h-4 text-gold" />
                  Pronostic Premium uniquement (abonnés)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  {t('admin.cancel')}
                </Button>
                <Button type="submit" className="btn-gradient">
                  {editingPrediction ? t('admin.update') : t('admin.create')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher match ou ligue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterMonth} onValueChange={setFilterMonth}>
          <SelectTrigger className="w-[180px]">
            <CalendarIcon className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {monthsList.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterResult} onValueChange={setFilterResult}>
          <SelectTrigger className="w-[160px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les résultats</SelectItem>
            <SelectItem value="pending">⏳ En cours</SelectItem>
            <SelectItem value="won">✅ Gagnés</SelectItem>
            <SelectItem value="lost">❌ Perdus</SelectItem>
          </SelectContent>
        </Select>
        <Button variant={showArchived ? 'secondary' : 'outline'} size="sm" onClick={() => setShowArchived(!showArchived)}>
          <Archive className="w-4 h-4 mr-2" />
          {showArchived ? 'Voir les actifs' : 'Voir les archivés'}
        </Button>
        <Link to="/admin/archive">
          <Button variant="ghost" size="sm">
            Page archivés
          </Button>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-3 font-medium text-muted-foreground text-sm">Match</th>
              <th className="text-left p-3 font-medium text-muted-foreground text-sm">Pronostic</th>
              <th className="text-center p-3 font-medium text-muted-foreground text-sm">Cote</th>
              <th className="text-center p-3 font-medium text-muted-foreground text-sm">Conf.</th>
              <th className="text-center p-3 font-medium text-muted-foreground text-sm">Statut</th>
              <th className="text-right p-3 font-medium text-muted-foreground text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((prediction) => {
              const result = prediction.result || 'pending';
              const rc = resultConfig[result as keyof typeof resultConfig] || resultConfig.pending;
              return (
                <tr key={prediction.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-1.5">
                      {prediction.archived && <Archive className="w-3.5 h-3.5 text-muted-foreground shrink-0" />}
                      <div>
                        <div className="font-medium text-sm">{prediction.match_title}</div>
                        <div className="text-xs text-muted-foreground">{prediction.league}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(prediction.match_date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                          {' '}
                          {new Date(prediction.match_date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1.5">
                      {prediction.is_premium && <Crown className="w-3.5 h-3.5 text-gold shrink-0" />}
                      <span className="text-sm">{prediction.prediction}</span>
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    <span className="font-bold text-primary">{prediction.odds.toFixed(2)}</span>
                  </td>
                  <td className="p-3 text-center">
                    <span className="text-sm">{'⭐'.repeat(prediction.confidence)}</span>
                  </td>
                  <td className="p-3 text-center">
                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${rc.cls}`}>
                      {rc.label}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {/* Quick result buttons */}
                      {result !== 'won' && (
                        <Button variant="ghost" size="icon" className="w-7 h-7 text-success hover:bg-success/10" onClick={() => handleQuickResult(prediction.id, 'won')} title="Marquer gagné">
                          <Check className="w-3.5 h-3.5" />
                        </Button>
                      )}
                      {result !== 'lost' && (
                        <Button variant="ghost" size="icon" className="w-7 h-7 text-destructive hover:bg-destructive/10" onClick={() => handleQuickResult(prediction.id, 'lost')} title="Marquer perdu">
                          <X className="w-3.5 h-3.5" />
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => handleArchive(prediction.id, !prediction.archived)} title={prediction.archived ? 'Désarchiver' : 'Archiver'}>
                        <Archive className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => handleEdit(prediction)}>
                        <Edit className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => handleDelete(prediction.id)}>
                        <Trash2 className="w-3.5 h-3.5 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            {loading ? 'Chargement...' : searchQuery ? 'Aucun résultat pour cette recherche' : t('admin.noPredictions')}
          </div>
        )}
      </div>

      {/* Stats summary */}
      {predictions.length > 0 && (
        <div className="flex gap-4 mt-4 pt-4 border-t border-border">
          {['won', 'lost', 'pending'].map(r => {
            const count = predictions.filter(p => (p.result || 'pending') === r).length;
            const rc = resultConfig[r as keyof typeof resultConfig];
            return (
              <div key={r} className="flex items-center gap-2">
                <span className={`text-xs font-medium px-2 py-0.5 rounded border ${rc.cls}`}>{rc.label}</span>
                <span className="font-bold text-sm">{count}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
