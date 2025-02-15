
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useQuery } from "@tanstack/react-query";

interface AuthContextType {
  session: Session | null;
  loading: boolean;
  userRole: string | null;
}

const AuthContext = createContext<AuthContextType>({ 
  session: null, 
  loading: true,
  userRole: null 
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch user role
  const { data: roleData } = useQuery({
    queryKey: ['user-role', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id
  });

  // Create or update user settings on authentication
  const initializeUserSettings = async (userId: string) => {
    const { error } = await supabase
      .from('user_settings')
      .upsert({
        user_id: userId,
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error initializing user settings:', error);
    }
  };

  useEffect(() => {
    if (roleData) {
      setUserRole(roleData.role);
    }
  }, [roleData]);

  useEffect(() => {
    // Refresh token function
    const refreshToken = async () => {
      const { data: { session: newSession }, error } = await supabase.auth.refreshSession();
      if (error) {
        console.error('Error refreshing token:', error);
        toast({
          title: "Session Error",
          description: "Please sign in again",
          variant: "destructive",
        });
        navigate("/auth");
      } else if (newSession) {
        setSession(newSession);
        if (newSession.user?.id) {
          initializeUserSettings(newSession.user.id);
        }
      }
    };

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user?.id) {
        initializeUserSettings(session.user.id);
      }
      setLoading(false);

      // Set up token refresh interval
      const tokenRefreshInterval = setInterval(() => {
        if (session) {
          refreshToken();
        }
      }, 3600000); // Refresh token every hour

      return () => clearInterval(tokenRefreshInterval);
    }).catch((error) => {
      console.error("Error getting session:", error);
      setLoading(false);
      toast({
        title: "Authentication Error",
        description: "Please try logging in again",
        variant: "destructive",
      });
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (!session) {
        navigate("/auth");
      } else if (session.user?.id) {
        initializeUserSettings(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  return (
    <>
      <AuthContext.Provider value={{ session, loading, userRole }}>
        {children}
      </AuthContext.Provider>
      <Toaster />
    </>
  );
};
