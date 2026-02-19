import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  fr: {
    translation: {
      nav: {
        home: "Accueil",
        dailyPicks: "Pronostics du jour",
        premium: "Premium",
        stats: "Statistiques",
        games: "Jeux",
        tips: "Conseils",
        login: "Connexion",
        signup: "S'inscrire",
        logout: "Déconnexion",
        profile: "Mon Profil",
        admin: "Dashboard"
      },
      hero: {
        title: "Pronostics Sportifs",
        subtitle: "d'Excellence",
        description: "Rejoignez des milliers de parieurs qui font confiance à nos analyses expertes pour maximiser leurs gains.",
        cta: "Commencer maintenant",
        stats: {
          successRate: "Taux de réussite",
          monthlyPicks: "Pronostics/mois",
          members: "Membres actifs"
        }
      },
      features: {
        title: "Pourquoi nous choisir",
        expert: {
          title: "Analyses Expertes",
          description: "Notre équipe d'analystes professionnels étudie chaque match en profondeur."
        },
        stats: {
          title: "Statistiques Avancées",
          description: "Accédez à des données détaillées pour prendre des décisions éclairées."
        },
        community: {
          title: "Communauté Active",
          description: "Partagez et échangez avec des milliers de passionnés."
        }
      },
      matches: {
        title: "Matchs du jour",
        viewAll: "Voir tous les pronostics",
        premium: "Premium",
        free: "Gratuit"
      },
      pricing: {
        title: "Nos Offres",
        subtitle: "Choisissez le plan qui vous convient",
        monthly: "Mensuel",
        yearly: "Annuel",
        popular: "Populaire",
        subscribe: "S'inscrire",
        basic: {
          name: "Basic",
          price: "Gratuit",
          features: ["Pronostics basiques", "Statistiques limitées", "Accès communauté"]
        },
        premium: {
          name: "Premium",
          price: "19€",
          period: "/mois",
          features: ["Tous les pronostics", "Statistiques complètes", "Support prioritaire", "Alertes en temps réel", "ROI garanti"]
        }
      },
      footer: {
        description: "La plateforme de pronostics sportifs de référence pour les parieurs exigeants.",
        links: "Liens utiles",
        legal: "Mentions légales",
        terms: "CGU",
        privacy: "Confidentialité",
        contact: "Contact",
        disclaimer: "Les paris comportent des risques. Jouez responsablement. 18+ uniquement.",
        disclaimer_link: "Avertissement",
        referral: "Parrainage"
      },
      auth: {
        loginRequired: "Connectez-vous pour accéder à cette section",
        premiumRequired: "Abonnement Premium requis"
      },
      games: {
        subtitle: "Participez à nos jeux et gagnez des récompenses !",
        players: "joueurs",
        play: "Jouer maintenant",
        leaderboard: "Classement",
        viewFullLeaderboard: "Voir tout le classement",
        quiz: {
          backToGames: "Retour aux jeux",
          gameOver: "Partie terminée !",
          yourScore: "Votre score",
          playAgain: "Rejouer",
          next: "Question suivante",
          seeResults: "Voir les résultats"
        },
        scorePrediction: {
          title: "Prédiction de Score",
          subtitle: "Devinez le score exact des matchs",
          backToGames: "Retour aux jeux",
          submitted: "Prédictions enregistrées !",
          checkBack: "Revenez après les matchs pour voir vos résultats.",
          modify: "Modifier",
          submit: "Valider mes prédictions"
        },
        accumulator: {
          title: "Accumulator Challenge",
          subtitle: "Construisez le meilleur combiné (3-5 sélections)",
          backToGames: "Retour aux jeux",
          selected: "Sélectionné:",
          totalOdds: "Cote totale",
          submitted: "Combiné enregistré !",
          yourAccumulator: "Votre combiné:",
          newAccumulator: "Nouveau combiné",
          selectMinimum: "Sélectionnez au moins 3 paris",
          submitAccumulator: "Valider mon combiné"
        }
      },
      tips: {
        subtitle: "Améliorez vos compétences en paris sportifs avec nos guides et conseils d'experts.",
        featured: "Article Vedette",
        readArticle: "Lire l'article",
        readMore: "Lire plus"
      },
      stats: {
        subtitle: "Consultez nos performances et notre historique de pronostics.",
        bilanGlobal: "Bilan global",
        won: "Gagnés",
        lost: "Perdus",
        pending: "En cours",
        winRateGlobal: "Taux de réussite global",
        last20Predictions: "20 derniers pronostics",
        match: "Match",
        predictionsOfMonth: "Pronostics du mois",
        sortByDate: "Date",
        sortByLeague: "Ligue",
        sortBySport: "Sport",
        sport: "Sport",
        viewGlobal: "Vue globale",
        viewMonthly: "Par mois",
        viewLeagues: "Par ligue",
        noDataMonthly: "Aucune donnée mensuelle disponible.",
        performanceByLeague: "Performance par Ligue",
        all: "Toutes",
        noData: "Aucune donnée disponible.",
        winRate: "Taux de réussite",
        totalPredictions: "Total pronostics",
        roi: "ROI moyen",
        victories: "Victoires"
      },
      pages: {
        terms: {
          title: "Conditions Générales d'Utilisation",
          section1: {
            title: "1. Objet",
            content: "Les présentes conditions générales d'utilisation (CGU) régissent l'accès et l'utilisation de la plateforme SyntrixSports. En accédant à ce site, vous acceptez sans réserve les présentes CGU."
          },
          section2: {
            title: "2. Services proposés",
            content: "SyntrixSports propose des pronostics et analyses sportives à titre informatif. Ces informations ne constituent en aucun cas des conseils en investissement ou des incitations aux paris."
          },
          section3: {
            title: "3. Inscription et compte utilisateur",
            content: "L'accès à certains services nécessite la création d'un compte. Vous vous engagez à fournir des informations exactes et à maintenir la confidentialité de vos identifiants de connexion."
          },
          section4: {
            title: "4. Abonnement Premium",
            content: "L'abonnement Premium est facturé mensuellement et peut être résilié à tout moment. La résiliation prend effet à la fin de la période de facturation en cours."
          },
          section5: {
            title: "5. Propriété intellectuelle",
            content: "Tous les contenus présents sur SyntrixSports sont protégés par le droit de la propriété intellectuelle. Toute reproduction sans autorisation est interdite."
          },
          section6: {
            title: "6. Limitation de responsabilité",
            content: "SyntrixSports ne saurait être tenu responsable des pertes financières résultant de l'utilisation de ses pronostics. Les paris sportifs comportent des risques de perte."
          },
          lastUpdate: "Dernière mise à jour"
        },
        privacy: {
          title: "Politique de Confidentialité",
          section1: {
            title: "1. Collecte des données",
            content: "Nous collectons uniquement les données nécessaires au fonctionnement de nos services : adresse email, informations de paiement pour les abonnés Premium, et données de navigation."
          },
          section2: {
            title: "2. Utilisation des données",
            content: "Vos données sont utilisées pour : gérer votre compte, traiter vos paiements, personnaliser votre expérience, et vous envoyer des communications si vous y avez consenti."
          },
          section3: {
            title: "3. Protection des données",
            content: "Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles pour protéger vos données contre tout accès non autorisé, modification ou destruction."
          },
          section4: {
            title: "4. Partage des données",
            content: "Nous ne vendons pas vos données personnelles. Elles peuvent être partagées avec nos prestataires de paiement (Stripe) dans le cadre du traitement des transactions."
          },
          section5: {
            title: "5. Vos droits",
            content: "Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données. Contactez-nous pour exercer ces droits."
          },
          lastUpdate: "Dernière mise à jour"
        },
        contact: {
          title: "Contactez-nous",
          subtitle: "Une question, une suggestion ou besoin d'aide ? Notre équipe est là pour vous.",
          email: "Email",
          hours: "Horaires",
          hoursValue: "Lun-Ven: 9h-18h",
          location: "Localisation",
          name: "Nom",
          namePlaceholder: "Votre nom",
          emailField: "Email",
          emailPlaceholder: "votre@email.com",
          subject: "Sujet",
          subjectPlaceholder: "Comment pouvons-nous vous aider ?",
          message: "Message",
          messagePlaceholder: "Décrivez votre demande en détail...",
          send: "Envoyer le message",
          successTitle: "Message envoyé !",
          successMessage: "Nous vous répondrons dans les plus brefs délais."
        },
        tipDetail: {
          notFound: "Article non trouvé",
          backToTips: "Retour aux conseils",
          share: "Partager",
          save: "Sauvegarder"
        }
      },
      notifications: {
        enable: "Activer les notifications",
        enabled: "Notifications activées !",
        enabledDesc: "Vous recevrez des alertes pour les nouveaux pronostics.",
        denied: "Notifications bloquées",
        deniedDesc: "Activez les notifications dans les paramètres de votre navigateur.",
        notSupported: "Non supporté",
        notSupportedDesc: "Votre navigateur ne supporte pas les notifications push."
      },
      profile: {
        title: "Mon Profil",
        subtitle: "Gérez vos informations personnelles et vos paramètres",
        displayName: "Nom d'affichage",
        displayNamePlaceholder: "Entrez votre nom",
        email: "Email",
        save: "Sauvegarder",
        saving: "Sauvegarde...",
        saved: "Profil mis à jour",
        savedDesc: "Vos modifications ont été enregistrées.",
        error: "Erreur",
        errorDesc: "Une erreur est survenue lors de la sauvegarde.",
        avatarUpdated: "Photo mise à jour",
        avatarUpdatedDesc: "Votre photo de profil a été mise à jour.",
        subscription: "Abonnement",
        premiumActive: "Abonnement Premium actif",
        freePlan: "Plan gratuit",
        premium: "Premium",
        expiresOn: "Expire le",
        manageSubscription: "Gérer",
        upgradeToPremium: "Passer Premium",
        gameStats: "Statistiques de jeux",
        quizPlayed: "Quiz joués",
        correctAnswers: "Réponses correctes",
        predictions: "Prédictions",
        totalPoints: "Points totaux",
        referral: "Parrainage",
        referralDesc: "Partagez votre code et gagnez 7 jours Premium gratuits pour chaque ami inscrit !",
        codeCopied: "Code copié !",
        codeCopiedDesc: "Partagez ce code avec vos amis.",
        referralsCompleted: "Parrainages réussis",
        rewardsEarned: "Récompenses gagnées",
        days: "jours"
      },
      referral: {
        title: "Programme de Parrainage",
        subtitle: "Invitez vos amis et gagnez des récompenses exclusives !",
        yourCode: "Votre code de parrainage",
        linkCopied: "Lien copié !",
        linkCopiedDesc: "Partagez ce lien avec vos amis.",
        totalInvited: "Invités",
        completed: "Inscrits",
        daysEarned: "Jours gagnés",
        haveCode: "Vous avez un code de parrainage ?",
        enterCodeDesc: "Entrez le code d'un ami pour bénéficier d'avantages exclusifs lors de votre inscription.",
        apply: "Appliquer",
        enterCode: "Entrez un code de parrainage",
        codeStored: "Code enregistré !",
        codeStoredDesc: "Le code sera appliqué lors de votre inscription.",
        howItWorks: "Comment ça marche ?",
        reward1Title: "7 jours Premium gratuits",
        reward1Desc: "Pour chaque ami qui s'inscrit avec votre code.",
        reward2Title: "Bonus de bienvenue",
        reward2Desc: "Votre ami reçoit aussi 3 jours Premium offerts.",
        reward3Title: "Parrainages illimités",
        reward3Desc: "Plus vous parrainez, plus vous gagnez !",
        joinNow: "Rejoignez-nous maintenant"
      },
      admin: {
        title: "Dashboard Admin",
        subtitle: "Gérez les pronostics, conseils et utilisateurs de la plateforme.",
        accessDenied: "Accès refusé",
        accessDeniedDesc: "Vous n'avez pas les permissions nécessaires.",
        totalUsers: "Utilisateurs",
        totalPredictions: "Pronostics",
        totalTips: "Conseils",
        premiumUsers: "Premium",
        predictions: "Pronostics",
        tips: "Conseils",
        users: "Utilisateurs",
        gameStats: "Stats Jeux",
        managePredictions: "Gestion des pronostics",
        addPrediction: "Ajouter un pronostic",
        editPrediction: "Modifier le pronostic",
        matchTitle: "Match",
        league: "Ligue",
        matchDate: "Date du match",
        prediction: "Pronostic",
        odds: "Cote",
        confidence: "Confiance",
        result: "Résultat",
        pending: "En attente",
        won: "Gagné",
        lost: "Perdu",
        premiumOnly: "Premium uniquement",
        match: "Match",
        status: "Statut",
        actions: "Actions",
        cancel: "Annuler",
        update: "Mettre à jour",
        create: "Créer",
        confirmDelete: "Êtes-vous sûr de vouloir supprimer cet élément ?",
        predictionCreated: "Pronostic créé avec succès",
        predictionUpdated: "Pronostic mis à jour",
        predictionDeleted: "Pronostic supprimé",
        error: "Une erreur est survenue",
        noPredictions: "Aucun pronostic pour le moment",
        manageTips: "Gestion des conseils",
        addTip: "Ajouter un conseil",
        editTip: "Modifier le conseil",
        tipTitle: "Titre",
        category: "Catégorie",
        readTime: "Temps de lecture",
        excerpt: "Résumé",
        content: "Contenu",
        featuredArticle: "Article vedette",
        tipCreated: "Conseil créé avec succès",
        tipUpdated: "Conseil mis à jour",
        tipDeleted: "Conseil supprimé",
        noTips: "Aucun conseil pour le moment",
        manageUsers: "Gestion des utilisateurs",
        user: "Utilisateur",
        email: "Email",
        role: "Rôle",
        joined: "Inscrit le",
        roleUpdated: "Rôle mis à jour",
        noUsers: "Aucun utilisateur",
        globalGameStats: "Statistiques globales des jeux",
        totalQuizGames: "Parties de quiz",
        totalCorrectAnswers: "Réponses correctes",
        totalScorePredictions: "Prédictions de score",
        totalAccumulators: "Combinés créés",
        topPlayers: "Meilleurs joueurs",
        rank: "Rang",
        player: "Joueur",
        points: "Points",
        correctAnswers: "Réponses",
        noPlayers: "Aucun joueur pour le moment",
        subscriptions: "Abonnements",
        subscriptionsDesc: "Gérer les abonnements Premium (DB).",
        refresh: "Actualiser",
        subscriptionSetPremium: "Utilisateur passé Premium",
        subscriptionSetFree: "Premium retiré"
      }
    }
  },
  en: {
    translation: {
      nav: {
        home: "Home",
        dailyPicks: "Daily Picks",
        premium: "Premium",
        stats: "Statistics",
        games: "Games",
        tips: "Tips",
        login: "Login",
        signup: "Sign Up",
        logout: "Logout",
        profile: "My Profile",
        admin: "Dashboard"
      },
      hero: {
        title: "Expert Sports",
        subtitle: "Predictions",
        description: "Join thousands of bettors who trust our expert analysis to maximize their winnings.",
        cta: "Get Started",
        stats: {
          successRate: "Success Rate",
          monthlyPicks: "Picks/month",
          members: "Active Members"
        }
      },
      features: {
        title: "Why Choose Us",
        expert: {
          title: "Expert Analysis",
          description: "Our team of professional analysts studies each match in depth."
        },
        stats: {
          title: "Advanced Statistics",
          description: "Access detailed data to make informed decisions."
        },
        community: {
          title: "Active Community",
          description: "Share and exchange with thousands of enthusiasts."
        }
      },
      matches: {
        title: "Today's Matches",
        viewAll: "View all predictions",
        premium: "Premium",
        free: "Free"
      },
      pricing: {
        title: "Our Plans",
        subtitle: "Choose the plan that suits you",
        monthly: "Monthly",
        yearly: "Yearly",
        popular: "Popular",
        subscribe: "Subscribe",
        basic: {
          name: "Basic",
          price: "Free",
          features: ["Basic predictions", "Limited stats", "Community access"]
        },
        premium: {
          name: "Premium",
          price: "€19",
          period: "/month",
          features: ["All predictions", "Full statistics", "Priority support", "Real-time alerts", "Guaranteed ROI"]
        }
      },
      footer: {
        description: "The reference sports betting platform for demanding bettors.",
        links: "Useful Links",
        legal: "Legal",
        terms: "Terms",
        privacy: "Privacy",
        contact: "Contact",
        disclaimer: "Betting involves risks. Play responsibly. 18+ only.",
        disclaimer_link: "Disclaimer",
        referral: "Referral"
      },
      auth: {
        loginRequired: "Login to access this section",
        premiumRequired: "Premium subscription required"
      },
      games: {
        subtitle: "Participate in our games and win rewards!",
        players: "players",
        play: "Play now",
        leaderboard: "Leaderboard",
        viewFullLeaderboard: "View full leaderboard",
        quiz: {
          backToGames: "Back to games",
          gameOver: "Game Over!",
          yourScore: "Your score",
          playAgain: "Play again",
          next: "Next question",
          seeResults: "See results"
        },
        scorePrediction: {
          title: "Score Prediction",
          subtitle: "Guess the exact score of matches",
          backToGames: "Back to games",
          submitted: "Predictions saved!",
          checkBack: "Come back after the matches to see your results.",
          modify: "Modify",
          submit: "Submit my predictions"
        },
        accumulator: {
          title: "Accumulator Challenge",
          subtitle: "Build the best accumulator (3-5 selections)",
          backToGames: "Back to games",
          selected: "Selected:",
          totalOdds: "Total odds",
          submitted: "Accumulator saved!",
          yourAccumulator: "Your accumulator:",
          newAccumulator: "New accumulator",
          selectMinimum: "Select at least 3 bets",
          submitAccumulator: "Submit my accumulator"
        }
      },
      tips: {
        subtitle: "Improve your sports betting skills with our expert guides and tips.",
        featured: "Featured Article",
        readArticle: "Read article",
        readMore: "Read more"
      },
      stats: {
        subtitle: "View our performance and prediction history.",
        bilanGlobal: "Overall summary",
        won: "Won",
        lost: "Lost",
        pending: "Pending",
        winRateGlobal: "Overall win rate",
        last20Predictions: "Last 20 predictions",
        match: "Match",
        predictionsOfMonth: "Predictions for this month",
        sortByDate: "Date",
        sortByLeague: "League",
        sortBySport: "Sport",
        sport: "Sport",
        viewGlobal: "Overall",
        viewMonthly: "By month",
        viewLeagues: "By league",
        noDataMonthly: "No monthly data available.",
        performanceByLeague: "Performance by League",
        all: "All",
        noData: "No data available.",
        winRate: "Win rate",
        totalPredictions: "Total predictions",
        roi: "Average ROI",
        victories: "Wins"
      },
      pages: {
        terms: {
          title: "Terms of Service",
          section1: {
            title: "1. Purpose",
            content: "These terms of service govern access to and use of the SyntrixSports platform. By accessing this site, you unreservedly accept these terms."
          },
          section2: {
            title: "2. Services offered",
            content: "SyntrixSports provides sports predictions and analysis for informational purposes. This information does not constitute investment advice or betting incentives."
          },
          section3: {
            title: "3. Registration and user account",
            content: "Access to certain services requires creating an account. You agree to provide accurate information and maintain the confidentiality of your login credentials."
          },
          section4: {
            title: "4. Premium Subscription",
            content: "The Premium subscription is billed monthly and can be cancelled at any time. Cancellation takes effect at the end of the current billing period."
          },
          section5: {
            title: "5. Intellectual property",
            content: "All content on SyntrixSports is protected by intellectual property law. Any reproduction without authorization is prohibited."
          },
          section6: {
            title: "6. Limitation of liability",
            content: "SyntrixSports cannot be held responsible for financial losses resulting from the use of its predictions. Sports betting involves risks of loss."
          },
          lastUpdate: "Last updated"
        },
        privacy: {
          title: "Privacy Policy",
          section1: {
            title: "1. Data collection",
            content: "We only collect data necessary for our services: email address, payment information for Premium subscribers, and browsing data."
          },
          section2: {
            title: "2. Data usage",
            content: "Your data is used to: manage your account, process payments, personalize your experience, and send communications if you have consented."
          },
          section3: {
            title: "3. Data protection",
            content: "We implement technical and organizational security measures to protect your data against unauthorized access, modification or destruction."
          },
          section4: {
            title: "4. Data sharing",
            content: "We do not sell your personal data. It may be shared with our payment providers (Stripe) for transaction processing."
          },
          section5: {
            title: "5. Your rights",
            content: "Under GDPR, you have the right to access, rectify, delete and port your data. Contact us to exercise these rights."
          },
          lastUpdate: "Last updated"
        },
        contact: {
          title: "Contact Us",
          subtitle: "Have a question, suggestion or need help? Our team is here for you.",
          email: "Email",
          hours: "Hours",
          hoursValue: "Mon-Fri: 9am-6pm",
          location: "Location",
          name: "Name",
          namePlaceholder: "Your name",
          emailField: "Email",
          emailPlaceholder: "your@email.com",
          subject: "Subject",
          subjectPlaceholder: "How can we help you?",
          message: "Message",
          messagePlaceholder: "Describe your request in detail...",
          send: "Send message",
          successTitle: "Message sent!",
          successMessage: "We will get back to you as soon as possible."
        },
        tipDetail: {
          notFound: "Article not found",
          backToTips: "Back to tips",
          share: "Share",
          save: "Save"
        }
      },
      notifications: {
        enable: "Enable notifications",
        enabled: "Notifications enabled!",
        enabledDesc: "You will receive alerts for new predictions.",
        denied: "Notifications blocked",
        deniedDesc: "Enable notifications in your browser settings.",
        notSupported: "Not supported",
        notSupportedDesc: "Your browser does not support push notifications."
      },
      profile: {
        title: "My Profile",
        subtitle: "Manage your personal information and settings",
        displayName: "Display Name",
        displayNamePlaceholder: "Enter your name",
        email: "Email",
        save: "Save",
        saving: "Saving...",
        saved: "Profile updated",
        savedDesc: "Your changes have been saved.",
        error: "Error",
        errorDesc: "An error occurred while saving.",
        avatarUpdated: "Photo updated",
        avatarUpdatedDesc: "Your profile photo has been updated.",
        subscription: "Subscription",
        premiumActive: "Premium subscription active",
        freePlan: "Free plan",
        premium: "Premium",
        expiresOn: "Expires on",
        manageSubscription: "Manage",
        upgradeToPremium: "Upgrade to Premium",
        gameStats: "Game Statistics",
        quizPlayed: "Quizzes played",
        correctAnswers: "Correct answers",
        predictions: "Predictions",
        totalPoints: "Total points",
        referral: "Referral",
        referralDesc: "Share your code and earn 7 free Premium days for each friend who signs up!",
        codeCopied: "Code copied!",
        codeCopiedDesc: "Share this code with your friends.",
        referralsCompleted: "Successful referrals",
        rewardsEarned: "Rewards earned",
        days: "days"
      },
      referral: {
        title: "Referral Program",
        subtitle: "Invite your friends and earn exclusive rewards!",
        yourCode: "Your referral code",
        linkCopied: "Link copied!",
        linkCopiedDesc: "Share this link with your friends.",
        totalInvited: "Invited",
        completed: "Signed up",
        daysEarned: "Days earned",
        haveCode: "Have a referral code?",
        enterCodeDesc: "Enter a friend's code to get exclusive benefits when you sign up.",
        apply: "Apply",
        enterCode: "Enter a referral code",
        codeStored: "Code saved!",
        codeStoredDesc: "The code will be applied when you sign up.",
        howItWorks: "How does it work?",
        reward1Title: "7 free Premium days",
        reward1Desc: "For each friend who signs up with your code.",
        reward2Title: "Welcome bonus",
        reward2Desc: "Your friend also gets 3 free Premium days.",
        reward3Title: "Unlimited referrals",
        reward3Desc: "The more you refer, the more you earn!",
        joinNow: "Join us now"
      },
      admin: {
        title: "Admin Dashboard",
        subtitle: "Manage predictions, tips and platform users.",
        accessDenied: "Access denied",
        accessDeniedDesc: "You don't have the required permissions.",
        totalUsers: "Users",
        totalPredictions: "Predictions",
        totalTips: "Tips",
        premiumUsers: "Premium",
        predictions: "Predictions",
        tips: "Tips",
        users: "Users",
        gameStats: "Game Stats",
        managePredictions: "Manage predictions",
        addPrediction: "Add prediction",
        editPrediction: "Edit prediction",
        matchTitle: "Match",
        league: "League",
        matchDate: "Match date",
        prediction: "Prediction",
        odds: "Odds",
        confidence: "Confidence",
        result: "Result",
        pending: "Pending",
        won: "Won",
        lost: "Lost",
        premiumOnly: "Premium only",
        match: "Match",
        status: "Status",
        actions: "Actions",
        cancel: "Cancel",
        update: "Update",
        create: "Create",
        confirmDelete: "Are you sure you want to delete this item?",
        predictionCreated: "Prediction created successfully",
        predictionUpdated: "Prediction updated",
        predictionDeleted: "Prediction deleted",
        error: "An error occurred",
        noPredictions: "No predictions yet",
        manageTips: "Manage tips",
        addTip: "Add tip",
        editTip: "Edit tip",
        tipTitle: "Title",
        category: "Category",
        readTime: "Read time",
        excerpt: "Excerpt",
        content: "Content",
        featuredArticle: "Featured article",
        tipCreated: "Tip created successfully",
        tipUpdated: "Tip updated",
        tipDeleted: "Tip deleted",
        noTips: "No tips yet",
        manageUsers: "Manage users",
        user: "User",
        email: "Email",
        role: "Role",
        joined: "Joined",
        roleUpdated: "Role updated",
        noUsers: "No users",
        globalGameStats: "Global game statistics",
        totalQuizGames: "Quiz games",
        totalCorrectAnswers: "Correct answers",
        totalScorePredictions: "Score predictions",
        totalAccumulators: "Accumulators created",
        topPlayers: "Top players",
        rank: "Rank",
        player: "Player",
        points: "Points",
        correctAnswers: "Answers",
        noPlayers: "No players yet",
        subscriptions: "Subscriptions",
        subscriptionsDesc: "Manage Premium subscriptions (DB).",
        refresh: "Refresh",
        subscriptionSetPremium: "User set as Premium",
        subscriptionSetFree: "Premium removed"
      }
    }
  },
  es: {
    translation: {
      nav: {
        home: "Inicio",
        dailyPicks: "Pronósticos del día",
        premium: "Premium",
        stats: "Estadísticas",
        games: "Juegos",
        tips: "Consejos",
        login: "Iniciar sesión",
        signup: "Registrarse",
        logout: "Cerrar sesión",
        profile: "Mi Perfil",
        admin: "Dashboard"
      },
      hero: {
        title: "Pronósticos Deportivos",
        subtitle: "de Excelencia",
        description: "Únete a miles de apostadores que confían en nuestros análisis expertos para maximizar sus ganancias.",
        cta: "Comenzar ahora",
        stats: {
          successRate: "Tasa de éxito",
          monthlyPicks: "Pronósticos/mes",
          members: "Miembros activos"
        }
      },
      features: {
        title: "Por qué elegirnos",
        expert: {
          title: "Análisis Experto",
          description: "Nuestro equipo de analistas profesionales estudia cada partido en profundidad."
        },
        stats: {
          title: "Estadísticas Avanzadas",
          description: "Accede a datos detallados para tomar decisiones informadas."
        },
        community: {
          title: "Comunidad Activa",
          description: "Comparte e intercambia con miles de entusiastas."
        }
      },
      matches: {
        title: "Partidos de hoy",
        viewAll: "Ver todos los pronósticos",
        premium: "Premium",
        free: "Gratis"
      },
      pricing: {
        title: "Nuestros Planes",
        subtitle: "Elige el plan que te convenga",
        monthly: "Mensual",
        yearly: "Anual",
        popular: "Popular",
        subscribe: "Suscribirse",
        basic: {
          name: "Básico",
          price: "Gratis",
          features: ["Pronósticos básicos", "Estadísticas limitadas", "Acceso a la comunidad"]
        },
        premium: {
          name: "Premium",
          price: "19€",
          period: "/mes",
          features: ["Todos los pronósticos", "Estadísticas completas", "Soporte prioritario", "Alertas en tiempo real", "ROI garantizado"]
        }
      },
      footer: {
        description: "La plataforma de pronósticos deportivos de referencia para apostadores exigentes.",
        links: "Enlaces útiles",
        legal: "Legal",
        terms: "Términos",
        privacy: "Privacidad",
        contact: "Contacto",
        disclaimer: "Las apuestas implican riesgos. Juega responsablemente. Solo mayores de 18.",
        disclaimer_link: "Aviso legal",
        referral: "Referidos"
      },
      auth: {
        loginRequired: "Inicia sesión para acceder a esta sección",
        premiumRequired: "Suscripción Premium requerida"
      },
      games: {
        subtitle: "¡Participa en nuestros juegos y gana recompensas!",
        players: "jugadores",
        play: "Jugar ahora",
        leaderboard: "Clasificación",
        viewFullLeaderboard: "Ver clasificación completa",
        quiz: {
          backToGames: "Volver a juegos",
          gameOver: "¡Juego terminado!",
          yourScore: "Tu puntuación",
          playAgain: "Jugar de nuevo",
          next: "Siguiente pregunta",
          seeResults: "Ver resultados"
        },
        scorePrediction: {
          title: "Predicción de Marcador",
          subtitle: "Adivina el marcador exacto de los partidos",
          backToGames: "Volver a juegos",
          submitted: "¡Predicciones guardadas!",
          checkBack: "Vuelve después de los partidos para ver tus resultados.",
          modify: "Modificar",
          submit: "Enviar mis predicciones"
        },
        accumulator: {
          title: "Desafío Acumulador",
          subtitle: "Construye la mejor combinada (3-5 selecciones)",
          backToGames: "Volver a juegos",
          selected: "Seleccionado:",
          totalOdds: "Cuota total",
          submitted: "¡Combinada guardada!",
          yourAccumulator: "Tu combinada:",
          newAccumulator: "Nueva combinada",
          selectMinimum: "Selecciona al menos 3 apuestas",
          submitAccumulator: "Enviar mi combinada"
        }
      },
      tips: {
        subtitle: "Mejora tus habilidades de apuestas deportivas con nuestras guías y consejos de expertos.",
        featured: "Artículo Destacado",
        readArticle: "Leer artículo",
        readMore: "Leer más"
      },
      stats: {
        subtitle: "Consulta nuestro rendimiento e historial de pronósticos.",
        bilanGlobal: "Resumen global",
        won: "Ganados",
        lost: "Perdidos",
        pending: "En curso",
        winRateGlobal: "Tasa de éxito global",
        last20Predictions: "20 últimos pronósticos",
        match: "Partido",
        predictionsOfMonth: "Pronósticos del mes",
        sortByDate: "Fecha",
        sortByLeague: "Liga",
        sortBySport: "Deporte",
        sport: "Deporte",
        viewGlobal: "Global",
        viewMonthly: "Por mes",
        viewLeagues: "Por liga",
        noDataMonthly: "No hay datos mensuales.",
        performanceByLeague: "Rendimiento por Liga",
        all: "Todas",
        noData: "No hay datos disponibles.",
        winRate: "Tasa de éxito",
        totalPredictions: "Total pronósticos",
        roi: "ROI medio",
        victories: "Victorias"
      },
      pages: {
        terms: {
          title: "Términos de Servicio",
          section1: {
            title: "1. Objeto",
            content: "Estos términos de servicio rigen el acceso y uso de la plataforma SyntrixSports. Al acceder a este sitio, aceptas sin reservas estos términos."
          },
          section2: {
            title: "2. Servicios ofrecidos",
            content: "SyntrixSports proporciona pronósticos y análisis deportivos con fines informativos. Esta información no constituye asesoramiento de inversión ni incentivos para apostar."
          },
          section3: {
            title: "3. Registro y cuenta de usuario",
            content: "El acceso a ciertos servicios requiere crear una cuenta. Te comprometes a proporcionar información precisa y mantener la confidencialidad de tus credenciales."
          },
          section4: {
            title: "4. Suscripción Premium",
            content: "La suscripción Premium se factura mensualmente y puede cancelarse en cualquier momento. La cancelación entra en vigor al final del período de facturación actual."
          },
          section5: {
            title: "5. Propiedad intelectual",
            content: "Todo el contenido de SyntrixSports está protegido por la ley de propiedad intelectual. Cualquier reproducción sin autorización está prohibida."
          },
          section6: {
            title: "6. Limitación de responsabilidad",
            content: "SyntrixSports no puede ser responsable de las pérdidas financieras resultantes del uso de sus pronósticos. Las apuestas deportivas implican riesgos de pérdida."
          },
          lastUpdate: "Última actualización"
        },
        privacy: {
          title: "Política de Privacidad",
          section1: {
            title: "1. Recopilación de datos",
            content: "Solo recopilamos datos necesarios para nuestros servicios: dirección de correo electrónico, información de pago para suscriptores Premium y datos de navegación."
          },
          section2: {
            title: "2. Uso de datos",
            content: "Tus datos se utilizan para: gestionar tu cuenta, procesar pagos, personalizar tu experiencia y enviar comunicaciones si has dado tu consentimiento."
          },
          section3: {
            title: "3. Protección de datos",
            content: "Implementamos medidas de seguridad técnicas y organizativas para proteger tus datos contra acceso, modificación o destrucción no autorizados."
          },
          section4: {
            title: "4. Compartir datos",
            content: "No vendemos tus datos personales. Pueden compartirse con nuestros proveedores de pago (Stripe) para el procesamiento de transacciones."
          },
          section5: {
            title: "5. Tus derechos",
            content: "Bajo el RGPD, tienes derecho a acceder, rectificar, eliminar y portar tus datos. Contáctanos para ejercer estos derechos."
          },
          lastUpdate: "Última actualización"
        },
        contact: {
          title: "Contáctanos",
          subtitle: "¿Tienes una pregunta, sugerencia o necesitas ayuda? Nuestro equipo está aquí para ti.",
          email: "Email",
          hours: "Horario",
          hoursValue: "Lun-Vie: 9am-6pm",
          location: "Ubicación",
          name: "Nombre",
          namePlaceholder: "Tu nombre",
          emailField: "Email",
          emailPlaceholder: "tu@email.com",
          subject: "Asunto",
          subjectPlaceholder: "¿Cómo podemos ayudarte?",
          message: "Mensaje",
          messagePlaceholder: "Describe tu solicitud en detalle...",
          send: "Enviar mensaje",
          successTitle: "¡Mensaje enviado!",
          successMessage: "Te responderemos lo antes posible."
        },
        tipDetail: {
          notFound: "Artículo no encontrado",
          backToTips: "Volver a consejos",
          share: "Compartir",
          save: "Guardar"
        }
      },
      notifications: {
        enable: "Activar notificaciones",
        enabled: "¡Notificaciones activadas!",
        enabledDesc: "Recibirás alertas para nuevos pronósticos.",
        denied: "Notificaciones bloqueadas",
        deniedDesc: "Activa las notificaciones en la configuración de tu navegador.",
        notSupported: "No soportado",
        notSupportedDesc: "Tu navegador no soporta notificaciones push."
      },
      profile: {
        title: "Mi Perfil",
        subtitle: "Gestiona tu información personal y configuración",
        displayName: "Nombre para mostrar",
        displayNamePlaceholder: "Introduce tu nombre",
        email: "Email",
        save: "Guardar",
        saving: "Guardando...",
        saved: "Perfil actualizado",
        savedDesc: "Tus cambios han sido guardados.",
        error: "Error",
        errorDesc: "Ha ocurrido un error al guardar.",
        avatarUpdated: "Foto actualizada",
        avatarUpdatedDesc: "Tu foto de perfil ha sido actualizada.",
        subscription: "Suscripción",
        premiumActive: "Suscripción Premium activa",
        freePlan: "Plan gratuito",
        premium: "Premium",
        expiresOn: "Expira el",
        manageSubscription: "Gestionar",
        upgradeToPremium: "Pasar a Premium",
        gameStats: "Estadísticas de juegos",
        quizPlayed: "Quiz jugados",
        correctAnswers: "Respuestas correctas",
        predictions: "Predicciones",
        totalPoints: "Puntos totales",
        referral: "Referidos",
        referralDesc: "¡Comparte tu código y gana 7 días Premium gratis por cada amigo que se registre!",
        codeCopied: "¡Código copiado!",
        codeCopiedDesc: "Comparte este código con tus amigos.",
        referralsCompleted: "Referidos exitosos",
        rewardsEarned: "Recompensas ganadas",
        days: "días"
      },
      referral: {
        title: "Programa de Referidos",
        subtitle: "¡Invita a tus amigos y gana recompensas exclusivas!",
        yourCode: "Tu código de referido",
        linkCopied: "¡Enlace copiado!",
        linkCopiedDesc: "Comparte este enlace con tus amigos.",
        totalInvited: "Invitados",
        completed: "Registrados",
        daysEarned: "Días ganados",
        haveCode: "¿Tienes un código de referido?",
        enterCodeDesc: "Introduce el código de un amigo para obtener beneficios exclusivos al registrarte.",
        apply: "Aplicar",
        enterCode: "Introduce un código de referido",
        codeStored: "¡Código guardado!",
        codeStoredDesc: "El código se aplicará cuando te registres.",
        howItWorks: "¿Cómo funciona?",
        reward1Title: "7 días Premium gratis",
        reward1Desc: "Por cada amigo que se registre con tu código.",
        reward2Title: "Bono de bienvenida",
        reward2Desc: "Tu amigo también recibe 3 días Premium gratis.",
        reward3Title: "Referidos ilimitados",
        reward3Desc: "¡Cuantos más refieras, más ganarás!",
        joinNow: "Únete ahora"
      },
      admin: {
        title: "Dashboard Admin",
        subtitle: "Gestiona pronósticos, consejos y usuarios de la plataforma.",
        accessDenied: "Acceso denegado",
        accessDeniedDesc: "No tienes los permisos necesarios.",
        totalUsers: "Usuarios",
        totalPredictions: "Pronósticos",
        totalTips: "Consejos",
        premiumUsers: "Premium",
        predictions: "Pronósticos",
        tips: "Consejos",
        users: "Usuarios",
        gameStats: "Stats Juegos",
        managePredictions: "Gestionar pronósticos",
        addPrediction: "Añadir pronóstico",
        editPrediction: "Editar pronóstico",
        matchTitle: "Partido",
        league: "Liga",
        matchDate: "Fecha del partido",
        prediction: "Pronóstico",
        odds: "Cuota",
        confidence: "Confianza",
        result: "Resultado",
        pending: "Pendiente",
        won: "Ganado",
        lost: "Perdido",
        premiumOnly: "Solo Premium",
        match: "Partido",
        status: "Estado",
        actions: "Acciones",
        cancel: "Cancelar",
        update: "Actualizar",
        create: "Crear",
        confirmDelete: "¿Estás seguro de que quieres eliminar este elemento?",
        predictionCreated: "Pronóstico creado con éxito",
        predictionUpdated: "Pronóstico actualizado",
        predictionDeleted: "Pronóstico eliminado",
        error: "Ha ocurrido un error",
        noPredictions: "No hay pronósticos todavía",
        manageTips: "Gestionar consejos",
        addTip: "Añadir consejo",
        editTip: "Editar consejo",
        tipTitle: "Título",
        category: "Categoría",
        readTime: "Tiempo de lectura",
        excerpt: "Resumen",
        content: "Contenido",
        featuredArticle: "Artículo destacado",
        tipCreated: "Consejo creado con éxito",
        tipUpdated: "Consejo actualizado",
        tipDeleted: "Consejo eliminado",
        noTips: "No hay consejos todavía",
        manageUsers: "Gestionar usuarios",
        user: "Usuario",
        email: "Email",
        role: "Rol",
        joined: "Registrado",
        roleUpdated: "Rol actualizado",
        noUsers: "No hay usuarios",
        globalGameStats: "Estadísticas globales de juegos",
        totalQuizGames: "Partidas de quiz",
        totalCorrectAnswers: "Respuestas correctas",
        totalScorePredictions: "Predicciones de marcador",
        totalAccumulators: "Combinadas creadas",
        topPlayers: "Mejores jugadores",
        rank: "Rango",
        player: "Jugador",
        points: "Puntos",
        correctAnswers: "Respuestas",
        noPlayers: "No hay jugadores todavía",
        subscriptions: "Suscripciones",
        subscriptionsDesc: "Gestionar suscripciones Premium (BD).",
        refresh: "Actualizar",
        subscriptionSetPremium: "Usuario pasado a Premium",
        subscriptionSetFree: "Premium retirado"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'fr',
    fallbackLng: 'fr',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;