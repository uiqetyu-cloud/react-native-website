import { create } from 'zustand';
import { MeshStandardMaterial, Object3D } from 'three';
import { GLTFExporter } from 'three-stdlib';

export type SceneItem = {
  id: string;
  kind: 'box' | 'sphere' | 'torus' | 'donut' | 'pedestal';
  color: string;
  position: [number, number, number];
};

interface SceneState {
  items: SceneItem[];
  isBusy: boolean;
  addFromPrompt: (prompt: string) => Promise<void>;
  clear: () => void;
  exportGlb: (root: Object3D) => Promise<Blob>;
}

function id(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

export const useSceneStore = create<SceneState>((set, get) => ({
  items: [
    { id: id('box'), kind: 'box', color: '#93c5fd', position: [-1.4, 0.5, 0] },
    { id: id('sphere'), kind: 'sphere', color: '#fca5a5', position: [1.2, 0.6, 0.2] },
  ],
  isBusy: false,
  clear: () => set({ items: [] }),
  addFromPrompt: async (prompt: string) => {
    set({ isBusy: true });
    await new Promise((r) => setTimeout(r, 800));
    const p = prompt.toLowerCase();
    const newItems: SceneItem[] = [];
    if (p.includes('donut') || p.includes('torus')) {
      newItems.push({ id: id('donut'), kind: 'donut', color: '#f472b6', position: [0, 0.9, 0] });
    } else if (p.includes('sphere') || p.includes('ball')) {
      newItems.push({ id: id('sphere'), kind: 'sphere', color: '#60a5fa', position: [0, 0.6, 0] });
    } else if (p.includes('box') || p.includes('cube')) {
      newItems.push({ id: id('box'), kind: 'box', color: '#34d399', position: [0, 0.5, 0] });
    }
    if (p.includes('pedestal') || p.includes('stand')) {
      newItems.push({ id: id('ped'), kind: 'pedestal', color: '#d1d5db', position: [0, 0.2, 0] });
    }
    if (newItems.length === 0) {
      newItems.push({ id: id('box'), kind: 'box', color: '#c084fc', position: [0, 0.5, 0] });
    }
    set({ items: [...get().items, ...newItems], isBusy: false });
  },
  exportGlb: async (root: Object3D) => {
    const exporter = new GLTFExporter();
    const scene = root.clone(true);
    scene.traverse((obj) => {
      const anyObj = obj as any;
      if (anyObj.material && anyObj.material instanceof MeshStandardMaterial) {
        anyObj.material.metalness = 0.2;
        anyObj.material.roughness = 0.6;
      }
    });
    return new Promise<Blob>((resolve, reject) => {
      try {
        exporter.parse(
          scene,
          (gltf) => {
            const blob = new Blob([gltf as ArrayBuffer], { type: 'model/gltf-binary' });
            resolve(blob);
          },
          { binary: true }
        );
      } catch (e) {
        reject(e);
      }
    });
  },
}));
