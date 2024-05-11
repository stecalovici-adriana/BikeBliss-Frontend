import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import BikeCard from './BikeCard';
import './BikesPage.css';

const BikesPage = () => {
  const [bikeModels, setBikeModels] = useState([]);
  const [sortedBikeModels, setSortedBikeModels] = useState([]);
  const [sortOrder, setSortOrder] = useState('price_asc');

  const sortBikeModels = useCallback((modelsArray) => {
    const sorted = [...modelsArray].sort((a, b) => {
      if (sortOrder === 'price_desc') {
        return b.pricePerDay - a.pricePerDay;
      } else {
        return a.pricePerDay - b.pricePerDay;
      }
    });
    setSortedBikeModels(sorted);
  }, [sortOrder]);

  useEffect(() => {
    document.title = "BikeBliss - Browse Bike Models";
    
    const fetchBikeModels = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/bikes/models');
        if (response.ok) {
          const data = await response.json();
          setBikeModels(data);
          sortBikeModels(data);
        } else {
          console.error(`HTTP Error: ${response.status}`);
        }
      } catch (error) {
        console.error('Failed to fetch bike models:', error);
      }
    };

    fetchBikeModels();
  }, [sortBikeModels]);

  useEffect(() => {
    sortBikeModels(bikeModels);
  }, [sortOrder, bikeModels, sortBikeModels]);

  const handleSortOrderChange = (order) => {
    setSortOrder(order); 
  };

  return (
    <div>
      <div className="title-and-filters">
        <Link to="/bikes-page" className="page-link">
          <h1 className="page-title">Bike Models</h1>
        </Link>
        <div className="filter-dropdown">
          <span className="filter-button">
            <i className="bi bi-filter"></i> Filters
          </span>
          <div className="dropdown-content">
            <ul>
              <li onClick={() => handleSortOrderChange('price_asc')}>Ascending price</li>
              <li onClick={() => handleSortOrderChange('price_desc')}>Descending price</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="bikes-container">
        {sortedBikeModels.map(model => (
          <BikeCard key={model.modelId} bikeModel={model} />
        ))}
      </div>
    </div>
  );
};

export default BikesPage;
