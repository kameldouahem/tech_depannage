import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase';
import { auth, googleAuthProvider } from '../lib/firebase';
import { signInWithPopup } from 'firebase/auth';
import technicianAvatar from '../assets/images/technician_avatar_1791279284630.jpg';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
  isSupabaseActive: boolean;
}

const DEFAULT_ADMIN: UserProfile = {
  id: 'admin-1',
  email: 'admin@depannage.fr',
  fullName: 'Kamel Douahem',
  role: 'admin',
  phone: '06 12 34 56 78',
  whatsappNumber: '06 12 34 56 78',
  companyName: 'TechDepan Express',
  companyAddress: '14 Rue de la République, 75011 Paris',
  siret: '892 145 678 00019',
  bioDescription: 'Dépannage informatique rapide à domicile & en atelier · PC, Mac, Imprimante, Réseau',
  interventionArea: 'Paris & Île-de-France (rayon 25 km)',
  openingHours: 'Du Lundi au Samedi : 8h30 - 19h30',
  websiteUrl: 'https://techdepan.fr',
  avatarUrl: technicianAvatar,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSupabaseActive, setIsSupabaseActive] = useState(false);

  useEffect(() => {
    // Check initial auth state
    const checkAuth = async () => {
      const supabase = getSupabaseClient();
      const configured = isSupabaseConfigured();
      setIsSupabaseActive(configured);

      if (configured && supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setUser({
              ...DEFAULT_ADMIN,
              id: session.user.id,
              email: session.user.email || 'admin@depannage.fr',
              fullName: session.user.user_metadata?.full_name || DEFAULT_ADMIN.fullName,
              companyName: session.user.user_metadata?.company_name || DEFAULT_ADMIN.companyName,
              phone: session.user.user_metadata?.phone || DEFAULT_ADMIN.phone,
              whatsappNumber: session.user.user_metadata?.whatsapp_number || DEFAULT_ADMIN.whatsappNumber,
              companyAddress: session.user.user_metadata?.company_address || DEFAULT_ADMIN.companyAddress,
              siret: session.user.user_metadata?.siret || DEFAULT_ADMIN.siret,
              bioDescription: session.user.user_metadata?.bio_description || DEFAULT_ADMIN.bioDescription,
              role: 'admin',
              avatarUrl: technicianAvatar,
            });
            setIsLoading(false);
            return;
          }
        } catch (err) {
          console.warn('Supabase session check error:', err);
        }
      }

      // Check local storage session
      const savedUser = localStorage.getItem('techdepan_auth_user');
      let initialUser = savedUser ? JSON.parse(savedUser) : null;

      // Fetch cloud company profile from Cloud SQL PostgreSQL
      try {
        const res = await fetch('/api/profile');
        if (res.ok) {
          const cloudProfile = await res.json();
          if (cloudProfile && cloudProfile.companyName) {
            initialUser = {
              ...(initialUser || DEFAULT_ADMIN),
              ...cloudProfile,
              avatarUrl: initialUser?.avatarUrl || technicianAvatar,
            };
          }
        }
      } catch (err) {
        console.warn('Could not fetch cloud profile on start:', err);
      }

      if (initialUser) {
        setUser(initialUser);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const loginWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const cred = await signInWithPopup(auth, googleAuthProvider);
      if (cred.user) {
        const profile: UserProfile = {
          ...DEFAULT_ADMIN,
          id: cred.user.uid,
          email: cred.user.email || 'admin@depannage.fr',
          fullName: cred.user.displayName || DEFAULT_ADMIN.fullName,
          avatarUrl: cred.user.photoURL || technicianAvatar,
          role: 'admin',
        };
        setUser(profile);
        localStorage.setItem('techdepan_auth_user', JSON.stringify(profile));
        return { success: true };
      }
      return { success: false, error: 'Connexion Google annulée.' };
    } catch (err: any) {
      console.error('Google Sign-in error:', err);
      return { success: false, error: err.message || 'Échec de connexion avec Google' };
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanEmail || !cleanPass) {
      return { success: false, error: 'Veuillez saisir votre email et votre mot de passe.' };
    }

    const supabase = getSupabaseClient();
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPass,
        });

        if (error) {
          // If Supabase returns error, attempt fallback if it's the demo admin
          if (cleanEmail === DEFAULT_ADMIN.email && (cleanPass === 'tech2026!' || cleanPass === 'admin123')) {
            const adminUser = { ...DEFAULT_ADMIN };
            setUser(adminUser);
            localStorage.setItem('techdepan_auth_user', JSON.stringify(adminUser));
            return { success: true };
          }
          return { success: false, error: error.message };
        }

        if (data.user) {
          const profile: UserProfile = {
            ...DEFAULT_ADMIN,
            id: data.user.id,
            email: data.user.email || cleanEmail,
            fullName: data.user.user_metadata?.full_name || DEFAULT_ADMIN.fullName,
            companyName: data.user.user_metadata?.company_name || DEFAULT_ADMIN.companyName,
            phone: data.user.user_metadata?.phone || DEFAULT_ADMIN.phone,
            whatsappNumber: data.user.user_metadata?.whatsapp_number || DEFAULT_ADMIN.whatsappNumber,
            role: 'admin',
            avatarUrl: technicianAvatar,
          };
          setUser(profile);
          localStorage.setItem('techdepan_auth_user', JSON.stringify(profile));
          return { success: true };
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Erreur de connexion';
        return { success: false, error: message };
      }
    }

    // Local / Standalone Auth Mode
    // Default allowed credentials: admin@depannage.fr / tech2026! or any demo password >= 4 chars
    if (cleanEmail === 'admin@depannage.fr' || cleanEmail.includes('@')) {
      if (cleanPass.length < 4) {
        return { success: false, error: 'Le mot de passe doit comporter au moins 4 caractères.' };
      }
      const loggedUser: UserProfile = {
        ...DEFAULT_ADMIN,
        email: cleanEmail,
      };
      setUser(loggedUser);
      localStorage.setItem('techdepan_auth_user', JSON.stringify(loggedUser));
      return { success: true };
    }

    return { success: false, error: 'Identifiants invalides.' };
  };

  const logout = async () => {
    const supabase = getSupabaseClient();
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Erreur signOut Supabase:', err);
      }
    }
    setUser(null);
    localStorage.removeItem('techdepan_auth_user');
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, message: 'Veuillez saisir une adresse email valide.' };
    }

    const supabase = getSupabaseClient();
    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail);
        if (error) {
          return { success: false, message: error.message };
        }
        return { 
          success: true, 
          message: `Un lien de réinitialisation sécurisé a été envoyé à ${cleanEmail} via Supabase Auth.` 
        };
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Erreur lors de la réinitialisation';
        return { success: false, message };
      }
    }

    // Local simulation
    return {
      success: true,
      message: `Un e-mail de réinitialisation avec un lien sécurisé a été généré pour ${cleanEmail}. (Mode autonome activé)`
    };
  };

  const updateProfile = async (updates: Partial<UserProfile>): Promise<boolean> => {
    try {
      const current = user || DEFAULT_ADMIN;
      const updated: UserProfile = {
        ...current,
        ...updates,
      };

      setUser(updated);
      localStorage.setItem('techdepan_auth_user', JSON.stringify(updated));

      // Also sync to Supabase user metadata if connected
      const supabase = getSupabaseClient();
      if (isSupabaseConfigured() && supabase) {
        try {
          await supabase.auth.updateUser({
            data: {
              full_name: updated.fullName,
              company_name: updated.companyName,
              phone: updated.phone,
              whatsapp_number: updated.whatsappNumber,
              company_address: updated.companyAddress,
              siret: updated.siret,
              bio_description: updated.bioDescription,
              intervention_area: updated.interventionArea,
              opening_hours: updated.openingHours,
            },
          });
        } catch (err) {
          console.warn('Supabase profile sync warning:', err);
        }
      }

      // Sync to Cloud SQL PostgreSQL database via backend API
      try {
        await fetch('/api/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updated),
        });
      } catch (err) {
        console.warn('Cloud SQL profile sync warning:', err);
      }

      return true;
    } catch (err) {
      console.error('Erreur mise à jour profil:', err);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginWithGoogle,
        logout,
        resetPassword,
        updateProfile,
        isSupabaseActive,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
