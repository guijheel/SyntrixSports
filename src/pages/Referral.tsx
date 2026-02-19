import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Gift, Copy, Check, Users, Crown, ArrowRight, Share2, AlertCircle } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface ReferralStats {
  referral_code: string | null;
  total_referrals: number;
  completed_referrals: number;
  rewards_earned: number;
}

const Referral = () => {
  const { t } = useTranslation();
  const { user, session } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [stats, setStats] = useState<ReferralStats>({
    referral_code: null,
    total_referrals: 0,
    completed_referrals: 0,
    rewards_earned: 0,
  });
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [referralCode, setReferralCode] = useState('');
  const [validating, setValidating] = useState(false);
  const [referralValid, setReferralValid] = useState<boolean | null>(null);

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      setReferralCode(code.toUpperCase());
      validateAndRedirect(code.toUpperCase());
    }
  }, [searchParams]);

  useEffect(() => {
    if (session) {
      fetchReferralStats();
    } else {
      setLoading(false);
    }
  }, [session]);

  const validateAndRedirect = async (code: string) => {
    setValidating(true);
    try {
      const { data: exists } = await supabase.rpc('check_referral_code_exists', { code: code.trim() });
      if (exists) {
        const codeToStore = code.trim().toUpperCase();
        localStorage.setItem('referral_code', codeToStore);
        toast({ title: '✅ Code valide !', description: 'Créez un compte pour profiter de 3 jours Premium offerts.' });
        navigate(`/auth?ref=${codeToStore}`);
      } else {
        toast({ title: '❌ Code invalide', description: "Ce code de parrainage n'existe pas.", variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Erreur', description: 'Impossible de vérifier le code.', variant: 'destructive' });
    } finally {
      setValidating(false);
    }
  };

  const fetchReferralStats = async () => {
    if (!user) return;
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('referral_code')
        .eq('user_id', user.id)
        .single();

      const { data: referrals, count } = await supabase
        .from('referrals')
        .select('*', { count: 'exact' })
        .eq('referrer_id', user.id);

      const completedReferrals = referrals?.filter(r => r.status === 'completed').length || 0;

      setStats({
        referral_code: profile?.referral_code || null,
        total_referrals: count || 0,
        completed_referrals: completedReferrals,
        rewards_earned: completedReferrals * 7,
      });
    } catch (error) {
      console.error('Error fetching referral stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyReferralLink = () => {
    if (stats.referral_code) {
      const link = `${window.location.origin}/auth?ref=${stats.referral_code}`;
      navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({ title: t('referral.linkCopied'), description: link });
    }
  };

  const shareReferralLink = async () => {
    if (stats.referral_code && navigator.share) {
      const link = `${window.location.origin}/auth?ref=${stats.referral_code}`;
      try {
        await navigator.share({ title: 'PronoMaster — Code parrainage', text: `Rejoins PronoMaster avec mon code ${stats.referral_code} et reçois 3 jours Premium offerts !`, url: link });
      } catch {}
    } else {
      copyReferralLink();
    }
  };

  const applyReferralCode = async () => {
    if (!referralCode.trim()) {
      toast({ title: t('referral.enterCode'), variant: 'destructive' });
      return;
    }
    await validateAndRedirect(referralCode.toUpperCase());
  };

  const validateCodeInput = async (code: string) => {
    if (code.length < 6) { setReferralValid(null); return; }
    try {
      const { data } = await supabase.rpc('check_referral_code_exists', { code: code.trim() });
      setReferralValid(data === true);
    } catch {
      setReferralValid(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary mb-4">
              <Gift className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">{t('referral.title')}</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t('referral.subtitle')}</p>
          </motion.div>

          {session ? (
            <>
              {/* User's referral stats */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card-elevated p-8 mb-8">
                <h2 className="font-display text-xl font-semibold mb-6">{t('referral.yourCode')}</h2>
                
                <div className="bg-muted/50 rounded-xl p-6 mb-6">
                  <div className="text-center mb-4">
                    <div className="font-mono text-4xl font-bold tracking-widest text-primary">
                      {stats.referral_code || '--------'}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">Votre code unique de parrainage</p>
                  </div>
                  <div className="flex gap-3 justify-center">
                    <Button onClick={copyReferralLink} variant="outline" className="gap-2">
                      {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                      {copied ? 'Copié !' : 'Copier le lien'}
                    </Button>
                    <Button onClick={shareReferralLink} className="btn-gradient gap-2">
                      <Share2 className="w-4 h-4" />
                      Partager
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-muted/50 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-primary">{stats.total_referrals}</div>
                    <div className="text-sm text-muted-foreground">{t('referral.totalInvited')}</div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-success">{stats.completed_referrals}</div>
                    <div className="text-sm text-muted-foreground">{t('referral.completed')}</div>
                  </div>
                  <div className="bg-gold/10 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-gold">{stats.rewards_earned}</div>
                    <div className="text-sm text-muted-foreground">{t('referral.daysEarned')}</div>
                  </div>
                </div>
              </motion.div>
            </>
          ) : (
            <>
              {/* Non-logged user - enter referral code */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card-elevated p-8 mb-8">
                <h2 className="font-display text-xl font-semibold mb-2">{t('referral.haveCode')}</h2>
                <p className="text-muted-foreground mb-6">{t('referral.enterCodeDesc')}</p>
                
                <div className="flex items-center gap-4">
                  <div className="flex-1 relative">
                    <Input
                      value={referralCode}
                      onChange={(e) => {
                        const val = e.target.value.toUpperCase();
                        setReferralCode(val);
                        validateCodeInput(val);
                      }}
                      placeholder="XXXXXXXX"
                      className={`text-center font-mono text-xl tracking-widest ${
                        referralValid === true ? 'border-success' : referralValid === false ? 'border-destructive' : ''
                      }`}
                      maxLength={10}
                    />
                    {referralValid !== null && (
                      <div className={`absolute right-3 top-1/2 -translate-y-1/2 text-sm ${referralValid ? 'text-success' : 'text-destructive'}`}>
                        {referralValid ? '✅' : '❌'}
                      </div>
                    )}
                  </div>
                  <Button onClick={applyReferralCode} size="lg" className="btn-gradient" disabled={validating || referralValid === false}>
                    {validating ? 'Vérification...' : t('referral.apply')}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>

                {referralValid === false && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-destructive">
                    <AlertCircle className="w-4 h-4" />
                    Ce code de parrainage est invalide ou n'existe pas.
                  </div>
                )}
                {referralValid === true && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-success">
                    <Check className="w-4 h-4" />
                    Code valide ! Cliquez sur "Appliquer" pour créer votre compte.
                  </div>
                )}
              </motion.div>
            </>
          )}

          {/* How it works */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-8">
            <h2 className="font-display text-2xl font-semibold mb-6 text-center">{t('referral.howItWorks')}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: Crown, title: t('referral.reward1Title'), description: t('referral.reward1Desc'), color: 'text-gold', bg: 'bg-gold/10' },
                { icon: Gift, title: t('referral.reward2Title'), description: t('referral.reward2Desc'), color: 'text-primary', bg: 'bg-primary/10' },
                { icon: Users, title: t('referral.reward3Title'), description: t('referral.reward3Desc'), color: 'text-secondary', bg: 'bg-secondary/10' },
              ].map((reward, index) => (
                <div key={index} className="card-elevated p-6 text-center">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${reward.bg} mb-4`}>
                    <reward.icon className={`w-6 h-6 ${reward.color}`} />
                  </div>
                  <div className="text-4xl font-bold text-muted-foreground mb-2">0{index + 1}</div>
                  <h3 className="font-display font-semibold mb-2">{reward.title}</h3>
                  <p className="text-sm text-muted-foreground">{reward.description}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {!session && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-center">
              <Button onClick={() => navigate('/auth')} size="lg" className="btn-gradient">
                {t('referral.joinNow')}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Referral;
