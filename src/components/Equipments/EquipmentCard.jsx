import React from 'react';
import { Link } from 'react-router-dom';
import './EquipmentCard.css';

const EquipmentCard = ({ equipmentModel, onDelete}) => {
  return (
    <div className="equipment-card">
      <div className="image-container">
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
        <p className="location-address">{equipmentModel.locationAddress}</p>
        <div className="price-per-day">
          <div>
            Price per day: <span className="price">{equipmentModel.pricePerDay.toFixed(2)} RON</span>
          </div>
          <Link to={`/equipments/equipmentModels/${equipmentModel.equipmentModelId}`} className="view-details-button">
            View details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EquipmentCard;
