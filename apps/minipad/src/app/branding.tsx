import React from 'react';

export function Branding(): React.ReactElement {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-brand-500 to-cyan-400" />
      <div className="text-xl font-semibold tracking-tight">Minipad</div>
    </div>
  );
}
