import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Crown, RefreshCw, UserCheck, UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ProfileRow {
  id: string;
  user_id: string;
  email: string | null;
  display_name: string | null;
  is_premium: boolean;
}

export function SubscriptionsTab() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, user_id, email, display_name, is_premium')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setProfiles((data as ProfileRow[]) || []);
    } catch (error) {
      console.error('Error fetching profiles:', error);
      toast({ title: t('admin.error'), variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const setPremium = async (profileId: string, isPremium: boolean) => {
    try {
      const { error } = await supabase.from('profiles').update({ is_premium: isPremium }).eq('id', profileId);
      if (error) throw error;
      toast({ title: isPremium ? t('admin.subscriptionSetPremium') : t('admin.subscriptionSetFree') });
      fetchProfiles();
    } catch {
      toast({ title: t('admin.error'), variant: 'destructive' });
    }
  };

  const premiumCount = profiles.filter(p => p.is_premium).length;

  return (
    <div className="card-elevated p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-xl font-semibold flex items-center gap-2">
            <Crown className="w-5 h-5 text-gold" />
            {t('admin.subscriptions')}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {t('admin.subscriptionsDesc')} {premiumCount} {t('admin.premiumUsers').toLowerCase()}.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchProfiles} disabled={loading}>
          <RefreshCw className="w-4 h-4 mr-2" />
          {t('admin.refresh')}
        </Button>
      </div>

      {loading ? (
        <div className="py-8 text-center text-muted-foreground">Chargement...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 font-medium text-sm text-muted-foreground">{t('admin.user')}</th>
                <th className="text-left p-3 font-medium text-sm text-muted-foreground">{t('admin.email')}</th>
                <th className="text-center p-3 font-medium text-sm text-muted-foreground">Premium</th>
                <th className="text-right p-3 font-medium text-sm text-muted-foreground">{t('admin.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((p) => (
                <tr key={p.id} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="p-3 font-medium">{p.display_name || '—'}</td>
                  <td className="p-3 text-sm text-muted-foreground">{p.email || '—'}</td>
                  <td className="p-3 text-center">
                    {p.is_premium ? (
                      <span className="inline-flex items-center gap-1 text-gold font-medium">
                        <Crown className="w-4 h-4" /> Oui
                      </span>
                    ) : (
                      <span className="text-muted-foreground">Non</span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    {p.is_premium ? (
                      <Button variant="ghost" size="sm" onClick={() => setPremium(p.id, false)} className="text-muted-foreground">
                        <UserX className="w-4 h-4 mr-1" />
                        Retirer Premium
                      </Button>
                    ) : (
                      <Button variant="ghost" size="sm" onClick={() => setPremium(p.id, true)} className="text-gold">
                        <UserCheck className="w-4 h-4 mr-1" />
                        Mettre Premium
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 p-4 rounded-lg bg-muted/50 border border-border text-sm text-muted-foreground">
        <strong>Stripe :</strong> Pour synchroniser les abonnements Stripe avec la base, configurez un webhook Stripe qui appelle votre backend (ou une Edge Function Supabase) pour mettre à jour <code className="bg-background px-1 rounded">profiles.is_premium</code> à la souscription / annulation.
      </div>
    </div>
  );
}
