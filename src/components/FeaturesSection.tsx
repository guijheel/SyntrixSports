import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { BarChart3, Brain, Users } from 'lucide-react';

export function FeaturesSection() {
  const { t } = useTranslation();

  const features = [
    {
      icon: Brain,
      title: t('features.expert.title'),
      description: t('features.expert.description'),
      gradient: 'from-primary to-secondary',
    },
    {
      icon: BarChart3,
      title: t('features.stats.title'),
      description: t('features.stats.description'),
      gradient: 'from-secondary to-primary',
    },
    {
      icon: Users,
      title: t('features.community.title'),
      description: t('features.community.description'),
      gradient: 'from-gold to-warning',
    },
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            {t('features.title')}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ y: -8 }}
              className="card-elevated p-8 text-center group"
            >
              <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
