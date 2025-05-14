import { ethers } from 'ethers'
import { routerAbi, UNISWAP_ROUTER_ADDRESS, USDC_ADDRESS, WETH_ADDRESS } from './abi'
import { parseEther, formatEther, parseUnits, formatUnits } from 'viem'

const aa = async (signer: ethers.JsonRpcSigner, swapAmount: string, address: string) => {
  // 创建Router合约实例
  const router = new ethers.Contract(UNISWAP_ROUTER_ADDRESS, routerAbi, signer)
  console.log('🚀 ~ executeSwap ~ router:', router)

  // 准备交易参数
  const amountIn = parseEther(swapAmount)
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20

  // 计算最小输出金额 (考虑0.5%的滑点)
  const amountOutMin = parseUnits(
    (parseFloat(swapAmount) * 0.95).toFixed(6),
    6 // USDC的小数位数
  )

  // 构建交易参数
  const params = {
    tokenIn: WETH_ADDRESS,
    tokenOut: USDC_ADDRESS,
    fee: 3000, // 0.3%费率池
    recipient: address,
    deadline: deadline,
    amountIn: amountIn,
    amountOutMinimum: amountOutMin,
    sqrtPriceLimitX96: 0,
  }

  // 发送交易
  const tx = await router.exactInputSingle(params, {
    value: amountIn,
  })

  // 等待交易确认
  const receipt = await tx.wait()

  return receipt
}
