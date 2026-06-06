import { useEffect, useMemo, useState } from 'react'
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
import { CheckCircle2, CircleAlert, Newspaper, PlugZap, Send } from 'lucide-react'
import { baseGmRollAbi, attributionSuffix, contractAddress } from './contracts'
import './App.css'

type ActionState =
  | 'Ready'
  | 'Connect a wallet'
  | 'Contract address missing'
  | 'Switching to Base'
  | 'Waiting for wallet'
  | 'Transaction submitted'
  | 'GM recorded'
  | 'Action failed'

const formatCount = (value?: bigint) =>
  typeof value === 'bigint' ? value.toLocaleString('en-US') : '0'

const shortAddress = (address?: string) =>
  address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not connected'

const shortHash = (hash?: string) =>
  hash ? `${hash.slice(0, 10)}...${hash.slice(-8)}` : 'No transaction yet'

function App() {
  const [isWalletDialogOpen, setIsWalletDialogOpen] = useState(false)
  const [actionState, setActionState] = useState<ActionState>(
    contractAddress ? 'Connect a wallet' : 'Contract address missing',
  )
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { connect, connectors, isPending: isConnecting } = useConnect({
    mutation: {
      onSuccess: () => {
        setIsWalletDialogOpen(false)
        setActionState(contractAddress ? 'Ready' : 'Contract address missing')
      },
      onError: () => setActionState('Action failed'),
    },
  })
  const { disconnect } = useDisconnect()
  const { switchChainAsync, isPending: isSwitching } = useSwitchChain()
  const {
    writeContractAsync,
    data: transactionHash,
    error: writeError,
    isPending: isWriting,
  } = useWriteContract()

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: receiptError,
  } = useWaitForTransactionReceipt({
    hash: transactionHash,
    query: { enabled: Boolean(transactionHash) },
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

  const visibleConnectors = useMemo(
    () =>
      connectors.filter((connector) => {
        const id = connector.id.toLowerCase()
        return id.includes('coinbase') || id.includes('injected')
      }),
    [connectors],
  )

  const statusText = isConnected
    ? chainId === base.id
      ? `Connected: ${shortAddress(address)}`
      : `Wrong network: ${shortAddress(address)}`
    : 'Not connected'

  const latestActionState: ActionState = receiptError
    ? 'Action failed'
    : isConfirmed
      ? 'GM recorded'
      : actionState

  const canSayGm =
    Boolean(contractAddress) &&
    isConnected &&
    !isWriting &&
    !isConfirming &&
    !isSwitching

  const handleSayGM = async () => {
    if (!contractAddress) {
      setActionState('Contract address missing')
      return
    }
    if (!isConnected) {
      setActionState('Connect a wallet')
      setIsWalletDialogOpen(true)
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
        dataSuffix: attributionSuffix,
      })
      setActionState('Transaction submitted')
    } catch {
      setActionState('Action failed')
    }
  }

  const errorText = writeError?.message ?? receiptError?.message

  useEffect(() => {
    if (!isConfirmed) return
    void Promise.all([refetchTotal(), refetchMine()])
  }, [isConfirmed, refetchMine, refetchTotal])

  return (
    <main className="newspaper-shell">
      <header className="masthead">
        <div className="edition-line">
          <span>Onchain GM Counter</span>
          <span>Base Network</span>
        </div>
        <div className="title-row">
          <div>
            <p className="kicker">Clean Morning Ledger</p>
            <h1>Base GM Roll</h1>
          </div>
          <div className="sun-mark" aria-hidden="true">
            <span />
          </div>
        </div>
      </header>

      <section className="lead-strip">
        <div className="lead-copy">
          <Newspaper aria-hidden="true" />
          <p>Every GM is written onchain. No daily cap, no rewards, no tokens.</p>
        </div>
        <button
          className="wallet-button"
          type="button"
          onClick={() =>
            isConnected ? disconnect() : setIsWalletDialogOpen(true)
          }
        >
          <PlugZap aria-hidden="true" />
          {isConnected ? 'Disconnect' : 'Connect Wallet'}
        </button>
      </section>

      <section className="counter-grid" aria-label="GM counters">
        <article className="counter-panel primary">
          <span className="label">My GM Count</span>
          <strong>{formatCount(myGMs)}</strong>
        </article>
        <article className="counter-panel">
          <span className="label">Total GM</span>
          <strong>{formatCount(totalGMs)}</strong>
        </article>
      </section>

      <section className="action-band">
        <button
          className="say-button"
          type="button"
          disabled={!canSayGm && isConnected}
          onClick={handleSayGM}
        >
          <Send aria-hidden="true" />
          {isWriting || isConfirming ? 'Sending GM' : 'Say GM'}
        </button>
        <div className="state-note">
          {isConfirmed ? (
            <CheckCircle2 aria-hidden="true" />
          ) : (
            <CircleAlert aria-hidden="true" />
          )}
          <span>{latestActionState}</span>
        </div>
      </section>

      <section className="status-table" aria-label="Status details">
        <div>
          <span>Wallet Status</span>
          <strong>{statusText}</strong>
        </div>
        <div>
          <span>Last Transaction</span>
          <strong>{shortHash(transactionHash)}</strong>
        </div>
        <div>
          <span>Latest Action State</span>
          <strong>{latestActionState}</strong>
        </div>
      </section>

      {!contractAddress && (
        <p className="setup-warning">
          Set VITE_BASE_GM_ROLL_ADDRESS before production deployment.
        </p>
      )}

      {errorText && <p className="setup-warning">{errorText}</p>}

      {isWalletDialogOpen && (
        <div className="dialog-backdrop" role="presentation">
          <div
            className="wallet-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="wallet-title"
          >
            <div className="dialog-heading">
              <h2 id="wallet-title">Choose Wallet</h2>
              <button
                type="button"
                className="close-button"
                onClick={() => setIsWalletDialogOpen(false)}
                aria-label="Close wallet dialog"
              >
                x
              </button>
            </div>
            <div className="wallet-options">
              {visibleConnectors.map((connector) => (
                <button
                  type="button"
                  key={connector.uid}
                  disabled={isConnecting}
                  onClick={() => connect({ connector })}
                >
                  <span>{connector.name}</span>
                  <small>{connector.id}</small>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default App
