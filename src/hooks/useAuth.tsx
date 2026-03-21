import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const checkRole = async (userId: string) => {
      const { data, error } = await supabase.rpc("has_role", {
        _user_id: userId,
        _role: "admin",
      });

      if (error) {
        console.error("Role check failed:", error);
        return false;
      }

      return !!data;
    };

    const handleUser = async (currentUser: User | null) => {
      if (!isMounted) return;

      setUser(currentUser);

      if (currentUser) {
        let admin = false;
        try {
          admin = await checkRole(currentUser.id);
        } catch (error) {
          console.error("Unexpected role check error:", error);
        }

        if (!isMounted) return;
        setIsAdmin(admin);
      } else {
        setIsAdmin(false);
      }

      setLoading(false);
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "INITIAL_SESSION") return;

      setLoading(true);
      void handleUser(session?.user ?? null);
    });

    // Initial session
    void supabase.auth
      .getSession()
      .then(({ data: { session }, error }) => {
        if (error) {
          console.error("Session fetch failed:", error);
          return handleUser(null);
        }

        handleUser(session?.user ?? null);
      })
      .catch((error) => {
        console.error("Session initialization error:", error);
        void handleUser(null);
      });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = (email: string, password: string) =>
    supabase.auth.signInWithPassword({ email, password });

  const signOut = () => supabase.auth.signOut();

  return { user, loading, isAdmin, signIn, signOut };
}
