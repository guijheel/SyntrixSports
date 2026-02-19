import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Check, Zap, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PricingSection() {
  const { t } = useTranslation();

  const plans = [
    {
      name: t('pricing.basic.name'),
      price: t('pricing.basic.price'),
      period: '',
      icon: Zap,
      features: t('pricing.basic.features', { returnObjects: true }) as string[],
      popular: false,
      buttonText: t('pricing.subscribe'),
      buttonVariant: 'outline' as const,
    },
    {
      name: t('pricing.premium.name'),
      price: t('pricing.premium.price'),
      period: t('pricing.premium.period'),
      icon: Crown,
      features: t('pricing.premium.features', { returnObjects: true }) as string[],
      popular: true,
      buttonText: t('pricing.subscribe'),
      buttonVariant: 'default' as const,
    },
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            {t('pricing.title')}
          </h2>
          <p className="text-muted-foreground text-lg">
            {t('pricing.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className={`relative card-elevated p-8 ${
                plan.popular ? 'border-gold/50 glow-primary' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gold text-gold-foreground text-sm font-semibold">
                  {t('pricing.popular')}
                </div>
              )}

              <div className="flex items-center gap-3 mb-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  plan.popular ? 'bg-gold text-gold-foreground' : 'bg-primary/10 text-primary'
                }`}>
                  <plan.icon className="w-6 h-6" />
                </div>
                <h3 className="font-display text-2xl font-bold">{plan.name}</h3>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-display font-bold">{plan.price}</span>
                {plan.period && (
                  <span className="text-muted-foreground">{plan.period}</span>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-center gap-3">
                    <Check className={`w-5 h-5 ${plan.popular ? 'text-gold' : 'text-primary'}`} />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full ${plan.popular ? 'btn-gold' : ''}`}
                variant={plan.buttonVariant}
                size="lg"
              >
                {plan.buttonText}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
