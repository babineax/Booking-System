import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types/auth';

export const useAuthGuard = () => {
  const { user, userProfile, loading } = useAuth();

  const isAuthenticated = !!user;
  const isEmailVerified = user?.emailVerified || false;

  const hasRole = (requiredRole: UserRole): boolean => {
    if (!userProfile) return false;
    
    // Admin has access to everything
    if (userProfile.role === 'admin') return true;
    
    // Staff can access staff and customer areas
    if (userProfile.role === 'staff' && (requiredRole === 'staff' || requiredRole === 'customer')) {
      return true;
    }
    
    // Customer can only access customer areas
    if (userProfile.role === 'customer' && requiredRole === 'customer') {
      return true;
    }
    
    return false;
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return roles.some(role => hasRole(role));
  };

  const isAdmin = (): boolean => {
    return userProfile?.role === 'admin';
  };

  const isStaff = (): boolean => {
    return userProfile?.role === 'staff' || userProfile?.role === 'admin';
  };

  const isCustomer = (): boolean => {
    return userProfile?.role === 'customer';
  };

  return {
    isAuthenticated,
    isEmailVerified,
    loading,
    user,
    userProfile,
    hasRole,
    hasAnyRole,
    isAdmin,
    isStaff,
    isCustomer
  };
};
