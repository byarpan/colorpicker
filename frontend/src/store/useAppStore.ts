import { create } from 'zustand';

interface AppState {
  address: string | null;
  storedColor: string | null;
  selectedColor: string;
  loading: boolean;
  saving: boolean;
  setAddress: (address: string | null) => void;
  setStoredColor: (color: string | null) => void;
  setSelectedColor: (color: string) => void;
  setLoading: (loading: boolean) => void;
  setSaving: (saving: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  address: null,
  storedColor: null,
  selectedColor: '#a855f7',
  loading: false,
  saving: false,
  setAddress: (address) => set({ address }),
  setStoredColor: (color) => set({ storedColor: color }),
  setSelectedColor: (color) => set({ selectedColor: color }),
  setLoading: (loading) => set({ loading }),
  setSaving: (saving) => set({ saving }),
}));
