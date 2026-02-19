import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Send, MapPin, Clock } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate sending
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: t('pages.contact.successTitle'),
      description: t('pages.contact.successMessage'),
    });
    
    setFormData({ name: '', email: '', subject: '', message: '' });
    setLoading(false);
  };

  return (
    <Layout>
      <div className="min-h-screen pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <MessageSquare className="w-10 h-10 text-primary" />
              <h1 className="font-display text-4xl font-bold">{t('pages.contact.title')}</h1>
            </div>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t('pages.contact.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              <div className="card-elevated p-6">
                <Mail className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-display font-semibold mb-2">{t('pages.contact.email')}</h3>
                <p className="text-muted-foreground">support@pronomaster.com</p>
              </div>

              <div className="card-elevated p-6">
                <Clock className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-display font-semibold mb-2">{t('pages.contact.hours')}</h3>
                <p className="text-muted-foreground">{t('pages.contact.hoursValue')}</p>
              </div>

              <div className="card-elevated p-6">
                <MapPin className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-display font-semibold mb-2">{t('pages.contact.location')}</h3>
                <p className="text-muted-foreground">Paris, France</p>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2"
            >
              <form onSubmit={handleSubmit} className="card-elevated p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">{t('pages.contact.name')}</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                      placeholder={t('pages.contact.namePlaceholder')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{t('pages.contact.emailField')}</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                      placeholder={t('pages.contact.emailPlaceholder')}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">{t('pages.contact.subject')}</label>
                  <Input
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    required
                    placeholder={t('pages.contact.subjectPlaceholder')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">{t('pages.contact.message')}</label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    required
                    rows={6}
                    placeholder={t('pages.contact.messagePlaceholder')}
                  />
                </div>

                <Button type="submit" className="btn-gradient text-primary-foreground w-full" disabled={loading}>
                  {loading ? (
                    <span className="animate-spin mr-2">⏳</span>
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  {t('pages.contact.send')}
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
