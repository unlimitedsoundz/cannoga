"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";

export default function AuthGuard({ children, requiredRole }: { children: React.ReactNode, requiredRole?: string }) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/portal/account/login");
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0a151a]"></div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return <>{children}</>;
}

