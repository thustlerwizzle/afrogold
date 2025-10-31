import React, { useState, useMemo } from 'react';
import { Property, PropertyFilters } from '../types/Property';
import PropertyCard from './PropertyCard';
import './PropertyList.css';

interface PropertyListProps {
  properties: Property[];
  onPropertySelect?: (property: Property) => void;
}

const PropertyList: React.FC<PropertyListProps> = ({ properties, onPropertySelect }) => {
  const [filters, setFilters] = useState<PropertyFilters>({
    searchTerm: '',
    minPrice: undefined,
    maxPrice: undefined,
    location: '',
    amenities: []
  });

  const [sortBy, setSortBy] = useState<'price-low' | 'price-high' | 'name'>('price-low');

  // Get unique locations for filter dropdown
  const uniqueLocations = useMemo(() => {
    const locations = properties.map(p => {
      const parts = p.location.split(',');
      return parts[parts.length - 2]?.trim() || parts[parts.length - 1]?.trim();
    });
    return Array.from(new Set(locations)).sort();
  }, [properties]);

  // Get unique amenities for filter
  const uniqueAmenities = useMemo(() => {
    const amenities = properties.flatMap(p => p.amenities);
    return Array.from(new Set(amenities)).sort();
  }, [properties]);

  // Filter and sort properties
  const filteredProperties = useMemo(() => {
    let filtered = properties.filter(property => {
      // Search term filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesSearch = 
          property.name.toLowerCase().includes(searchLower) ||
          property.description.toLowerCase().includes(searchLower) ||
          property.location.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Price range filter
      if (filters.minPrice !== undefined && property.price < filters.minPrice) {
        return false;
      }
      if (filters.maxPrice !== undefined && property.price > filters.maxPrice) {
        return false;
      }

      // Location filter
      if (filters.location) {
        const propertyLocation = property.location.toLowerCase();
        if (!propertyLocation.includes(filters.location.toLowerCase())) {
          return false;
        }
      }

      // Amenities filter
      if (filters.amenities && filters.amenities.length > 0) {
        const hasRequiredAmenities = filters.amenities.every(amenity =>
          property.amenities.includes(amenity)
        );
        if (!hasRequiredAmenities) return false;
      }

      return true;
    });

    // Sort properties
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [properties, filters, sortBy]);

  const handleFilterChange = (key: keyof PropertyFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      minPrice: undefined,
      maxPrice: undefined,
      location: '',
      amenities: []
    });
  };

  return (
    <div className="property-list-container">
      {/* Filters */}
      <div className="filters-section">
        <div className="filters-header">
          <h2>Find Your Perfect Property</h2>
          <p>{filteredProperties.length} properties found</p>
        </div>

        <div className="filters-grid">
          {/* Search */}
          <div className="filter-group">
            <label>Search</label>
            <input
              type="text"
              placeholder="Search by name, description, or location..."
              value={filters.searchTerm || ''}
              onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              className="filter-input"
            />
          </div>

          {/* Price Range */}
          <div className="filter-group">
            <label>Price Range (HBAR)</label>
            <div className="price-range">
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice || ''}
                onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                className="filter-input"
              />
              <span>-</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice || ''}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                className="filter-input"
              />
            </div>
          </div>

          {/* Location */}
          <div className="filter-group">
            <label>Location</label>
            <select
              value={filters.location || ''}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="filter-select"
            >
              <option value="">All Locations</option>
              {uniqueLocations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="filter-group">
            <label>Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="filter-select"
            >
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>

          {/* Clear Filters */}
          <div className="filter-group">
            <button onClick={clearFilters} className="clear-filters-btn">
              Clear All Filters
            </button>
          </div>
        </div>

        {/* Amenities Filter */}
        {uniqueAmenities.length > 0 && (
          <div className="amenities-filter">
            <label>Amenities</label>
            <div className="amenities-checkboxes">
              {uniqueAmenities.map(amenity => (
                <label key={amenity} className="amenity-checkbox">
                  <input
                    type="checkbox"
                    checked={filters.amenities?.includes(amenity) || false}
                    onChange={(e) => {
                      const currentAmenities = filters.amenities || [];
                      const newAmenities = e.target.checked
                        ? [...currentAmenities, amenity]
                        : currentAmenities.filter(a => a !== amenity);
                      handleFilterChange('amenities', newAmenities);
                    }}
                  />
                  <span>{amenity}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Properties Grid */}
      <div className="properties-grid">
        {filteredProperties.length > 0 ? (
          filteredProperties.map(property => (
            <PropertyCard
              key={property.id}
              property={property}
              onSelect={onPropertySelect}
            />
          ))
        ) : (
          <div className="no-results">
            <h3>No properties found</h3>
            <p>Try adjusting your search criteria or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyList;
