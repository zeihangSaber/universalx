'use strict'
import { TOKENS } from '@/util/configs'
import { ethers } from 'ethers'
import React, { useState } from 'react'
import { parseEther } from 'viem'
import { AAWrapProvider, SendTransactionMode } from '@particle-network/aa'
import { useAccount, useSmartAccount, useWallets } from '@particle-network/connectkit'

const Transfer: React.FC<{ tokenBalances: Record<string, string> }> = ({ tokenBalances }) => {
  // 转账状态
  const [recipient, setRecipient] = useState<string>('')
  const [amount, setAmount] = useState<string>('0')
  const [selectedToken, setSelectedToken] = useState<string>('ETH')
  const [txHash, setTxHash] = useState<string | null>(null)
  const [primaryWallet] = useWallets()
  const smartAccount = useSmartAccount()
  const { chainId } = useAccount()

  //

  // 执行转账
  const executeTransfer = async () => {
    if (!recipient || !amount || !primaryWallet || !smartAccount) return

    try {
      // 初始化AA Provider
      const customProvider = new ethers.BrowserProvider(
        new AAWrapProvider(smartAccount, SendTransactionMode.UserSelect) as any,
        'any'
      )

      const signer = await customProvider.getSigner()

      // 如果是ETH转账
      if (selectedToken === 'ETH' || selectedToken === 'SepoliaETH') {
        const tx = {
          to: recipient,
          value: parseEther(amount).toString(),
        }

        const txResponse = await signer.sendTransaction(tx)
        const txReceipt = await txResponse.wait()

        if (txReceipt) {
          setTxHash(txReceipt.hash)
        }
      }
      // 如果是ERC20转账 (简化版，实际应通过合约调用)
      else {
        alert('ERC20转账功能需要合约交互，此处为简化演示')
      }
    } catch (error) {
      console.error('Error executing transfer:', error)
      alert(`转账失败: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">选择代币</label>
        <select
          className="w-full p-2 border rounded"
          value={selectedToken}
          onChange={(e) => setSelectedToken(e.target.value)}
        >
          {(TOKENS.get(chainId ?? 1) ?? []).map((token) => (
            <option key={token.symbol} value={token.symbol}>
              {token.symbol} ({tokenBalances[token.symbol] || '0'})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">收款地址</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          placeholder="0x..."
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">金额</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          placeholder="0.0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <button
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        onClick={executeTransfer}
        disabled={!recipient || !amount}
      >
        发送转账
      </button>

      {txHash && (
        <div className="mt-4 p-3 bg-green-50 rounded text-sm">
          <p>交易成功!</p>
          <p className="break-all">TxHash: {txHash}</p>
        </div>
      )}
    </div>
  )
}

export default Transfer
