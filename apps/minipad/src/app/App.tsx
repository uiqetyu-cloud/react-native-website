import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuthStore } from '../state/authStore';
import { Login } from '../components/auth/Login';
import { MinipadShell } from '../components/ui/MinipadShell';

export default function App(): React.ReactElement {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <div className="min-h-dvh bg-neutral-950 bg-animated">
      <AnimatePresence mode="wait">
        {!isAuthenticated ? (
          <motion.div
            key="login"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="flex items-center justify-center min-h-dvh p-4"
          >
            <Login />
          </motion.div>
        ) : (
          <motion.div
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <MinipadShell />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
