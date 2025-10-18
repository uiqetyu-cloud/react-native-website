import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../state/authStore';

export function Login(): React.ReactElement {
  const login = useAuthStore((s) => s.login);
  const [name, setName] = useState('');

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length > 0) login(name.trim());
  };

  return (
    <motion.div
      className="glass w-full max-w-md rounded-2xl p-6 md:p-8"
      initial={{ y: 12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 text-2xl font-semibold tracking-tight">
          <span className="relative">
            <span className="absolute inset-0 blur-md opacity-70 bg-gradient-to-r from-brand-500 to-cyan-400 rounded-full" />
            <span className="relative z-10">Minipad</span>
          </span>
        </div>
        <p className="mt-2 text-neutral-300 text-sm">AI-linked 3D modeling playground</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm text-neutral-300">Your name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ada Lovelace"
            className="w-full rounded-lg bg-black/30 border border-white/15 px-3 py-2 outline-none focus:ring-2 focus:ring-brand-500/70"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-lg bg-gradient-to-r from-brand-600 to-cyan-500 py-2 font-medium hover:from-brand-500 hover:to-cyan-400 transition-colors"
        >
          Continue
        </button>
      </form>

      <div className="mt-6 text-xs text-neutral-400">
        Tip: Use the AI prompt later to create shapes quickly.
      </div>
    </motion.div>
  );
}
