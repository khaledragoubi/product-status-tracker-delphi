
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/sonner';

interface UserMetadata {
  id: string;
  role: 'admin' | 'technicien_diag' | 'viewer';
  email?: string;
}

const UserManagement = () => {
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Fetch all users with their metadata
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data: userMetadata, error: metadataError } = await supabase
        .from('user_metadata')
        .select('id, role');

      if (metadataError) throw metadataError;

      // Get user emails from auth.users (admin only can access this)
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        console.warn('Could not fetch user emails:', authError);
        return userMetadata?.map(user => ({
          ...user,
          email: 'Email not available'
        })) || [];
      }

      return userMetadata?.map(user => {
        const authUser = authUsers.users.find(au => au.id === user.id);
        return {
          ...user,
          email: authUser?.email || 'Email not available'
        };
      }) || [];
    },
  });

  // Mutation to update user role
  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string; newRole: string }) => {
      const { error } = await supabase
        .from('user_metadata')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Rôle utilisateur mis à jour avec succès');
      setUpdatingUserId(null);
    },
    onError: (error) => {
      console.error('Error updating user role:', error);
      toast.error('Erreur lors de la mise à jour du rôle');
      setUpdatingUserId(null);
    },
  });

  const handleRoleUpdate = (userId: string, newRole: string) => {
    setUpdatingUserId(userId);
    updateRoleMutation.mutate({ userId, newRole });
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrateur';
      case 'technicien_diag': return 'Technicien Diagnostic';
      case 'viewer': return 'Visualiseur';
      default: return role;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500/20 text-red-700';
      case 'technicien_diag': return 'bg-blue-500/20 text-blue-700';
      case 'viewer': return 'bg-gray-500/20 text-gray-700';
      default: return 'bg-gray-500/20 text-gray-700';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gestion des Utilisateurs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Chargement des utilisateurs...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gestion des Utilisateurs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-red-600">
            Erreur lors du chargement des utilisateurs
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion des Utilisateurs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users && users.length > 0 ? (
            users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex flex-col">
                  <span className="font-medium">{user.email}</span>
                  <span className={`text-xs px-2 py-1 rounded-full inline-block w-fit ${getRoleBadgeColor(user.role)}`}>
                    {getRoleLabel(user.role)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    value={user.role}
                    onValueChange={(newRole) => handleRoleUpdate(user.id, newRole)}
                    disabled={updatingUserId === user.id}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="viewer">Visualiseur</SelectItem>
                      <SelectItem value="technicien_diag">Technicien Diagnostic</SelectItem>
                      <SelectItem value="admin">Administrateur</SelectItem>
                    </SelectContent>
                  </Select>
                  {updatingUserId === user.id && (
                    <div className="text-sm text-gray-500">Mise à jour...</div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4">Aucun utilisateur trouvé</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserManagement;
