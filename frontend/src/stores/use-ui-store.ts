import { create } from 'zustand';

interface UiStoreState {
  isQuickEntryOpen: boolean;
  openQuickEntry: () => void;
  closeQuickEntry: () => void;
}

export const useUiStore = create<UiStoreState>((set) => ({
  isQuickEntryOpen: false,
  openQuickEntry: () => set({ isQuickEntryOpen: true }),
  closeQuickEntry: () => set({ isQuickEntryOpen: false }),
}));
