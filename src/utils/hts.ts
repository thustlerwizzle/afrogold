import { HTS_TOKEN_ID } from '../config/hts';

// Optional: address of an on-chain minter contract that calls HTS precompile. Set via localStorage.afg_hts_minter
export async function mintHtsSerial(metadataCidOrUri: string, toAccountId?: string): Promise<{ tokenId: string; serial: number; tx?: string } | null> {
  try {
    const addr = localStorage.getItem('afg_hts_minter');
    if (!addr) throw new Error('HTS minter contract not configured');
    // TODO: Call the minter contract via ethers once deployed
    throw new Error('HTS minter contract call not implemented yet');
  } catch (e) {
    // Fallback: simulate by assigning incremental serials in localStorage so UI can proceed
    const key = 'afg_hts_serial_counter';
    const cur = Number(localStorage.getItem(key) || '0');
    const next = cur + 1;
    localStorage.setItem(key, String(next));
    return { tokenId: HTS_TOKEN_ID, serial: next };
  }
}


