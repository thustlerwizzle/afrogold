export type TrustWeights = {
  verifiedBonus: number;
  pendingBonus: number;
  unverifiedPenalty: number;
  certWeight: number;
  projectWeight: number;
};

export const DEFAULT_TRUST_WEIGHTS: TrustWeights = {
  verifiedBonus: 50,
  pendingBonus: 15,
  unverifiedPenalty: -25,
  certWeight: 7,
  projectWeight: 12,
};

export function getTrustWeights(): TrustWeights {
  try {
    const raw = localStorage.getItem('trust_weights');
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_TRUST_WEIGHTS, ...parsed };
    }
  } catch {}
  return DEFAULT_TRUST_WEIGHTS;
}


