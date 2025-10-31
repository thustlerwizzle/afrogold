export type ContractsConfig = {
  registry: string;
  marketplace: string;
};

export function getContracts(): ContractsConfig {
  try {
    const ls = localStorage.getItem('afg_contracts');
    if (ls) return JSON.parse(ls);
  } catch {}
  // Default to provided address if not set
  const fallback = '0xb1F616b8134F602c3Bb465fB5b5e6565cCAd37Ed';
  return { registry: fallback, marketplace: fallback };
}

export function setContracts(cfg: ContractsConfig) {
  localStorage.setItem('afg_contracts', JSON.stringify(cfg));
}


