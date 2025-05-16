'use strict'
import { TOKENS } from '@/util/configs'
import React, { useEffect, useState } from 'react'
import { useAccount, useSmartAccount, useWallets } from '@particle-network/connectkit'
import { AAWrapProvider, SendTransactionMode } from '@particle-network/aa'
import type { Eip1193Provider } from 'ethers'
import { ethers } from 'ethers'
import { getSwap } from '@/util/api'
import { Address, ETH_Sepolia } from '@/util/tokenAddress'

const Swap: React.FC<{ balance: string; tokenBalances: Record<string, string> }> = ({ balance, tokenBalances }) => {
  // Swap状态
  const [fromToken, setFromToken] = useState<string>()
  const [toToken, setToToken] = useState<string>()
  const [swapAmount, setSwapAmount] = useState<string>('0')
  const [swapTxHash, setSwapTxHash] = useState<string | null>(null)
  const [primaryWallet] = useWallets()
  const { chainId } = useAccount()
  const smartAccount = useSmartAccount()

  const executeSwap = async () => {
    if (!swapAmount || !primaryWallet || !smartAccount) return

    console.log('🚀 ~ executeSwap ~ fromToken:', swapAmount)
    console.log('🚀 ~ executeSwap ~ toToken:', toToken)
    if (!(fromToken && toToken)) {
      alert('请选择要交换的代币')
      return
    }

    if (Number(swapAmount) < 100) {
      alert('Swap数量不能小于100')
      return
    }

    try {
      // 初始化AA Provider
      const customProvider = new ethers.BrowserProvider(
        new AAWrapProvider(smartAccount, SendTransactionMode.Gasless) as Eip1193Provider,
        'any'
      )

      const signer = await customProvider.getSigner()
      const address = await signer.getAddress()

      const { result: swapData } = await getSwap(
        [
          address,
          {
            fromTokenAddress: Address.get(chainId ?? 1)?.[fromToken ?? ''],
            toTokenAddress: Address.get(chainId ?? 1)?.[toToken ?? ''],
            amount: String(swapAmount),
            slippage: 1,
          },
        ],
        chainId
      )

      // // 获取Particle的RPC provider
      // const particleProvider = smartAccount.provider
      // console.log('🚀 ~ executeSwap ~ particleProvider:', particleProvider)

      // 使用AA钱包发送交易
      const txResponse = await signer.sendTransaction({
        to: swapData.tx.to,
        data: swapData.tx.data,
        value: swapData.tx.value || '0x0',
      })

      // 等待交易确认
      const receipt = await txResponse.wait()
      console.log('🚀 ~ executeSwap ~ receipt:', receipt)

      if (receipt) {
        setSwapTxHash(receipt.hash)
      }
    } catch (error) {
      console.error('Error executing swap:', error)
      alert(`Swap失败: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  useEffect(() => {
    if (chainId) {
      setFromToken(TOKENS.get(chainId)?.[0]?.symbol)
      setToToken(TOKENS.get(chainId)?.[1]?.symbol)
    }
  }, [chainId])

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">从</label>
          <select
            className="w-full p-2 border rounded"
            value={fromToken}
            onChange={(e) => setFromToken(e.target.value)}
          >
            {(TOKENS.get(chainId ?? 1) ?? []).map((token) => (
              <option key={token.symbol} value={token.symbol}>
                {token.symbol}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">到</label>
          <select className="w-full p-2 border rounded" value={toToken} onChange={(e) => setToToken(e.target.value)}>
            {(TOKENS.get(chainId ?? 1) ?? [])
              .filter((t) => t.symbol !== fromToken)
              .map((token) => (
                <option key={token.symbol} value={token.symbol}>
                  {token.symbol}
                </option>
              ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">数量</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          placeholder="0.0"
          value={swapAmount}
          onChange={(e) => setSwapAmount(e.target.value)}
        />
        {/* <p className="text-xs text-gray-500 mt-1">
          余额: {fromToken === 'ETH' ? balance : tokenBalances[fromToken] || '0'} {fromToken}
        </p> */}
      </div>

      <button
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        onClick={executeSwap}
        disabled={!swapAmount}
      >
        Swap
      </button>

      {swapTxHash && (
        <div className="mt-4 p-3 bg-green-50 rounded text-sm">
          <p>Swap成功!</p>
          <p className="break-all">TxHash: {swapTxHash}</p>
        </div>
      )}
    </div>
  )
}

export default Swap
