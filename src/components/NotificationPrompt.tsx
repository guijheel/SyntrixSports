import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export function NotificationPrompt() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [visible, setVisible] = useState(() => {
    // Don't show if already responded or if not supported
    if (typeof window !== 'undefined') {
      const responded = localStorage.getItem('notification_prompt_responded');
      if (responded) return false;
      if (!('Notification' in window)) return false;
      if (Notification.permission === 'granted') return false;
    }
    return true;
  });

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      toast({
        title: t('notifications.notSupported'),
        description: t('notifications.notSupportedDesc'),
        variant: 'destructive',
      });
      return;
    }

    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      toast({
        title: t('notifications.enabled'),
        description: t('notifications.enabledDesc'),
      });
      
      // Show a test notification
      new Notification('SyntrixSports', {
        body: t('notifications.enabledDesc'),
        icon: '/favicon.ico',
      });
    } else if (permission === 'denied') {
      toast({
        title: t('notifications.denied'),
        description: t('notifications.deniedDesc'),
        variant: 'destructive',
      });
    }

    localStorage.setItem('notification_prompt_responded', 'true');
    setVisible(false);
  };

  const dismiss = () => {
    localStorage.setItem('notification_prompt_responded', 'true');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50"
        >
          <div className="card-elevated p-4 border border-primary/20">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-1">{t('notifications.enable')}</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  {t('notifications.enabledDesc')}
                </p>
                <div className="flex gap-2">
                  <Button onClick={requestPermission} size="sm" className="btn-gradient text-primary-foreground">
                    {t('notifications.enable')}
                  </Button>
                  <Button onClick={dismiss} size="sm" variant="ghost">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
