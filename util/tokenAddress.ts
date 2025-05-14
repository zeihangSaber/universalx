export const Address = new Map<number, Record<string, string>>()
// 常用代币地址配置

// 以太坊主网代币
Address.set(1, {
  ETH: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', // ETH 原生代币表示
  USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7', // USDT ERC20
  USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC ERC20
  WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // Wrapped ETH
})

Address.set(56, {
  BNB: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', // BNB 原生代币表示
  USDT: '0x55d398326f99059fF775485246999027B3197955', // USDT BEP20
  USDC: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', // USDC BEP20
  WBNB: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', // Wrapped BNB
})

Address.set(101, {
  SOL: 'native', // SOL 原生代币
  USDT: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', // USDT SPL
  USDC: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC SPL
})

Address.set(728126428, {
  TRX: 'native', // TRX 原生代币
  USDT: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t', //
})

export const ETH_MAINNET = {
  ETH: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', // ETH 原生代币表示
  USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7', // USDT ERC20
  USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC ERC20
  WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // Wrapped ETH
}

export const ETH_Sepolia = {
  ETH: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', // ETH 原生代币表示
  USDT: '0x516de3a7a567d81737e3a46ec4ff9cfd1fcb0136', // USDT
}

// BSC主网代币
export const BSC_MAINNET = {
  BNB: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', // BNB 原生代币表示
  USDT: '0x55d398326f99059fF775485246999027B3197955', // USDT BEP20
  USDC: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', // USDC BEP20
  WBNB: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', // Wrapped BNB
}

// Solana主网代币
export const SOLANA_MAINNET = {
  SOL: 'native', // SOL 原生代币
  USDT: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', // USDT SPL
  USDC: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC SPL
}

// TRON主网代币
export const TRON_MAINNET = {
  TRX: 'native', // TRX 原生代币
  USDT: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t', // USDT TRC20
}

// 链ID配置
export const CHAIN_IDS = {
  ETH_MAINNET: 1,
  BSC_MAINNET: 56,
  SOLANA_MAINNET: 101,
  TRON_MAINNET: 728126428,
}

// 跨链兑换配置
export const CROSS_CHAIN_TOKENS = {
  // 从以太坊到BSC的兑换配置
  ETH_TO_BSC: {
    sourceChainId: CHAIN_IDS.ETH_MAINNET,
    targetChainId: CHAIN_IDS.BSC_MAINNET,
    supportedTokens: ['ETH', 'USDT', 'USDC'],
  },
  // 从BSC到以太坊的兑换配置
  BSC_TO_ETH: {
    sourceChainId: CHAIN_IDS.BSC_MAINNET,
    targetChainId: CHAIN_IDS.ETH_MAINNET,
    supportedTokens: ['BNB', 'USDT', 'USDC'],
  },
}
