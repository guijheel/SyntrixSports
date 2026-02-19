import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface SubscriptionInfo {
  subscribed: boolean;
  productId: string | null;
  subscriptionEnd: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  subscription: SubscriptionInfo;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  checkSubscription: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<SubscriptionInfo>({
    subscribed: false,
    productId: null,
    subscriptionEnd: null,
  });

  const checkSubscription = async () => {
    if (!session) {
      setSubscription({ subscribed: false, productId: null, subscriptionEnd: null });
      return;
    }

    try {
      let subscribed = false;
      let productId: string | null = null;
      let subscriptionEnd: string | null = null;

      const { data: profile } = await supabase
        .from('profiles')
        .select('is_premium')
        .eq('user_id', session.user.id)
        .maybeSingle();
      if (profile?.is_premium) {
        subscribed = true;
      }

      try {
        const { data, error } = await supabase.functions.invoke('check-subscription');
        if (!error && data?.subscribed) {
          subscribed = true;
          productId = data.product_id || null;
          subscriptionEnd = data.subscription_end || null;
        }
      } catch {
        // Stripe/edge function optional; DB is_premium already checked
      }

      setSubscription({ subscribed, productId, subscriptionEnd });
    } catch (error) {
      console.error('Error checking subscription:', error);
      setSubscription({ subscribed: false, productId: null, subscriptionEnd: null });
    }
  };

  useEffect(() => {
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        if (session?.user) {
          setTimeout(() => {
            checkSubscription();
          }, 0);
        } else {
          setSubscription({ subscribed: false, productId: null, subscriptionEnd: null });
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (session?.user) {
        checkSubscription();
      }
    });

    return () => authSubscription.unsubscribe();
  }, []);

  // Auto-refresh subscription every minute
  useEffect(() => {
    if (!session) return;
    
    const interval = setInterval(checkSubscription, 60000);
    return () => clearInterval(interval);
  }, [session]);

  const signUp = async (email: string, password: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl
      }
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setSubscription({ subscribed: false, productId: null, subscriptionEnd: null });
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      subscription,
      signUp,
      signIn,
      signOut,
      checkSubscription,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
