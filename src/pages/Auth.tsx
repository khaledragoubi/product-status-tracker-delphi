
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/sonner';
import { UserRound } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/');
      }
    };
    checkAuth();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success('Connexion réussie');
        navigate('/');
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`
          }
        });
        if (error) throw error;
        toast.success('Compte créé avec succès. Veuillez vérifier votre email.');
      }
    } catch (error: any) {
      toast.error(error.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <header className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img 
              src="/lovable-uploads/52a12bc6-eba5-4826-8c18-1d971f9e1b2d.png" 
              alt="Logo ACTIA" 
              className="h-16" 
            />
          </div>
          <h1 className="text-2xl font-bold text-primary">SAV AMY IO Nc log</h1>
          <p className="text-sm opacity-90">Système de Suivi des Produits</p>
        </header>
        
        <Card className="w-full border-primary">
          <CardHeader className="space-y-1 bg-primary/10">
            <div className="flex justify-center mb-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <UserRound size={36} className="text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">
              {isLogin ? 'Connexion' : 'Créer un compte'}
            </CardTitle>
            <CardDescription className="text-center">
              {isLogin 
                ? 'Connectez-vous pour accéder au système' 
                : 'Créez votre compte pour accéder au système'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={handleAuth} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  disabled={loading}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Votre mot de passe"
                  disabled={loading}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Chargement...' : (isLogin ? 'Se connecter' : 'Créer le compte')}
              </Button>
            </form>
            
            <div className="mt-4 text-center">
              <Button 
                variant="link" 
                onClick={() => setIsLogin(!isLogin)}
                disabled={loading}
              >
                {isLogin 
                  ? "Pas de compte ? Créer un compte" 
                  : "Déjà un compte ? Se connecter"
                }
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
