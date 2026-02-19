import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { User, Camera, Trophy, Target, BarChart3, Gift, Copy, Check, Crown, Settings } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface GameStats {
  quiz_games_played: number;
  quiz_correct_answers: number;
  score_predictions_made: number;
  score_predictions_correct: number;
  accumulators_created: number;
  accumulators_won: number;
  total_points: number;
}

interface ProfileData {
  display_name: string | null;
  avatar_url: string | null;
  referral_code: string | null;
}

const Profile = () => {
  const { t } = useTranslation();
  const { user, subscription, session } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [gameStats, setGameStats] = useState<GameStats | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [referralCount, setReferralCount] = useState(0);

  useEffect(() => {
    if (!session) {
      navigate('/auth');
      return;
    }
    fetchProfileData();
  }, [session, navigate]);

  const fetchProfileData = async () => {
    if (!user) return;
    
    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('display_name, avatar_url, referral_code')
        .eq('user_id', user.id)
        .single();
      
      if (profileData) {
        setProfile(profileData);
        setDisplayName(profileData.display_name || '');
      }

      // Fetch game stats
      const { data: statsData } = await supabase
        .from('user_game_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (statsData) {
        setGameStats(statsData);
      }

      // Fetch referral count
      const { count } = await supabase
        .from('referrals')
        .select('*', { count: 'exact', head: true })
        .eq('referrer_id', user.id)
        .eq('status', 'completed');
      
      setReferralCount(count || 0);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ display_name: displayName })
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      toast({
        title: t('profile.saved'),
        description: t('profile.savedDesc'),
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: t('profile.error'),
        description: t('profile.errorDesc'),
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // For now, we'll use a placeholder - in production, you'd upload to storage
    toast({
      title: t('profile.avatarUpdated'),
      description: t('profile.avatarUpdatedDesc'),
    });
  };

  const copyReferralCode = () => {
    if (profile?.referral_code) {
      navigator.clipboard.writeText(profile.referral_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: t('profile.codeCopied'),
        description: t('profile.codeCopiedDesc'),
      });
    }
  };

  const handleManageSubscription = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'accéder au portail de gestion.',
        variant: 'destructive',
      });
    }
  };

  if (!session) {
    return null;
  }

  return (
    <Layout>
      <div className="min-h-screen pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="font-display text-4xl font-bold mb-2">{t('profile.title')}</h1>
            <p className="text-muted-foreground">{t('profile.subtitle')}</p>
          </motion.div>

          <div className="grid gap-6">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card-elevated p-6"
            >
              <div className="flex items-start gap-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-12 h-12 text-muted-foreground" />
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors">
                    <Camera className="w-4 h-4 text-primary-foreground" />
                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                  </label>
                </div>
                
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">{t('profile.displayName')}</label>
                    <Input
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder={t('profile.displayNamePlaceholder')}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">{t('profile.email')}</label>
                    <Input value={user?.email || ''} disabled className="mt-1 bg-muted" />
                  </div>
                  <Button onClick={handleSaveProfile} disabled={saving} className="btn-gradient">
                    {saving ? t('profile.saving') : t('profile.save')}
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Subscription Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card-elevated p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Crown className={`w-8 h-8 ${subscription.subscribed ? 'text-gold' : 'text-muted-foreground'}`} />
                  <div>
                    <h3 className="font-display text-lg font-semibold">{t('profile.subscription')}</h3>
                    <p className="text-sm text-muted-foreground">
                      {subscription.subscribed ? t('profile.premiumActive') : t('profile.freePlan')}
                    </p>
                  </div>
                </div>
                {subscription.subscribed ? (
                  <div className="text-right">
                    <span className="stat-badge-gold">{t('profile.premium')}</span>
                    {subscription.subscriptionEnd && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {t('profile.expiresOn')} {new Date(subscription.subscriptionEnd).toLocaleDateString()}
                      </p>
                    )}
                    <Button variant="outline" size="sm" className="mt-2" onClick={handleManageSubscription}>
                      <Settings className="w-4 h-4 mr-2" />
                      {t('profile.manageSubscription')}
                    </Button>
                  </div>
                ) : (
                  <Button onClick={() => navigate('/premium')} className="btn-gold">
                    {t('profile.upgradeToPremium')}
                  </Button>
                )}
              </div>
            </motion.div>

            {/* Game Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card-elevated p-6"
            >
              <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-gold" />
                {t('profile.gameStats')}
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-muted/50 rounded-lg p-4 text-center">
                  <Target className="w-6 h-6 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold">{gameStats?.quiz_games_played || 0}</div>
                  <div className="text-xs text-muted-foreground">{t('profile.quizPlayed')}</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-4 text-center">
                  <Check className="w-6 h-6 text-success mx-auto mb-2" />
                  <div className="text-2xl font-bold">{gameStats?.quiz_correct_answers || 0}</div>
                  <div className="text-xs text-muted-foreground">{t('profile.correctAnswers')}</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-4 text-center">
                  <BarChart3 className="w-6 h-6 text-secondary mx-auto mb-2" />
                  <div className="text-2xl font-bold">{gameStats?.score_predictions_made || 0}</div>
                  <div className="text-xs text-muted-foreground">{t('profile.predictions')}</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-4 text-center">
                  <Trophy className="w-6 h-6 text-gold mx-auto mb-2" />
                  <div className="text-2xl font-bold">{gameStats?.total_points || 0}</div>
                  <div className="text-xs text-muted-foreground">{t('profile.totalPoints')}</div>
                </div>
              </div>
            </motion.div>

            {/* Referral Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card-elevated p-6"
            >
              <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
                <Gift className="w-5 h-5 text-primary" />
                {t('profile.referral')}
              </h3>
              
              <p className="text-muted-foreground mb-4">{t('profile.referralDesc')}</p>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 bg-muted rounded-lg px-4 py-3 font-mono text-lg">
                  {profile?.referral_code || '--------'}
                </div>
                <Button onClick={copyReferralCode} variant="outline" size="icon">
                  {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">{t('profile.referralsCompleted')}:</span>
                  <span className="font-semibold text-primary">{referralCount}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">{t('profile.rewardsEarned')}:</span>
                  <span className="font-semibold text-gold">{referralCount * 7} {t('profile.days')}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
