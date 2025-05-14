import axios from 'axios'
import { ethers, type JsonRpcSigner } from 'ethers'
import { formatUnits, parseUnits } from 'ethers/utils'
import BN from 'bn.js'

// 配置
const config = {
  chainId: 1, // 主网 Ethereum，其他链ID见文档
  apiUrl: 'https://api.1inch.io/v5.0',
  apiKey: process.env.ONE_INCH_API_KEY || '', // 可选
}

// // 初始化以太坊提供者
// const provider = new ethers.providers.JsonRpcProvider('https://eth.llamarpc.com') // 替换为你的RPC节点
// const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider) // 你的钱包私钥

// 常用代币地址
const tokens = {
  ETH: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
  USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  DAI: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
}

// 获取代币允许额度
export async function getAllowance(tokenAddress: string, walletAddress: string) {
  try {
    const response = await axios.get(`${config.apiUrl}/${config.chainId}/approve/allowance`, {
      params: {
        tokenAddress,
        walletAddress,
      },
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
      },
    })
    return response.data.allowance
  } catch (error: any) {
    console.error('Error getting allowance:', error.response?.data || error.message)
    throw error
  }
}

// 获取授权交易数据
export async function getApproveTransactionData(tokenAddress: string, amount: number) {
  try {
    const response = await axios.get(`${config.apiUrl}/${config.chainId}/approve/transaction`, {
      params: {
        tokenAddress,
        amount: amount.toString(),
      },
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
      },
    })
    return response.data
  } catch (error: any) {
    console.error('Error getting approve transaction:', error.response?.data || error.message)
    throw error
  }
}

// 获取兑换报价
export async function getQuote(fromTokenAddress: string, toTokenAddress: string, amount: number, decimals = 18) {
  try {
    const response = await axios.get(`${config.apiUrl}/${config.chainId}/quote`, {
      params: {
        fromTokenAddress,
        toTokenAddress,
        amount: parseUnits(amount.toString(), decimals).toString(),
      },
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
      },
    })
    return response.data
  } catch (error: any) {
    console.error('Error getting quote:', error.response?.data || error.message)
    throw error
  }
}

// 获取兑换交易数据
export async function getSwapTransactionData(
  fromTokenAddress: string,
  toTokenAddress: string,
  amount: number,
  fromAddress: string,
  slippage = 1,
  decimals = 18
) {
  try {
    const response = await axios.get(`${config.apiUrl}/${config.chainId}/swap`, {
      params: {
        fromTokenAddress,
        toTokenAddress,
        amount: parseUnits(amount.toString(), decimals).toString(),
        fromAddress,
        slippage,
        disableEstimate: true,
      },
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
      },
    })
    return response.data
  } catch (error: any) {
    console.error('Error getting swap transaction:', error.response?.data || error.message)
    throw error
  }
}

// 执行授权
async function approveToken(tokenAddress: string, amount: number, wallet: JsonRpcSigner) {
  try {
    const approveData = await getApproveTransactionData(tokenAddress, amount)

    const tx = {
      to: approveData.to,
      data: approveData.data,
      value: BigInt(approveData.value || 0),
      gasPrice: BigInt(approveData.gasPrice || 0),
      gasLimit: BigInt(approveData.gas || 0),
    }

    const signedTx = await wallet.sendTransaction(tx)
    const receipt = await signedTx.wait()

    console.log('Approval successful, tx hash:', receipt?.hash)
    return receipt
  } catch (error) {
    console.error('Error approving token:', error)
    throw error
  }
}

// 执行兑换
async function executeSwap(swapData: any, wallet: JsonRpcSigner) {
  try {
    const tx = {
      to: swapData.tx.to,
      data: swapData.tx.data,
      value: BigInt(swapData.tx.value),
      gasPrice: BigInt(swapData.tx.gasPrice),
      gasLimit: BigInt(swapData.tx.gas),
    }

    const signedTx = await wallet.sendTransaction(tx)
    const receipt = await signedTx.wait()

    console.log('Swap successful, tx hash:', receipt?.hash)
    return receipt
  } catch (error) {
    console.error('Error executing swap:', error)
    throw error
  }
}

// 主函数 - 完整的兑换流程
async function main(wallet: JsonRpcSigner) {
  const fromToken = tokens.USDC // 从USDC兑换
  const toToken = tokens.DAI // 兑换成DAI
  const amount = 10 // 兑换10个USDC
  const decimals = 6 // USDC有6位小数

  // 1. 检查授权额度
  const allowance = await getAllowance(fromToken, wallet.address)
  const amountInWei = parseUnits(amount.toString(), decimals)

  if (BigInt(allowance) < amountInWei) {
    console.log('Approval needed...')
    await approveToken(fromToken, Number(amountInWei), wallet)
  }

  // 2. 获取报价
  console.log('Getting quote...')
  const quote = await getQuote(fromToken, toToken, amount, decimals)
  console.log(
    `Quote: 1 ${fromToken === tokens.ETH ? 'ETH' : 'USDC'} = ${formatUnits(
      quote.toTokenAmount,
      quote.toToken.decimals
    )} DAI`
  )

  // 3. 获取兑换交易数据
  console.log('Getting swap data...')
  const swapData = await getSwapTransactionData(
    fromToken,
    toToken,
    amount,
    wallet.address,
    1, // 1% slippage
    decimals
  )

  // 4. 执行兑换
  console.log('Executing swap...')
  const receipt = await executeSwap(swapData, wallet)
  console.log('Swap completed:', receipt?.hash)
}
