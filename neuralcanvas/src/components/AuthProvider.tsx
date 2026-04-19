// src/components/AuthProvider.tsx
"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { supabase } from "@/lib/supabaseClient";

interface AuthUser {
    id: string;
    email: string;
    name: string;
    avatar?: string;
}

interface AuthContextType {
    user: AuthUser | null;
    loading: boolean;
    signOut: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    signOut: async () => {},
    refreshUser: async () => {},
});

export function useAuth() {
    return useContext(AuthContext);
}

export default function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    const syncUser = useCallback((supaUser: any) => {
        if (supaUser) {
            const authUser: AuthUser = {
                id: supaUser.id,
                email: supaUser.email || "",
                name: supaUser.user_metadata?.full_name || supaUser.email?.split("@")[0] || "User",
                avatar: supaUser.user_metadata?.avatar_url,
            };
            setUser(authUser);
            localStorage.setItem("user", JSON.stringify(authUser));
        } else {
            setUser(null);
            localStorage.removeItem("user");
        }
    }, []);

    const refreshUser = useCallback(async () => {
        try {
            const { data: { user: supaUser } } = await supabase.auth.getUser();
            syncUser(supaUser);
        } catch {
            // Try localStorage fallback
            const stored = localStorage.getItem("user");
            if (stored) {
                try { setUser(JSON.parse(stored)); } catch { setUser(null); }
            }
        }
    }, [syncUser]);

    useEffect(() => {
        // Initial load
        const initialize = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                syncUser(session?.user || null);
            } catch {
                const stored = localStorage.getItem("user");
                if (stored) {
                    try { setUser(JSON.parse(stored)); } catch { /* empty */ }
                }
            } finally {
                setLoading(false);
            }
        };

        initialize();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event: string, session: any) => {
                syncUser(session?.user || null);
                setLoading(false);
            }
        );

        return () => {
            subscription?.unsubscribe();
        };
    }, [syncUser]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        localStorage.removeItem("user");
        window.location.href = "/";
    };

    return (
        <AuthContext.Provider value={{ user, loading, signOut: handleSignOut, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}
