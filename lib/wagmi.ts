'use client'

import { QueryClient } from '@tanstack/react-query'
import { Attribution } from 'ox/erc8021'
import { createConfig, http } from 'wagmi'
import { base } from 'wagmi/chains'
import { coinbaseWallet, injected } from 'wagmi/connectors'
import type { Address, Hex } from 'viem'

export const baseRpcUrl =
  process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://mainnet.base.org'

export const contractAddress = (
  /^0x[a-fA-F0-9]{40}$/.test(
    process.env.NEXT_PUBLIC_BASE_GM_ROLL_ADDRESS ?? '',
  )
    ? process.env.NEXT_PUBLIC_BASE_GM_ROLL_ADDRESS
    : undefined
) as Address | undefined

export const builderCode = ''

export const dataSuffix = (builderCode
  ? Attribution.toDataSuffix({
      codes: [builderCode],
    })
  : '0x') as Hex

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
  dataSuffix,
  ssr: true,
  transports: {
    [base.id]: http(baseRpcUrl),
  },
})
