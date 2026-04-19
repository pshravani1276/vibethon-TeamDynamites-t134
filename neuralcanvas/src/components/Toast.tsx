// src/components/Toast.tsx
"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    CheckCircle,
    XCircle,
    AlertTriangle,
    Info,
    X,
} from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
}

interface ToastContextType {
    addToast: (message: string, type?: ToastType, duration?: number) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType>({
    addToast: () => {},
    removeToast: () => {},
});

export function useToast() {
    return useContext(ToastContext);
}

const icons: Record<ToastType, any> = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertTriangle,
    info: Info,
};

const styles: Record<ToastType, string> = {
    success: "bg-emerald-500/15 border-emerald-500/40 text-emerald-300",
    error: "bg-red-500/15 border-red-500/40 text-red-300",
    warning: "bg-amber-500/15 border-amber-500/40 text-amber-300",
    info: "bg-blue-500/15 border-blue-500/40 text-blue-300",
};

const iconColors: Record<ToastType, string> = {
    success: "text-emerald-400",
    error: "text-red-400",
    warning: "text-amber-400",
    info: "text-blue-400",
};

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((message: string, type: ToastType = "info", duration = 4000) => {
        const id = Math.random().toString(36).substring(2) + Date.now().toString(36);
        setToasts((prev) => [...prev, { id, message, type, duration }]);

        if (duration > 0) {
            setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== id));
            }, duration);
        }
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast, removeToast }}>
            {children}
            {/* Toast Container */}
            <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
                <AnimatePresence mode="popLayout">
                    {toasts.map((toast) => {
                        const Icon = icons[toast.type];
                        return (
                            <motion.div
                                key={toast.id}
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, x: 100, scale: 0.95 }}
                                className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl shadow-2xl ${styles[toast.type]}`}
                            >
                                <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColors[toast.type]}`} />
                                <p className="text-sm font-medium flex-1">{toast.message}</p>
                                <button
                                    onClick={() => removeToast(toast.id)}
                                    className="flex-shrink-0 opacity-50 hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}
