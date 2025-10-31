import React, { useEffect, useState } from 'react';
import { Property } from './types/Property';
import { InfrastructureProject } from './types/Project';
import { properties } from './data/properties';
import { getCompleteProjectList } from './data/projects';
import PropertyList from './components/PropertyList';
import { AuthProvider, useAuth, LoginForm, MetaMaskLogin } from './components/Auth';
import MetaMaskConnect from './components/MetaMaskConnect';
import AnimatedLogo from './components/AnimatedLogo';
import HostDashboard from './components/HostDashboard';
import BookingSystem, { Booking } from './components/BookingSystem';
import ProjectInvestment from './components/ProjectInvestment';
import { getProjectFallbackImage, attachImgOnErrorFallback } from './utils/images';
import NFTViewer from './components/NFTViewer';
import Analytics from './components/Analytics';
import Suppliers from './components/Suppliers';
import About from './components/About';
import { makeDataUriJson, mintPropertyNft, mintPropertyNftBatch } from './utils/nft';
import { HTS_TOKEN_ID, HTS_TOKEN_NAME } from './config/hts';
import { mintHtsSerial } from './utils/hts';
import { getContracts } from './config/contracts';
import { DEFAULT_RECEIVER_EVM } from './config/hedera';
import './App.css';

const AppContent: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const getAllProperties = (): Property[] => {
    try {
      const merged: Record<string, Property> = {};
      // Base seed
      for (const p of properties) merged[p.id] = p;
      // Legacy global list
      const legacy = JSON.parse(localStorage.getItem('ethereus_host_properties') || '[]');
      for (const p of legacy) merged[p.id] = p;
      // All per-host keys
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i) as string;
        if (k && k.startsWith('afg_host_properties_')) {
          try {
            const arr = JSON.parse(localStorage.getItem(k) || '[]');
            for (const p of arr) merged[p.id] = p;
          } catch {}
        }
      }
      return Object.values(merged);
    } catch {
      return properties;
    }
  };
  const [searchResults, setSearchResults] = useState<Property[]>(getAllProperties());
  const [currentView, setCurrentView] = useState<'guest' | 'host' | 'invest' | 'nfts' | 'analytics' | 'suppliers' | 'about'>('guest');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState<InfrastructureProject | null>(null);
  const projects = getCompleteProjectList();
  const [showProjectInvestment, setShowProjectInvestment] = useState(false);
  const [filterCountry, setFilterCountry] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<InfrastructureProject['category'] | ''>('');
  const [unreadGlobal, setUnreadGlobal] = useState<number>(0);
  const [isMinting, setIsMinting] = useState<boolean>(false);

  // Duplicate search UI removed; filtering handled within PropertyList if needed

  const handlePropertySelect = (property: Property) => {
    setSelectedProperty(property);
    setShowBookingForm(true);
  };

  // Refresh properties list when navigating back to guest view
  useEffect(() => {
    if (currentView === 'guest') {
      setSearchResults(getAllProperties());
    }
  }, [currentView]);

  // Live updates: listen for host listing changes and storage updates
  useEffect(() => {
    const handler = () => setSearchResults(getAllProperties());
    window.addEventListener('afg:properties-updated', handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener('afg:properties-updated', handler);
      window.removeEventListener('storage', handler);
    };
  }, []);

  // Compute global unread chat count (host or guest)
  const computeUnread = () => {
    try {
      const bookings = JSON.parse(localStorage.getItem('ethereus_bookings') || '[]');
      let total = 0;
      if (user) {
        if (user.email) {
          const hostBookings = bookings.filter((b: any) => b.hostEmail === user.email);
          for (const b of hostBookings) {
            const msgs: Array<any> = JSON.parse(localStorage.getItem(`afg_chat_${b.id}`) || '[]');
            const lastRead = Number(localStorage.getItem(`afg_chat_read_host_${b.id}`) || '0');
            total += msgs.filter(m => (m.at || 0) > lastRead && m.sender !== 'host').length;
          }
        }
        if (user.address) {
          const guestBookings = bookings.filter((b: any) => (b.guestWallet || '').toLowerCase() === user.address.toLowerCase());
          for (const b of guestBookings) {
            const msgs: Array<any> = JSON.parse(localStorage.getItem(`afg_chat_${b.id}`) || '[]');
            const lastRead = Number(localStorage.getItem(`afg_chat_read_guest_${b.id}`) || '0');
            total += msgs.filter(m => (m.at || 0) > lastRead && m.sender !== 'guest').length;
          }
        }
      }
      setUnreadGlobal(total);
    } catch {
      setUnreadGlobal(0);
    }
  };

  useEffect(() => {
    computeUnread();
    const onStorage = () => computeUnread();
    window.addEventListener('storage', onStorage);
    let ch: any;
    try {
      ch = new (window as any).BroadcastChannel('afg-chat');
      ch.onmessage = () => computeUnread();
    } catch {}
    return () => {
      window.removeEventListener('storage', onStorage);
      try { ch && ch.close && ch.close(); } catch {}
    };
  }, [user]);

  // Mint any missing NFTs for existing properties and projects
  const mintMissingNfts = async () => {
    try {
      if (!user?.isHost) {
        alert('Host login required to mint');
        return;
      }
      const { registry } = getContracts();
      if (!registry) {
        alert('Set contract addresses first: localStorage.afg_contracts');
        return;
      }
      setIsMinting(true);
      // Prefer HTS mint for each property (assign serials)
      const nftMapKey = 'afg_property_nft_map';
      const map = JSON.parse(localStorage.getItem(nftMapKey) || '{}');
      const allProps = getAllProperties();
      const batchItems = allProps.filter(p => !map[p.id]).map(p => ({
        to: (p.hostWallet || user.address || DEFAULT_RECEIVER_EVM),
        propertyId: p.id,
        tokenUri: makeDataUriJson({
          name: p.name,
          description: p.description,
          image: p.imageUrl,
          attributes: [
            { trait_type: 'Location', value: p.location },
            { trait_type: 'PricePerNightHBAR', value: p.price }
          ]
        })
      }));
      if (batchItems.length > 0) {
        // HTS serial assignment loop (one by one) to ensure we have mapping
        for (const it of batchItems) {
          try {
            const minted = await mintHtsSerial(it.tokenUri);
            if (minted) {
              map[it.propertyId] = { token: HTS_TOKEN_ID, tokenName: HTS_TOKEN_NAME, serial: minted.serial };
              localStorage.setItem(nftMapKey, JSON.stringify(map));
            }
          } catch (e) {
            console.warn('HTS mint fallback to ERC721 for', it.propertyId);
          }
        }
        // If some items still not mapped (HTS pathway not ready), fallback to ERC‑721 batch
        try {
          const res = await mintPropertyNftBatch(batchItems);
          if (res) {
            for (const it of batchItems) {
              if (!map[it.propertyId]) {
                map[it.propertyId] = { contract: registry, tokenId: '', tx: res.tx };
              }
            }
            localStorage.setItem(nftMapKey, JSON.stringify(map));
          }
        } catch (e) {
          console.warn('Batch mint failed, falling back to single mints:', e);
          for (const it of batchItems) {
            try {
              const single = await mintPropertyNft(it.to, it.propertyId, it.tokenUri);
              if (single) {
                map[it.propertyId] = { contract: registry, tokenId: single.tokenId, tx: single.tx };
                localStorage.setItem(nftMapKey, JSON.stringify(map));
              }
            } catch (err) {
              console.warn('Mint failed for', it.propertyId, err);
            }
          }
        }
      }
      // Project NFTs (optional, for display/ownership proofs)
      const projMapKey = 'afg_project_nft_map';
      const pmap = JSON.parse(localStorage.getItem(projMapKey) || '{}');
      const projBatch = projects.filter(proj => !pmap[proj.id]).map(proj => ({
        to: user.address || DEFAULT_RECEIVER_EVM,
        propertyId: `project_${proj.id}`,
        tokenUri: makeDataUriJson({
          name: proj.name,
          description: proj.description,
          image: proj.imageUrl,
          attributes: [
            { trait_type: 'Country', value: proj.country },
            { trait_type: 'Category', value: proj.category },
            { trait_type: 'RaisedHBAR', value: proj.raisedAmount },
          ]
        })
      }));
      if (projBatch.length > 0) {
        for (const it of projBatch) {
          try {
            const minted = await mintHtsSerial(it.tokenUri);
            if (minted) {
              const id = it.propertyId.replace(/^project_/, '');
              pmap[id] = { token: HTS_TOKEN_ID, tokenName: HTS_TOKEN_NAME, serial: minted.serial };
              localStorage.setItem(projMapKey, JSON.stringify(pmap));
            }
          } catch {}
        }
        try {
          const res = await mintPropertyNftBatch(projBatch);
          if (res) {
            for (const it of projBatch) {
              const id = it.propertyId.replace(/^project_/, '');
              if (!pmap[id]) {
                pmap[id] = { contract: registry, tokenId: '', tx: res.tx };
              }
            }
            localStorage.setItem(projMapKey, JSON.stringify(pmap));
          }
        } catch (e) {
          console.warn('Project batch mint failed, falling back to single:', e);
          for (const it of projBatch) {
            try {
              const single = await mintPropertyNft(it.to, it.propertyId, it.tokenUri);
              if (single) {
                const id = it.propertyId.replace(/^project_/, '');
                pmap[id] = { contract: registry, tokenId: single.tokenId, tx: single.tx };
                localStorage.setItem(projMapKey, JSON.stringify(pmap));
              }
            } catch (err) {
              console.warn('Project mint failed for', it.propertyId, err);
            }
          }
        }
      }
      alert('Minting completed (see console for any skipped items).');
    } finally {
      setIsMinting(false);
    }
  };

  // Auto-mint once after host logs in, if mappings are missing
  useEffect(() => {
    try {
      if (!user?.isHost) return;
      const already = localStorage.getItem('afg_automintrun');
      const propMap = JSON.parse(localStorage.getItem('afg_property_nft_map') || '{}');
      const projMap = JSON.parse(localStorage.getItem('afg_project_nft_map') || '{}');
      const needsProps = (getAllProperties() || []).some(p => !propMap[p.id]);
      const needsProjs = (projects || []).some(p => !projMap[p.id]);
      if (!already && (needsProps || needsProjs)) {
        localStorage.setItem('afg_automintrun', '1');
        mintMissingNfts();
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.isHost]);

  const handleBookingCreated = (booking: Booking) => {
    setShowBookingForm(false);
    setSelectedProperty(null);
  };

  const handleProjectSelect = (project: InfrastructureProject) => {
    setSelectedProject(project);
    setShowProjectInvestment(true);
  };

  const handleInvestmentComplete = (projectId: string, amount: number) => {
    setShowProjectInvestment(false);
    setSelectedProject(null);
  };

  const handleLogout = () => {
    logout();
    setCurrentView('guest');
    setSelectedProperty(null);
    setShowBookingForm(false);
    setSelectedProject(null);
    setShowProjectInvestment(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="auth-container">
        <div className="auth-content">
          <div className="auth-header">
            <h1>🏠 AfrGold</h1>
            <p>Connect your wallet to continue</p>
          </div>
          <div className="auth-options">
            <div className="auth-option">
              <h3>Login with MetaMask</h3>
              <MetaMaskLogin />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (user?.isHost && currentView === 'host') {
    return (
      <div className="app">
        <header className="app-header">
          <div className="header-content">
            <h1 className="app-title">
              <span className="title-icon">🏠</span>
              AfrGold - Host Portal
            </h1>
            <div className="header-actions">
              <MetaMaskConnect />
              {unreadGlobal > 0 && (
                <span className="unread-badge" title="Unread chats">
                  {unreadGlobal > 99 ? '99+' : unreadGlobal}
                </span>
              )}
              {user?.isHost && (
                <button 
                  className="view-switch-btn" 
                  onClick={mintMissingNfts}
                  disabled={isMinting}
                >
                  {isMinting ? 'Minting…' : 'Mint Missing NFTs'}
                </button>
              )}
              <button 
                className="view-switch-btn"
                onClick={() => setCurrentView('guest')}
              >
                Guest View
              </button>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="app-main">
          <HostDashboard 
            userEmail={user.email} 
            userWallet={user.address}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">
            <AnimatedLogo size={48} />
            <span className="afg-brand">AfroGold</span>
          </h1>
          <div className="ticker">
            <div className="ticker-track">
              <span className="ticker-item">Luxury stays and transparent, on-chain infrastructure investing — powered by HBAR on Hedera.</span>
              <span className="ticker-item">Web3 + Blockchain + Fintech: AI-driven diligence, verifiable suppliers, and milestone receipts on-chain.</span>
              <span className="ticker-item">Hedera-powered contracts • low, predictable fees • instant finality • green network.</span>
              <span className="ticker-item">Discover why Africa is the destination of choice for premium travel and long-term growth.</span>
              {/* duplicate for seamless loop */}
              <span className="ticker-item">Luxury stays and transparent, on-chain infrastructure investing — powered by HBAR on Hedera.</span>
              <span className="ticker-item">Web3 + Blockchain + Fintech: AI-driven diligence, verifiable suppliers, and milestone receipts on-chain.</span>
              <span className="ticker-item">Hedera-powered contracts • low, predictable fees • instant finality • green network.</span>
              <span className="ticker-item">Discover why Africa is the destination of choice for premium travel and long-term growth.</span>
            </div>
            <div className="ticker-mask" />
          </div>
          <div className="header-meta">
            <MetaMaskConnect />
            {unreadGlobal > 0 && (
              <span className="unread-badge" title="Unread chats">
                {unreadGlobal > 99 ? '99+' : unreadGlobal}
              </span>
            )}
            {user?.isHost && (
              <button 
                className="view-switch-btn" 
                onClick={mintMissingNfts}
                disabled={isMinting}
              >
                {isMinting ? 'Minting…' : 'Mint Missing NFTs'}
              </button>
            )}
          </div>
          
          <div className="header-actions">
            {user?.isHost && (
              <button 
                className="view-switch-btn"
                onClick={() => setCurrentView('host')}
              >
                Host Dashboard
              </button>
            )}
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      

      <nav className="main-navigation">
        <div className="nav-container">
          <button 
            className={`nav-button ${currentView === 'guest' ? 'active' : ''}`}
            onClick={() => setCurrentView('guest')}
          >
            🏠 Properties
          </button>
          
          <button 
            className={`nav-button ${currentView === 'invest' ? 'active' : ''}`}
            onClick={() => setCurrentView('invest')}
          >
            💰 Invest
          </button>
          <button 
            className={`nav-button ${currentView === 'nfts' ? 'active' : ''}`}
            onClick={() => setCurrentView('nfts')}
          >
            🎨 My NFTs
          </button>
          <button 
            className={`nav-button ${currentView === 'analytics' ? 'active' : ''}`}
            onClick={() => setCurrentView('analytics')}
          >
            📊 Analytics
          </button>
          <button 
            className={`nav-button ${currentView === 'suppliers' ? 'active' : ''}`}
            onClick={() => setCurrentView('suppliers')}
          >
            🧩 Suppliers
          </button>
          <button 
            className={`nav-button ${currentView === 'about' ? 'active' : ''}`}
            onClick={() => setCurrentView('about')}
          >
            ℹ️ About
          </button>
        </div>
      </nav>

      <main className="app-main">
        {currentView === 'guest' && (
          <PropertyList 
            properties={searchResults} 
            onPropertySelect={handlePropertySelect}
          />
        )}
        
        
        
        {currentView === 'invest' && (
          <div className="invest-section">
            <h2>All African Infrastructure Projects</h2>
            <div className="filter-chips">
              <span className={`chip ${!filterCountry ? 'active' : ''}`} onClick={() => setFilterCountry('')}>All Countries</span>
              {Array.from(new Set(projects.map(p => p.country))).sort().map(c => (
                <span key={c} className={`chip ${filterCountry === c ? 'active' : ''}`} onClick={() => setFilterCountry(c)}>{c}</span>
              ))}
            </div>
            <div className="filter-chips" style={{ marginTop: 6 }}>
              <span className={`chip ${!filterCategory ? 'active' : ''}`} onClick={() => setFilterCategory('' as any)}>All Industries</span>
              {Array.from(new Set(projects.map(p => p.category))).sort().map(c => (
                <span key={c} className={`chip ${filterCategory === c ? 'active' : ''}`} onClick={() => setFilterCategory(c as any)}>{c}</span>
              ))}
            </div>
            {Array.from(
              projects
                .filter(p => (filterCountry ? p.country === filterCountry : true))
                .filter(p => (filterCategory ? p.category === filterCategory : true))
                .reduce((acc: Map<string, InfrastructureProject[]>, p) => {
                  const arr = acc.get(p.category) || [];
                  arr.push(p);
                  acc.set(p.category, arr);
                  return acc;
                }, new Map())
            ).map(([category, list]) => (
              <div key={category} style={{ marginBottom: 24 }}>
                <h3 style={{ color: '#fff', margin: '12px 0' }}>{category.toUpperCase()}</h3>
                <div className="projects-grid">
                  {list.map(project => (
                <div key={project.id} className="project-card" onClick={() => handleProjectSelect(project)}>
                  <div className="project-image">
                    <img 
                      src={project.imageUrl}
                      alt={project.name}
                      onError={(e) => attachImgOnErrorFallback(e, getProjectFallbackImage(project))}
                    />
                    <div className="project-status">
                      <span className={`status-badge ${project.status}`}>
                        {project.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="project-content">
                    <h3>{project.name}</h3>
                    <p className="project-location">📍 {project.city}, {project.country}</p>
                    <p className="project-description">{project.description}</p>
                    {(() => {
                      try {
                        const pmap = JSON.parse(localStorage.getItem('afg_project_nft_map') || '{}');
                        const info = pmap[project.id];
                        if (!info) return null;
                        return (
                          <div style={{ margin: '6px 0', display: 'flex', gap: 8, alignItems: 'center' }}>
                            <span className="amenity-tag">On-Chain</span>
                            {info.token ? (
                              <a href={`https://hashscan.io/testnet/nft/${info.token}/${info.serial || 0}`} target="_blank" rel="noreferrer">{`HTS ${info.token} #${info.serial || '?'}`}</a>
                            ) : info.tx ? (
                              <a href={`https://hashscan.io/testnet/transaction/${info.tx}`} target="_blank" rel="noreferrer">View on HashScan</a>
                            ) : (
                              <a href={`https://hashscan.io/testnet/address/${info.contract}`} target="_blank" rel="noreferrer">Contract</a>
                            )}
                            {info.tokenId && (<span className="amenity-tag">Token #{info.tokenId}</span>)}
                          </div>
                        );
                      } catch {
                        return null;
                      }
                    })()}
                    <div className="project-stats">
                      <div className="stat-item">
                        <span className="stat-label">Total Cost</span>
                        <span className="stat-value">{project.totalCost.toLocaleString()} HBAR</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Raised</span>
                        <span className="stat-value">{project.raisedAmount.toLocaleString()} HBAR</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Investors</span>
                        <span className="stat-value">{project.investors}</span>
                      </div>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${Math.round((project.raisedAmount / project.totalCost) * 100)}%` }}
                      ></div>
                    </div>
                    <button className="invest-btn">Invest Now</button>
                  </div>
                </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {currentView === 'nfts' && user && (
          <NFTViewer userAddress={user.address} />
        )}

        {currentView === 'analytics' && (
          <Analytics />
        )}
        {currentView === 'suppliers' && (
          <Suppliers />
        )}
        {currentView === 'about' && (
          <About />
        )}
      </main>

      {selectedProperty && showBookingForm && (
        <div className="property-modal-overlay" onClick={() => setShowBookingForm(false)}>
          <div className="property-modal booking-modal" onClick={(e) => e.stopPropagation()}>
            <button 
              className="modal-close"
              onClick={() => setShowBookingForm(false)}
            >
              ×
            </button>
            
            <div className="modal-content">
              <div className="modal-image">
                <img 
                  src={selectedProperty.imageUrl} 
                  alt={selectedProperty.name}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/600x400?text=No+Image';
                  }}
                />
              </div>
              
              <div className="modal-details">
                <h2>{selectedProperty.name}</h2>
                <div className="modal-price">
                  <span className="price-amount">{selectedProperty.price}</span>
                  <span className="price-currency">HBAR/night</span>
                </div>
                
                <div className="modal-location">
                  <span className="location-icon">📍</span>
                  {selectedProperty.location}
                </div>
                
                <div className="modal-description">
                  <h3>Description</h3>
                  <p>{selectedProperty.description}</p>
                </div>
                
                {selectedProperty.amenities && selectedProperty.amenities.length > 0 && (
                  <div className="modal-amenities">
                    <h3>Amenities</h3>
                    <div className="amenities-grid">
                      {selectedProperty.amenities.map((amenity, index) => (
                        <span key={index} className="amenity-badge">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <BookingSystem
                  property={selectedProperty}
                  hostEmail={selectedProperty.hostEmail || ''}
                  hostWallet={selectedProperty.hostWallet || ''}
                  contactDetails={selectedProperty.contactDetails}
                  onBookingCreated={handleBookingCreated}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedProject && showProjectInvestment && (
        <div className="property-modal-overlay" onClick={() => setShowProjectInvestment(false)}>
          <div className="property-modal project-modal" onClick={(e) => e.stopPropagation()}>
            <button 
              className="modal-close"
              onClick={() => setShowProjectInvestment(false)}
            >
              ×
            </button>
            
            <div className="modal-content">
              <ProjectInvestment
                project={selectedProject}
                userAddress={user?.address || ''}
                onInvestmentComplete={handleInvestmentComplete}
              />
            </div>
          </div>
        </div>
      )}

      <footer className="app-footer">
        <div className="footer-content">
          <p>&copy; 2024 AfrGold. All rights reserved.</p>
          <p>Powered by Hedera Hashgraph (HBAR)</p>
        </div>
      </footer>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
