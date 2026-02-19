import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, User, Share2, Bookmark } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';

const tipsData: Record<string, { title: string; content: string; category: string; readTime: string; author: string }> = {
  'bankroll-management': {
    title: 'Gérer sa Bankroll comme un Pro',
    category: 'Gestion',
    readTime: '8 min',
    author: 'Expert PronoMaster',
    content: `
## Introduction

La gestion de votre bankroll est la compétence la plus importante pour tout parieur sérieux. Sans une stratégie solide de gestion de capital, même les meilleurs pronostics ne vous mèneront nulle part sur le long terme.

## Qu'est-ce que la Bankroll ?

Votre bankroll est le montant total que vous avez décidé de consacrer aux paris sportifs. Ce montant doit être de l'argent que vous pouvez vous permettre de perdre sans affecter votre vie quotidienne.

## Les Règles d'Or

### 1. Ne jamais parier plus de 1-5% de votre bankroll

C'est la règle fondamentale. Si vous avez une bankroll de 1000€, chaque mise devrait être comprise entre 10€ et 50€ maximum.

### 2. Utiliser un système de mise fixe

Plutôt que de varier vos mises en fonction de vos "feelings", adoptez un système de mise fixe. Cela vous protège contre les décisions émotionnelles.

### 3. Tenir un registre détaillé

Notez chaque pari : date, match, type de pari, cote, mise, résultat. Analysez régulièrement vos performances pour identifier vos forces et faiblesses.

## Le Système Kelly

Le critère de Kelly est une formule mathématique qui vous aide à déterminer la taille optimale de vos mises :

**Mise = (Cote × Probabilité estimée - 1) / (Cote - 1)**

Ce système maximise la croissance de votre bankroll tout en minimisant le risque de ruine.

## Conclusion

Une bonne gestion de bankroll vous permettra de survivre aux inévitables périodes de pertes et de maximiser vos gains sur le long terme. C'est ce qui différencie les parieurs amateurs des professionnels.
    `
  },
  'value-bets': {
    title: 'Comprendre les Value Bets',
    category: 'Stratégie',
    readTime: '6 min',
    author: 'Analyste PronoMaster',
    content: `
## Qu'est-ce qu'un Value Bet ?

Un value bet est un pari où la cote proposée par le bookmaker est supérieure à la probabilité réelle de l'événement. C'est l'essence même du pari rentable sur le long terme.

## Comment identifier un Value Bet ?

### Étape 1 : Estimer la probabilité réelle

Utilisez vos analyses, statistiques et connaissances pour estimer la probabilité qu'un événement se produise.

### Étape 2 : Calculer la cote équitable

Cote équitable = 1 / Probabilité estimée

Par exemple, si vous estimez qu'une équipe a 50% de chances de gagner, la cote équitable est 1/0.5 = 2.00

### Étape 3 : Comparer avec la cote du bookmaker

Si le bookmaker propose une cote supérieure à votre cote équitable, vous avez un value bet !

## Exemple pratique

- Match : Liverpool vs Chelsea
- Votre estimation : Liverpool gagne à 60%
- Cote équitable : 1/0.60 = 1.67
- Cote proposée : 1.85

C'est un value bet car 1.85 > 1.67 !

## Points importants

- Les value bets ne garantissent pas de gagner chaque pari
- Sur le long terme, parier uniquement les value bets est la seule stratégie rentable
- La précision de votre estimation est cruciale
    `
  },
  'advanced-stats': {
    title: 'Analyse des Statistiques Avancées',
    category: 'Analyse',
    readTime: '10 min',
    author: 'Data Analyst',
    content: `
## Au-delà des statistiques basiques

Les statistiques traditionnelles (buts marqués, possession) ne racontent qu'une partie de l'histoire. Les statistiques avancées vous donnent un avantage décisif.

## Les métriques clés

### Expected Goals (xG)

Le xG mesure la qualité des occasions de but. Un xG de 2.5 signifie que l'équipe aurait dû marquer 2.5 buts en moyenne avec ces occasions.

### Expected Goals Against (xGA)

Le xGA mesure la qualité des occasions concédées. Un faible xGA indique une défense solide.

### xG Differential

La différence entre xG et xGA. Un différentiel positif indique une équipe performante.

## Comment utiliser ces données

1. Comparez les performances réelles aux performances attendues
2. Identifiez les équipes sur-performantes (qui régresseront) et sous-performantes (qui s'amélioreront)
3. Utilisez ces données pour vos estimations de probabilités

## Sources de données

- FBref
- Understat
- WhoScored

## Conclusion

Les statistiques avancées vous permettent de voir au-delà des résultats bruts et d'identifier des opportunités que d'autres parieurs manquent.
    `
  },
  'beginner-mistakes': {
    title: 'Éviter les Erreurs de Débutant',
    category: 'Conseils',
    readTime: '5 min',
    author: 'Expert PronoMaster',
    content: `
## Les pièges les plus courants

Les parieurs débutants répètent souvent les mêmes erreurs. Les identifier vous évite de perdre de l'argent inutilement.

## Parier sur son équipe de cœur

Les émotions brouillent le jugement. Un pari sur l'équipe que vous supportez est rarement objectif. Évitez ce type de pari ou fixez une mise très limitée.

## Chasser les pertes

Après une mauvaise série, augmenter les mises pour "se refaire" mène à la spirale infernale. Restez discipliné : une mise fixe, quelle que soit la journée.

## Parier sans analyse

Un pronostic doit reposer sur des faits : statistiques, forme, blessures, enjeux. Parier au feeling ou "parce que la cote est belle" n'est pas une stratégie.

## Ignorer la gestion de bankroll

Sans budget dédié et sans règle de mise (1 à 5 % par pari), vous risquez de tout perdre. Définissez votre bankroll et tenez-vous-y.

## Conclusion

En évitant ces erreurs classiques, vous mettez toutes les chances de votre côté pour progresser sur la durée.
    `
  },
  'live-betting': {
    title: 'Le Live Betting Expliqué',
    category: 'Stratégie',
    readTime: '7 min',
    author: 'Analyste PronoMaster',
    content: `
## Qu'est-ce que le live betting ?

Le live betting consiste à parier pendant que le match est en cours. Les cotes évoluent en temps réel selon le score, les événements et le temps restant.

## Avantages du live

Vous avez plus d'informations : état du match, blessures in-game, expulsions, conditions réelles. Les bookmakers ajustent parfois les cotes avec retard, ce qui peut créer des value bets.

## Les bonnes pratiques

Ne pariez pas sous le coup de l'émotion après un but. Attendez quelques minutes pour que les cotes se stabilisent. Concentrez-vous sur les marchés que vous maîtrisez (buts, corners, cartons selon votre expertise).

## Gestion du temps et de l'attention

Le live exige de la concentration. Limitez le nombre de matchs suivis en même temps et fixez un budget dédié au live pour ne pas déraper.

## Conclusion

Le live betting peut être rentable si vous restez discipliné et que vous exploitez les moments où le marché surréagit ou sous-réagit.
    `
  },
  'psychology': {
    title: 'Psychologie du Parieur',
    category: 'Mindset',
    readTime: '9 min',
    author: 'Expert PronoMaster',
    content: `
## L'importance du mental

La psychologie détermine souvent la différence entre un parieur qui gagne sur la durée et un autre qui s'effondre. Les décisions sous stress ou après une perte sont rarement bonnes.

## Éviter le biais de confirmation

Nous avons tendance à ne retenir que les informations qui confirment notre pari. Forcez-vous à envisager le scénario inverse et à lister les arguments contre votre pronostic.

## Gérer la variance

Une série de pertes est normale. Ce n'est pas la faute de votre stratégie à chaque fois. Gardez confiance dans votre processus si celui-ci est solide (value bets, bankroll, analyse).

## Rester détaché du résultat

Concentrez-vous sur la qualité de la décision, pas sur le résultat immédiat. Un bon pari peut perdre ; un mauvais pari peut gagner. Sur le long terme, seules les bonnes décisions paient.

## Conclusion

Un mental d'acier et une prise de décision rationnelle sont des atouts majeurs pour réussir dans les paris sportifs.
    `
  },
  'odds-comparison': {
    title: 'Comparer les Cotes Efficacement',
    category: 'Stratégie',
    readTime: '6 min',
    author: 'Analyste PronoMaster',
    content: `
## Pourquoi comparer ?

Une même sélection peut avoir des cotes différentes selon les bookmakers. Une différence de 0,05 à 0,10 sur chaque pari représente des centaines d'euros de gain en plus sur une saison.

## Outils et habitudes

Utilisez des comparateurs de cotes (sites dédiés ou applications). Vérifiez toujours la cote au moment de miser : elles bougent. Ouvrir des comptes chez plusieurs bookmakers est indispensable pour maximiser vos gains.

## Comptes multi-bookmakers

Ayez au moins 2 ou 3 comptes chez des opérateurs sérieux. Comparez systématiquement avant de valider un pari. Le temps passé à comparer est un investissement rentable.

## Conclusion

Comparer les cotes est l'une des actions les plus rentables : aucun effort tactique, juste de la discipline et un peu d'organisation.
    `
  },
  'asian-handicap': {
    title: 'Maîtriser le Handicap Asiatique',
    category: 'Avancé',
    readTime: '12 min',
    author: 'Data Analyst',
    content: `
## Qu'est-ce que le handicap asiatique ?

Le handicap asiatique supprime le match nul en donnant un avantage (ou un handicap) à une équipe en buts. Exemple : -0,5 pour l'équipe A signifie qu'elle doit gagner pour que le pari soit gagnant ; +0,5 pour l'équipe B signifie qu'elle doit ne pas perdre (nul ou victoire).

## Handicap -0,5 / +0,5

Équivalent à "victoire de A" ou "non défaite de B". Trois issues possibles deviennent deux, ce qui simplifie l'analyse et évite le pari nul.

## Handicap -1 / +1 et autres

Des handicaps comme -1, +1 (ou -1,5 / +1,5) permettent de parier sur un écart de buts. Utile quand une équipe est largement favorite : vous misez sur une victoire nette plutôt que sur une cote 1X2 trop basse.

## Quand l'utiliser ?

Quand la cote 1X2 sur la victoire est trop basse et que vous voulez un meilleur rapport risque/récompense, ou quand vous pensez qu'une équipe va gagner avec au moins un but d'écart.

## Conclusion

Le handicap asiatique est un outil puissant pour affiner vos paris et obtenir des cotes plus intéressantes lorsque vous avez une forte conviction.
    `
  },
  'football-formations': {
    title: 'Analyser les Formations Tactiques',
    category: 'Analyse',
    readTime: '11 min',
    author: 'Analyste PronoMaster',
    content: `
## L'impact des schémas tactiques

Les formations (4-3-3, 3-5-2, 5-3-2, etc.) et le style de jeu influencent les résultats : nombre de buts, possession, corners, cartons. Une équipe qui joue très bas contre un gros attaquant peut générer moins de buts, ou plus de corners selon le type d'attaque.

## Adapter vos marchés

Selon le duel tactique, certains marchés sont plus pertinents : "plus de 2,5 buts" dans un match ouvert, "moins de buts" dans un match bloqué, "corners" quand une équipe joue en contre ou en boucle latérale.

## Confrontations directes

Regardez les derniers face-à-face : mêmes entraîneurs, mêmes systèmes. Certains duels se répètent (matchs fermés, beaucoup de corners, etc.). Utilisez ces tendances en complément des stats de forme.

## Conclusion

Une lecture tactique du match vous donne un avantage sur les parieurs qui ne regardent que les cotes et les noms d'équipes.
    `
  },
  'injury-impact': {
    title: 'Impact des Blessures sur les Paris',
    category: 'Analyse',
    readTime: '7 min',
    author: 'Expert PronoMaster',
    content: `
## Pourquoi les absences comptent

Un titulaire indisponible (surtout un buteur, un meneur ou un défenseur clé) peut changer le niveau d'une équipe. Les bookmakers intègrent ces infos, mais parfois avec retard ou en sous-estimant l'impact.

## Hiérarchiser les absences

Un attaquant star absent pèse plus qu'un remplaçant. Un milieu récupérateur manquant peut déstabiliser toute la défense. Identifiez les joueurs "irremplaçables" dans l'effectif.

## Où trouver l'info ?

Sites officiels des clubs, comptes Twitter des journalistes locaux, communiqués de la FFF/UEFA. Croisez les sources pour éviter les rumeurs.

## Ajuster vos pronostics

Une équipe affaiblie peut justifier un pari sur l'adversaire ou sur "moins de buts" si le bloc offensif est touché. À l'inverse, une défense amoindrie peut encourager "plus de 2,5 buts".

## Conclusion

Prendre en compte les blessures et les suspensions vous place devant ceux qui parient sans cette dimension.
    `
  },
  'weather-betting': {
    title: 'Météo et Paris Sportifs',
    category: 'Conseils',
    readTime: '5 min',
    author: 'Expert PronoMaster',
    content: `
## Influence de la météo

Pluie, vent, chaleur ou froid modifient le jeu : qualité des passes, nombre de centres, fatigue, nombre de buts. Un match sous la pluie sur un terrain lourd favorise souvent un jeu plus court et parfois moins de buts ; le vent peut influencer les corners et les coups de pied arrêtés.

## Quels marchés cibler ?

Buts : selon les conditions, anticipez un match plus ou moins ouvert. Corners : le vent ou un terrain glissant peut augmenter les corners (défenses en difficulté). Cartons : un terrain difficile peut générer plus de tacles et de frustrations.

## Vérifier les prévisions

Consultez la météo du lieu du match la veille et le jour J. Les bookmakers ne valorisent pas toujours correctement des conditions extrêmes.

## Conclusion

Intégrer la météo dans votre analyse vous donne un angle supplémentaire pour trouver de la valeur, surtout dans les championnats où le temps est variable.
    `
  },
  'discipline-patience': {
    title: 'Discipline et Patience : Les Clés du Succès',
    category: 'Mindset',
    readTime: '8 min',
    author: 'Expert PronoMaster',
    content: `
## La régularité prime

Les parieurs qui réussissent sur le long terme ne font pas de coups d'éclat : ils appliquent une stratégie claire, une gestion de bankroll stricte et ne dévient pas après une mauvaise journée.

## Fixer des règles et les respecter

Définissez à l'avance : budget par pari, types de marchés autorisés, nombre de paris par jour ou par semaine. Une fois les règles fixées, ne les brisez pas sous le coup de l'émotion.

## Accepter les périodes creuses

La variance fait que vous aurez des séries de pertes. Ce n'est pas le moment de tout changer : gardez le cap, analysez froidement si vos paris étaient cohérents avec votre stratégie.

## Patience et sélection

Moins de paris, mais mieux choisis, valent mieux qu'une multitude de mises "pour le fun". La patience consiste à n'attaquer que les opportunités qui correspondent à vos critères.

## Conclusion

Discipline et patience transforment le pari sportif en projet à long terme plutôt qu'en loterie. Ce sont les vraies clés du succès.
    `
  }
};

const TipDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  
  const tip = slug ? tipsData[slug] : null;

  if (!tip) {
    return (
      <Layout>
        <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-display text-2xl font-bold mb-4">{t('pages.tipDetail.notFound')}</h1>
            <Link to="/tips">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('pages.tipDetail.backToTips')}
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Back Button */}
            <Link to="/tips" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8">
              <ArrowLeft className="w-4 h-4" />
              {t('pages.tipDetail.backToTips')}
            </Link>

            {/* Header */}
            <div className="mb-8">
              <span className="px-3 py-1 text-sm rounded-full bg-primary/10 text-primary font-medium">
                {tip.category}
              </span>
              <h1 className="font-display text-3xl md:text-4xl font-bold mt-4 mb-6">
                {tip.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {tip.author}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {tip.readTime}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-8">
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                {t('pages.tipDetail.share')}
              </Button>
              <Button variant="outline" size="sm">
                <Bookmark className="w-4 h-4 mr-2" />
                {t('pages.tipDetail.save')}
              </Button>
            </div>

            {/* Content */}
            <article className="card-elevated p-8">
              <div className="prose prose-invert max-w-none">
                {tip.content.split('\n').map((line, i) => {
                  if (line.startsWith('## ')) {
                    return <h2 key={i} className="font-display text-2xl font-bold mt-8 mb-4 text-foreground">{line.replace('## ', '')}</h2>;
                  }
                  if (line.startsWith('### ')) {
                    return <h3 key={i} className="font-display text-xl font-semibold mt-6 mb-3 text-foreground">{line.replace('### ', '')}</h3>;
                  }
                  if (line.startsWith('**') && line.endsWith('**')) {
                    return <p key={i} className="font-semibold text-foreground my-2">{line.replace(/\*\*/g, '')}</p>;
                  }
                  if (line.startsWith('- ')) {
                    return <li key={i} className="text-muted-foreground ml-4">{line.replace('- ', '')}</li>;
                  }
                  if (line.trim()) {
                    return <p key={i} className="text-muted-foreground leading-relaxed my-4">{line}</p>;
                  }
                  return null;
                })}
              </div>
            </article>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default TipDetail;
