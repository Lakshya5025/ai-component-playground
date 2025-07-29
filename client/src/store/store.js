import { create } from 'zustand';

const useAppStore = create((set) => ({
    // STATE
    user: null,
    sessions: [],
    activeSession: null,

    // ACTIONS
    setUser: (user) => set({ user }),
    setSessions: (sessions) => set({ sessions }),
    setActiveSession: (session) => set({ activeSession: session }),
    clearState: () => set({ user: null, sessions: [], activeSession: null }),
}));

export default useAppStore; // Make sure this line exists and is correct