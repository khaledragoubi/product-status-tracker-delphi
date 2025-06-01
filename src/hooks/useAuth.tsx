
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export type UserRole = 'admin' | 'technicien_diag' | 'viewer';

export interface UserWithRole extends User {
  role?: UserRole;
}

export const useAuth = () => {
  const [user, setUser] = useState<UserWithRole | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        
        if (session?.user) {
          // Fetch user role
          const { data: userMetadata } = await supabase
            .from('user_metadata')
            .select('role')
            .eq('id', session.user.id)
            .single();
          
          setUser({
            ...session.user,
            role: userMetadata?.role || 'viewer'
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        // Fetch user role for existing session
        supabase
          .from('user_metadata')
          .select('role')
          .eq('id', session.user.id)
          .single()
          .then(({ data: userMetadata }) => {
            setUser({
              ...session.user,
              role: userMetadata?.role || 'viewer'
            });
            setSession(session);
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const hasRole = (requiredRole: UserRole): boolean => {
    if (!user?.role) return false;
    if (user.role === 'admin') return true; // Admin can access everything
    return user.role === requiredRole;
  };

  return {
    user,
    session,
    loading,
    signOut,
    hasRole
  };
};
