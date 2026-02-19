import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import { Layout } from '@/components/Layout';

const Privacy = () => {
  const { t } = useTranslation();

  return (
    <Layout>
      <div className="min-h-screen pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <Shield className="w-10 h-10 text-primary" />
              <h1 className="font-display text-4xl font-bold">{t('pages.privacy.title')}</h1>
            </div>

            <div className="card-elevated p-8 space-y-8">
              <section>
                <h2 className="font-display text-xl font-semibold mb-4">{t('pages.privacy.section1.title')}</h2>
                <p className="text-muted-foreground leading-relaxed">{t('pages.privacy.section1.content')}</p>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold mb-4">{t('pages.privacy.section2.title')}</h2>
                <p className="text-muted-foreground leading-relaxed">{t('pages.privacy.section2.content')}</p>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold mb-4">{t('pages.privacy.section3.title')}</h2>
                <p className="text-muted-foreground leading-relaxed">{t('pages.privacy.section3.content')}</p>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold mb-4">{t('pages.privacy.section4.title')}</h2>
                <p className="text-muted-foreground leading-relaxed">{t('pages.privacy.section4.content')}</p>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold mb-4">{t('pages.privacy.section5.title')}</h2>
                <p className="text-muted-foreground leading-relaxed">{t('pages.privacy.section5.content')}</p>
              </section>

              <div className="text-sm text-muted-foreground pt-4 border-t border-border">
                {t('pages.privacy.lastUpdate')}: 30/01/2026
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Privacy;
