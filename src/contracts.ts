import type { Address, Hex } from 'viem'
import { Attribution } from 'ox/erc8021'

export const baseGmRollAbi = [
  {
    type: 'function',
    name: 'sayGM',
    stateMutability: 'nonpayable',
    inputs: [],
    outputs: [],
  },
  {
    type: 'function',
    name: 'totalGMs',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'userGMs',
    stateMutability: 'view',
    inputs: [{ name: '', type: 'address' }],
    outputs: [{ type: 'uint256' }],
  },
  {
    type: 'event',
    name: 'GMSent',
    inputs: [
      { indexed: true, name: 'user', type: 'address' },
      { indexed: false, name: 'userGMs', type: 'uint256' },
      { indexed: false, name: 'totalGMs', type: 'uint256' },
    ],
  },
] as const

const configuredAddress = import.meta.env.VITE_BASE_GM_ROLL_ADDRESS

export const contractAddress = /^0x[a-fA-F0-9]{40}$/.test(
  configuredAddress ?? '',
)
  ? (configuredAddress as Address)
  : undefined

const builderCode = import.meta.env.VITE_BASE_BUILDER_CODE?.trim()

export const attributionSuffix = builderCode
  ? (Attribution.toDataSuffix({
      codes: [builderCode],
    }) as Hex)
  : undefined
