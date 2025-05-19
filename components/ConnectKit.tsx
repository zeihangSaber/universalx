'use client'

import React from 'react'
import { ConnectKitProvider, createConfig } from '@particle-network/connectkit'
import { authWalletConnectors } from '@particle-network/connectkit/auth'
import { mainnet, bsc, sepolia, solana, solanaTestnet, baseSepolia, tron } from '@particle-network/connectkit/chains'
import { evmWalletConnectors } from '@particle-network/connectkit/evm'
import { wallet, EntryPosition } from '@particle-network/connectkit/wallet'
import { aa } from '@particle-network/connectkit/aa'

import { injected, solanaWalletConnectors } from '@particle-network/connectkit/solana'

// @ts-expect-error
tron.nativeCurrency.decimals = 18

const config = createConfig({
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID!,
  clientKey: process.env.NEXT_PUBLIC_CLIENT_KEY!,
  appId: process.env.NEXT_PUBLIC_APP_ID!,
  appearance: {
    splitEmailAndPhone: false,
    collapseWalletList: false,
    hideContinueButton: false,
    mode: 'light',
    connectorsOrder: ['wallet', 'social'],
  },
  walletConnectors: [
    authWalletConnectors({
      language: 'zh-cn',
      fiatCoin: 'CNY',
    }),
    solanaWalletConnectors({
      connectorFns: [injected({ target: 'phantom' })],
    }),
    evmWalletConnectors({
      walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
    }),
  ],
  plugins: [
    wallet({
      entryPosition: EntryPosition.BR,
      visible: true,
    }),
    // aa({
    //   name: 'BICONOMY',
    //   version: '2.0.0', // 使用Biconomy实现AA功能
    // }),
  ],

  chains: [mainnet, sepolia, bsc, solana, solanaTestnet, baseSepolia, tron],
})

console.log('🚀 ~ tron:~~~~~~~~~~~~~~~~~~~~~~~', tron)

export const ParticleConnectKit = ({ children }: React.PropsWithChildren) => {
  return <ConnectKitProvider config={config}>{children}</ConnectKitProvider>
}
