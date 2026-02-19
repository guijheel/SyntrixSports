import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Zap, Twitter, Instagram, Youtube, MessageCircle, Gift, Image } from 'lucide-react';

export function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-12 h-12 rounded-xl  flex items-center justify-center glow-primary group-hover:scale-110 transition-transform">
                <img src="/genfavicon-512.png" alt="Logo" />
              </div>
              <span className="font-display text-xl font-bold gradient-text">
                  SyntrixSports
              </span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-md">
              {t('footer.description')}
            </p>
            <div className="flex gap-3">
              {[Twitter, Instagram, Youtube, MessageCircle].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display font-semibold mb-4">{t('footer.links')}</h4>
            <ul className="space-y-2">
              <li><Link to="/daily-picks" className="text-muted-foreground hover:text-primary transition-colors">{t('nav.dailyPicks')}</Link></li>
              <li><Link to="/premium" className="text-muted-foreground hover:text-primary transition-colors">{t('nav.premium')}</Link></li>
              <li><Link to="/stats" className="text-muted-foreground hover:text-primary transition-colors">{t('nav.stats')}</Link></li>
              <li><Link to="/tips" className="text-muted-foreground hover:text-primary transition-colors">{t('nav.tips')}</Link></li>
              <li>
                <Link to="/referral" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                  <Gift className="w-4 h-4" />
                  {t('footer.referral')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-display font-semibold mb-4">{t('footer.legal')}</h4>
            <ul className="space-y-2">
              <li><Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">{t('footer.terms')}</Link></li>
              <li><Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">{t('footer.privacy')}</Link></li>
              <li><Link to="/disclaimer" className="text-muted-foreground hover:text-primary transition-colors">{t('footer.disclaimer_link')}</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">{t('footer.contact')}</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {currentYear} SyntrixSports. All rights reserved.
            </p>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive/10 border border-destructive/20">
              <span className="text-xs text-destructive font-medium">
                ⚠️ {t('footer.disclaimer')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
