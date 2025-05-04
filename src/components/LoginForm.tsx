
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!username.trim()) {
      toast.error('Veuillez saisir un nom d\'utilisateur');
      return;
    }
    
    if (!password.trim()) {
      toast.error('Veuillez saisir un mot de passe');
      return;
    }
    
    // For demo purposes, we'll accept any login
    // In production, this would verify against a database
    onLogin(username);
    toast.success(`Bienvenue, ${username}`);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <div className="flex justify-center mb-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <UserRound size={36} className="text-primary" />
          </div>
        </div>
        <CardTitle className="text-2xl text-center">Identification</CardTitle>
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
            />
          </div>
          <Button type="submit" className="w-full">Se connecter</Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Mode démonstration: n'importe quel identifiant est accepté
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
