
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/hooks/useAuth';

interface UserMetadata {
  id: string;
  role: UserRole;
  email?: string;
  created_at: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserMetadata[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      // Get user metadata with roles
      const { data: userMetadata, error: metadataError } = await supabase
        .from('user_metadata')
        .select('*');

      if (metadataError) throw metadataError;

      // Get user auth data (for emails)
      const { data: { users: authUsers }, error: authError } = await supabase.auth.admin.listUsers();

      if (authError) throw authError;

      // Combine the data
      const combinedUsers = userMetadata?.map(metadata => {
        const authUser = authUsers.find(user => user.id === metadata.id);
        return {
          ...metadata,
          email: authUser?.email
        };
      }) || [];

      setUsers(combinedUsers);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast.error('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      const { error } = await supabase
        .from('user_metadata')
        .update({ role: newRole, updated_at: new Date().toISOString() })
        .eq('id', userId);

      if (error) throw error;

      toast.success('Rôle mis à jour avec succès');
      fetchUsers(); // Refresh the list
    } catch (error: any) {
      console.error('Error updating role:', error);
      toast.error('Erreur lors de la mise à jour du rôle');
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'Administrateur';
      case 'technicien_diag': return 'Technicien Diagnostic';
      case 'viewer': return 'Visualiseur';
      default: return role;
    }
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'technicien_diag': return 'bg-blue-100 text-blue-800';
      case 'viewer': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Chargement des utilisateurs...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion des utilisateurs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.length === 0 ? (
            <div className="text-center text-gray-500">Aucun utilisateur trouvé</div>
          ) : (
            users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{user.email || 'Email non disponible'}</div>
                  <div className="text-sm text-gray-500">
                    Créé le {new Date(user.created_at).toLocaleDateString('fr-FR')}
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                    {getRoleLabel(user.role)}
                  </span>
                  
                  <Select
                    value={user.role}
                    onValueChange={(newRole: UserRole) => handleRoleChange(user.id, newRole)}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrateur</SelectItem>
                      <SelectItem value="technicien_diag">Technicien Diagnostic</SelectItem>
                      <SelectItem value="viewer">Visualiseur</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserManagement;
