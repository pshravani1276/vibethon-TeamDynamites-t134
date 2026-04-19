// src/components/ClientProviders.tsx
"use client";

import { ReactNode } from "react";
import AuthProvider from "@/components/AuthProvider";
import { ToastProvider } from "@/components/Toast";
import ThemeProvider from "@/components/ThemeProvider";

export default function ClientProviders({ children }: { children: ReactNode }) {
    return (
        <ThemeProvider>
            <AuthProvider>
                <ToastProvider>
                    {children}
                </ToastProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}
