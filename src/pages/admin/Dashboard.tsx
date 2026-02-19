import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Users, TrendingUp, Lightbulb, Gamepad2, 
  Shield, Crown, Layers, CreditCard
} from 'lucide-react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { PredictionsTab } from '@/components/admin/PredictionsTab';
import { TipsTab } from '@/components/admin/TipsTab';
import { UsersTab } from '@/components/admin/UsersTab';
import { StatsTab } from '@/components/admin/StatsTab';
import { GamesTab } from '@/components/admin/GamesTab';
import { SubscriptionsTab } from '@/components/admin/SubscriptionsTab';

type AppRole = 'admin' | 'moderator' | 'user';

const Dashboard = () => {
  const { t } = useTranslation();
  const { user, session } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [userRole, setUserRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPredictions: 0,
    totalTips: 0,
    premiumUsers: 0,
  });

  useEffect(() => {
    if (!session) {
      navigate('/auth');
      return;
    }
    checkUserRole();
  }, [session, navigate]);

  const checkUserRole = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .order('role')
        .limit(1);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const role = data[0].role as AppRole;
        if (role !== 'admin' && role !== 'moderator') {
          toast({
            title: t('admin.accessDenied'),
            description: t('admin.accessDeniedDesc'),
            variant: 'destructive',
          });
          navigate('/');
          return;
        }
        setUserRole(role);
        fetchDashboardStats();
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Error checking role:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const [usersRes, predictionsRes, tipsRes, premiumRes] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('predictions').select('*', { count: 'exact', head: true }),
        supabase.from('tips').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('is_premium', true),
      ]);

      setStats({
        totalUsers: usersRes.count || 0,
        totalPredictions: predictionsRes.count || 0,
        totalTips: tipsRes.count || 0,
        premiumUsers: premiumRes.count || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!userRole || (userRole !== 'admin' && userRole !== 'moderator')) {
    return null;
  }

  return (
    <Layout>
      <div className="min-h-screen pt-32 pb-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <LayoutDashboard className="w-8 h-8 text-primary" />
              <h1 className="font-display text-4xl font-bold">{t('admin.title')}</h1>
              <span className={`stat-badge ${userRole === 'admin' ? 'stat-badge-gold' : 'bg-secondary/20 text-secondary'}`}>
                {userRole === 'admin' ? <Crown className="w-3 h-3 mr-1" /> : <Shield className="w-3 h-3 mr-1" />}
                {userRole === 'admin' ? 'Admin' : 'Modérateur'}
              </span>
            </div>
            <p className="text-muted-foreground">{t('admin.subtitle')}</p>
          </motion.div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card-elevated p-4"
            >
              <Users className="w-6 h-6 text-primary mb-2" />
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <div className="text-xs text-muted-foreground">{t('admin.totalUsers')}</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card-elevated p-4"
            >
              <TrendingUp className="w-6 h-6 text-success mb-2" />
              <div className="text-2xl font-bold">{stats.totalPredictions}</div>
              <div className="text-xs text-muted-foreground">{t('admin.totalPredictions')}</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card-elevated p-4"
            >
              <Lightbulb className="w-6 h-6 text-gold mb-2" />
              <div className="text-2xl font-bold">{stats.totalTips}</div>
              <div className="text-xs text-muted-foreground">{t('admin.totalTips')}</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card-elevated p-4"
            >
              <Crown className="w-6 h-6 text-secondary mb-2" />
              <div className="text-2xl font-bold">{stats.premiumUsers}</div>
              <div className="text-xs text-muted-foreground">{t('admin.premiumUsers')}</div>
            </motion.div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="predictions" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1">
              <TabsTrigger value="predictions" className="gap-2">
                <TrendingUp className="w-4 h-4" />
                <span className="hidden sm:inline">{t('admin.predictions')}</span>
              </TabsTrigger>
              <TabsTrigger value="tips" className="gap-2">
                <Lightbulb className="w-4 h-4" />
                <span className="hidden sm:inline">{t('admin.tips')}</span>
              </TabsTrigger>
              {userRole === 'admin' && (
                <>
                  <TabsTrigger value="subscriptions" className="gap-2">
                    <CreditCard className="w-4 h-4" />
                    <span className="hidden sm:inline">{t('admin.subscriptions')}</span>
                  </TabsTrigger>
                  <TabsTrigger value="users" className="gap-2">
                    <Users className="w-4 h-4" />
                    <span className="hidden sm:inline">{t('admin.users')}</span>
                  </TabsTrigger>
                </>
              )}
              <TabsTrigger value="games" className="gap-2">
                <Layers className="w-4 h-4" />
                <span className="hidden sm:inline">Jeux</span>
              </TabsTrigger>
              <TabsTrigger value="stats" className="gap-2">
                <Gamepad2 className="w-4 h-4" />
                <span className="hidden sm:inline">{t('admin.gameStats')}</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="predictions">
              <PredictionsTab />
            </TabsContent>
            <TabsContent value="tips">
              <TipsTab />
            </TabsContent>
            {userRole === 'admin' && (
              <>
                <TabsContent value="subscriptions">
                  <SubscriptionsTab />
                </TabsContent>
                <TabsContent value="users">
                  <UsersTab />
                </TabsContent>
              </>
            )}
            <TabsContent value="games">
              <GamesTab />
            </TabsContent>
            <TabsContent value="stats">
              <StatsTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
