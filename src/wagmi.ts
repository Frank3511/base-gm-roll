import { QueryClient } from '@tanstack/react-query'
import { base } from 'wagmi/chains'
import { coinbaseWallet, injected } from 'wagmi/connectors'
import { createConfig, http } from 'wagmi'

export const queryClient = new QueryClient()

export const wagmiConfig = createConfig({
  chains: [base],
  connectors: [
    coinbaseWallet({
      appName: 'Base GM Roll',
      preference: 'all',
    }),
    injected({
      shimDisconnect: true,
    }),
  ],
  transports: {
    [base.id]: http(import.meta.env.VITE_BASE_RPC_URL),
  },
})
