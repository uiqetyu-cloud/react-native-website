import React from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../state/authStore';
import { Studio } from '../../scene/Studio';
import { AIPrompt } from '../../ai/AIPrompt';

export function MinipadShell(): React.ReactElement {
  const userName = useAuthStore((s) => s.userName);
  const logout = useAuthStore((s) => s.logout);

  return (
    <div className="min-h-dvh grid grid-rows-[auto_1fr]">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-black/30 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded-md bg-gradient-to-br from-brand-500 to-cyan-400" />
            <div className="font-semibold">Minipad</div>
            <div className="text-xs text-neutral-400">AI-linked 3D modeling</div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-neutral-300">{userName}</span>
            <button onClick={logout} className="text-xs text-neutral-400 hover:text-white">Logout</button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl w-full grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4 p-4">
        <motion.section
          className="rounded-xl overflow-hidden border border-white/10 bg-black/20"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          <Studio />
        </motion.section>
        <aside className="space-y-4">
          <AIPrompt />
          <div className="rounded-xl border border-white/10 bg-black/20 p-3">
            <h3 className="font-medium mb-2">Export</h3>
            <p className="text-xs text-neutral-400 mb-3">Download current scene as GLB.</p>
            <button id="export-glb" className="w-full rounded-md bg-white/10 py-2 text-sm hover:bg-white/20">Export GLB</button>
          </div>
        </aside>
      </main>
    </div>
  );
}
