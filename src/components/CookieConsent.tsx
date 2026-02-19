import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const CONSENT_KEY = 'cookie_consent_accepted';

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem(CONSENT_KEY);
    if (!accepted) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-[90] p-4 bg-card border-t border-border shadow-lg"
      >
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Cookie className="w-8 h-8 text-primary shrink-0" />
            <div>
              <p className="text-sm font-medium">
                Nous utilisons des cookies pour le bon fonctionnement du site et l'expérience utilisateur.
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                <Link to="/privacy" className="text-primary hover:underline">Politique de confidentialité</Link>
              </p>
            </div>
          </div>
          <Button onClick={accept} className="btn-gradient shrink-0">
            Accepter
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
