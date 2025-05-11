
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/sonner';
import { UserRound } from 'lucide-react';

interface LoginFormProps {
  onLogin: (username: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Liste des utilisateurs autorisés (en production, cela serait stocké dans une base de données)
  const authorizedUsers = [
    { username: 'admin', password: 'admin123' },
    { username: 'technicien', password: 'tech123' },
    { username: 'test', password: 'test123' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simple validation
    if (!username.trim()) {
      toast.error('Veuillez saisir un nom d\'utilisateur');
      setLoading(false);
      return;
    }
    
    if (!password.trim()) {
      toast.error('Veuillez saisir un mot de passe');
      setLoading(false);
      return;
    }
    
    // Vérification des identifiants
    const user = authorizedUsers.find(
      user => user.username === username && user.password === password
    );
    
    setTimeout(() => {
      if (user) {
        onLogin(username);
        toast.success(`Bienvenue, ${username}`);
      } else {
        toast.error('Identifiants incorrects');
      }
      setLoading(false);
    }, 600); // Petit délai pour simuler une vérification
  };

  return (
    <Card className="w-full max-w-md mx-auto border-primary">
      <CardHeader className="space-y-1 bg-primary/10">
        <div className="flex justify-center mb-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <UserRound size={36} className="text-primary" />
          </div>
        </div>
        <CardTitle className="text-2xl text-center">SAV AMY IO Nc log</CardTitle>
        <CardDescription className="text-center">
          Connectez-vous pour accéder au système de suivi des produits
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Nom d'utilisateur</Label>
            <Input 
              id="username" 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Entrez votre nom d'utilisateur"
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input 
              id="password" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Entrez votre mot de passe"
              disabled={loading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Vérification...' : 'Se connecter'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <p className="text-sm text-muted-foreground">
          Utilisateurs de démonstration:
        </p>
        <div className="text-xs text-muted-foreground bg-muted p-2 rounded-md w-full">
          <p>admin / admin123</p>
          <p>technicien / tech123</p>
          <p>test / test123</p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
