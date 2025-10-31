export interface ProjectMilestone {
  id: string;
  name: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending';
  completionDate?: string;
  progress: number; // 0-100
}

export interface Supplier {
  id: string;
  name: string;
  type: 'construction' | 'materials' | 'technology' | 'consulting';
  country: string;
  verificationStatus: 'verified' | 'pending' | 'rejected';
  certifications: string[];
}

export interface ProofOfWork {
  id: string;
  type: 'photo' | 'document' | 'video' | 'report';
  title: string;
  description: string;
  url: string;
  uploadDate: string;
  verified: boolean;
}

export interface InfrastructureProject {
  id: string;
  name: string;
  description: string;
  country: string;
  city: string;
  category: 'transport' | 'energy' | 'healthcare' | 'education' | 'housing' | 'technology' | 'water' | 'agriculture';
  status: 'planning' | 'funding' | 'construction' | 'completed';
  totalCost: number; // in HBAR
  raisedAmount: number; // in HBAR
  investors: number;
  startDate: string;
  expectedCompletion: string;
  imageUrl: string;
  milestones: ProjectMilestone[];
  suppliers: Supplier[];
  proofOfWork: ProofOfWork[];
  nftContractAddress?: string;
  tokenId?: string;
  blockchain: 'hedera';
}

export interface ProjectNFT {
  id: string;
  projectId: string;
  projectName: string;
  tokenId: string;
  contractAddress: string;
  ownerAddress: string;
  purchasePrice: number; // in HBAR
  purchaseDate: string;
  transactionHash?: string;
  imageUrl: string;
  metadata: {
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    benefits: string[];
    votingPower: number;
  };
}
