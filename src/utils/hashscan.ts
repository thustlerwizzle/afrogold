export function hashscanTx(txHashOrId: string) {
  return `https://hashscan.io/testnet/transaction/${txHashOrId}`;
}

export function hashscanToken(tokenId: string) {
  return `https://hashscan.io/testnet/token/${tokenId}`;
}

export function hashscanNft(tokenId: string, serial: number | string) {
  return `https://hashscan.io/testnet/nft/${tokenId}/${serial}`;
}


