export async function getEthers() {
  try {
    // Prefer v6 default export
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = await import('ethers');
    return mod as any;
  } catch (e) {
    throw new Error('Ethers not installed. Run: npm i ethers');
  }
}

export async function getSigner() {
  if (typeof (window as any).ethereum === 'undefined') throw new Error('MetaMask not detected');
  const { ethers } = await getEthers();
  const provider = new (ethers as any).BrowserProvider((window as any).ethereum);
  await provider.send('eth_requestAccounts', []);
  return await provider.getSigner();
}

export async function getContract(address: string, abi: any) {
  const { ethers } = await getEthers();
  const signer = await getSigner();
  return new (ethers as any).Contract(address, abi, signer);
}


