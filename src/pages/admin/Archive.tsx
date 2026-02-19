import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Archive, ArchiveRestore, Edit, Trash2, Check, X, Crown } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

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
  archived: boolean | null;
}

const resultConfig: Record<string, { label: string; cls: string }> = {
  won: { label: '✅ Gagné', cls: 'bg-success/20 text-success' },
  lost: { label: '❌ Perdu', cls: 'bg-destructive/20 text-destructive' },
  pending: { label: '⏳ En cours', cls: 'bg-warning/20 text-warning' },
};

export default function AdminArchive() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { toast } = useToast();
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (!session) {
      navigate('/auth');
      return;
    }
    const check = async () => {
      const { data } = await supabase.from('user_roles').select('role').eq('user_id', session.user.id).limit(1);
      const role = data?.[0]?.role;
      if (role !== 'admin' && role !== 'moderator') {
        setLoading(false);
        navigate('/admin');
        return;
      }
      setAllowed(true);
      fetchArchived();
    };
    check();
  }, [session, navigate]);

  const fetchArchived = async () => {
    try {
      const { data, error } = await supabase
        .from('predictions')
        .select('*')
        .eq('archived', true)
        .order('match_date', { ascending: false });
      if (error) throw error;
      setPredictions(data || []);
    } catch (error) {
      console.error(error);
      toast({ title: 'Erreur', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleUnarchive = async (id: string) => {
    try {
      const { error } = await supabase.from('predictions').update({ archived: false }).eq('id', id);
      if (error) throw error;
      toast({ title: 'Pronostic désarchivé' });
      fetchArchived();
    } catch {
      toast({ title: 'Erreur', variant: 'destructive' });
    }
  };

  if (!session || !allowed) return null;

  return (
    <Layout>
      <div className="min-h-screen pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold flex items-center gap-2">
                <Archive className="w-8 h-8 text-primary" />
                Pronostics archivés
              </h1>
              <p className="text-muted-foreground mt-1">Réintégrer un pronostic dans le dashboard en le désarchivant.</p>
            </div>
            <Button variant="outline" onClick={() => navigate('/admin')}>
              Retour au dashboard
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
            </div>
          ) : predictions.length === 0 ? (
            <div className="card-elevated p-12 text-center text-muted-foreground">
              Aucun pronostic archivé.
            </div>
          ) : (
            <div className="card-elevated overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-3 font-medium text-sm">Match</th>
                    <th className="text-left p-3 font-medium text-sm">Pronostic</th>
                    <th className="text-center p-3 font-medium text-sm">Cote</th>
                    <th className="text-center p-3 font-medium text-sm">Statut</th>
                    <th className="text-right p-3 font-medium text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {predictions.map((p) => {
                    const result = p.result || 'pending';
                    const rc = resultConfig[result] || resultConfig.pending;
                    return (
                      <tr key={p.id} className="border-b border-border/50 hover:bg-muted/30">
                        <td className="p-3">
                          <div className="font-medium text-sm">{p.match_title}</div>
                          <div className="text-xs text-muted-foreground">{p.league} · {new Date(p.match_date).toLocaleDateString('fr-FR')}</div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-1.5">
                            {p.is_premium && <Crown className="w-3.5 h-3.5 text-gold" />}
                            <span className="text-sm">{p.prediction}</span>
                          </div>
                        </td>
                        <td className="p-3 text-center font-bold text-primary">{p.odds.toFixed(2)}</td>
                        <td className="p-3 text-center">
                          <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium border ${rc.cls}`}>{rc.label}</span>
                        </td>
                        <td className="p-3 text-right">
                          <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => handleUnarchive(p.id)} title="Désarchiver">
                            <ArchiveRestore className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
