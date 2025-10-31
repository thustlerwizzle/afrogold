import React, { useState, useRef, useEffect } from 'react';
import './SearchBar.css';

interface SearchBarProps {
  onSearch: (searchData: SearchData) => void;
}

export interface SearchData {
  location: string;
  startDate: string;
  endDate: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sample locations for autocomplete (in a real app, this would come from an API)
  const locationSuggestions = [
    'Kimberley, South Africa',
    'Cape Town, South Africa',
    'Johannesburg, South Africa',
    'Durban, South Africa',
    'Pretoria, South Africa',
    'Port Elizabeth, South Africa',
    'Bloemfontein, South Africa',
    'Nelspruit, South Africa',
    'Polokwane, South Africa',
    'Rustenburg, South Africa',
    'Orania, South Africa',
    'Philippolis, South Africa',
    'Edenburg, South Africa',
    'Ritchie, South Africa',
    'Fauresmith, South Africa',
    'Jacobsdal, South Africa',
    'Vanderkloof, South Africa',
    'Trompsburg, South Africa',
    'Kameelpan, South Africa',
    'Hopetown, South Africa'
  ];

  useEffect(() => {
    if (location.length > 2) {
      const filtered = locationSuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(location.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [location]);

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setLocation(suggestion);
    setShowSuggestions(false);
  };

  const handleSearch = () => {
    if (location && startDate && endDate) {
      onSearch({
        location,
        startDate,
        endDate
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
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
    <div className="search-bar-container">
      <div className="search-bar">
        <div className="search-field location-field">
          <input
            ref={inputRef}
            type="text"
            placeholder="Where do you want to go? (e.g., Kimberley)"
            value={location}
            onChange={handleLocationChange}
            onKeyPress={handleKeyPress}
            onFocus={() => location.length > 2 && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="search-input"
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="suggestions-dropdown">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="search-field date-field">
          <input
            type="date"
            placeholder="mm/dd/yyyy"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            min={getMinDate()}
            max={getMaxDate()}
            className="search-input date-input"
          />
        </div>

        <div className="search-field date-field">
          <input
            type="date"
            placeholder="mm/dd/yyyy"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={startDate || getMinDate()}
            max={getMaxDate()}
            className="search-input date-input"
          />
        </div>

        <button 
          className="search-button"
          onClick={handleSearch}
          disabled={!location || !startDate || !endDate}
        >
          <span className="search-icon">🔍</span>
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
