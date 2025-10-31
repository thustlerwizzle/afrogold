import React, { useMemo } from 'react';
import { getCompleteProjectList } from '../data/projects';
import { InfrastructureProject, Supplier } from '../types/Project';
import './PropertyList.css';
import './Suppliers.css';
import { getSupplierLogoUrl } from '../utils/suppliers';
import { getTrustWeights } from '../config/suppliers';
import { getProjectFallbackImage, attachImgOnErrorFallback } from '../utils/images';

interface SupplierWithProjects extends Supplier {
  projects: InfrastructureProject[];
}

const Suppliers: React.FC = () => {
  const suppliers = useMemo(() => {
    const map = new Map<string, SupplierWithProjects>();
    for (const project of getCompleteProjectList()) {
      for (const s of project.suppliers) {
        const key = `${s.name}|${s.country}|${s.type}`;
        if (!map.has(key)) {
          map.set(key, { ...s, projects: [] });
        }
        map.get(key)!.projects.push(project);
      }
    }
    return Array.from(map.values()).sort((a, b) => b.projects.length - a.projects.length);
  }, []);

  const getLogo = (name: string) => getSupplierLogoUrl(name);
  const groups = useMemo(() => {
    const W = getTrustWeights();
    const calcTrust = (s: SupplierWithProjects) => {
      const statusScore = s.verificationStatus === 'verified' ? W.verifiedBonus : s.verificationStatus === 'pending' ? W.pendingBonus : W.unverifiedPenalty;
      const certScore = s.certifications.length * W.certWeight;
      const projectScore = s.projects.length * W.projectWeight;
      return statusScore + certScore + projectScore;
    };
      
    const calcVotingWeight = (s: SupplierWithProjects) => s.projects.length * 12; // proxy by footprint

    const entries = suppliers.map(s => ({ s, trust: calcTrust(s), weight: calcVotingWeight(s) }));
    const threshold = Math.max(W.verifiedBonus + W.projectWeight * 2 + W.certWeight * 2, 40);
    const topRated = entries.filter(e => e.trust >= threshold).sort((a, b) => b.trust - a.trust);
    const verified = entries.filter(e => e.trust < threshold && e.s.verificationStatus === 'verified').sort((a, b) => b.trust - a.trust);
    const pending = entries.filter(e => e.s.verificationStatus !== 'verified').sort((a, b) => b.trust - a.trust);
    return [
      { title: 'Top Rated', items: topRated },
      { title: 'Verified', items: verified },
      { title: 'Pending / Unverified', items: pending }
    ];
  }, [suppliers]);

  return (
    <div className="property-list-container">
      <div className="filters-header">
        <h2>Verified Suppliers</h2>
        <p>{suppliers.length} suppliers listed</p>
      </div>

      {groups.map(group => (
        <div key={group.title} style={{ marginBottom: 24 }}>
          <h3 style={{ color: '#fff', margin: '0 0 12px 0' }}>{group.title}</h3>
          <div className="properties-grid">
            {group.items.map(({ s, trust, weight }) => (
              <div key={s.id + s.name} className="supplier-card project-card">
                <div className="holo-overlay">🅗 ON-CHAIN VERIFIED</div>
                <div className="project-content">
                  <div className="supplier-header">
                    <div className="supplier-logo">
                      <img src={getLogo(s.name)} alt={`${s.name} logo`} width={56} height={56} />
                    </div>
                    <div className="supplier-title">
                      <h3>{s.name}</h3>
                      <span className="supplier-sub">{s.type.toUpperCase()} • {s.country}</span>
                    </div>
                    {s.verificationStatus === 'verified' && (
                      <span className="verified-chip">✔ Verified</span>
                    )}
                  </div>
                  <div className="mini-metrics">
                    <span className="metric-chip">Projects: {s.projects.length}</span>
                    <span className="metric-chip">Certs: {s.certifications.length}</span>
                    <span className="metric-chip accent">Trust score: {trust}</span>
                    <span className="metric-chip">Voting weight: {weight}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Suppliers;


