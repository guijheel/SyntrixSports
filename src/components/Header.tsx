import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, Globe, ChevronDown, Zap, LogOut, Crown, Shield, LayoutDashboard, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

const languages = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
];

type AppRole = 'admin' | 'moderator' | 'user';

export function Header() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, subscription } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState<AppRole | null>(null);

  useEffect(() => {
    if (user) {
      fetchUserRole();
    } else {
      setUserRole(null);
    }
  }, [user]);

  const fetchUserRole = async () => {
    if (!user) return;
    try {
      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .limit(1);
      
      if (data && data.length > 0) {
        setUserRole(data[0].role as AppRole);
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const navLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/daily-picks', label: t('nav.dailyPicks') },
    { path: '/premium', label: t('nav.premium'), premium: true },
    { path: '/stats', label: t('nav.stats') },
    { path: '/games', label: t('nav.games') },
    { path: '/tips', label: t('nav.tips') },
  ];

  const currentLang = languages.find(l => l.code === i18n.language) || languages[0];
  const isAdminOrMod = userRole === 'admin' || userRole === 'moderator';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center glow-primary group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold gradient-text hidden sm:block">
              PronoMaster
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link flex items-center gap-1.5 ${
                  location.pathname === link.path ? 'active' : ''
                }`}
              >
                {link.label}
                {link.premium && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-gold text-gold-foreground">
                    PRO
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Admin Badge */}
            {isAdminOrMod && (
              <Link to="/admin" className="hidden md:flex">
                <Button variant="outline" size="sm" className="gap-2 border-secondary/50 text-secondary">
                  {userRole === 'admin' ? <Crown className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                  <span className="hidden lg:inline">{userRole === 'admin' ? 'Admin' : 'Modo'}</span>
                </Button>
              </Link>
            )}

            {/* Subscription Badge */}
            {user && subscription.subscribed && (
              <div className="hidden md:flex items-center gap-1 px-3 py-1 rounded-full bg-gold/10 border border-gold/20 text-gold text-sm font-medium">
                <Crown className="w-4 h-4" />
                Premium
              </div>
            )}

            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Globe className="w-4 h-4" />
                  <span className="hidden sm:inline">{currentLang.flag}</span>
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-card border-border">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => i18n.changeLanguage(lang.code)}
                    className="gap-2 cursor-pointer"
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Auth Section */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">Mon compte</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-card border-border min-w-[200px]">
                  <DropdownMenuItem className="text-muted-foreground cursor-default">
                    {user.email}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
                    <User className="w-4 h-4 mr-2" />
                    {t('nav.profile')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/referral')} className="cursor-pointer">
                    <Gift className="w-4 h-4 mr-2" />
                    {t('footer.referral')}
                  </DropdownMenuItem>
                  {isAdminOrMod && (
                    <DropdownMenuItem onClick={() => navigate('/admin')} className="cursor-pointer">
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      {t('nav.admin')}
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    {t('nav.logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                {/* Login Button */}
                <Link to="/auth">
                  <Button variant="ghost" size="sm" className="hidden sm:flex gap-2">
                    <User className="w-4 h-4" />
                    {t('nav.login')}
                  </Button>
                </Link>

                {/* CTA Button */}
                <Link to="/auth">
                  <Button size="sm" className="btn-gradient text-primary-foreground hidden sm:flex">
                    {t('nav.signup')}
                  </Button>
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-background border-b border-border overflow-hidden"
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                    location.pathname === link.path
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-muted'
                  }`}
                >
                  {link.label}
                  {link.premium && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-gold text-gold-foreground">
                      PRO
                    </span>
                  )}
                </Link>
              ))}
              {user && (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-muted"
                  >
                    <User className="w-4 h-4" />
                    {t('nav.profile')}
                  </Link>
                  <Link
                    to="/referral"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-muted"
                  >
                    <Gift className="w-4 h-4" />
                    {t('footer.referral')}
                  </Link>
                  {isAdminOrMod && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-muted text-secondary"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      {t('nav.admin')}
                    </Link>
                  )}
                </>
              )}
              <div className="border-t border-border mt-2 pt-4 flex gap-2">
                {user ? (
                  <Button 
                    variant="outline" 
                    className="flex-1" 
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    {t('nav.logout')}
                  </Button>
                ) : (
                  <>
                    <Link to="/auth" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full">
                        {t('nav.login')}
                      </Button>
                    </Link>
                    <Link to="/auth" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full btn-gradient text-primary-foreground">
                        {t('nav.signup')}
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
