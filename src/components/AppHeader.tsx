
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserWithRole } from '@/hooks/useAuth';

interface AppHeaderProps {
  user: UserWithRole | null;
  onLogout: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ user, onLogout }) => {
  const getRoleLabel = (role?: string) => {
    switch (role) {
      case 'admin': return 'Administrateur';
      case 'technicien_diag': return 'Technicien Diagnostic';
      case 'viewer': return 'Visualiseur';
      default: return 'Utilisateur';
    }
  };

  const getRoleBadgeColor = (role?: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500/20 text-red-300';
      case 'technicien_diag': return 'bg-blue-500/20 text-blue-300';
      case 'viewer': return 'bg-gray-500/20 text-gray-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/52a12bc6-eba5-4826-8c18-1d971f9e1b2d.png" 
              alt="Logo ACTIA" 
              className="h-10" 
            />
            <h1 className="text-2xl font-bold">SAV AMY IO Nc log</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-primary-foreground/20 px-3 py-1 rounded-md">
              <p className="text-sm">{user?.email}</p>
              <p className={`text-xs px-2 py-1 rounded-full ${getRoleBadgeColor(user?.role)}`}>
                {getRoleLabel(user?.role)}
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={onLogout} 
              size="sm" 
              className="text-primary-foreground bg-transparent border-primary-foreground/30 hover:bg-primary-foreground/20"
            >
              Déconnexion
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
