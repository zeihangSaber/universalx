import type { ethers, TransactionRequest, BrowserProvider } from 'ethers'
import { getOption } from './tool'

const url = 'https://rpc.particle.network/evm-chain'

const inchParams = [
  '0x36CC465C456ef53d707D0DEB55680E83273966d7',
  {
    tokenAddress: '0x111111111117dc0aa78b770fa6a738034120c302', // from token address
    amount: '1000000000',
  },
]

export const sendTransaction = async (provider: BrowserProvider, tx: TransactionRequest) => {
  const signer = await provider.getSigner()
  const address = await signer.getAddress()

  // 使用AA钱包发送交易
  const txResponse = await signer.sendTransaction(tx)

  const receipt = await txResponse.wait()

  console.log('🚀 ~ sendTransaction ~ receipt:', receipt)

  return receipt

  return
}

export const checkApprove = async (params: unknown[] = inchParams, chainId: number = 1) => {
  return await realFetch(url, 'particle_swap_checkApprove', params, chainId)
}

export const getQuote = async (
  params: unknown[] = [
    '0x369aa8a7a7BE683E1a46d9A056806B2B3FD778C8', // wallet address
    {
      fromTokenAddress: '0x111111111117dc0aa78b770fa6a738034120c302',
      toTokenAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      amount: '10000',
    },
  ],
  chainId: number = 1
) => {
  return await realFetch(url, 'particle_swap_getQuote', params, chainId)
}

export const getSwap = async (
  params: unknown[] = [
    '0x369aa8a7a7BE683E1a46d9A056806B2B3FD778C8',
    {
      fromTokenAddress: '0x111111111117dc0aa78b770fa6a738034120c302',
      toTokenAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      amount: '1000000000',
      slippage: 1,
    },
  ],
  chainId: number = 1
) => {
  return await realFetch(url, 'particle_swap_getSwap', params, chainId)
}

export const realFetch = async (url: string, fnName: string, params: unknown[], chainId: number) => {
  const realParams = getOption(fnName, params, chainId)
  console.log('🚀 ~ realFetch ~ realParams:', realParams)
  return await fetch(url, realParams).then((res) => res.json())
}
