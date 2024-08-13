import React from 'react';
import { Link } from 'react-router-dom';
import './EquipmentCard.css';

const EquipmentCard = ({ equipmentModel, onDelete}) => {
  const mapsLink = equipmentModel.locationAddress
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(equipmentModel.locationAddress)}`
    : "#";
  return (
    <div className="equipment-card">
      <div className="image-container">
      {equipmentModel.discountedPrice && (
          <div className="discount-label">15% OFF</div>
        )}
      <img src={equipmentModel.imageURL} alt={equipmentModel.equipmentModel} className="equipment-image" />
        {localStorage.getItem('userRole') === 'ADMIN' && (
          <button onClick={() => onDelete(equipmentModel.equipmentModelId)} className="delete-icon">
            <i className="bi bi-trash3"></i>
          </button>
        )}
      </div>
      <div className="equipment-info">
        <h3 className="equipment-title">{equipmentModel.equipmentModel}</h3>
        <p className="equipment-description">{equipmentModel.equipmentDescription}</p>
        <p className="location-address">
          <a
            href={mapsLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <i className="bi bi-geo-alt"></i> {equipmentModel.locationAddress}
          </a>
        </p>
        <div className="price-per-day">
        {equipmentModel.discountedPrice ? (
            <div>
              <span>Price per day: </span>
              <span className="old-price">{equipmentModel.pricePerDay.toFixed(2)} RON</span>
              <span className="discounted-price"> {equipmentModel.discountedPrice.toFixed(2)} RON</span>
            </div>
          ) : (
            <div>
              Price per day: <span className="price">{equipmentModel.pricePerDay.toFixed(2)} RON</span>
            </div>
          )}
          <Link to={`/equipments/equipmentModels/${equipmentModel.equipmentModelId}`} className="view-details-button">
            View details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EquipmentCard;
