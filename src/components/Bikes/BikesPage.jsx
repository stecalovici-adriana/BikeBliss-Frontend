import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Modal, Button, Form } from 'react-bootstrap';
import BikeCard from './BikeCard';
import EquipmentCard from '../Equipments/EquipmentCard';
import './BikesPage.css'; 

const BikesPage = () => {
  const [showBikes, setShowBikes] = useState(true);
  const [sortedModels, setSortedModels] = useState([]);
  const [sortOrder, setSortOrder] = useState('price_asc');
  const [showModal, setShowModal] = useState(false);
  const [newBikeModel, setNewBikeModel] = useState({
    bikeModel: '',
    pricePerDay: '',
    bikeDescription: '',
    imageURL: '',
    locationId: '',
    bikes: Array(3).fill({ bikeStatus: "AVAILABLE" })
  });
  const [showEquipmentModal, setShowEquipmentModal] = useState(false);
const [newEquipmentModel, setNewEquipmentModel] = useState({
  equipmentModel: '',
  pricePerDay: '',
  equipmentDescription: '',
  imageURL: '',
  locationId: '',
  equipments: Array(4).fill({ equipmentStatus: "AVAILABLE" })
});

  const sortModels = useCallback((modelsArray) => {
    const sorted = [...modelsArray].sort((a, b) => sortOrder === 'price_desc' ? b.pricePerDay - a.pricePerDay : a.pricePerDay - b.pricePerDay);
    setSortedModels(sorted);
  }, [sortOrder]);

  useEffect(() => {
    document.title = "BikeBliss - Browse Models";

    const fetchModels = async (url) => {
      try {
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          sortModels(data);
        } else {
          console.error(`HTTP Error: ${response.status}`);
        }
      } catch (error) {
        console.error('Failed to fetch models:', error);
      }
    };

    const modelUrl = showBikes ? 'http://localhost:8080/api/bikes/models' : 'http://localhost:8080/api/equipments/equipmentModels';
    fetchModels(modelUrl);
  }, [showBikes, sortModels]);

  const handleSortOrderChange = (order) => {
    setSortOrder(order);
  };
const handleInputChange = (event) => {
  const { name, value } = event.target;
  setNewBikeModel(prevState => ({ ...prevState, [name]: value }));
};

const handleFormSubmit = async (event) => {
  event.preventDefault();


  const payload = {
    ...newBikeModel,
    pricePerDay: parseFloat(newBikeModel.pricePerDay), 
    locationId: parseInt(newBikeModel.locationId), 
    bikes: newBikeModel.bikes 
  };

  const apiUrl = 'http://localhost:8080/api/bikes/addModels';
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      alert('Bike model added successfully!');
      setShowModal(false); 
      // Optionally, refresh the list of bike models
    } else {
      const errorData = await response.json();
      alert(`Failed to add bike model: ${errorData.message}`);
    }
  } catch (error) {
    console.error('Failed to submit the form:', error);
    alert('Error submitting form');
  }
};

const handleEquipmentInputChange = event => {
  const { name, value } = event.target;
  setNewEquipmentModel(prevState => ({ ...prevState, [name]: value }));
};

const payloadEq = {
  ...newEquipmentModel,
  pricePerDay: parseFloat(newEquipmentModel.pricePerDay), 
  locationId: parseInt(newEquipmentModel.locationId),
  equipments: newEquipmentModel.equipments
}
const handleEquipmentSubmit = async (event) => {
  event.preventDefault();
  try {
    const response = await fetch('http://localhost:8080/api/equipments/addEquipmentModels', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
      },
      body: JSON.stringify(payloadEq)
    });

    if (response.ok) {
      alert('Equipment model added successfully!');
      setShowEquipmentModal(false);
    } else {
      const errorData = await response.json();
      alert(`Failed to add equipment model: ${errorData.message}`);
    }
  } catch (error) {
    console.error('Failed to submit the form:', error);
    alert('Error submitting form');
  }
};
const handleDeleteBikeModel = async (modelId) => {
  try {
    const response = await fetch(`http://localhost:8080/api/bikes/models/${modelId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`, // Ensure you're passing the correct auth token
        'Content-Type': 'application/json'
      },
    });

    if (response.ok) {
      alert('Bike model deleted successfully!');
      // Optionally, refresh the list or remove the item from the state
    } else {
      const errorData = await response.json();
      alert(`Failed to delete bike model: ${errorData.message}`);
    }
  } catch (error) {
    console.error('Failed to delete bike model:', error);
    alert('Error deleting bike model');
  }
};
const handleDeleteEquipmentModel = async (equipmentModelId) => {
  try {
    const response = await fetch(`http://localhost:8080/api/equipments/models/${equipmentModelId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
        'Content-Type': 'application/json'
      },
    });

    if (response.ok) {
      alert('Equipment model deleted successfully!');
      // Optionally, refresh the list or remove the item from the state
    } else {
      const errorData = await response.json();
      alert(`Failed to delete equipment model: ${errorData.message}`);
    }
  } catch (error) {
    console.error('Failed to delete equipment model:', error);
    alert('Error deleting equipment model');
  }
};
const toggleModal = () => setShowModal(!showModal);

  return (
    <div>
      <div className="title-and-filters">
      {localStorage.getItem('userRole') === 'ADMIN' && (
          <Link to="/admin/dashboard" className="page-link">
            <h1 className='page-title'>Owner Page</h1></Link>
        )}
        <Link to="#" onClick={() => setShowBikes(true)} className="page-link">
          <h1 className="page-title">Bike Models</h1>
        </Link>
        <Link to="#" onClick={() => setShowBikes(false)} className="page-link">
          <h1 className="page-title">Equipment Models</h1>
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
      {localStorage.getItem('userRole') === 'ADMIN' && showBikes && (
  <div className="add-model-button-container">
    <Button variant="primary" onClick={toggleModal} className="add-model-button">
      <i className="bi bi-plus-circle"></i> Add Bike
    </Button>
  </div>
)}
      <Modal show={showModal} onHide={toggleModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add bike</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleFormSubmit} className="bike-form">
            <Form.Group className="mb-3">
              <Form.Label>Model Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter model name"
                name="bikeModel"
                required
                value={newBikeModel.bikeModel}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price Per Day</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter price per day"
                name="pricePerDay"
                required
                value={newBikeModel.pricePerDay}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="bikeDescription"
                required
                value={newBikeModel.bikeDescription}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="url"
                placeholder="Enter image URL"
                name="imageURL"
                required
                value={newBikeModel.imageURL}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Location ID</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter location ID"
                name="locationId"
                required
                value={newBikeModel.locationId}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={toggleModal}>Close</Button>
          <Button variant="primary" type="submit" onClick={handleFormSubmit}>Submit</Button>
        </Modal.Footer>
      </Modal>
      {localStorage.getItem('userRole') === 'ADMIN' && !showBikes && (
  <div className="add-model-button-container">
    <Button variant="primary" onClick={() => setShowEquipmentModal(true)} className="add-model-button">
      <i className="bi bi-plus-circle"></i> Add Equipment
    </Button>
  </div>
)}

<Modal show={showEquipmentModal} onHide={() => setShowEquipmentModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Equipment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEquipmentSubmit} className="equipment-form">
            <Form.Group className="mb-3">
              <Form.Label>Model Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter equipment model"
                name="equipmentModel"
                required
                value={newEquipmentModel.equipmentModel}
                onChange={e => setNewEquipmentModel({...newEquipmentModel, [e.target.name]: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price Per Day</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter price per day"
                name="pricePerDay"
                required
                value={newEquipmentModel.pricePerDay}
                onChange={handleEquipmentInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="equipmentDescription"
                required
                value={newEquipmentModel.equipmentDescription}
                onChange={e => setNewEquipmentModel({...newEquipmentModel, [e.target.name]: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="url"
                placeholder="Enter image URL"
                name="imageURL"
                required
                value={newEquipmentModel.imageURL}
                onChange={e => setNewEquipmentModel({...newEquipmentModel, [e.target.name]: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Location ID</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter location ID"
                name="locationId"
                required
                value={newEquipmentModel.locationId}
                onChange={e => setNewEquipmentModel({...newEquipmentModel, [e.target.name]: e.target.value})}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEquipmentModal(false)}>Close</Button>
          <Button variant="primary" type="submit" onClick={handleEquipmentSubmit}>Submit</Button>
        </Modal.Footer>
      </Modal>
      <div className="models-container">
        {sortedModels.map(model => (
          showBikes ? 
          <BikeCard key={model.modelId} bikeModel={model} onDelete={handleDeleteBikeModel}/> : 
          <EquipmentCard key={model.equipmentModelId} equipmentModel={model} onDelete={handleDeleteEquipmentModel}/>
        ))}
      </div>
    </div>
  );
};

export default BikesPage;
