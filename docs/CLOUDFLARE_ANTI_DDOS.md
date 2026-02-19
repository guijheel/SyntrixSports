# Protection anti-DDoS avec Cloudflare

Pour protéger le site contre les abus et les attaques DDoS :

1. **Mettre le domaine derrière Cloudflare**
   - Créez un compte sur [cloudflare.com](https://www.cloudflare.com)
   - Ajoutez votre site et suivez les instructions pour pointer les DNS vers Cloudflare
   - Cloudflare agit comme proxy et filtre le trafic (DDoS, bots) avant d’atteindre votre hébergeur

2. **Paramètres recommandés**
   - **Security > Settings** : niveau de sécurité "Medium" ou "High" selon votre besoin
   - **Firewall** : règles pour limiter les requêtes par IP si nécessaire
   - **Bot Fight Mode** : activer pour réduire le trafic des bots

3. **Optionnel : Turnstile (CAPTCHA invisible)**
   - Dans Cloudflare : **Turnstile** pour protéger formulaires (connexion, inscription) sans CAPTCHA visible
   - Vous pouvez intégrer le widget Turnstile sur la page d’auth si vous souhaitez renforcer la protection des comptes

Aucune modification de code n’est obligatoire pour la protection de base : il suffit que le domaine soit géré par Cloudflare.
