import React from 'react';
import './PropertyList.css';

const About: React.FC = () => {
  return (
    <div className="property-list-container">
      <div className="filters-header">
        <h2>AfrGold</h2>
        <p>Luxury stays and transparent infrastructure investing on Hedera</p>
      </div>

      <div className="project-card" style={{ padding: 24 }}>
        <div className="project-content">
          <h3>What we do</h3>
          <p>
            AfrGold connects luxury property travel with real-world infrastructure investing. 
            Guests book premium stays while investors fund verifiable African infrastructure projects — all settled with HBAR on the Hedera testnet.
          </p>

          <h3>Why Hedera</h3>
          <ul>
            <li>Low, predictable fees for bookings and payouts</li>
            <li>Finality and fairness for on-chain governance and receipts</li>
            <li>Public, auditable records via HashScan</li>
          </ul>

          <h3>The problem we solve</h3>
          <p>
            Infrastructure investing in Africa is frequently constrained by corruption risks, opaque reporting,
            and limited access to global funding. AfreNova tackles this with supplier reputation, on-chain milestones,
            and immutable receipts so capital flows to the best builders.
          </p>

          <h3>How it works</h3>
          <ul>
            <li>Book Stays: Pay with HBAR via MetaMask on Hedera testnet</li>
            <li>Invest: Back verified infrastructure projects and earn yield</li>
            <li>Own: Receive digital receipts and NFTs representing your bookings and investments</li>
          </ul>

          <h3>Supplier quality & transparency</h3>
          <ul>
            <li>Only top-rated, verified suppliers are listed</li>
            <li>Project milestones and digital receipts published on-chain</li>
            <li>Community voting and dispute trails anchored to Hedera</li>
          </ul>

          <h3>Our promise</h3>
          <ul>
            <li>Curated properties and suppliers with verifiable proof-of-work</li>
            <li>Clear returns and transparent milestones for every project</li>
            <li>Seamless wallet-based UX — your data and assets are yours</li>
          </ul>

          <h3>Founders</h3>
          <ul>
            <li>Trilochana Chary — Standard Chartered Bank</li>
            <li>Takunda Sadomba — Standard Chartered Bank</li>
          </ul>
        </div>
      </div>

      <div className="project-card" style={{ padding: 24, marginTop: 16 }}>
        <div className="project-content">
          <h3>Headquarters & Contact</h3>
          <ul>
            <li>Headquarters: Johannesburg, South Africa</li>
            <li>Email: contact@afrenova.africa</li>
            <li>Partnerships: partners@afrenova.africa</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;


