import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    const checkRole = async (userId: string) => {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();
      return !!data;
    };

    const handleUser = async (currentUser: User | null) => {
      setUser(currentUser);
      if (currentUser) {
        const admin = await checkRole(currentUser.id);
        setIsAdmin(admin);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    };

    // Get initial session first
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!initialized.current) {
        initialized.current = true;
        handleUser(session?.user ?? null);
      }
    });

    // Listen for subsequent changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (initialized.current && _event !== "INITIAL_SESSION") {
          setLoading(true);
          await handleUser(session?.user ?? null);
        } else if (!initialized.current) {
          initialized.current = true;
          await handleUser(session?.user ?? null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = (email: string, password: string) =>
    supabase.auth.signInWithPassword({ email, password });

  const signOut = () => supabase.auth.signOut();

  return { user, loading, isAdmin, signIn, signOut };
}
