
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface ActionButtonsProps {
  onExportLogs: () => Promise<void>;
  onClearAllLogs: () => Promise<void>;
  isExporting: boolean;
  isClearing: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ 
  onExportLogs, 
  onClearAllLogs,
  isExporting,
  isClearing 
}) => {
  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        className="flex items-center gap-1"
        onClick={onExportLogs}
        disabled={isExporting}
      >
        <Download className="size-4" />
        {isExporting ? 'Exportation...' : 'Enregistrement des logs'}
      </Button>
      
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" className="flex items-center gap-1" disabled={isClearing}>
            <Trash2 className="size-4" />
            {isClearing ? 'Suppression...' : 'Supprimer et vider les logs'}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer tous les logs ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action va supprimer définitivement tous les logs et l'historique des produits. 
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={onClearAllLogs} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ActionButtons;
