import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Redirect, useRootNavigationState, router } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';

interface AuthRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requiredRole?: 'user' | 'owner' | 'admin';
  redirectUrl?: string;
}

export default function AuthRoute({ 
  children, 
  requireAuth = true,
  requiredRole = undefined, 
  redirectUrl = requireAuth ? '/onboarding' : '/'
}: AuthRouteProps) {
  const { user, userRole, isLoading } = useAuth();
  const navigationState = useRootNavigationState();

  // Wait for navigation to be ready
  if (!navigationState?.key) {
    return null;
  }

  // Show loading indicator while checking auth
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4a80f5" />
      </View>
    );
  }

  // Handle authentication check
  const isAuthenticated = !!user;
  const hasRequiredRole = !requiredRole || userRole === requiredRole;

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Redirect href={redirectUrl} />;
  }

  // If authentication is not required but user is authenticated
  if (!requireAuth && isAuthenticated) {
    // Determine where to redirect based on user role
    if (userRole === 'owner') {
      return <Redirect href="/owner-dashboard" />;
    } else {
      return <Redirect href="/(tabs)" />;
    }
  }

  // If role check fails
  if (requireAuth && isAuthenticated && !hasRequiredRole) {
    // Redirect based on actual role
    if (userRole === 'owner') {
      return <Redirect href="/owner-dashboard" />;
    } else {
      return <Redirect href="/(tabs)" />;
    }
  }

  // All checks passed, render children
  return <>{children}</>;
}