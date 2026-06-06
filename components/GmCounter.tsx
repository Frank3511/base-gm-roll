'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  CheckCircle2,
  CircleAlert,
  Newspaper,
  PlugZap,
  Send,
  X,
} from 'lucide-react'
import {
  useAccount,
  useChainId,
  useConnect,
  useDisconnect,
  useReadContract,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi'
import { base } from 'wagmi/chains'
import { baseGmRollAbi } from '@/lib/abi'
import { contractAddress, dataSuffix } from '@/lib/wagmi'

type ActionState =
  | 'Ready'
  | 'Connect a wallet'
  | 'Contract address missing'
  | 'Switching to Base'
  | 'Waiting for wallet'
  | 'Transaction pending'
  | 'GM recorded'
  | 'Transaction failed'

const formatCount = (value?: bigint) =>
  typeof value === 'bigint' ? value.toLocaleString('en-US') : '0'

const shortAddress = (address?: string) =>
  address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not connected'

const shortHash = (hash?: string) =>
  hash ? `${hash.slice(0, 10)}...${hash.slice(-8)}` : 'No transaction yet'

export function GmCounter() {
  const [walletOpen, setWalletOpen] = useState(false)
  const [actionState, setActionState] = useState<ActionState>(
    contractAddress ? 'Connect a wallet' : 'Contract address missing',
  )

  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { disconnect } = useDisconnect()
  const { switchChainAsync, isPending: switching } = useSwitchChain()
  const { connect, connectors, isPending: connecting } = useConnect({
    mutation: {
      onSuccess: () => {
        setWalletOpen(false)
        setActionState(contractAddress ? 'Ready' : 'Contract address missing')
      },
      onError: () => setActionState('Transaction failed'),
    },
  })

  const {
    writeContractAsync,
    data: lastHash,
    error: writeError,
    isPending: writing,
  } = useWriteContract()

  const {
    isLoading: confirming,
    isSuccess: confirmed,
    error: receiptError,
  } = useWaitForTransactionReceipt({
    hash: lastHash,
    query: { enabled: Boolean(lastHash) },
  })

  const { data: totalGMs, refetch: refetchTotal } = useReadContract({
    address: contractAddress,
    abi: baseGmRollAbi,
    functionName: 'totalGMs',
    query: { enabled: Boolean(contractAddress) },
  })

  const { data: myGMs, refetch: refetchMine } = useReadContract({
    address: contractAddress,
    abi: baseGmRollAbi,
    functionName: 'userGMs',
    args: address ? [address] : undefined,
    query: { enabled: Boolean(contractAddress && address) },
  })

  const walletOptions = useMemo(
    () =>
      connectors.filter((connector) => {
        const id = connector.id.toLowerCase()
        return id.includes('coinbase') || id.includes('injected')
      }),
    [connectors],
  )

  const walletStatus = isConnected
    ? chainId === base.id
      ? `Connected: ${shortAddress(address)}`
      : `Wrong network: ${shortAddress(address)}`
    : 'Not connected'

  const latestState: ActionState = receiptError
    ? 'Transaction failed'
    : confirmed
      ? 'GM recorded'
      : confirming
        ? 'Transaction pending'
        : actionState

  const canSend =
    Boolean(contractAddress) &&
    isConnected &&
    !writing &&
    !confirming &&
    !switching

  const sendGM = async () => {
    if (!contractAddress) {
      setActionState('Contract address missing')
      return
    }

    if (!isConnected) {
      setActionState('Connect a wallet')
      setWalletOpen(true)
      return
    }

    try {
      if (chainId !== base.id) {
        setActionState('Switching to Base')
        await switchChainAsync({ chainId: base.id })
      }

      setActionState('Waiting for wallet')
      await writeContractAsync({
        address: contractAddress,
        abi: baseGmRollAbi,
        functionName: 'sayGM',
        dataSuffix,
      })
      setActionState('Transaction pending')
    } catch {
      setActionState('Transaction failed')
    }
  }

  useEffect(() => {
    if (!confirmed) return
    void Promise.all([refetchTotal(), refetchMine()])
  }, [confirmed, refetchMine, refetchTotal])

  const errorText = writeError?.message ?? receiptError?.message

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(255,203,90,0.18),transparent_31%),#f4efe2] px-0 text-[#4c473d] sm:px-5">
      <section className="mx-auto min-h-screen w-full max-w-[760px] border-[#24211c2e] bg-[linear-gradient(90deg,rgba(0,82,255,0.035)_1px,transparent_1px)_0_0/28px_28px,#fffaf0] px-4 py-4 sm:border-x sm:px-6 sm:py-6">
        <header className="border-b border-[#24211c2e] pb-4">
          <div className="flex items-center justify-between gap-3 font-mono text-[11px] font-bold uppercase leading-none text-[#7a7165]">
            <span>Onchain GM Counter</span>
            <span>Base Network</span>
          </div>

          <div className="mt-4 flex items-center justify-between gap-4">
            <div>
              <p className="mb-1 font-mono text-xs font-bold uppercase leading-none text-[#0052ff]">
                Clean Morning Ledger
              </p>
              <h1 className="font-serif text-[42px] font-black leading-[0.92] text-[#24211c] sm:text-[76px]">
                Base GM Roll
              </h1>
            </div>
            <div
              className="grid aspect-square w-[58px] shrink-0 place-items-center rounded-full border border-[#24211c] bg-[#ffcb5a] sm:w-[74px]"
              aria-hidden="true"
            >
              <span className="aspect-square w-7 rounded-full bg-[#0052ff]" />
            </div>
          </div>
        </header>

        <section className="flex flex-col gap-4 border-b border-[#24211c2e] py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 text-[15px] text-[#4c473d]">
            <Newspaper className="h-[18px] w-[18px] shrink-0" aria-hidden />
            <p>Every GM is written onchain. No tokens, rewards, fees, or daily cap.</p>
          </div>

          <button
            type="button"
            onClick={() => (isConnected ? disconnect() : setWalletOpen(true))}
            className="flex min-h-10 items-center justify-center gap-2 rounded-md border border-[#24211c] bg-[#fffaf0] px-4 font-medium text-[#24211c] transition hover:-translate-y-0.5"
          >
            <PlugZap className="h-[18px] w-[18px]" aria-hidden />
            {isConnected ? 'Disconnect' : 'Connect Wallet'}
          </button>
        </section>

        <section className="grid border-b border-[#24211c2e] sm:grid-cols-2">
          <article className="min-h-36 border-b border-[#24211c2e] py-5 sm:min-h-44 sm:border-b-0 sm:border-r sm:pr-5">
            <span className="mb-4 block font-mono text-xs font-bold uppercase leading-none text-[#7a7165]">
              My GM Count
            </span>
            <strong className="block overflow-wrap-anywhere font-serif text-[54px] font-black leading-[0.9] text-[#24211c] sm:text-[104px]">
              {formatCount(myGMs)}
            </strong>
          </article>

          <article className="min-h-36 py-5 sm:min-h-44 sm:pl-5">
            <span className="mb-4 block font-mono text-xs font-bold uppercase leading-none text-[#7a7165]">
              Total GM
            </span>
            <strong className="block overflow-wrap-anywhere font-serif text-[54px] font-black leading-[0.9] text-[#24211c] sm:text-[104px]">
              {formatCount(totalGMs)}
            </strong>
          </article>
        </section>

        <section className="flex flex-col gap-4 border-b border-[#24211c2e] py-5 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            disabled={!canSend && isConnected}
            onClick={sendGM}
            className="flex min-h-14 items-center justify-center gap-3 rounded-md border border-[#24211c] bg-[#0052ff] px-6 font-extrabold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 sm:min-w-44"
          >
            <Send className="h-[18px] w-[18px]" aria-hidden />
            {writing || confirming ? 'Sending GM' : 'Say GM'}
          </button>

          <div className="flex min-w-0 items-center gap-2 font-bold text-[#4c473d]">
            {confirmed ? (
              <CheckCircle2 className="h-[18px] w-[18px] shrink-0 text-[#0052ff]" aria-hidden />
            ) : (
              <CircleAlert className="h-[18px] w-[18px] shrink-0 text-[#0052ff]" aria-hidden />
            )}
            <span className="break-words">{latestState}</span>
          </div>
        </section>

        <section className="mt-5 grid border-t border-[#24211c]">
          {[
            ['Wallet Status', walletStatus],
            ['Last Transaction', shortHash(lastHash)],
            ['Last Transaction Status', latestState],
          ].map(([label, value]) => (
            <div
              className="grid gap-2 border-b border-[#24211c2e] py-3 text-left sm:grid-cols-[minmax(132px,0.8fr)_minmax(0,1.2fr)] sm:gap-4"
              key={label}
            >
              <span className="font-mono text-xs font-bold uppercase leading-tight text-[#7a7165]">
                {label}
              </span>
              <strong className="min-w-0 break-words text-sm text-[#24211c]">
                {value}
              </strong>
            </div>
          ))}
        </section>

        {!contractAddress && (
          <p className="mt-4 rounded-md border border-[#0052ff47] bg-[#ffcb5a3d] p-3 text-sm text-[#24211c]">
            Set NEXT_PUBLIC_BASE_GM_ROLL_ADDRESS before production deployment.
          </p>
        )}

        {errorText && (
          <p className="mt-4 rounded-md border border-[#0052ff47] bg-[#ffcb5a3d] p-3 text-sm text-[#24211c]">
            {errorText}
          </p>
        )}
      </section>

      {walletOpen && (
        <div className="fixed inset-0 grid place-items-center bg-[#1f1e1942] p-5">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="wallet-title"
            className="w-full max-w-sm rounded-lg border border-[#24211c] bg-[#fffaf0] shadow-2xl"
          >
            <div className="flex items-center justify-between gap-3 border-b border-[#24211c2e] p-4">
              <h2
                id="wallet-title"
                className="font-serif text-3xl font-black leading-none text-[#24211c]"
              >
                Choose Wallet
              </h2>
              <button
                type="button"
                aria-label="Close wallet dialog"
                onClick={() => setWalletOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-full border border-[#24211c] text-[#24211c]"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </div>

            <div className="grid gap-3 p-4">
              {walletOptions.map((connector) => (
                <button
                  type="button"
                  key={connector.uid}
                  disabled={connecting}
                  onClick={() => connect({ connector })}
                  className="grid gap-1 rounded-md border border-[#24211c] bg-[#fffaf0] p-3 text-left transition hover:-translate-y-0.5 disabled:opacity-60"
                >
                  <span className="font-extrabold text-[#24211c]">
                    {connector.name}
                  </span>
                  <small className="font-mono text-[11px] font-bold leading-none text-[#7a7165]">
                    {connector.id}
                  </small>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
