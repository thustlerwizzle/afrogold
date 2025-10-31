import { getContracts } from '../config/contracts';
import { getContract } from './eth';
import PropertyRegistryAbi from '../abi/PropertyNFTRegistry.json';
import AGNFTAbi from '../abi/AGNFT.json';

export async function mintPropertyNft(to: string, propertyId: string, tokenUri: string): Promise<{ tokenId: string; tx: string } | null> {
  const { registry } = getContracts();
  if (!registry) throw new Error('Registry address not set. Save afg_contracts in localStorage.');
  let contract: any = null;
  try {
    contract = await getContract(registry, PropertyRegistryAbi as any);
    const txResp = await (contract as any).mintProperty(to, propertyId, tokenUri);
    const receipt = await txResp.wait?.();
    let tokenId: string | null = null;
    try {
      const found = (receipt?.events || []).find((e: any) => e.event === 'PropertyMinted');
      if (found && found.args) tokenId = String(found.args.tokenId);
    } catch {}
    return { tokenId: tokenId || '', tx: String(txResp.hash || receipt?.transactionHash || '') };
  } catch (e) {
    // Fallback: use AGNFT.safeMint(owner-only)
    contract = await getContract(registry, AGNFTAbi as any);
    const tokenIdNum = Date.now();
    const txResp = await (contract as any).safeMint(to, BigInt(tokenIdNum), tokenUri);
    const receipt = await txResp.wait?.();
    return { tokenId: String(tokenIdNum), tx: String(txResp.hash || receipt?.transactionHash || '') };
  }
}

export async function mintPropertyNftBatch(items: Array<{ to: string; propertyId: string; tokenUri: string }>): Promise<{ tokenIds: string[]; tx: string } | null> {
  const { registry } = getContracts();
  if (!registry) throw new Error('Registry address not set. Save afg_contracts in localStorage.');
  const contract = await getContract(registry, PropertyRegistryAbi as any);
  const to = items.map(i => i.to);
  const ids = items.map(i => i.propertyId);
  const uris = items.map(i => i.tokenUri);
  const txResp = await (contract as any).mintBatch(to, ids, uris);
  const receipt = await txResp.wait?.();
  // tokenIds from event decoding can vary by lib; return empty array and rely on UI to refresh later
  return { tokenIds: [], tx: String(txResp.hash || receipt?.transactionHash || '') };
}

export function makeDataUriJson(payload: any): string {
  const s = JSON.stringify(payload);
  let b64 = '';
  try {
    if (typeof window === 'undefined') {
      // Node/SSR
      // eslint-disable-next-line no-undef
      b64 = Buffer.from(s, 'utf8').toString('base64');
    } else {
      // Browser: ensure UTF-8 encoding before base64
      // Using encodeURIComponent/unescape to handle non-Latin1
      // eslint-disable-next-line no-undef
      b64 = btoa(unescape(encodeURIComponent(s)));
    }
  } catch (e) {
    // Fallback: try TextEncoder path
    try {
      const enc = new TextEncoder();
      const bytes = enc.encode(s);
      let binary = '';
      for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
      // eslint-disable-next-line no-undef
      b64 = typeof window === 'undefined' ? (global as any).Buffer.from(bytes).toString('base64') : btoa(binary);
    } catch {
      b64 = '';
    }
  }
  return `data:application/json;base64,${b64}`;
}


