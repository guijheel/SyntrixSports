import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { AlertTriangle, Shield, Scale, Info } from 'lucide-react';
import { Layout } from '@/components/Layout';

const Disclaimer = () => {
  const { t } = useTranslation();

  return (
    <Layout>
      <div className="min-h-screen pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-destructive/10 mb-6">
                <AlertTriangle className="w-10 h-10 text-destructive" />
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
                Avertissement Légal
              </h1>
              <p className="text-xl text-muted-foreground">
                Informations importantes concernant les paris sportifs
              </p>
            </div>

            {/* Main Content */}
            <div className="space-y-8">
              {/* ROI Warning */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card-elevated p-8 border-l-4 border-destructive"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-6 h-6 text-destructive" />
                  </div>
                  <div>
                    <h2 className="font-display text-2xl font-bold mb-4 text-destructive">
                      Le ROI n'est pas garanti
                    </h2>
                    <p className="text-muted-foreground mb-4">
                      Les performances passées ne garantissent en aucun cas les résultats futurs. 
                      Les statistiques et taux de réussite affichés sur notre plateforme sont 
                      basés sur des données historiques et ne constituent pas une promesse de gains.
                    </p>
                    <p className="text-muted-foreground">
                      <strong className="text-foreground">Investissez uniquement des sommes que vous pouvez vous permettre de perdre.</strong> 
                      Les paris sportifs comportent un risque financier réel et peuvent entraîner 
                      des pertes importantes.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Risk Warning */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card-elevated p-8"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-gold" />
                  </div>
                  <div>
                    <h2 className="font-display text-2xl font-bold mb-4">
                      Risques des Paris Sportifs
                    </h2>
                    <ul className="space-y-3 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-destructive mt-1">•</span>
                        <span>Les paris sportifs peuvent créer une dépendance. Jouez de manière responsable.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-destructive mt-1">•</span>
                        <span>Ne pariez jamais plus que ce que vous pouvez vous permettre de perdre.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-destructive mt-1">•</span>
                        <span>Les résultats sportifs sont par nature imprévisibles et aucune méthode n'est infaillible.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-destructive mt-1">•</span>
                        <span>Si vous pensez avoir un problème avec le jeu, contactez une association d'aide.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>

              {/* Legal Notice */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="card-elevated p-8"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Scale className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-display text-2xl font-bold mb-4">
                      Cadre Légal
                    </h2>
                    <p className="text-muted-foreground mb-4">
                      SyntrixSports est un site d'information et de conseil sur les paris sportifs. 
                      Nous ne sommes pas un opérateur de paris et ne collectons pas d'argent pour des paris.
                    </p>
                    <p className="text-muted-foreground mb-4">
                      Les paris sportifs sont interdits aux mineurs de moins de 18 ans. 
                      En utilisant nos services, vous confirmez avoir l'âge légal pour parier 
                      dans votre pays de résidence.
                    </p>
                    <p className="text-muted-foreground">
                      SyntrixSports décline toute responsabilité quant aux pertes financières 
                      résultant de l'utilisation des informations fournies sur ce site.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Help Resources */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="card-elevated p-8 bg-muted/30"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                    <Info className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h2 className="font-display text-2xl font-bold mb-4">
                      Besoin d'aide ?
                    </h2>
                    <p className="text-muted-foreground mb-4">
                      Si vous ou un proche avez des difficultés avec le jeu, des ressources sont disponibles :
                    </p>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>
                        <strong className="text-foreground">France :</strong> Joueurs Info Service - 09 74 75 13 13 (appel non surtaxé)
                      </li>
                      <li>
                        <strong className="text-foreground">Belgique :</strong> Aide aux Joueurs - 0800 35 777
                      </li>
                      <li>
                        <strong className="text-foreground">Suisse :</strong> Addiction Suisse - 0800 104 104
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Disclaimer;
