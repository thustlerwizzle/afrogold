import React, { useState } from 'react';
import { Property } from '../types/Property';
import './PropertyListingForm.css';

interface PropertyListingFormProps {
  onSubmit: (propertyData: PropertyFormData) => void;
  onCancel: () => void;
}

export interface PropertyFormData {
  name: string;
  description: string;
  location: string;
  price: number;
  amenities: string[];
  imageUrl: string;
  hostWallet: string;
  contactDetails: {
    phone: string;
    email: string;
    address: string;
  };
}

const PropertyListingForm: React.FC<PropertyListingFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<PropertyFormData>({
    name: '',
    description: '',
    location: '',
    price: 0,
    amenities: [],
    imageUrl: '',
    hostWallet: '',
    contactDetails: {
      phone: '',
      email: '',
      address: ''
    }
  });

  const [currentAmenity, setCurrentAmenity] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const commonAmenities = [
    'Free WiFi',
    'Air Conditioning',
    'Private Bathroom',
    'Kitchen',
    'Parking',
    'Swimming Pool',
    'Garden',
    'Balcony',
    'TV',
    'Washing Machine',
    'Dishwasher',
    'Microwave',
    'Refrigerator',
    'Coffee Maker',
    'Iron',
    'Hair Dryer',
    'Safe',
    'Desk',
    'Terrace',
    'BBQ Facilities'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('contactDetails.')) {
      const contactField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        contactDetails: {
          ...prev.contactDetails,
          [contactField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'price' ? parseFloat(value) || 0 : value
      }));
    }
  };

  const addAmenity = () => {
    if (currentAmenity.trim() && !formData.amenities.includes(currentAmenity.trim())) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, currentAmenity.trim()]
      }));
      setCurrentAmenity('');
    }
  };

  const removeAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter(a => a !== amenity)
    }));
  };

  const addCommonAmenity = (amenity: string) => {
    if (!formData.amenities.includes(amenity)) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, amenity]
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.location || 
        !formData.price || !formData.hostWallet || !formData.contactDetails.email) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Failed to submit property:', error);
      alert('Failed to submit property. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="property-listing-form-container">
      <div className="property-listing-form">
        <div className="form-header">
          <h2>List Your Property</h2>
          <p>Share your property with travelers and earn HBAR</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Basic Information</h3>
            
            <div className="form-group">
              <label htmlFor="name">Property Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Enter property name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                placeholder="Describe your property, its features, and what makes it special"
              />
            </div>

            <div className="form-group">
              <label htmlFor="location">Location *</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                placeholder="Enter full address"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">Price per Night (HBAR) *</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>

              <div className="form-group">
                <label htmlFor="imageUrl">Image URL</label>
                <input
                  type="url"
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Host Information</h3>
            
            <div className="form-group">
              <label htmlFor="hostWallet">Your Wallet Address *</label>
              <input
                type="text"
                id="hostWallet"
                name="hostWallet"
                value={formData.hostWallet}
                onChange={handleInputChange}
                required
                placeholder="Enter your wallet address for payments"
              />
            </div>

            <div className="form-group">
              <label htmlFor="contactDetails.email">Contact Email *</label>
              <input
                type="email"
                id="contactDetails.email"
                name="contactDetails.email"
                value={formData.contactDetails.email}
                onChange={handleInputChange}
                required
                placeholder="Email for guest communications"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="contactDetails.phone">Phone Number</label>
                <input
                  type="tel"
                  id="contactDetails.phone"
                  name="contactDetails.phone"
                  value={formData.contactDetails.phone}
                  onChange={handleInputChange}
                  placeholder="Phone number"
                />
              </div>

              <div className="form-group">
                <label htmlFor="contactDetails.address">Contact Address</label>
                <input
                  type="text"
                  id="contactDetails.address"
                  name="contactDetails.address"
                  value={formData.contactDetails.address}
                  onChange={handleInputChange}
                  placeholder="Additional contact address"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Amenities</h3>
            
            <div className="amenities-input">
              <div className="amenity-input-group">
                <input
                  type="text"
                  value={currentAmenity}
                  onChange={(e) => setCurrentAmenity(e.target.value)}
                  placeholder="Add custom amenity"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
                />
                <button type="button" onClick={addAmenity} className="add-amenity-btn">
                  Add
                </button>
              </div>
            </div>

            <div className="common-amenities">
              <h4>Common Amenities</h4>
              <div className="amenity-chips">
                {commonAmenities.map(amenity => (
                  <button
                    key={amenity}
                    type="button"
                    className={`amenity-chip ${formData.amenities.includes(amenity) ? 'selected' : ''}`}
                    onClick={() => addCommonAmenity(amenity)}
                  >
                    {amenity}
                  </button>
                ))}
              </div>
            </div>

            <div className="selected-amenities">
              <h4>Selected Amenities</h4>
              <div className="selected-amenity-list">
                {formData.amenities.map((amenity, index) => (
                  <span key={index} className="selected-amenity">
                    {amenity}
                    <button
                      type="button"
                      onClick={() => removeAmenity(amenity)}
                      className="remove-amenity"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="submit-btn">
              {isSubmitting ? 'Listing Property...' : 'List Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PropertyListingForm;
