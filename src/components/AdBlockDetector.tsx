import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldX, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export function AdBlockDetector() {
  const [adBlockDetected, setAdBlockDetected] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [rechecking, setRechecking] = useState(false);
  const { subscription } = useAuth();

  const checkAdBlock = useCallback(async () => {
    try {
      const testAd = document.createElement('div');
      testAd.innerHTML = '&nbsp;';
      testAd.className = 'adsbox ad-banner ad-container pub_300x250 pub_300x250m pub_728x90 text-ad textAd text_ad text_ads text-ads text-ad-links';
      testAd.style.cssText = 'position: absolute; left: -10000px; top: -10000px; width: 1px; height: 1px;';
      document.body.appendChild(testAd);
      await new Promise(resolve => setTimeout(resolve, 100));
      const isBlocked = testAd.offsetHeight === 0 || testAd.offsetParent === null || window.getComputedStyle(testAd).display === 'none' || testAd.clientHeight === 0;
      document.body.removeChild(testAd);
      try {
        await fetch('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js', { method: 'HEAD', mode: 'no-cors' });
      } catch {
        setAdBlockDetected(true);
        return;
      }
      setAdBlockDetected(isBlocked);
      if (!isBlocked) setDismissed(true);
    } catch {
      setAdBlockDetected(true);
    }
  }, []);

  useEffect(() => {
    if (subscription.subscribed) {
      setAdBlockDetected(false);
      return;
    }
    checkAdBlock();
  }, [subscription.subscribed, checkAdBlock]);

  const handleRetry = async () => {
    setRechecking(true);
    await checkAdBlock();
    setRechecking(false);
  };

  if (!adBlockDetected || dismissed || subscription.subscribed) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="card-elevated max-w-lg w-full p-8 relative"
        >

          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-destructive/10 flex items-center justify-center">
              <ShieldX className="w-10 h-10 text-destructive" />
            </div>

            <h2 className="font-display text-2xl font-bold mb-4">
              Bloqueur de publicités détecté
            </h2>

            <p className="text-muted-foreground mb-6">
              Nous avons détecté que vous utilisez un bloqueur de publicités. 
              Les publicités nous permettent de vous offrir du contenu gratuit de qualité.
            </p>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-muted/50 border border-border">
                <p className="text-sm text-muted-foreground mb-3">
                  <strong className="text-foreground">Option 1 :</strong> Désactivez votre bloqueur de publicités 
                  sur notre site pour continuer à accéder au contenu gratuitement.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleRetry}
                  disabled={rechecking}
                >
                  {rechecking ? 'Vérification...' : "J'ai désactivé mon bloqueur"}
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">ou</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gold/5 border border-gold/20">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Crown className="w-5 h-5 text-gold" />
                  <p className="text-sm font-semibold text-gold">
                    Option 2 : Passez Premium
                  </p>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Profitez d'une expérience sans publicité + accès aux pronostics premium.
                </p>
                <Link to="/premium">
                  <Button className="w-full btn-gradient text-primary-foreground">
                    <Crown className="w-4 h-4 mr-2" />
                    Découvrir Premium
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
