
import React from 'react';

const AppFooter: React.FC = () => {
  return (
    <footer className="bg-secondary py-3 border-t">
      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
        <div className="flex items-center justify-center gap-2 mb-1">
          <img 
            src="/lovable-uploads/52a12bc6-eba5-4826-8c18-1d971f9e1b2d.png" 
            alt="Logo ACTIA" 
            className="h-6" 
          />
          <span>SAV AMY IO Nc log - Système de Suivi des Produits © 2025</span>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;
