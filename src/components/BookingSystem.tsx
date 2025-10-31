import React, { useState, useEffect } from 'react';
import { Property } from '../types/Property';
import './BookingSystem.css';
import { DEFAULT_RECEIVER_EVM } from '../config/hedera';
import { getEthereumProvider, ensureHederaTestnet, sendHBAR } from '../wallet/metamask';

export interface Booking {
  id: string;
  propertyId: string;
  propertyName: string;
  guestEmail: string;
  guestName: string;
  guestWallet: string;
  hostEmail: string;
  hostWallet: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
  contactDetails?: {
    phone?: string;
    email?: string;
    address?: string;
  };
}

interface BookingSystemProps {
  property: Property;
  hostEmail: string;
  hostWallet: string;
  contactDetails?: {
    phone?: string;
    email?: string;
    address?: string;
  };
  onBookingCreated?: (booking: Booking) => void;
}

const BookingSystem: React.FC<BookingSystemProps> = ({
  property,
  hostEmail,
  hostWallet,
  contactDetails,
  onBookingCreated
}) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestName, setGuestName] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [bookedDates, setBookedDates] = useState<string[]>([]);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);

  // Load existing bookings for this property
  useEffect(() => {
    const bookings = JSON.parse(localStorage.getItem('ethereus_bookings') || '[]');
    const propertyBookings = bookings.filter((booking: Booking) => 
      booking.propertyId === property.id && booking.status !== 'cancelled'
    );
    
    const dates: string[] = [];
    propertyBookings.forEach((booking: Booking) => {
      const start = new Date(booking.startDate);
      const end = new Date(booking.endDate);
      const current = new Date(start);
      
      while (current <= end) {
        dates.push(current.toISOString().split('T')[0]);
        current.setDate(current.getDate() + 1);
      }
    });
    
    setBookedDates(dates);
    // Load host-blocked dates
    const blocked = JSON.parse(localStorage.getItem(`afg_blocked_${property.id}`) || '[]');
    setBlockedDates(blocked);
  }, [property.id]);

  const calculateTotalPrice = () => {
    if (!startDate || !endDate) return 0;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    return nights * property.price;
  };

  const isDateBooked = (date: string) => {
    return bookedDates.includes(date) || blockedDates.includes(date);
  };

  const handleBooking = async () => {
    if (!startDate || !endDate || !guestEmail || !guestName) {
      alert('Please fill in all required fields');
      return;
    }
    // Check against host-blocked dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    const cur = new Date(start);
    while (cur <= end) {
      const d = cur.toISOString().split('T')[0];
      if (blockedDates.includes(d)) {
        alert('Selected dates include blocked dates by the host. Please choose different dates.');
        return;
      }
      cur.setDate(cur.getDate() + 1);
    }

    const provider = await getEthereumProvider();
    if (!provider) { alert('MetaMask is not installed.'); return; }

    setIsBooking(true);

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
      const totalPrice = calculateTotalPrice();
      
      if (balanceInHBAR < totalPrice) {
        alert(`Insufficient HBAR balance. You have ${balanceInHBAR.toFixed(2)} HBAR but need ${totalPrice} HBAR.`);
        setIsBooking(false);
        return;
      }

      const dataHex = `0x${property.id.replace(/[^a-fA-F0-9]/g, '').padStart(64, '0')}`;
      const txHash = await sendHBAR(provider, DEFAULT_RECEIVER_EVM, totalPrice, dataHex);

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
        // Transaction successful - create booking
        const booking: Booking = {
          id: `booking_${Date.now()}`,
          propertyId: property.id,
          propertyName: property.name,
          guestEmail,
          guestName,
          guestWallet: account,
          hostEmail,
          hostWallet,
          startDate,
          endDate,
          totalPrice,
          status: 'confirmed',
          createdAt: new Date().toISOString(),
          contactDetails
        };

        // Save booking to localStorage
        const existingBookings = JSON.parse(localStorage.getItem('ethereus_bookings') || '[]');
        existingBookings.push(booking);
        localStorage.setItem('ethereus_bookings', JSON.stringify(existingBookings));

        // Create Booking NFT
        const bookingNFT = {
          id: `booking_nft_${Date.now()}`,
          bookingId: booking.id,
          propertyId: property.id,
          propertyName: property.name,
          tokenId: Date.now().toString(),
          contractAddress: '0.0.7054981',
          ownerAddress: account,
          purchasePrice: totalPrice,
          purchaseDate: new Date().toISOString(),
          startDate: booking.startDate,
          endDate: booking.endDate,
          totalPrice: totalPrice,
          location: property.location,
          transactionHash: txHash,
          imageUrl: property.imageUrl,
          metadata: {
            rarity: 'common',
            benefits: [
              'Digital booking confirmation',
              'Access to property updates',
              'Exclusive guest perks',
              'Loyalty points accumulation'
            ],
            votingPower: 1
          }
        };

        const existingNFTs = JSON.parse(localStorage.getItem('ethereus_booking_nfts') || '[]');
        existingNFTs.push(bookingNFT);
        localStorage.setItem('ethereus_booking_nfts', JSON.stringify(existingNFTs));

        // Update booked dates
        const dates: string[] = [];
        const bookingStart = new Date(startDate);
        const bookingEnd = new Date(endDate);
        const current = new Date(bookingStart);
        
        while (current <= bookingEnd) {
          dates.push(current.toISOString().split('T')[0]);
          current.setDate(current.getDate() + 1);
        }
        
        setBookedDates(prev => [...prev, ...dates]);

        if (onBookingCreated) {
          onBookingCreated(booking);
        }

        alert(`Booking confirmed! You've paid ${totalPrice} HBAR for ${property.name}\nTransaction Hash: ${txHash}`);
        
        // Reset form
        setStartDate('');
        setEndDate('');
        setGuestEmail('');
        setGuestName('');
      } else {
        throw new Error('Transaction failed or timed out');
      }
    } catch (error: any) {
      console.error('Booking failed:', error);
      alert(`Booking failed: ${error.message}`);
    } finally {
      setIsBooking(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getMinDate = () => {
    return formatDate(new Date());
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 1);
    return formatDate(maxDate);
  };

  return (
    <div className="booking-system">
      <h3>Book This Property</h3>
      
      <div className="booking-form">
        <div className="form-row">
          <div className="form-group">
            <label>Check-in Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min={getMinDate()}
              max={getMaxDate()}
              className={isDateBooked(startDate) ? 'booked-date' : ''}
            />
          </div>
          
          <div className="form-group">
            <label>Check-out Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate || getMinDate()}
              max={getMaxDate()}
              className={isDateBooked(endDate) ? 'booked-date' : ''}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Your Name</label>
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Enter your full name"
            />
          </div>
          
          <div className="form-group">
            <label>Your Email</label>
            <input
              type="email"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
        </div>

        <div className="price-summary">
          <div className="price-breakdown">
            <div className="price-item">
              <span>Price per night:</span>
              <span>{property.price} HBAR</span>
            </div>
            <div className="price-item">
              <span>Nights:</span>
              <span>
                {startDate && endDate 
                  ? Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))
                  : 0
                }
              </span>
            </div>
            <div className="price-item total">
              <span>Total:</span>
              <span>{calculateTotalPrice()} HBAR</span>
            </div>
          </div>
        <div style={{ marginTop: 10, fontSize: 12, color: '#4a5568' }}>
          <strong>Legend:</strong> <span style={{ background: '#fed7d7', color: '#c53030', padding: '2px 6px', borderRadius: 8 }}>Booked/Blocked</span> dates are unavailable.
        </div>
        </div>

        <button
          className="book-button"
          onClick={handleBooking}
          disabled={isBooking || !startDate || !endDate || !guestEmail || !guestName}
        >
          {isBooking ? 'Processing...' : 'Book Now'}
        </button>
      </div>

      {bookedDates.length > 0 && (
        <div className="booked-dates-info">
          <h4>Unavailable Dates</h4>
          <div className="booked-dates-list">
            {bookedDates.slice(0, 10).map((date, index) => (
              <span key={index} className="booked-date-tag">
                {new Date(date).toLocaleDateString()}
              </span>
            ))}
            {blockedDates.filter(d => !bookedDates.includes(d)).slice(0, 10).map((date, index) => (
              <span key={`b-${index}`} className="booked-date-tag">
                {new Date(date).toLocaleDateString()}
              </span>
            ))}
            {bookedDates.length > 10 && (
              <span className="more-dates">+{bookedDates.length - 10} more</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingSystem;
