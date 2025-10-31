import { getContracts } from '../config/contracts';
import MarketAbi from '../abi/BookingMarketplace.json';
import { getContract, getEthers } from './eth';

export async function listOnMarketplace(nft: string, tokenId: string | number, priceHBAR: number, expiresAtSec: number) {
  const { marketplace } = getContracts();
  if (!marketplace) throw new Error('Marketplace address not set');
  const market = await getContract(marketplace, MarketAbi as any);
  const { ethers } = await getEthers();
  const priceWei = (ethers as any).parseEther(String(priceHBAR));
  const tx = await (market as any).list(nft, BigInt(tokenId), priceWei, BigInt(expiresAtSec || 0));
  const rc = await tx.wait?.();
  return String(tx.hash || rc?.transactionHash || '');
}

export async function buyFromMarketplace(nft: string, tokenId: string | number, priceHBAR: number) {
  const { marketplace } = getContracts();
  if (!marketplace) throw new Error('Marketplace address not set');
  const market = await getContract(marketplace, MarketAbi as any);
  const { ethers } = await getEthers();
  const value = (ethers as any).parseEther(String(priceHBAR));
  const tx = await (market as any).buy(nft, BigInt(tokenId), { value });
  const rc = await tx.wait?.();
  return String(tx.hash || rc?.transactionHash || '');
}


