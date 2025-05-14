import { create } from 'zustand'

interface WalletState {
  address: string | null
  balance: string | null
  isConnected: boolean
  setAddress: (address: string | null) => void
  setBalance: (balance: string | null) => void
  setConnected: (status: boolean) => void
  disconnect: () => void
}

const useWalletStore = create<WalletState>((set) => ({
  address: null,
  balance: null,
  isConnected: false,

  setAddress: (address) => set({ address }),
  setBalance: (balance) => set({ balance }),
  setConnected: (status) => set({ isConnected: status }),

  disconnect: () =>
    set({
      address: null,
      balance: null,
      isConnected: false,
    }),
}))

export default useWalletStore
