import React from 'react';
import { Property } from '../types/Property';
import './PropertyCard.css';

interface PropertyCardProps {
  property: Property;
  onSelect?: (property: Property) => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onSelect }) => {
  const handleClick = () => {
    if (onSelect) {
      onSelect(property);
    }
  };

  let nftInfo: { contract?: string; tokenId?: string; tx?: string } | null = null;
  try {
    // priority: inline (from recent mint), then global map
    const inline = { contract: (property as any).nftContract, tokenId: (property as any).nftTokenId, tx: (property as any).nftTx };
    const map = JSON.parse(localStorage.getItem('afg_property_nft_map') || '{}');
    const mapped = map[property.id] || {};
    nftInfo = { ...mapped, ...inline };
  } catch {}

  return (
    <div className="property-card" onClick={handleClick}>
      <div className="property-image-container">
        <img 
          src={property.imageUrl} 
          alt={property.name}
          className="property-image"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://via.placeholder.com/300x200?text=No+Image';
          }}
        />
        <div className="property-price">
          <span className="price-amount">{property.price}</span>
          <span className="price-currency">HBAR</span>
        </div>
      </div>
      
      <div className="property-content">
        <h3 className="property-name">{property.name}</h3>
        <p className="property-location">{property.location}</p>
        <p className="property-description">
          {property.description.length > 150 
            ? `${property.description.substring(0, 150)}...` 
            : property.description
          }
        </p>
        {nftInfo && ((nftInfo as any).token || nftInfo.contract || nftInfo.tx) && (
          <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
            <span className="amenity-tag">On-Chain</span>
            {(nftInfo as any).token ? (
              <a href={`https://hashscan.io/testnet/nft/${(nftInfo as any).token}/${(nftInfo as any).serial || 0}`} target="_blank" rel="noreferrer">{`HTS ${ (nftInfo as any).token } #${ (nftInfo as any).serial || '?' }`}</a>
            ) : nftInfo.tx ? (
              <a href={`https://hashscan.io/testnet/transaction/${nftInfo.tx}`} target="_blank" rel="noreferrer">View on HashScan</a>
            ) : (
              <a href={`https://hashscan.io/testnet/address/${nftInfo.contract}`} target="_blank" rel="noreferrer">Contract</a>
            )}
            {nftInfo.tokenId && (
              <span className="amenity-tag">Token #{nftInfo.tokenId}</span>
            )}
          </div>
        )}
        
        {property.amenities.length > 0 && (
          <div className="property-amenities">
            <div className="amenities-label">Amenities:</div>
            <div className="amenities-list">
              {property.amenities.slice(0, 3).map((amenity, index) => (
                <span key={index} className="amenity-tag">
                  {amenity}
                </span>
              ))}
              {property.amenities.length > 3 && (
                <span className="amenity-tag more">
                  +{property.amenities.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyCard;
