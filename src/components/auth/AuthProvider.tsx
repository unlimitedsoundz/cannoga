"use client";

import { createContext, useContext, useEffect, useState, useRef } from "react";
import { User, Session } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

interface AuthContextType {
    user: User | null;
    session: Session | null;
    isLoading: boolean;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    session: null,
    isLoading: true,
    signOut: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const supabaseRef = useRef<any>(null);

    useEffect(() => {
        if (!supabaseRef.current) {
            supabaseRef.current = createClient();
        }
        const supabase = supabaseRef.current;

        const initializeAuth = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                setSession(session);
                setUser(session?.user ?? null);
            } catch (error) {
                console.error("Error checking session:", error);
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: string, session: any) => {
            setSession(session);
            setUser(session?.user ?? null);
            setIsLoading(false);

            if (_event === 'SIGNED_OUT') {
                const pathname = window.location.pathname;
                if (!pathname.startsWith('/admin') && !pathname.startsWith('/portal') && !pathname.startsWith('/sis')) {
                    router.push('/portal/account/login/');
                }
            }
        });

        return () => subscription.unsubscribe();
    }, [router]);

    const signOut = async () => {
        if (!supabaseRef.current) return;
        await supabaseRef.current.auth.signOut();
        localStorage.removeItem('Cannoga_user');
        router.push('/');
        router.refresh();
    };

    return (
        <AuthContext.Provider value={{ user, session, isLoading, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}