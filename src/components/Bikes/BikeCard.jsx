import React from 'react';
import { Link } from 'react-router-dom';
import './BikeCard.css';

const BikeCard = ({ bikeModel, onDelete }) => {
  const mapsLink = bikeModel.locationAddress
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(bikeModel.locationAddress)}`
    : "#";
  return (
    <div className="bike-card">
      <div className="image-container">
      {bikeModel.discountedPrice && (
          <div className="discount-label">20% OFF</div>
        )}
        <img src={bikeModel.imageURL} alt={bikeModel.bikeModel} className="bike-image" />
        {localStorage.getItem('userRole') === 'ADMIN' && (
          <button onClick={() => onDelete(bikeModel.modelId)} className="delete-icon">
            <i className="bi bi-trash3"></i>
          </button>
        )}
      </div>
      <div className="bike-info">
        <h3 className="bike-title">{bikeModel.bikeModel}</h3>
        <p className="bike-description">{bikeModel.bikeDescription}</p>
        <p className="location-address">
          <a
            href={mapsLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <i className="bi bi-geo-alt"></i> {bikeModel.locationAddress}
          </a>
        </p>
        <div className="price-per-day">
          {bikeModel.discountedPrice ? (
             <div>
              <span>Price per day: </span>
              <span className="old-price">{bikeModel.pricePerDay.toFixed(2)} RON</span>
              <span className="discounted-price"> {bikeModel.discountedPrice.toFixed(2)} RON</span>
            </div>
          ) : (
            <div>
              Price per day: <span className="price">{bikeModel.pricePerDay.toFixed(2)} RON</span>
            </div>
          )}
          <Link to={`/bikes/models/${bikeModel.modelId}`} className="view-details-button">
            <i className="bi bi-cart"></i> View details
          </Link>
        </div>
      </div>
    </div>
  );
};


export default BikeCard;