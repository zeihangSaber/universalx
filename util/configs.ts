export const TOKENS = new Map<
  number,
  {
    symbol: string
    address?: string
    decimals: number
  }[]
>()

TOKENS.set(1, [
  { symbol: 'ETH', address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', decimals: 18 },
  { symbol: 'USDT', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', decimals: 6 },
])

TOKENS.set(56, [
  { symbol: 'ETH', address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', decimals: 18 },
  { symbol: 'USDT', address: '0x55d398326f99059fF775485246999027B3197955', decimals: 6 },
])

TOKENS.set(101, [
  { symbol: 'SOL', address: 'native', decimals: 18 },
  { symbol: 'USDT', address: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', decimals: 6 },
])

TOKENS.set(728126428, [
  { symbol: 'TRX', address: 'native', decimals: 18 },
  { symbol: 'USDT', address: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t', decimals: 6 },
])

export const my1inchConfig = {
  chainId: 1, // 主网 Ethereum，其他链ID见文档
  apiUrl: 'https://api.1inch.io/v5.0',
  apiKey: process.env.ONE_INCH_API_KEY || '', // 可选
}
