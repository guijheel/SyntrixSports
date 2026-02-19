import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Crown, User, UserCog } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  user_id: string;
  email: string | null;
  display_name: string | null;
  created_at: string;
  role?: string;
}

type AppRole = 'admin' | 'moderator' | 'user';

export const UsersTab = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;

      // Fetch roles for each user
      const usersWithRoles = await Promise.all(
        (profiles || []).map(async (profile) => {
          const { data: roles } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', profile.user_id)
            .limit(1);
          
          return {
            ...profile,
            role: roles?.[0]?.role || 'user',
          };
        })
      );

      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: AppRole) => {
    try {
      // First, delete existing role
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      // Then insert new role
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role: newRole });

      if (error) throw error;

      toast({ title: t('admin.roleUpdated') });
      fetchUsers();
    } catch (error) {
      console.error('Error updating role:', error);
      toast({ title: t('admin.error'), variant: 'destructive' });
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="w-4 h-4 text-gold" />;
      case 'moderator':
        return <Shield className="w-4 h-4 text-secondary" />;
      default:
        return <User className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'admin':
        return 'stat-badge-gold';
      case 'moderator':
        return 'bg-secondary/20 text-secondary';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="card-elevated p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl font-semibold flex items-center gap-2">
          <UserCog className="w-5 h-5" />
          {t('admin.manageUsers')}
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-3 font-medium text-muted-foreground">{t('admin.user')}</th>
              <th className="text-left p-3 font-medium text-muted-foreground">{t('admin.email')}</th>
              <th className="text-center p-3 font-medium text-muted-foreground">{t('admin.role')}</th>
              <th className="text-center p-3 font-medium text-muted-foreground">{t('admin.joined')}</th>
              <th className="text-right p-3 font-medium text-muted-foreground">{t('admin.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((userProfile) => (
              <tr key={userProfile.id} className="border-b border-border/50 hover:bg-muted/30">
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    {getRoleIcon(userProfile.role || 'user')}
                    <span className="font-medium">{userProfile.display_name || 'Sans nom'}</span>
                  </div>
                </td>
                <td className="p-3 text-muted-foreground">{userProfile.email || '-'}</td>
                <td className="p-3 text-center">
                  <span className={`stat-badge ${getRoleBadgeClass(userProfile.role || 'user')}`}>
                    {userProfile.role || 'user'}
                  </span>
                </td>
                <td className="p-3 text-center text-muted-foreground text-sm">
                  {new Date(userProfile.created_at).toLocaleDateString()}
                </td>
                <td className="p-3 text-right">
                  <Select
                    value={userProfile.role || 'user'}
                    onValueChange={(value) => handleRoleChange(userProfile.user_id, value as AppRole)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">
                        <span className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          User
                        </span>
                      </SelectItem>
                      <SelectItem value="moderator">
                        <span className="flex items-center gap-2">
                          <Shield className="w-4 h-4" />
                          Moderator
                        </span>
                      </SelectItem>
                      <SelectItem value="admin">
                        <span className="flex items-center gap-2">
                          <Crown className="w-4 h-4" />
                          Admin
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            {t('admin.noUsers')}
          </div>
        )}
      </div>
    </div>
  );
};
