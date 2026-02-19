import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Crown, TrendingUp, Shield, Zap, Bell, Check } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const benefits = [
  { icon: TrendingUp, title: 'Pronostics Haute Cote', description: 'Accédez à nos picks les plus rentables avec des cotes élevées.' },
  { icon: Shield, title: 'Analyses Détaillées', description: 'Comprenez notre raisonnement avec des analyses approfondies.' },
  { icon: Zap, title: 'Accès Prioritaire', description: 'Recevez les pronostics avant tout le monde.' },
  { icon: Bell, title: 'Alertes Temps Réel', description: 'Notifications push pour ne jamais rater une opportunité.' },
];

const Premium = () => {
  const { t } = useTranslation();
  const { user, subscription, checkSubscription } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      toast({
        title: "Paiement réussi !",
        description: "Bienvenue dans SyntrixSports Premium ! Votre abonnement est maintenant actif.",
      });
      checkSubscription();
    } else if (searchParams.get('canceled') === 'true') {
      toast({
        title: "Paiement annulé",
        description: "Votre paiement a été annulé. Vous pouvez réessayer à tout moment.",
        variant: "destructive",
      });
    }
  }, [searchParams, toast, checkSubscription]);

  const handleSubscribe = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout');
      if (error) throw error;
      
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        title: "Erreur",
        description: "Impossible de démarrer le processus de paiement. Veuillez réessayer.",
        variant: "destructive",
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
        title: "Erreur",
        description: "Impossible d'ouvrir le portail de gestion. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <div className="min-h-screen pt-32 pb-20">
        {/* Hero */}
        <div className="container mx-auto px-4 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 text-gold mb-6">
              <Crown className="w-5 h-5" />
              <span className="font-semibold">Premium</span>
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-bold mb-6">
              Passez au niveau{' '}
              <span className="gradient-text-gold">supérieur</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Débloquez l'accès complet à tous nos pronostics premium et maximisez vos profits avec nos analyses expertes.
            </p>
          </motion.div>
        </div>

        {/* Benefits */}
        <div className="container mx-auto px-4 mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="card-elevated p-6 text-center"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gold/10 flex items-center justify-center">
                  <benefit.icon className="w-7 h-7 text-gold" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Pricing Card */}
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-md mx-auto"
          >
            <div className={`card-elevated p-8 text-center relative ${subscription.subscribed ? 'border-2 border-gold' : ''}`}>
              {subscription.subscribed && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gold text-gold-foreground text-sm font-bold">
                  Votre abonnement
                </div>
              )}
              
              <Crown className="w-12 h-12 mx-auto mb-4 text-gold" />
              <h3 className="font-display text-2xl font-bold mb-2">Premium</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">19,99€</span>
                <span className="text-muted-foreground">/mois</span>
              </div>

              <ul className="space-y-3 text-left mb-8">
                {[
                  "Tous les pronostics premium",
                  "Analyses détaillées",
                  "Alertes en temps réel",
                  "Support prioritaire",
                  "Sans publicité"
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center">
                      <Check className="w-3 h-3 text-success" />
                    </div>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {subscription.subscribed ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Actif jusqu'au {new Date(subscription.subscriptionEnd || '').toLocaleDateString('fr-FR')}
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleManageSubscription}
                  >
                    Gérer mon abonnement
                  </Button>
                </div>
              ) : (
                <Button 
                  className="w-full btn-gradient text-primary-foreground"
                  onClick={handleSubscribe}
                >
                  <Crown className="w-4 h-4 mr-2" />
                  {user ? "S'abonner maintenant" : "Se connecter pour s'abonner"}
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Premium;
