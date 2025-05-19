'use strict'
import { TOKENS } from '@/util/configs'
import React, { useEffect, useState } from 'react'
import { useAccount, useSmartAccount, useWallets } from '@particle-network/connectkit'
import { AAWrapProvider, SendTransactionMode } from '@particle-network/aa'
import type { Eip1193Provider } from 'ethers'
import { ethers } from 'ethers'
import { getSwap, checkApprove, sendTransaction } from '@/util/api'
import { Address, ETH_Sepolia } from '@/util/tokenAddress'
import { parseEther, parseUnits } from 'viem'
import { Button, Modal, Space } from 'antd'

const Swap: React.FC<{ balance: string; tokenBalances: Record<string, string> }> = ({ balance, tokenBalances }) => {
  // Swap状态
  const [fromToken, setFromToken] = useState<string>()
  const [modal, contextHolder] = Modal.useModal()
  const [toToken, setToToken] = useState<string>()
  const [loading, setLoading] = useState<boolean>(false)
  const [swapAmount, setSwapAmount] = useState<string>('0')
  const [swapTxHash, setSwapTxHash] = useState<string | null>(null)
  const [primaryWallet] = useWallets()
  const { chainId } = useAccount()

  const executeSwap = async () => {
    if (!swapAmount || !primaryWallet) return

    setLoading(true)

    if (!(fromToken && toToken)) {
      alert('请选择要交换的代币')
      return
    }

    if (fromToken === toToken) {
      alert('不能选择相同的代币')
      return
    }

    if (Number(swapAmount) < 0) {
      alert('Swap数量不能小于0')
      return
    }

    try {
      // 初始化AA Provider
      const customProvider = new ethers.BrowserProvider(
        // new AAWrapProvider(smartAccount, SendTransactionMode.Gasless) as Eip1193Provider,
        // 'any'
        // @ts-expect-error
        window.ethereum as Eip1193Provider
      )

      const signer = await customProvider.getSigner()
      const address = await signer.getAddress()

      if (fromToken !== 'ETH') {
        // 检查是否需要授权
        const {
          result: { approved, tx },
        } = await checkApprove(
          [
            address,
            {
              tokenAddress: Address.get(chainId ?? 1)?.[fromToken ?? ''],
              amount: parseUnits(String(swapAmount), 6).toString(),
            },
          ],
          chainId
        )

        console.log('🚀 ~ executeSwap ~ result:', tx)

        if (!approved) {
          modal.confirm({
            title: '授权',
            content: '请授权',
            okText: '授权',
            async onOk() {
              const txResponse = await signer.sendTransaction({
                to: tx.to,
                data: tx.data,
                value: tx.value || '0x0',
              })

              const receipt = await txResponse.wait()

              if (!receipt) {
                alert('授权失败')
                return
              }
            },
          })

          return
        }
      }

      const { result: swapData } = await getSwap(
        [
          address,
          {
            fromTokenAddress: Address.get(chainId ?? 1)?.[fromToken ?? ''],
            toTokenAddress: Address.get(chainId ?? 1)?.[toToken ?? ''],
            amount:
              fromToken === 'ETH'
                ? parseEther(String(swapAmount)).toString()
                : parseUnits(String(swapAmount), 6).toString(),
            slippage: 1,
          },
        ],
        chainId
      )

      // // 获取Particle的RPC provider
      // const particleProvider = smartAccount.provider
      console.log('🚀 ~ executeSwap ~ particleProvider:', swapData)

      // 使用AA钱包发送交易
      const txResponse = await signer.sendTransaction({
        to: swapData.tx.to,
        data: swapData.tx.data,
        value: swapData.tx.value || '0x0',
      })

      console.log('🚀 ~ executeSwap ~ receipt:')

      // 等待交易确认
      const receipt = await txResponse.wait()
      console.log('🚀 ~ executeSwap ~ receipt:', receipt)

      setLoading(false)

      if (receipt) {
        setSwapTxHash(receipt.hash)
      }
    } catch (error) {
      console.error('Error executing swap:', error)
      setLoading(false)
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
            {(TOKENS.get(chainId ?? 1) ?? []).map((token) => (
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
        disabled={!Number(swapAmount) || !!loading}
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
