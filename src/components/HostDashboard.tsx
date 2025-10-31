import React, { useState, useEffect } from 'react';
import { Property } from '../types/Property';
import { Booking } from './BookingSystem';
import PropertyListingForm, { PropertyFormData } from './PropertyListingForm';
import './HostDashboard.css';
import { mintPropertyNft, makeDataUriJson } from '../utils/nft';

interface HostDashboardProps {
  userEmail: string;
  userWallet: string;
}

const HostDashboard: React.FC<HostDashboardProps> = ({ userEmail, userWallet }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'properties' | 'bookings' | 'list-property'>('dashboard');
  const [hostProperties, setHostProperties] = useState<Property[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [showListingForm, setShowListingForm] = useState(false);
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalBookings: 0,
    totalEarnings: 0,
    pendingBookings: 0
  });
  const [availabilityProperty, setAvailabilityProperty] = useState<Property | null>(null);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [chatBooking, setChatBooking] = useState<Booking | null>(null);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string; at: number }>>([]);

useEffect(() => {
  loadHostData();
    // Real-time chat sync across tabs
    let ch: any;
    try {
      ch = new (window as any).BroadcastChannel('afg-chat');
      ch.onmessage = (ev: any) => {
        const data = ev.data || {};
        if (data.type === 'chat' && chatBooking) {
          const key = `afg_chat_${chatBooking.id}`;
          if (data.bookingKey === key) {
            const msgs = JSON.parse(localStorage.getItem(key) || '[]');
            setChatMessages(msgs);
          }
        }
      };
    } catch {}
    return () => {
      try { ch && ch.close && ch.close(); } catch {}
    };
}, [userEmail, userWallet]);

const loadHostData = () => {
  const hostId = (userEmail || userWallet || '').toLowerCase();
  const perHostKey = `afg_host_properties_${hostId}`;
  const perHostList = JSON.parse(localStorage.getItem(perHostKey) || '[]');
  const legacyAll = JSON.parse(localStorage.getItem('ethereus_host_properties') || '[]');
  const legacyMine = legacyAll.filter((prop: any) => (prop.hostEmail && prop.hostEmail === userEmail) || (prop.hostWallet && prop.hostWallet?.toLowerCase() === (userWallet||'').toLowerCase()));
  const mergedMap: Record<string, any> = {};
  [...perHostList, ...legacyMine].forEach((p: any) => { mergedMap[p.id] = p; });
  const userProperties = Object.values(mergedMap);
  setHostProperties(userProperties as Property[]);

    // Load bookings for host properties
  const storedBookings = JSON.parse(localStorage.getItem('ethereus_bookings') || '[]');
  const hostBookings = storedBookings.filter((booking: Booking) => 
    booking.hostEmail === userEmail || (booking.hostWallet && booking.hostWallet?.toLowerCase() === (userWallet||'').toLowerCase())
  );
    setBookings(hostBookings);

    // Calculate stats (ensure earnings include all bookings tied to this host's properties)
    const propertyIds = new Set(userProperties.map((p: Property) => p.id));
  const eligibleBookings = storedBookings.filter((b: Booking) =>
    b.status === 'confirmed' && (
      b.hostEmail === userEmail || 
      (b.hostWallet && b.hostWallet?.toLowerCase() === (userWallet||'').toLowerCase()) ||
      propertyIds.has(b.propertyId)
    )
  );
    const totalEarnings = eligibleBookings.reduce((sum: number, b: Booking) => sum + b.totalPrice, 0);
    
    const pendingBookings = hostBookings.filter((b: Booking) => b.status === 'pending').length;

    setStats({
      totalProperties: userProperties.length,
      totalBookings: eligibleBookings.length,
      totalEarnings,
      pendingBookings
    });
  };

  const handlePropertySubmit = (propertyData: PropertyFormData) => {
    const newProperty: Property = {
      id: `property_${Date.now()}`,
      name: propertyData.name,
      description: propertyData.description,
      location: propertyData.location,
      price: propertyData.price,
      amenities: propertyData.amenities,
      imageUrl: propertyData.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image',
      hostEmail: userEmail,
      hostWallet: propertyData.hostWallet || userWallet,
      contactDetails: propertyData.contactDetails
    };

    // Attempt on-chain mint (best-effort, non-blocking)
    (async () => {
      try {
        const metadata = makeDataUriJson({
          name: newProperty.name,
          description: newProperty.description,
          image: newProperty.imageUrl,
          attributes: [
            { trait_type: 'Location', value: newProperty.location },
            { trait_type: 'PricePerNightHBAR', value: newProperty.price }
          ]
        });
        const res = await mintPropertyNft(newProperty.hostWallet || userWallet, newProperty.id, metadata);
        if (res) {
          (newProperty as any).nftContract = (localStorage.getItem('afg_contracts') ? JSON.parse(localStorage.getItem('afg_contracts') as string).registry : '') || '';
          (newProperty as any).nftTokenId = res.tokenId;
          (newProperty as any).nftTx = res.tx;
        }
      } catch (e) {
        console.warn('Mint property NFT skipped:', e);
      }
    })();

    // Save under per-host key for durability across login methods
    const hostId = (userEmail || userWallet || '').toLowerCase();
    const perHostKey = `afg_host_properties_${hostId}`;
    const perHostList = JSON.parse(localStorage.getItem(perHostKey) || '[]');
    perHostList.push(newProperty);
    localStorage.setItem(perHostKey, JSON.stringify(perHostList));

    // Also append to legacy global list for backward compatibility and guest merge
    const storedProperties = JSON.parse(localStorage.getItem('ethereus_host_properties') || '[]');
    storedProperties.push(newProperty);
    localStorage.setItem('ethereus_host_properties', JSON.stringify(storedProperties));

    setHostProperties(prev => [...prev, newProperty]);
    setShowListingForm(false);
    setActiveTab('properties');
    // Notify other parts of the app (same tab) to refresh guest listings immediately
    try { window.dispatchEvent(new Event('afg:properties-updated')); } catch {}
    
    alert('Property listed successfully!');
  };

  const handleBookingStatusChange = (bookingId: string, status: 'confirmed' | 'cancelled') => {
    const storedBookings = JSON.parse(localStorage.getItem('ethereus_bookings') || '[]');
    const updatedBookings = storedBookings.map((booking: Booking) =>
      booking.id === bookingId ? { ...booking, status } : booking
    );
    localStorage.setItem('ethereus_bookings', JSON.stringify(updatedBookings));
    
    loadHostData(); // Reload data to update stats
    try { window.dispatchEvent(new Event('afg:bookings-updated')); } catch {}
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatPrice = (price: number) => {
    return `${price} HBAR`;
  };

  const getUnreadCount = (bookingId: string): number => {
    const key = `afg_chat_${bookingId}`;
    const msgs: Array<{ at: number }> = JSON.parse(localStorage.getItem(key) || '[]');
    const rk = `afg_chat_read_host_${bookingId}`;
    const lastRead = Number(localStorage.getItem(rk) || '0');
    return msgs.filter(m => (m.at || 0) > lastRead).length;
  };

  return (
    <div className="host-dashboard">
      <div className="dashboard-header">
        <h1>Host Dashboard</h1>
        <p>Welcome back! Manage your properties and bookings.</p>
      </div>
      {availabilityProperty && (
        <div className="property-modal-overlay" onClick={() => setAvailabilityProperty(null)}>
          <div className="property-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content" style={{ gridTemplateColumns: '1fr' }}>
              <div className="modal-details">
                <h2>Block Dates — {availabilityProperty.name}</h2>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input id="afg-block-date" type="date" />
                  <button className="confirm-btn" onClick={() => {
                    const el = document.getElementById('afg-block-date') as HTMLInputElement;
                    if (el && el.value) {
                      const key = `afg_blocked_${availabilityProperty.id}`;
                      const dates = Array.from(new Set([...(JSON.parse(localStorage.getItem(key) || '[]')), el.value]));
                      localStorage.setItem(key, JSON.stringify(dates));
                      setBlockedDates(dates);
                    }
                  }}>Add</button>
                </div>
                <div style={{ marginTop: 12 }}>
                  {blockedDates.length === 0 && <p>No blocked dates</p>}
                  {blockedDates.map(d => (
                    <div key={d} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span>{d}</span>
                      <button className="cancel-btn" onClick={() => {
                        const key = `afg_blocked_${availabilityProperty.id}`;
                        const dates = (JSON.parse(localStorage.getItem(key) || '[]')).filter((x: string) => x !== d);
                        localStorage.setItem(key, JSON.stringify(dates));
                        setBlockedDates(dates);
                      }}>Remove</button>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 12 }}>
                  <button className="cta-button" onClick={() => setAvailabilityProperty(null)}>Done</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {chatBooking && (
        <div className="property-modal-overlay" onClick={() => setChatBooking(null)}>
          <div className="property-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content" style={{ gridTemplateColumns: '1fr' }}>
              <div className="modal-details">
                <h2>Chat — {chatBooking.propertyName}</h2>
                <div style={{ maxHeight: 260, overflow: 'auto', background: '#f7fafc', padding: 12, borderRadius: 8 }}>
                  {chatMessages.length === 0 && <p>No messages yet</p>}
                  {chatMessages.map((m, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: m.sender === 'host' ? 'flex-end' : 'flex-start', marginBottom: 6 }}>
                      <span style={{ background: m.sender === 'host' ? '#c6f6d5' : '#e2e8f0', padding: '6px 10px', borderRadius: 12 }}>
                        {m.text}
                      </span>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <input type="text" placeholder="Type a message" style={{ flex: 1 }} onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const input = e.currentTarget as HTMLInputElement;
                      const key = `afg_chat_${chatBooking.id}`;
                      const msgs = JSON.parse(localStorage.getItem(key) || '[]');
                      msgs.push({ sender: 'host', text: input.value, at: Date.now() });
                      localStorage.setItem(key, JSON.stringify(msgs));
                      setChatMessages(msgs);
                      try {
                        const ch = new (window as any).BroadcastChannel('afg-chat');
                        ch.postMessage({ type: 'chat', bookingKey: key, message: { sender: 'host', text: input.value } });
                        ch.close();
                      } catch {}
                      input.value = '';
                    }
                  }} />
                  <button className="confirm-btn" onClick={() => {
                    const inputs = document.querySelectorAll<HTMLInputElement>('input[placeholder="Type a message"]');
                    const el = inputs[inputs.length - 1];
                    if (el && el.value) {
                      const key = `afg_chat_${chatBooking.id}`;
                      const msgs = JSON.parse(localStorage.getItem(key) || '[]');
                      msgs.push({ sender: 'host', text: el.value, at: Date.now() });
                      localStorage.setItem(key, JSON.stringify(msgs));
                      setChatMessages(msgs);
                      try {
                        const ch = new (window as any).BroadcastChannel('afg-chat');
                        ch.postMessage({ type: 'chat', bookingKey: key, message: { sender: 'host', text: el.value } });
                        ch.close();
                      } catch {}
                      el.value = '';
                    }
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

      <div className="dashboard-tabs">
        <button
          className={`tab-button ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 Dashboard
        </button>
        <button
          className={`tab-button ${activeTab === 'properties' ? 'active' : ''}`}
          onClick={() => setActiveTab('properties')}
        >
          🏠 Properties
        </button>
        <button
          className={`tab-button ${activeTab === 'bookings' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookings')}
        >
          📅 Bookings
        </button>
        <button
          className={`tab-button ${activeTab === 'list-property' ? 'active' : ''}`}
          onClick={() => setActiveTab('list-property')}
        >
          ➕ List Property
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'dashboard' && (
          <div className="dashboard-overview">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">🏠</div>
                <div className="stat-content">
                  <h3>{stats.totalProperties}</h3>
                  <p>Total Properties</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📅</div>
                <div className="stat-content">
                  <h3>{stats.totalBookings}</h3>
                  <p>Total Bookings</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">💰</div>
                <div className="stat-content">
                  <h3>{formatPrice(stats.totalEarnings)}</h3>
                  <p>Total Earnings</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⏳</div>
                <div className="stat-content">
                  <h3>{stats.pendingBookings}</h3>
                  <p>Pending Bookings</p>
                </div>
              </div>
            </div>

            <div className="recent-bookings">
              <h3>Recent Bookings</h3>
              {bookings.slice(0, 5).map(booking => (
                <div key={booking.id} className="booking-item">
                  <div className="booking-info">
                    <h4>{booking.propertyName}</h4>
                    <p>{booking.guestName} • {formatDate(booking.startDate)} - {formatDate(booking.endDate)}</p>
                  </div>
                  <div className="booking-status">
                    <span className={`status-badge ${booking.status}`}>
                      {booking.status}
                    </span>
                    <span className="booking-price">{formatPrice(booking.totalPrice)}</span>
                  </div>
                </div>
              ))}
              {bookings.length === 0 && (
                <p className="no-data">No bookings yet</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'properties' && (
          <div className="properties-section">
            <div className="section-header">
              <h3>Your Properties</h3>
              <button
                className="add-property-btn"
                onClick={() => setActiveTab('list-property')}
              >
                Add Property
              </button>
            </div>
            
            <div className="properties-grid">
              {hostProperties.map(property => (
                <div key={property.id} className="property-card">
                  <img src={property.imageUrl} alt={property.name} />
                  <div className="property-info">
                    <h4>{property.name}</h4>
                    <p>{property.location}</p>
                    <div className="property-price">{formatPrice(property.price)}/night</div>
                    <div className="property-amenities">
                      {property.amenities.slice(0, 3).map((amenity, index) => (
                        <span key={index} className="amenity-tag">{amenity}</span>
                      ))}
                    </div>
                    <div style={{ marginTop: 12 }}>
                      <button
                        className="add-property-btn"
                        onClick={() => {
                          setAvailabilityProperty(property);
                          const dates = JSON.parse(localStorage.getItem(`afg_blocked_${property.id}`) || '[]');
                          setBlockedDates(dates);
                        }}
                      >
                        Manage Availability
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {hostProperties.length === 0 && (
              <div className="no-properties">
                <h3>No properties listed yet</h3>
                <p>Start by listing your first property to begin earning!</p>
                <button
                  className="cta-button"
                  onClick={() => setActiveTab('list-property')}
                >
                  List Your First Property
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="bookings-section">
            <h3>Booking Management</h3>
            
            <div className="bookings-list">
              {bookings.map(booking => (
                <div key={booking.id} className="booking-card">
                  <div className="booking-header">
                    <h4>{booking.propertyName}</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className={`status-badge ${booking.status}`}>
                        {booking.status}
                      </span>
                      {getUnreadCount(booking.id) > 0 && (
                        <span className="status-badge" style={{ background: '#c6f6d5', color: '#22543d' }}>
                          {getUnreadCount(booking.id)} new
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="booking-details">
                    <div className="guest-info">
                      <p><strong>Guest:</strong> {booking.guestName}</p>
                      <p><strong>Email:</strong> {booking.guestEmail}</p>
                      <p><strong>Wallet:</strong> {booking.guestWallet.slice(0, 10)}...</p>
                    </div>
                    
                    <div className="booking-dates">
                      <p><strong>Check-in:</strong> {formatDate(booking.startDate)}</p>
                      <p><strong>Check-out:</strong> {formatDate(booking.endDate)}</p>
                      <p><strong>Total:</strong> {formatPrice(booking.totalPrice)}</p>
                    </div>
                  </div>
                  
                  <div className="booking-actions">
                    {booking.status === 'pending' && (
                      <>
                        <button
                          className="confirm-btn"
                          onClick={() => handleBookingStatusChange(booking.id, 'confirmed')}
                        >
                          Confirm Booking
                        </button>
                        <button
                          className="cancel-btn"
                          onClick={() => handleBookingStatusChange(booking.id, 'cancelled')}
                        >
                          Cancel Booking
                        </button>
                      </>
                    )}
                    <button
                      className="add-property-btn"
                      onClick={() => {
                        setChatBooking(booking);
                        const msgs = JSON.parse(localStorage.getItem(`afg_chat_${booking.id}`) || '[]');
                        setChatMessages(msgs);
                        localStorage.setItem(`afg_chat_read_host_${booking.id}`, String(Date.now()));
                      }}
                    >
                      Chat
                    </button>
                  </div>
                </div>
              ))}
              
              {bookings.length === 0 && (
                <p className="no-data">No bookings yet</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'list-property' && (
          <div className="list-property-section">
            <PropertyListingForm
              onSubmit={handlePropertySubmit}
              onCancel={() => setActiveTab('properties')}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default HostDashboard;
