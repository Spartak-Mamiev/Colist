import { createContext, useContext, useState, useEffect } from 'react';
import supabase from '../lib/supabaseClient';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // The currently logged-in Supabase user (or null)
  const [loading, setLoading] = useState(true); // True while we check for an existing session

  useEffect(() => {
    // On mount, check if the user already has a session (e.g. they refreshed the page)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes (login, logout, token refresh) to keep user in sync
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    // Cleanup: unsubscribe when the component unmounts
    return () => subscription.unsubscribe();
  }, []);

  // Sign up a new user — name is stored in user metadata and copied to profiles via DB trigger
  async function signUp(email, password, name) {
    return supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
  }

  // Sign in with email and password — returns { data, error }
  async function signIn(email, password) {
    return supabase.auth.signInWithPassword({ email, password });
  }

  // Sign out the current user
  async function signOut() {
    return supabase.auth.signOut();
  }

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to access auth context from any component
export function useAuth() {
  return useContext(AuthContext);
}
