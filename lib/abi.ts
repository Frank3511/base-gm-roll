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
    name: 'userGMs',
    stateMutability: 'view',
    inputs: [{ name: '', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'totalGMs',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'event',
    name: 'GMSent',
    inputs: [
      { indexed: true, name: 'user', type: 'address' },
      { indexed: false, name: 'userGMs', type: 'uint256' },
      { indexed: false, name: 'totalGMs', type: 'uint256' },
    ],
    anonymous: false,
  },
] as const
