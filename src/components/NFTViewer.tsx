import React, { useState, useEffect } from 'react';
import { getEthereumProvider, sendHBAR } from '../wallet/metamask';
import { listOnMarketplace, buyFromMarketplace } from '../utils/market';
import { ProjectNFT } from '../types/Project';
import { Booking } from './BookingSystem';
import './NFTViewer.css';

interface NFTViewerProps {
  userAddress: string;
}

const NFTViewer: React.FC<NFTViewerProps> = ({ userAddress }) => {
  const [projectNFTs, setProjectNFTs] = useState<ProjectNFT[]>([]);
  const [bookingNFTs, setBookingNFTs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'projects' | 'bookings' | 'market' | 'earnings'>('projects');
  const [marketListings, setMarketListings] = useState<any[]>([]);
  const [salesRevenue, setSalesRevenue] = useState<number>(0);
  const [salesHistory, setSalesHistory] = useState<any[]>([]);
  const [chatBooking, setChatBooking] = useState<any | null>(null);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string; at: number }>>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadUserNFTs();
  }, [userAddress]);

  const loadUserNFTs = async () => {
    setIsLoading(true);
    try {
      // Load project NFTs from localStorage
      const storedProjectNFTs = JSON.parse(localStorage.getItem('ethereus_project_nfts') || '[]');
      const userProjectNFTs = storedProjectNFTs.filter((nft: ProjectNFT) => 
        nft.ownerAddress.toLowerCase() === userAddress.toLowerCase()
      );
      setProjectNFTs(userProjectNFTs);

      // Load booking NFTs from localStorage
      const storedBookingNFTs = JSON.parse(localStorage.getItem('ethereus_booking_nfts') || '[]');
      const userBookingNFTs = storedBookingNFTs.filter((nft: any) => 
        nft.ownerAddress.toLowerCase() === userAddress.toLowerCase()
      );
      setBookingNFTs(userBookingNFTs);

      // Load marketplace listings (peer sales of booking NFTs)
      const listings = JSON.parse(localStorage.getItem('afg_market_listings') || '[]');
      setMarketListings(listings);

      // Load my sales revenue
      const hist = JSON.parse(localStorage.getItem(`afg_sales_hist_${userAddress.toLowerCase()}`) || '[]');
      const revStored = Number(localStorage.getItem(`afg_sales_${userAddress.toLowerCase()}`) || '0');
      const revComputed = Array.isArray(hist) ? hist.reduce((s: number, r: any) => s + Number(r.price || 0), 0) : 0;
      setSalesRevenue(revComputed || revStored);
      setSalesHistory(hist);
    } catch (error) {
      console.error('Failed to load NFTs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const persistListings = (listings: any[]) => {
    localStorage.setItem('afg_market_listings', JSON.stringify(listings));
    setMarketListings(listings);
  };

  const listBookingForSale = async (bookingNft: any) => {
    const priceStr = window.prompt('Enter sale price in HBAR for this booking NFT:', '50');
    if (!priceStr) return;
    const price = Number(priceStr);
    if (Number.isNaN(price) || price <= 0) return alert('Invalid price');
    const pmap = JSON.parse(localStorage.getItem('afg_property_nft_map') || '{}');
    const propId = bookingNft.propertyId || bookingNft.property_id;
    const link = pmap[propId];
    if (!link || !link.contract) {
      return alert('On-chain property NFT not found for this booking. Mint first.');
    }
    const expiresAt = bookingNft.endDate ? Math.floor(new Date(bookingNft.endDate).getTime() / 1000) : 0;
    try {
      const txHash = await listOnMarketplace(link.contract, link.tokenId || 0, price, expiresAt);
      const listings = JSON.parse(localStorage.getItem('afg_market_listings') || '[]');
      const id = `listing_${bookingNft.id}`;
      const existing = listings.find((l: any) => l.id === id);
      const newListing = {
        id,
        type: 'booking',
        bookingId: bookingNft.id,
        price,
        seller: bookingNft.ownerAddress,
        nft: { ...bookingNft, nftContract: link.contract, nftTokenId: link.tokenId },
        createdAt: Date.now(),
        onchainTx: txHash
      };
      if (existing) Object.assign(existing, newListing); else listings.push(newListing);
      persistListings(listings);
      alert('Listed on-chain.');
    } catch (e: any) {
      alert(`Listing failed: ${e?.message || e}`);
    }
  };

  const cancelListing = (listingId: string) => {
    const listings = JSON.parse(localStorage.getItem('afg_market_listings') || '[]');
    const updated = listings.filter((l: any) => l.id !== listingId);
    persistListings(updated);
  };

  const buyListing = async (listing: any) => {
    try {
      if (listing.seller?.toLowerCase() === userAddress.toLowerCase()) {
        return alert('You cannot buy your own listing.');
      }
      if (isExpired(listing.nft?.endDate)) {
        return alert('This booking NFT has expired and cannot be purchased.');
      }
      if (listing.nft?.nftContract && (listing.nft?.nftTokenId || listing.nft?.tokenId)) {
        const tokenId = listing.nft.nftTokenId || listing.nft.tokenId;
        const txHash = await buyFromMarketplace(listing.nft.nftContract, tokenId, Number(listing.price));
        await finalizePurchase(listing, txHash);
        return;
      }
      const provider = await getEthereumProvider();
      if (!provider) return alert('MetaMask not detected');
      const dataHex = `0x${(listing.bookingId || '').toString().replace(/[^a-fA-F0-9]/g, '').padStart(8, '0')}`;
      const txHash = await sendHBAR(provider as any, listing.seller, Number(listing.price), dataHex);
      await finalizePurchase(listing, txHash);
    } catch (e: any) {
      console.error(e);
      alert(`Purchase failed: ${e?.message || e}`);
    }
  };

  const finalizePurchase = async (listing: any, txHash: string) => {
    const allBookings = JSON.parse(localStorage.getItem('ethereus_booking_nfts') || '[]');
    const idx = allBookings.findIndex((nft: any) => nft.id === listing.bookingId);
    if (idx >= 0) {
      allBookings[idx].ownerAddress = userAddress;
      allBookings[idx].transactionHash = txHash;
      localStorage.setItem('ethereus_booking_nfts', JSON.stringify(allBookings));
    }
    cancelListing(listing.id);
    await loadUserNFTs();
    const key = `afg_sales_${listing.seller.toLowerCase()}`;
    const old = Number(localStorage.getItem(key) || '0');
    localStorage.setItem(key, String(old + Number(listing.price)));
    const histKey = `afg_sales_hist_${listing.seller.toLowerCase()}`;
    const hist = JSON.parse(localStorage.getItem(histKey) || '[]');
    hist.push({
      id: listing.id,
      bookingId: listing.bookingId,
      propertyName: listing.nft?.propertyName,
      price: listing.price,
      buyer: userAddress,
      txHash,
      at: Date.now(),
      type: listing.nft?.nftContract ? 'NFT Purchase' : 'HBAR Transfer'
    });
    localStorage.setItem(histKey, JSON.stringify(hist));
    alert(`Purchase complete. Tx: ${txHash}`);
  };

  // Guest chat handlers
  const openGuestChat = (bookingNft: any) => {
    setChatBooking(bookingNft);
    const key = `afg_chat_${bookingNft.bookingId}`;
    const legacyKey = `afg_chat_${bookingNft.id}`; // backward-compat if previously miskeyed
    const a = JSON.parse(localStorage.getItem(key) || '[]');
    const b = JSON.parse(localStorage.getItem(legacyKey) || '[]');
    const merged = [...a, ...b].sort((x: any, y: any) => (x.at||0) - (y.at||0));
    setChatMessages(merged);
    try { localStorage.setItem(`afg_chat_read_guest_${bookingNft.bookingId}`, String(Date.now())); } catch {}
  };

  const sendGuestChat = (text: string) => {
    if (!chatBooking || !text.trim()) return;
    const key = `afg_chat_${chatBooking.bookingId}`;
    const legacyKey = `afg_chat_${chatBooking.id}`;
    const msgs = JSON.parse(localStorage.getItem(key) || '[]');
    const entry = { sender: 'guest', text, at: Date.now() };
    msgs.push(entry);
    localStorage.setItem(key, JSON.stringify(msgs));
    // mirror to legacy if present
    try {
      const old = JSON.parse(localStorage.getItem(legacyKey) || '[]');
      old.push(entry);
      localStorage.setItem(legacyKey, JSON.stringify(old));
    } catch {}
    setChatMessages(msgs);
    try {
      const ch = new (window as any).BroadcastChannel('afg-chat');
      ch.postMessage({ type: 'chat', bookingKey: key, message: { sender: 'guest', text } });
      ch.close();
    } catch {}
  };

  useEffect(() => {
    // Listen for remote chat updates
    let ch: any;
    try {
      ch = new (window as any).BroadcastChannel('afg-chat');
      ch.onmessage = (ev: any) => {
        const data = ev.data || {};
        if (data.type === 'chat' && chatBooking) {
          const key = `afg_chat_${chatBooking.bookingId}`;
          const legacyKey = `afg_chat_${chatBooking.id}`;
          if (data.bookingKey === key || data.bookingKey === legacyKey) {
            const a = JSON.parse(localStorage.getItem(key) || '[]');
            const b = JSON.parse(localStorage.getItem(legacyKey) || '[]');
            const merged = [...a, ...b].sort((x: any, y: any) => (x.at||0) - (y.at||0));
            setChatMessages(merged);
          }
        }
      };
    } catch {}
    return () => {
      try { ch && ch.close && ch.close(); } catch {}
    };
  }, [chatBooking]);

  const purchaseProjectNFT = async (projectId: string, price: number) => {
    if (typeof window.ethereum === 'undefined') {
      alert('MetaMask is not installed');
      return;
    }

    try {
      // In a real implementation, this would interact with Hedera testnet
      // For demo purposes, we'll simulate the transaction
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length === 0) {
        alert('No accounts found');
        return;
      }

      // Simulate NFT purchase
      const newNFT: ProjectNFT = {
        id: `nft_${Date.now()}`,
        projectId,
        projectName: `Project ${projectId}`,
        tokenId: Date.now().toString(),
        contractAddress: '0.0.7054981',
        ownerAddress: userAddress,
        purchasePrice: price,
        purchaseDate: new Date().toISOString(),
        imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=400&fit=crop',
        metadata: {
          rarity: 'rare',
          benefits: ['Voting rights', 'Early access', 'Exclusive updates'],
          votingPower: 10
        }
      };

      // Save to localStorage (in real app, this would be on blockchain)
      const existingNFTs = JSON.parse(localStorage.getItem('ethereus_project_nfts') || '[]');
      existingNFTs.push(newNFT);
      localStorage.setItem('ethereus_project_nfts', JSON.stringify(existingNFTs));

      // Update state
      setProjectNFTs(prev => [...prev, newNFT]);

      alert('NFT purchased successfully!');
    } catch (error) {
      console.error('NFT purchase failed:', error);
      alert('NFT purchase failed. Please try again.');
    }
  };

  const formatPrice = (price: number) => {
    if (typeof price !== 'number' || Number.isNaN(price)) return '0 HBAR';
    return `${price} HBAR`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const isExpired = (end?: string) => {
    if (!end) return false;
    const today = new Date();
    const endDate = new Date(end);
    // Compare by date only
    today.setHours(0,0,0,0);
    endDate.setHours(0,0,0,0);
    return endDate < today;
  };

  return (
    <div className="nft-viewer">
      <div className="nft-header">
        <h2>My NFTs & Digital Assets</h2>
        <p>View your project investments and booking confirmations</p>
      </div>
      {chatBooking && (
        <div className="property-modal-overlay" onClick={() => setChatBooking(null)}>
          <div className="property-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content" style={{ gridTemplateColumns: '1fr' }}>
              <div className="modal-details">
                <h2>Chat — {chatBooking.propertyName}</h2>
                <div style={{ maxHeight: 260, overflow: 'auto', background: '#f7fafc', padding: 12, borderRadius: 8 }}>
                  {chatMessages.length === 0 && <p>No messages yet</p>}
                  {chatMessages.map((m, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: m.sender === 'guest' ? 'flex-end' : 'flex-start', marginBottom: 6 }}>
                      <span style={{ background: m.sender === 'guest' ? '#bee3f8' : '#e2e8f0', padding: '6px 10px', borderRadius: 12 }}>
                        {m.text}
                      </span>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <input type="text" placeholder="Type a message" style={{ flex: 1 }} onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const input = e.currentTarget as HTMLInputElement;
                      sendGuestChat(input.value);
                      input.value = '';
                    }
                  }} />
                  <button className="confirm-btn" onClick={() => {
                    const inputs = document.querySelectorAll<HTMLInputElement>('input[placeholder="Type a message"]');
                    const el = inputs[inputs.length - 1];
                    if (el && el.value) { sendGuestChat(el.value); el.value = ''; }
                  }}>Send</button>
                </div>
                <div style={{ marginTop: 12 }}>
                  <button className="cta-button" onClick={() => setChatBooking(null)}>Close</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="nft-tabs">
        <button
          className={`tab-button ${activeTab === 'projects' ? 'active' : ''}`}
          onClick={() => setActiveTab('projects')}
        >
          🏗️ Project NFTs ({projectNFTs.length})
        </button>
        <button
          className={`tab-button ${activeTab === 'bookings' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookings')}
        >
          🏠 Booking NFTs ({bookingNFTs.length})
        </button>
        <button
          className={`tab-button ${activeTab === 'market' ? 'active' : ''}`}
          onClick={() => setActiveTab('market')}
        >
          💱 Marketplace ({marketListings.length})
        </button>
        <button
          className={`tab-button ${activeTab === 'earnings' ? 'active' : ''}`}
          onClick={() => setActiveTab('earnings')}
        >
          💵 Earnings ({salesHistory.length})
        </button>
      </div>

      <div className="nft-content">
        {isLoading ? (
          <div className="loading">Loading your NFTs...</div>
        ) : (
          <>
            {activeTab === 'projects' && (
              <div className="project-nfts">
                {projectNFTs.length > 0 ? (
                  <div className="nft-grid">
                    {projectNFTs.map(nft => (
                      <div key={nft.id} className="nft-card">
                        <div className="nft-image">
                          <img src={nft.imageUrl} alt={nft.projectName} />
                          <div className="rarity-badge">{nft.metadata.rarity}</div>
                        </div>
                        <div className="nft-details">
                          <h3>{nft.projectName}</h3>
                          <div className="nft-info">
                            <div className="info-item">
                              <span className="label">Token ID:</span>
                              <span className="value">{nft.tokenId}</span>
                            </div>
                            <div className="info-item">
                              <span className="label">Contract:</span>
                              <span className="value">{nft.contractAddress}</span>
                            </div>
                            <div className="info-item">
                              <span className="label">Purchase Price:</span>
                              <span className="value">{formatPrice(nft.purchasePrice)}</span>
                            </div>
                            <div className="info-item">
                              <span className="label">Purchase Date:</span>
                              <span className="value">{formatDate(nft.purchaseDate)}</span>
                            </div>
                            {nft.transactionHash && (
                              <div className="info-item">
                                <span className="label">Explorer:</span>
                                <span className="value">
                                  <a href={`https://hashscan.io/testnet/transaction/${nft.transactionHash}`} target="_blank" rel="noreferrer">View on HashScan</a>
                                </span>
                              </div>
                            )}
                            <div className="info-item">
                              <span className="label">Voting Power:</span>
                              <span className="value">{nft.metadata.votingPower}</span>
                            </div>
                          </div>
                          <div className="benefits">
                            <h4>Benefits:</h4>
                            <ul>
                              {nft.metadata.benefits.map((benefit, index) => (
                                <li key={index}>{benefit}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-nfts">
                    <h3>No Project NFTs Found</h3>
                    <p>You haven't purchased any project NFTs yet. Invest in infrastructure projects to get started!</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'bookings' && (
              <div className="booking-nfts">
                {bookingNFTs.length > 0 ? (
                  <div className="nft-grid">
                    {bookingNFTs.map(booking => (
                      <div key={booking.id} className="nft-card booking-card">
                        <div className="nft-image">
                          <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=400&fit=crop" alt="Booking NFT" />
                          <div className="status-badge">{booking.status}</div>
                          {isExpired(booking.endDate) && (
                            <div className="status-badge" style={{ right: 8, left: 'auto', background: '#6b7280' }}>Vintage</div>
                          )}
                        </div>
                        <div className="nft-details">
                          <h3>{booking.propertyName}</h3>
                          <div className="nft-info">
                            <div className="info-item">
                              <span className="label">Booking ID:</span>
                              <span className="value">{booking.id}</span>
                            </div>
                            <div className="info-item">
                              <span className="label">Check-in:</span>
                              <span className="value">{booking.startDate ? formatDate(booking.startDate) : '-'}</span>
                            </div>
                            <div className="info-item">
                              <span className="label">Check-out:</span>
                              <span className="value">{booking.endDate ? formatDate(booking.endDate) : '-'}</span>
                            </div>
                            <div className="info-item">
                              <span className="label">Total Price:</span>
                              <span className="value">{formatPrice(booking.totalPrice)}</span>
                            </div>
                            <div className="info-item">
                              <span className="label">Location:</span>
                              <span className="value">{booking.location || booking.propertyName}</span>
                            </div>
                            {booking.transactionHash && (
                              <div className="info-item">
                                <span className="label">Explorer:</span>
                                <span className="value">
                                  <a href={`https://hashscan.io/testnet/transaction/${booking.transactionHash}`} target="_blank" rel="noreferrer">View on HashScan</a>
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="benefits">
                            <h4>Booking Benefits:</h4>
                            <ul>
                              <li>Digital receipt & confirmation</li>
                              <li>Access to property updates</li>
                              <li>Exclusive guest perks</li>
                              <li>Loyalty points accumulation</li>
                            </ul>
                            <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                              <button onClick={() => listBookingForSale(booking)} className="invest-btn">List for Sale</button>
                              <button onClick={() => openGuestChat(booking)} className="invest-btn">Chat with Host</button>
                              {(() => {
                                const a = JSON.parse(localStorage.getItem(`afg_chat_${booking.bookingId}`) || '[]');
                                const b = JSON.parse(localStorage.getItem(`afg_chat_${booking.id}`) || '[]');
                                const lastRead = Number(localStorage.getItem(`afg_chat_read_guest_${booking.bookingId}`) || '0');
                                const unread = [...a, ...b].filter((m: any) => (m.at || 0) > lastRead).length;
                                return unread > 0 ? (<span className="status-badge" style={{ background: '#bee3f8', color: '#1a365d' }}>{unread} new</span>) : null;
                              })()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-nfts">
                    <h3>No Booking NFTs Found</h3>
                    <p>You haven't made any bookings yet. Book a property to receive your booking NFT!</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'market' && (
              <div className="booking-nfts">
                {marketListings.length > 0 ? (
                  <div className="nft-grid">
                    {marketListings.map(listing => (
                      <div key={listing.id} className="nft-card booking-card">
                        <div className="nft-image">
                          <img src={listing.nft.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=400&fit=crop'} alt="Booking NFT" />
                          <div className="status-badge">For Sale</div>
                          {isExpired(listing.nft?.endDate) && (
                            <div className="status-badge" style={{ right: 8, left: 'auto', background: '#ef4444' }}>Expired</div>
                          )}
                        </div>
                        <div className="nft-details">
                          <h3>{listing.nft.propertyName} — {listing.price} HBAR</h3>
                          <div className="nft-info">
                            <div className="info-item">
                              <span className="label">Booking ID:</span>
                              <span className="value">{listing.bookingId}</span>
                            </div>
                            <div className="info-item">
                              <span className="label">Seller:</span>
                              <span className="value">{listing.seller.slice(0,6)}...{listing.seller.slice(-4)}</span>
                            </div>
                            <div className="info-item">
                              <span className="label">Check-in:</span>
                              <span className="value">{listing.nft?.startDate ? formatDate(listing.nft.startDate) : '-'}</span>
                            </div>
                            <div className="info-item">
                              <span className="label">Check-out:</span>
                              <span className="value">{listing.nft?.endDate ? formatDate(listing.nft.endDate) : '-'}</span>
                            </div>
                            <div className="info-item">
                              <span className="label">Total Price:</span>
                              <span className="value">{formatPrice(listing.nft?.totalPrice || listing.price)}</span>
                            </div>
                            <div className="info-item">
                              <span className="label">Location:</span>
                              <span className="value">{listing.nft?.location || listing.nft?.propertyName}</span>
                            </div>
                            {listing.nft?.transactionHash && (
                              <div className="info-item">
                                <span className="label">Explorer:</span>
                                <span className="value">
                                  <a href={`https://hashscan.io/testnet/transaction/${listing.nft.transactionHash}`} target="_blank" rel="noreferrer">View on HashScan</a>
                                </span>
                              </div>
                            )}
                          </div>
                          <div style={{ display: 'flex', gap: 8 }}>
                            {listing.seller.toLowerCase() === userAddress.toLowerCase() ? (
                              <button className="invest-btn" onClick={() => cancelListing(listing.id)}>Cancel Listing</button>
                            ) : (
                              <button className="invest-btn" disabled={isExpired(listing.nft?.endDate)} onClick={() => buyListing(listing)}>
                                {isExpired(listing.nft?.endDate) ? 'Expired' : 'Buy'}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-nfts">
                    <h3>No Listings</h3>
                    <p>When users list booking NFTs, they will appear here for purchase.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'earnings' && (
              <div className="booking-nfts">
                <div style={{ marginBottom: 12, fontWeight: 600 }}>Total Earnings: {salesRevenue} HBAR • Sales: {salesHistory.length}</div>
                {salesHistory.length > 0 ? (
                  <div className="nft-grid">
                    {salesHistory
                      .sort((a, b) => b.at - a.at)
                      .map((s, i) => (
                        <div key={i} className="nft-card booking-card">
                          <div className="nft-details">
                            <h3>{s.propertyName || s.bookingId} — {s.price} HBAR</h3>
                            <div className="nft-info">
                              <div className="info-item">
                                <span className="label">Date:</span>
                                <span className="value">{new Date(s.at).toLocaleString()}</span>
                              </div>
                              <div className="info-item">
                                <span className="label">Buyer:</span>
                                <span className="value">{s.buyer?.slice(0,6)}...{s.buyer?.slice(-4)}</span>
                              </div>
                              <div className="info-item">
                                <span className="label">Tx:</span>
                                <span className="value">
                                  <a href={`https://hashscan.io/testnet/transaction/${s.txHash}`} target="_blank" rel="noreferrer">View</a>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="no-nfts">
                    <h3>No Sales Yet</h3>
                    <p>When you sell booking NFTs, your history and revenue will appear here.</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NFTViewer;
