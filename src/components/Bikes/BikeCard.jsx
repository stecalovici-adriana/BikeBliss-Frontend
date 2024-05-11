import React from 'react';
import { Link } from 'react-router-dom';
import './BikeCard.css';

const BikeCard = ({ bikeModel }) => {
  return (
    <div className="bike-card">
      <img src={bikeModel.imageURL} alt={bikeModel.bikeModel} className="bike-image" />
      <div className="bike-info">
        <h3 className="bike-title">{bikeModel.bikeModel}</h3>
        <p className="bike-description">{bikeModel.bikeDescription}</p>
        <p className="location-address">{bikeModel.locationAddress}</p>
        <div className="price-per-day">
          <div>
            Price per day: <span className="price">{bikeModel.pricePerDay.toFixed(2)} RON</span>
          </div>
          <Link to={`/bikes/models/${bikeModel.modelId}`} className="view-details-button">
            <i className="bi bi-cart"></i> View details
          </Link>
        </div>
      </div>
    </div>
  );
};


export default BikeCard;