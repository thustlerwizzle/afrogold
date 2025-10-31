import detectEthereumProvider from "@metamask/detect-provider";

export interface EIP1193Provider {
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  on: (event: string, callback: (...args: any[]) => void) => void;
  removeListener: (event: string, callback: (...args: any[]) => void) => void;
}

export const HEDERA_TESTNET = {
  chainIdHex: "0x128", // 296
  chainIdDec: 296,
  chainName: "Hedera Testnet",
  nativeCurrency: { name: "HBAR", symbol: "HBAR", decimals: 18 },
  rpcUrls: ["https://testnet.hashio.io/api"],
  blockExplorerUrls: ["https://hashscan.io/testnet"],
};

export async function getEthereumProvider(): Promise<EIP1193Provider | undefined> {
  const provider = (await detectEthereumProvider()) as unknown as EIP1193Provider | undefined;
  if (provider && provider === window.ethereum) {
    return provider;
  }
  return undefined;
}

export async function getChainId(provider: EIP1193Provider): Promise<string> {
  return provider.request({ method: "eth_chainId" });
}

export async function ensureHederaTestnet(provider: EIP1193Provider): Promise<void> {
  const currentChainId = await getChainId(provider);
  if (currentChainId?.toLowerCase() === HEDERA_TESTNET.chainIdHex.toLowerCase()) return;

  try {
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: HEDERA_TESTNET.chainIdHex }],
    });
  } catch (switchError: any) {
    // 4902 = Unrecognized chain. Try to add it.
    if (switchError?.code === 4902) {
      await provider.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: HEDERA_TESTNET.chainIdHex,
            chainName: HEDERA_TESTNET.chainName,
            nativeCurrency: HEDERA_TESTNET.nativeCurrency,
            rpcUrls: HEDERA_TESTNET.rpcUrls,
            blockExplorerUrls: HEDERA_TESTNET.blockExplorerUrls,
          },
        ],
      });
    } else {
      throw switchError;
    }
  }
}

export async function requestAccounts(provider: EIP1193Provider): Promise<string[]> {
  const accounts = await provider.request({ method: "eth_requestAccounts" });
  return accounts as string[];
}

export function onChainChanged(provider: EIP1193Provider, handler: (chainId: string) => void): void {
  provider.on("chainChanged", handler);
}

export function onAccountsChanged(provider: EIP1193Provider, handler: (accounts: string[]) => void): void {
  provider.on("accountsChanged", handler as any);
}

export function hbarToWeiHex(amountHBAR: number): string {
  const wei = BigInt(Math.floor(amountHBAR * 1e6)) * BigInt(1_000_000_000_000); // avoid float issues
  return "0x" + wei.toString(16);
}

export function isValidEvmAddress(address: string): boolean {
  return /^0x[0-9a-fA-F]{40}$/.test(address);
}

export async function sendHBAR(
  provider: EIP1193Provider,
  toEvmAddress: string,
  amountHBAR: number,
  dataHex?: string
): Promise<string> {
  await ensureHederaTestnet(provider);
  if (!isValidEvmAddress(toEvmAddress)) {
    throw new Error("Invalid recipient EVM address");
  }
  const accounts = (await provider.request({ method: "eth_requestAccounts" })) as string[];
  const from = accounts?.[0];
  if (!from || !isValidEvmAddress(from)) {
    throw new Error("No valid sender account from MetaMask");
  }
  const tx = {
    from,
    to: toEvmAddress,
    value: hbarToWeiHex(amountHBAR),
    ...(dataHex ? { data: dataHex } : {}),
  } as any;
  const hash = await provider.request({ method: "eth_sendTransaction", params: [tx] });
  return hash as string;
}


