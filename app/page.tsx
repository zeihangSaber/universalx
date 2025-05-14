'use client'
import { useState, useEffect } from 'react'
import { ConnectButton, useAccount, usePublicClient } from '@particle-network/connectkit'
import { formatEther } from 'viem'
// import { TOKENS } from '@/util/configs'
import Swap from '@/components/swap'
import Transfer from '@/components/transfer'
import { checkApprove, getQuote, getSwap } from '@/util/api'

export default function Home() {
  const { isConnected, address, chain, chainId } = useAccount()
  const publicClient = usePublicClient()

  // 状态管理
  const [balance, setBalance] = useState<string>('0')
  const [tokenBalances, setTokenBalances] = useState<Record<string, string>>({})
  const [activeTab, setActiveTab] = useState<'transfer' | 'swap'>('transfer')

  // 获取余额
  useEffect(() => {
    console.log('🚀 ~ useEffect ~ isConnected:', chain?.id)

    const fetchBalances = async () => {
      if (!address || !publicClient) return

      try {
        // 获取原生代币余额
        // @ts-expect-error
        const nativeBalance = await publicClient.getBalance({ address })
        setBalance(formatEther(nativeBalance))

        // // 获取ERC20代币余额 (简化版，实际应通过合约读取)
        // const dummyBalances = TOKENS.reduce((acc, token) => {
        //   if (token.symbol === 'ETH') return acc
        //   acc[token.symbol] = '100' // 模拟余额
        //   return acc
        // }, {} as Record<string, string>)

        // setTokenBalances(dummyBalances)
      } catch (error) {
        console.error('Error fetching balances:', error)
      }
    }

    getSwap()
      .then((res) => {
        console.log('🚀 ~ .then ~ res:', res)
      })
      .finally((...args) => {
        console.log('🚀 ~ checkApprove ~ args:', args)
      })

    if (isConnected) {
      fetchBalances()
    }
  }, [isConnected, address, publicClient])
  console.log('🚀 ~ useEffect ~ chain?.id:', chain?.id)
  console.log('🚀 ~ useEffect ~ chain?.id:', chain?.id)

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">UniversalX Wallet</h1>
            <ConnectButton />
          </div>

          {isConnected && (
            <div className="mt-4">
              <p className="text-sm">地址: {address}</p>
              <p className="text-sm">网络: {chain?.name}</p>
              <p className="text-sm">网络: {chain?.id}</p>
              <p className="text-sm">余额: {balance} ETH</p>
            </div>
          )}
        </div>

        <div className="p-6">
          {!isConnected ? (
            <div className="text-center py-10">
              <p className="text-lg mb-4">请连接钱包开始使用</p>
              <ConnectButton />
            </div>
          ) : (
            <>
              <div className="flex border-b mb-6">
                <button
                  className={`px-4 py-2 font-medium ${
                    activeTab === 'transfer' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
                  }`}
                  onClick={() => setActiveTab('transfer')}
                >
                  转账
                </button>
                <button
                  className={`px-4 py-2 font-medium ${
                    activeTab === 'swap' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
                  }`}
                  onClick={() => setActiveTab('swap')}
                >
                  Swap
                </button>
              </div>

              {/* 转账面板 */}
              {activeTab === 'transfer' && <Transfer tokenBalances={tokenBalances}></Transfer>}

              {/* Swap面板 */}
              {activeTab === 'swap' && <Swap balance={balance} tokenBalances={tokenBalances}></Swap>}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
