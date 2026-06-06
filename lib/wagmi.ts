'use client'

import { QueryClient } from '@tanstack/react-query'
import { Attribution } from 'ox/erc8021'
import { createConfig, http } from 'wagmi'
import { base } from 'wagmi/chains'
import { coinbaseWallet, injected } from 'wagmi/connectors'
import type { Address, EIP1193Provider, Hex } from 'viem'
import type { InjectedParameters } from 'wagmi/connectors'

type WalletProvider = EIP1193Provider & {
  isCoinbaseWallet?: true
  isMetaMask?: true
  isOkxWallet?: true
  isOKExWallet?: true
  isRabby?: true
  isTrust?: true
  isTrustWallet?: true
  providers?: WalletProvider[]
}

type WalletWindow = Window & {
  coinbaseWalletExtension?: WalletProvider
  ethereum?: WalletProvider
  okxwallet?: WalletProvider
  trustwallet?: WalletProvider
}

type InjectedTarget = Exclude<InjectedParameters['target'], string | undefined>

function getInjectedProvider(
  windowLike: Window | undefined,
  matcher: (provider: WalletProvider) => boolean,
) {
  const ethereum = (windowLike as WalletWindow | undefined)?.ethereum
  if (!ethereum) return undefined

  const providers = ethereum.providers ?? [ethereum]
  return providers.find(matcher)
}

const anyInjectedWallet = {
  id: 'browser-wallet',
  name: 'Base App / Browser Wallet',
  provider: (windowLike?: Window) => {
    const walletWindow = windowLike as WalletWindow | undefined
    return (
      walletWindow?.ethereum ??
      walletWindow?.coinbaseWalletExtension ??
      walletWindow?.okxwallet ??
      walletWindow?.trustwallet
    )
  },
}

const metaMaskWallet = {
  id: 'metamask',
  name: 'MetaMask',
  provider: (windowLike?: Window) =>
    getInjectedProvider(
      windowLike,
      (provider) =>
        Boolean(provider.isMetaMask) &&
        !provider.isCoinbaseWallet &&
        !provider.isOkxWallet &&
        !provider.isOKExWallet,
    ),
}

const okxWallet = {
  id: 'okx',
  name: 'OKX Wallet',
  provider: (windowLike?: Window) => {
    const walletWindow = windowLike as WalletWindow | undefined
    return (
      walletWindow?.okxwallet ??
      getInjectedProvider(
      windowLike,
      (provider) => Boolean(provider.isOkxWallet || provider.isOKExWallet),
      )
    )
  },
}

const rabbyWallet = {
  id: 'rabby',
  name: 'Rabby Wallet',
  provider: (windowLike?: Window) =>
    getInjectedProvider(windowLike, (provider) => Boolean(provider.isRabby)),
}

const trustWallet = {
  id: 'trust',
  name: 'Trust Wallet',
  provider: (windowLike?: Window) => {
    const walletWindow = windowLike as WalletWindow | undefined
    return (
      walletWindow?.trustwallet ??
      getInjectedProvider(
      windowLike,
      (provider) => Boolean(provider.isTrust || provider.isTrustWallet),
      )
    )
  },
}

const injectedTargets = {
  anyInjectedWallet,
  metaMaskWallet,
  okxWallet,
  rabbyWallet,
  trustWallet,
} as Record<string, InjectedTarget>

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
      unstable_shimAsyncInject: 1_000,
      target: injectedTargets.anyInjectedWallet,
    }),
    injected({
      shimDisconnect: true,
      unstable_shimAsyncInject: 1_000,
      target: injectedTargets.metaMaskWallet,
    }),
    injected({
      shimDisconnect: true,
      unstable_shimAsyncInject: 1_000,
      target: injectedTargets.okxWallet,
    }),
    injected({
      shimDisconnect: true,
      unstable_shimAsyncInject: 1_000,
      target: injectedTargets.rabbyWallet,
    }),
    injected({
      shimDisconnect: true,
      unstable_shimAsyncInject: 1_000,
      target: injectedTargets.trustWallet,
    }),
  ],
  dataSuffix,
  multiInjectedProviderDiscovery: false,
  ssr: true,
  transports: {
    [base.id]: http(baseRpcUrl),
  },
})
