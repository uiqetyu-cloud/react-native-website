import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSceneStore } from '../scene/sceneStore';

export function AIPrompt(): React.ReactElement {
  const [prompt, setPrompt] = useState('a glossy pink donut on a pedestal');
  const addFromPrompt = useSceneStore((s) => s.addFromPrompt);
  const isBusy = useSceneStore((s) => s.isBusy);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addFromPrompt(prompt);
  };

  return (
    <motion.div
      className="rounded-xl border border-white/10 bg-black/20 p-3"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <h3 className="font-medium mb-2">AI Prompt</h3>
      <form onSubmit={onSubmit} className="space-y-2">
        <input
          className="w-full rounded-md bg-white/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500/70"
          placeholder="Describe a 3D shape..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button
          type="submit"
          disabled={isBusy}
          className="w-full rounded-md bg-gradient-to-r from-brand-600 to-cyan-500 py-2 text-sm disabled:opacity-50"
        >
          {isBusy ? 'Creating…' : 'Create with AI'}
        </button>
      </form>
      <p className="mt-2 text-xs text-neutral-400">This uses a local mock. Wire to your AI later.</p>
    </motion.div>
  );
}
