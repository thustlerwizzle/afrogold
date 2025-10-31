import React, { useState } from 'react';
import { InfrastructureProject } from '../types/Project';
import './ProjectInvestment.css';
import { DEFAULT_RECEIVER_EVM } from '../config/hedera';
import { getEthereumProvider, ensureHederaTestnet, sendHBAR } from '../wallet/metamask';

interface ProjectInvestmentProps {
  project: InfrastructureProject;
  userAddress: string;
  onInvestmentComplete?: (projectId: string, amount: number) => void;
}

const ProjectInvestment: React.FC<ProjectInvestmentProps> = ({
  project,
  userAddress,
  onInvestmentComplete
}) => {
  const [investmentAmount, setInvestmentAmount] = useState(0);
  const [isInvesting, setIsInvesting] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleInvestment = async () => {
    if (investmentAmount <= 0) {
      alert('Please enter a valid investment amount');
      return;
    }

    const provider = await getEthereumProvider();
    if (!provider) { alert('MetaMask is not installed.'); return; }

    setIsInvesting(true);

    try {
      await ensureHederaTestnet(provider);
      const accounts = await provider.request({ method: 'eth_requestAccounts' });

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found. Please connect MetaMask.');
      }

      const account = accounts[0];
      console.log('Connected account:', account);

      // Check if user has enough HBAR balance
      const balance = await provider.request({
        method: 'eth_getBalance',
        params: [account, 'latest']
      });

      const balanceInHBAR = parseInt(balance, 16) / 1e18;
      
      if (balanceInHBAR < investmentAmount) {
        alert(`Insufficient HBAR balance. You have ${balanceInHBAR.toFixed(2)} HBAR but need ${investmentAmount} HBAR.`);
        setIsInvesting(false);
        return;
      }

      const dataHex = `0x${project.id.replace(/[^a-fA-F0-9]/g, '').padStart(64, '0')}`;
      const txHash = await sendHBAR(provider, DEFAULT_RECEIVER_EVM, investmentAmount, dataHex);

      console.log('Transaction hash:', txHash);

      // Wait for transaction confirmation
      let receipt = null;
      let attempts = 0;
      const maxAttempts = 30; // 30 seconds timeout

      while (!receipt && attempts < maxAttempts) {
        try {
          receipt = await provider.request({
            method: 'eth_getTransactionReceipt',
            params: [txHash]
          });
        } catch (error) {
          console.log('Waiting for transaction confirmation...');
        }
        
        if (!receipt) {
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
          attempts++;
        }
      }

      if (receipt && receipt.status === '0x1') {
        // Transaction successful - update project data
        const updatedProject = {
          ...project,
          raisedAmount: project.raisedAmount + investmentAmount,
          investors: project.investors + 1
        };

        // Save overlay with updated aggregate fields to reflect globally
        const overridesRaw = localStorage.getItem('ethereus_project_overrides');
        const overrides = overridesRaw ? JSON.parse(overridesRaw) : {};
        overrides[project.id] = {
          raisedAmount: updatedProject.raisedAmount,
          investors: updatedProject.investors
        };
        localStorage.setItem('ethereus_project_overrides', JSON.stringify(overrides));

        // Create investment record
        const investment = {
          id: `inv_${Date.now()}`,
          projectId: project.id,
          projectName: project.name,
          investorAddress: account,
          amount: investmentAmount,
          date: new Date().toISOString(),
          status: 'confirmed',
          transactionHash: txHash,
          blockNumber: receipt.blockNumber
        };

        const existingInvestments = JSON.parse(localStorage.getItem('ethereus_investments') || '[]');
        existingInvestments.push(investment);
        localStorage.setItem('ethereus_investments', JSON.stringify(existingInvestments));

        // Create Project NFT
        const projectNFT = {
          id: `nft_${Date.now()}`,
          projectId: project.id,
          projectName: project.name,
          tokenId: Date.now().toString(),
          contractAddress: '0.0.7054981',
          ownerAddress: account,
          purchasePrice: investmentAmount,
          purchaseDate: new Date().toISOString(),
          transactionHash: txHash,
          imageUrl: project.imageUrl,
          metadata: {
            rarity: investmentAmount >= 1000 ? 'legendary' : investmentAmount >= 500 ? 'epic' : investmentAmount >= 100 ? 'rare' : 'common',
            benefits: [
              'Voting rights on project decisions',
              'Early access to project updates',
              'Exclusive investor reports',
              'Priority access to future projects'
            ],
            votingPower: Math.floor(investmentAmount / 100)
          }
        };

        const existingNFTs = JSON.parse(localStorage.getItem('ethereus_project_nfts') || '[]');
        existingNFTs.push(projectNFT);
        localStorage.setItem('ethereus_project_nfts', JSON.stringify(existingNFTs));

        if (onInvestmentComplete) {
          onInvestmentComplete(project.id, investmentAmount);
        }

        alert(`Investment successful! You've invested ${investmentAmount} HBAR in ${project.name}\nTransaction Hash: ${txHash}`);
        setInvestmentAmount(0);
      } else {
        throw new Error('Transaction failed or timed out');
      }
    } catch (error: any) {
      console.error('Investment failed:', error);
      alert(`Investment failed: ${error.message}`);
    } finally {
      setIsInvesting(false);
    }
  };

  const formatPrice = (price: number) => {
    return `${price.toLocaleString()} HBAR`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getProgressPercentage = () => {
    return Math.round((project.raisedAmount / project.totalCost) * 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#38a169';
      case 'in-progress': return '#d69e2e';
      case 'pending': return '#718096';
      default: return '#718096';
    }
  };

  return (
    <div className="project-investment">
      <div className="project-header">
        <div className="project-image">
          <img src={project.imageUrl} alt={project.name} />
          <div className="project-status">
            <span className={`status-badge ${project.status}`}>
              {project.status.toUpperCase()}
            </span>
          </div>
        </div>
        
        <div className="project-info">
          <h2>{project.name}</h2>
          <p className="project-location">📍 {project.city}, {project.country}</p>
          <p className="project-description">{project.description}</p>
          
          <div className="project-stats">
            <div className="stat-item">
              <span className="stat-label">Total Cost</span>
              <span className="stat-value">{formatPrice(project.totalCost)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Raised</span>
              <span className="stat-value">{formatPrice(project.raisedAmount)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Investors</span>
              <span className="stat-value">{project.investors.toLocaleString()}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Progress</span>
              <span className="stat-value">{getProgressPercentage()}%</span>
            </div>
          </div>

          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="investment-section">
        <h3>Invest in This Project</h3>
        <div className="investment-form">
          <div className="amount-input">
            <label htmlFor="investment-amount">Investment Amount (HBAR)</label>
            <input
              id="investment-amount"
              type="number"
              value={investmentAmount || ''}
              onChange={(e) => setInvestmentAmount(Number(e.target.value))}
              placeholder="Enter amount in HBAR"
              min="1"
              max={project.totalCost - project.raisedAmount}
            />
            <div className="amount-info">
              <span>Minimum: 1 HBAR</span>
              <span>Maximum: {formatPrice(project.totalCost - project.raisedAmount)}</span>
            </div>
          </div>

          <button
            className="invest-button"
            onClick={handleInvestment}
            disabled={isInvesting || investmentAmount <= 0}
          >
            {isInvesting ? 'Processing...' : `Invest ${investmentAmount || 0} HBAR`}
          </button>

          <div className="payment-info">
            <p>💳 Payment will be processed via MetaMask</p>
            <p>🏦 Funds will be sent to: <strong>0.0.7054981</strong></p>
            <p>⛓️ Transaction will be recorded on Hedera Testnet</p>
          </div>
        </div>
      </div>

      <div className="project-details">
        <button
          className="details-toggle"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? 'Hide Details' : 'Show Project Details'}
        </button>

        {showDetails && (
          <div className="details-content">
            <div className="milestones-section">
              <h4>Project Milestones</h4>
              <div className="milestones-list">
                {project.milestones.map(milestone => (
                  <div key={milestone.id} className="milestone-item">
                    <div className="milestone-header">
                      <h5>{milestone.name}</h5>
                      <span 
                        className="milestone-status"
                        style={{ color: getStatusColor(milestone.status) }}
                      >
                        {milestone.status.toUpperCase()}
                      </span>
                    </div>
                    <p>{milestone.description}</p>
                    <div className="milestone-progress">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${milestone.progress}%` }}
                        ></div>
                      </div>
                      <span>{milestone.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="suppliers-section">
              <h4>Verified Suppliers</h4>
              <div className="suppliers-list">
                {project.suppliers.map(supplier => (
                  <div key={supplier.id} className="supplier-item">
                    <div className="supplier-header">
                      <h5>{supplier.name}</h5>
                      <span className={`verification-badge ${supplier.verificationStatus}`}>
                        {supplier.verificationStatus.toUpperCase()}
                      </span>
                    </div>
                    <p>Type: {supplier.type} | Country: {supplier.country}</p>
                    <div className="certifications">
                      {supplier.certifications.map((cert, index) => (
                        <span key={index} className="cert-badge">{cert}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="proof-section">
              <h4>Proof of Work</h4>
              <div className="proof-list">
                {project.proofOfWork.map(proof => (
                  <div key={proof.id} className="proof-item">
                    <div className="proof-header">
                      <h5>{proof.title}</h5>
                      <span className={`verification-badge ${proof.verified ? 'verified' : 'pending'}`}>
                        {proof.verified ? 'VERIFIED' : 'PENDING'}
                      </span>
                    </div>
                    <p>{proof.description}</p>
                    <div className="proof-meta">
                      <span>Type: {proof.type}</span>
                      <span>Date: {formatDate(proof.uploadDate)}</span>
                      <a href={proof.url} target="_blank" rel="noopener noreferrer">
                        View {proof.type}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectInvestment;
