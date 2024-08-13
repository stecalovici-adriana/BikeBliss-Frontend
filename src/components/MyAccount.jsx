import React, { useState, useEffect} from "react";
import { useNavigate} from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";
import "./MyAccount.css";
import FeedbackModal from './Feedback/FeedbackModal';

function MyAccount() {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [rentals, setRentals] = useState([]);
  const [editShow, setEditShow] = useState(false);
  const [showRentals, setShowRentals] = useState(true);
  const [editFormData, setEditFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    birthDate: "",
  });
  const [showRentalDetails, setShowRentalDetails] = useState(false);
  const [selectedRental, setSelectedRental] = useState(null);
  const [activeRentals, setActiveRentals] = useState([]);
  const [showActiveRentals, setShowActiveRentals] = useState(false);
  const [pendingRentals, setPendingRentals] = useState([]);
  const [showPendingRentals, setShowPendingRentals] = useState(false);
  const [showCompletedRentals, setShowCompletedRentals] = useState(false);
  const [completedRentals, setCompletedRentals] = useState([]);
  const [equipmentRentals, setEquipmentRentals] = useState([]);
  const [activeEquipmentRentals, setActiveEquipmentRentals] = useState([]);
  const [pendingEquipmentRentals, setPendingEquipmentRentals] = useState([]);
  const [completedEquipmentRentals, setCompletedEquipmentRentals] = useState([]);
  const [feedbackModalShow, setFeedbackModalShow] = useState(false);
  const [selectedRentalForFeedback,setSelectedRentalForFeedback] = useState(null);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [existingFeedback, setExistingFeedback] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');
  
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUserDetails = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/users/details",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setUserDetails(data);
        setEditFormData({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          username: data.username,
          birthDate: data.birthDate?.split("T")[0],
        });
      } catch (error) {
        console.error("Fetching user details failed:", error);
        navigate("/login");
      }
    };

    const fetchRentals = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/rentals/user-rentals",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const rentalData = await response.json();
        setRentals(rentalData);
      } catch (error) {
        console.error("Fetching rentals failed:", error);
      }
    };
    const fetchEquipmentRentals = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/equipmentRentals/user-rentals",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const rentalData = await response.json();
        setEquipmentRentals(rentalData);
      } catch (error) {
        console.error("Fetching equipment rentals failed:", error);
      }
    };
    const fetchActiveRentals = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/rentals/active-rentals",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch active rentals");
        const data = await response.json();
        setActiveRentals(data);
      } catch (error) {
        console.error("Error fetching active rentals:", error);
      }
    };
    const fetchActiveEquipmentRentals = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/equipmentRentals/active-rentals",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch active equipment rentals");
        const data = await response.json();
        setActiveEquipmentRentals(data);
      } catch (error) {
        console.error("Error fetching active equipment rentals:", error);
      }
    };
    const fetchPendingRentals = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/rentals/pending-rentals",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch pending rentals");
        const data = await response.json();
        setPendingRentals(data);
      } catch (error) {
        console.error("Error fetching pending rentals:", error);
      }
    };
    const fetchPendingEquipmentRentals = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/equipmentRentals/pending-rentals",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch pending equipment rentals");
        const data = await response.json();
        setPendingEquipmentRentals(data);
      } catch (error) {
        console.error("Error fetching pending equipment rentals:", error);
      }
    };
    const fetchCompletedRentals = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/rentals/completed-rentals",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch completed rentals");
        const data = await response.json();
        setCompletedRentals(data);
      } catch (error) {
        console.error("Error fetching completed rentals:", error);
      }
    };
    const fetchCompletedEquipmentRentals = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/equipmentRentals/completed-rentals",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch completed equipment rentals");
        const data = await response.json();
        setCompletedEquipmentRentals(data);
      } catch (error) {
        console.error("Error fetching completed equipment rentals:", error);
      }
    };

    fetchUserDetails();
    fetchRentals();
    fetchEquipmentRentals();
    fetchActiveRentals();
    fetchActiveEquipmentRentals();
    fetchPendingRentals();
    fetchPendingEquipmentRentals();
    fetchCompletedRentals();
    fetchCompletedEquipmentRentals();
  }, [navigate]);

  const handleShowEdit = () => setEditShow(true);
  const handleCloseEdit = () => setEditShow(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setEditFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSaveChanges = async () => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      alert("You are not logged in.");
      navigate("/login");
      return;
    }
    if (!editFormData.email.includes("@")) {
      alert("Please enter a valid email address.");
      return;
    }

    if (!userDetails || !userDetails.userId) {
      alert("User ID is missing. Cannot update.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/users/${userDetails.userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editFormData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Failed to update: ${errorData.message}`);
        throw new Error(
          `HTTP error! status: ${response.status} - ${errorData.message}`
        );
      }

      const updatedUser = await response.json();
      setUserDetails(updatedUser);
      setUpdateMessage("User details updated successfully. Please login again.");
      setTimeout(() => {
        handleCloseEdit();
        setUpdateMessage('');
        navigate("/login");

      }, 10000);
    } catch (error) {
      console.error("Failed to update user details:", error);
      alert("An error occurred while updating user details.");
    }
  };

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "long", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };
  const handleRentalClick = (rental) => {
    setSelectedRental(rental);
    if (rental) {
      setSelectedRentalForFeedback(rental);
    } else {
      console.error('No rental data available');
    }
    setShowRentalDetails(true);
  };

  const handleCloseRentalDetails = () => {
    setShowRentalDetails(false);
    setSelectedRental(null);
  };
  const handleCancelRental = async () => {
    if (!selectedRental || (!selectedRental.rentalId && !selectedRental.equipmentRentalId)) {
        alert('No rental selected or rental ID is missing.');
        return;
    }

    const rentalId = selectedRental.rentalId;
    const equipmentRentalId = selectedRental.equipmentRentalId;

    try {
        const url = rentalId
            ? `http://localhost:8080/api/rentals/cancelRental/${rentalId}`
            : `http://localhost:8080/api/equipmentRentals/cancelEquipmentRental/${equipmentRentalId}`;

        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            const errorText = await response.text(); 
            try {
                const errorData = JSON.parse(errorText);
                alert(`Failed to cancel rental: ${errorData.message}`);
            } catch (e) {
                alert(`Failed to cancel rental: ${errorText}`);
            }
            return;
        }

        alert('Rental canceled successfully.');
        setRentals(prevRentals => prevRentals.filter(rental => rental.rentalId !== rentalId && rental.equipmentRentalId !== equipmentRentalId));
        setSelectedRental(null);
    } catch (error) {
        console.error("An error occurred while canceling the rental:", error);
        alert("An error occurred while canceling the rental.");
    }
};

const handleFeedbackClick = async (event, rental) => {
  event.stopPropagation();
  try {
    const url = rental.bikeModel
      ? `http://localhost:8080/api/feedback/${rental.rentalId}`
      : `http://localhost:8080/api/feedbackEq/${rental.equipmentRentalId}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
      }
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const text = await response.text();
    if (!text) {
      setFeedbackSubmitted(false);
      setExistingFeedback(null);
    } else {
      const feedbackData = JSON.parse(text);
      if (feedbackData.length > 0) {
        setFeedbackSubmitted(true);
        setExistingFeedback({
          text: feedbackData[0].feedbackText,
          rating: feedbackData[0].rating
        });
      } else {
        setFeedbackSubmitted(false);
        setExistingFeedback(null);
      }
    }
  } catch (error) {
    console.error('Error fetching feedback:', error);
    alert('Failed to load feedback. Please try again.');
  }
  setFeedbackModalShow(true);
};

const updateRentalsAfterFeedback = (rentalId) => {
    setCompletedRentals(completedRentals.map(rental => {
      if (rental.rentalId === rentalId) {
        return { ...rental, feedbackSubmitted: true }; 
      }
      return rental;
    }));
  };
  const handleFeedbackSubmit = async (rentalId, feedback, isBike) => {
    try {
      const url = isBike
        ? `http://localhost:8080/api/feedback/submit/${rentalId}`
        : `http://localhost:8080/api/feedbackEq/submit/${rentalId}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
        },
        body: JSON.stringify({
          feedbackText: feedback.text,
          rating: feedback.rating
        })
      });
  
      if (response.ok) {
        alert('Feedback submitted successfully');
        setFeedbackSubmitted(true); 
        setExistingFeedback(feedback); 
        setFeedbackModalShow(false); 
        updateRentalsAfterFeedback(rentalId); 
      } else {
        const errorData = await response.json();
        alert(`Failed to submit feedback: ${errorData.message || 'An error occurred'}`);
      }
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      alert('Failed to submit feedback due to a network error.');
    }
  };
  
  if (!userDetails) {
    return <div>Loading...</div>;
  }

  const combinedRentals = [...rentals, ...equipmentRentals];
  const combinedActiveRentals = [...activeRentals, ...activeEquipmentRentals];
  const combinedPendingRentals = [...pendingRentals, ...pendingEquipmentRentals];
  const combinedCompletedRentals = [...completedRentals, ...completedEquipmentRentals];

  return (
    <div className="dasboard-cont">
      <div className="content-container">
      <div className="user-details-section">
      <p className="sidebar-title">User</p>
        <img
          src="https://icons.veryicon.com/png/o/internet--web/prejudice/user-128.png"
          alt="User Icon"
          className="user-icon"
        />

        <div className="header-section">
          <h2>Welcome {userDetails.firstName}, </h2>
          <i
            className="bi bi-gear-fill"
            onClick={handleShowEdit}
            style={{ cursor: "pointer" }}
          ></i>{" "}
        </div>
        <Button
  onClick={() => {
    setShowProfile(true);
    setShowRentals(false);
    setShowActiveRentals(false);
    setShowPendingRentals(false);
    setShowCompletedRentals(false);
  }}
  variant="outline-secondary"
  className="account-settings-button"
  style={{ margin: "10px 0" }}
>
  <i className="bi bi-person-fill"></i> Profile
  <i className="bi bi-caret-right-fill"></i>
</Button>
        <Button
          onClick={() => {
            setShowRentals(true);
            setShowActiveRentals(false);
            setShowPendingRentals(false);
            setShowCompletedRentals(false);
            setShowProfile(false);
          }}
          variant="outline-secondary"
          className="account-settings-button"
          style={{ margin: "10px 0" }}
        >
          <i className="bi bi-bicycle"></i> Rental History
          <i className="bi bi-caret-right-fill"></i>
        </Button>
        <Button
          onClick={() => {
            setShowActiveRentals(true);
            setShowRentals(false);
            setShowPendingRentals(false);
            setShowCompletedRentals(false);
            setShowProfile(false);
          }}
          variant="outline-secondary"
          className="account-settings-button"
          style={{ margin: "10px 0" }}
        >
          <i className="bi bi-bicycle"></i> Active Rentals
          <i className="bi bi-caret-right-fill"></i>
        </Button>
        <Button
          onClick={() => {
            setShowPendingRentals(true);
            setShowRentals(false);
            setShowActiveRentals(false);
            setShowCompletedRentals(false);
            setShowProfile(false);
          }}
          variant="outline-secondary"
          className="account-settings-button"
          style={{ margin: "10px 0" }}>
          <i className="bi bi-clock-history"></i> Pending Rentals
          <i className="bi bi-caret-right-fill"></i>
        </Button>
        <Button
          onClick={() => {
            setShowCompletedRentals(true);
            setShowRentals(false);
            setShowActiveRentals(false);
            setShowPendingRentals(false);
            setShowProfile(false);
          }}
          variant="outline-secondary"
          className="account-settings-button"
          style={{ margin: "10px 0" }}
        >
          <i className="bi bi-archive"></i> Completed Rentals
          <i className="bi bi-caret-right-fill"></i>
        </Button>
      </div>
      {showActiveRentals && (
  <div className="rentals-section">
    <h2>Active Rentals</h2>
    {combinedActiveRentals.length > 0 ? (
      <ul className="rentals-list">
        {combinedActiveRentals.map((rental, index) => (
          <li
            key={index}
            className="rental-item"
            onClick={() => handleRentalClick(rental)}
          >
            <div className="rental-preview">
              <img
                src={rental.bikeImageURL || rental.equipmentImageURL}
                alt="Rental"
                className="rental-bike-image"
              />
              <div className="rental-brief">
                <p>
                {rental.bikeModel || rental.equipmentModel} rented from {formatDate(rental.startDate)} to{" "}
                {formatDate(rental.endDate)}
                </p>
                <i className="bi bi-caret-right-fill expand-icon"></i>
              </div>
            </div>
          </li>
        ))}
      </ul>
    ) : (
      <p className="no-rentals-message">You don't have any active rentals yet.</p>
    )}
  </div>
)}
      {showPendingRentals && (
          <div className="rentals-section">
            <h2>Pending Rentals</h2>
            {combinedPendingRentals.length > 0 ? (
              <ul className="rentals-list">
                {combinedPendingRentals.map((rental, index) => (
                  <li
                    key={index}
                    className="rental-item"
                    onClick={() => handleRentalClick(rental)}
                  >
                    <div className="rental-preview">
                      <img
                        src={rental.bikeImageURL || rental.equipmentImageURL}
                        alt="Rental"
                        className="rental-bike-image"
                      />
                      <div className="rental-brief">
                        <p>
                          {rental.bikeModel || rental.equipmentModel} rented from {formatDate(rental.startDate)} to{" "}
                          {formatDate(rental.endDate)}
                        </p>
                        <i className="bi bi-caret-right-fill expand-icon"></i>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-rentals-message">You have no pending rentals.</p>
            )}
          </div>
        )}

        {showCompletedRentals && (
          <div className="rentals-section">
            <h2>Completed Rentals</h2>
            {combinedCompletedRentals.length > 0 ? (
              <ul className="rentals-list">
                {combinedCompletedRentals.map((rental, index) => (
                  <li
                    key={rental.rentalId}
                    className="rental-item"
                    onClick={() => handleRentalClick(rental)}
                  >
                    <div className="rental-preview">
                      <img
                        src={rental.bikeImageURL || rental.equipmentImageURL}
                        alt="Rental"
                        className="rental-bike-image"
                      />
                      <div className="rental-brief">
                        <p>
                          {rental.bikeModel || rental.equipmentModel} rented from {formatDate(rental.startDate)} to{" "}
                          {formatDate(rental.endDate)}
                        </p>
                        <i className="bi bi-caret-right-fill expand-icon"></i>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-rentals-message">You have no completed rentals.</p>
            )}
          </div>
        )}

        {showRentals && (
          <div className="rentals-section">
            <h2>Rental History</h2>
            {combinedRentals.length > 0 ? (
              <ul className="rentals-list">
                {combinedRentals.map((rental, index) => (
                  <li
                    key={index}
                    className="rental-item"
                    onClick={() => handleRentalClick(rental)}
                  >
                    <div className="rental-preview">
                      <img
                        src={rental.bikeImageURL || rental.equipmentImageURL}
                        alt="Rental"
                        className="rental-bike-image"
                      />
                      <div className="rental-brief">
                        <p>
                          {rental.bikeModel || rental.equipmentModel} rented from {formatDate(rental.startDate)} to{" "}
                          {formatDate(rental.endDate)}
                        </p>
                        <i className="bi bi-caret-right-fill expand-icon"></i>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div>
                <p className="no-rentals-message">You haven't rented anything yet.</p>
                <Button
                  className="link-button"
                  onClick={() => navigate("/bikes-page")}
                >
                  Start Rentals
                </Button>
              </div>
            )}
          </div>
        )}

{showProfile && (
  <div className="profile-section">
    <div className="profile-header">
      <h2>Profile</h2>
      <Button variant="outline-secondary" className="edit-button" onClick={handleShowEdit}>
        <i className="bi bi-pencil-square"></i>
      </Button>
    </div>
    <p className="section-label">Account Details</p>
    <hr />
    <Form>
      <Form.Group className="mb-3">
        <div className="info-line">
          <span className="info-label">First Name:</span> <span className="info-value">{editFormData.firstName}</span>
        </div>
      </Form.Group>
      <Form.Group className="mb-3">
        <div className="info-line">
          <span className="info-label">Last Name:</span> <span className="info-value">{editFormData.lastName}</span>
        </div>
      </Form.Group>
      <Form.Group className="mb-3">
        <div className="info-line">
          <span className="info-label">Email:</span> <span className="info-value">{editFormData.email}</span>
        </div>
      </Form.Group>
      <Form.Group className="mb-3">
        <div className="info-line">
          <span className="info-label">Username:</span> <span className="info-value">{editFormData.username}</span>
        </div>
      </Form.Group>
      <Form.Group className="mb-3">
  <div className="info-line">
    <span className="info-label">Birth Date:</span>
    <span className="info-value">{formatDate(editFormData.birthDate)}</span>
  </div>
</Form.Group>
    </Form>
  </div>
)}
<Modal show={editShow} onHide={handleCloseEdit} centered>
  <Modal.Header closeButton className="edit-modal-header">
    <Modal.Title className="edit-modal-title">Edit User Details</Modal.Title>
  </Modal.Header>
  <Modal.Body className="edit-modal-body">
    <Form>
      <Form.Group className="mb-3">
        <Form.Label className="form-label">First Name</Form.Label>
        <div className="input-group">
          <span className="input-group-text icon-no-bg"><i className="bi bi-person"></i></span>
          <Form.Control
            type="text"
            name="firstName"
            value={editFormData.firstName}
            onChange={handleChange}
            className="form-control edit-input"
          />
        </div>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label className="form-label">Last Name</Form.Label>
        <div className="input-group">
          <span className="input-group-text icon-no-bg"><i className="bi bi-person"></i></span>
          <Form.Control
            type="text"
            name="lastName"
            value={editFormData.lastName}
            onChange={handleChange}
            className="form-control edit-input"
          />
        </div>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label className="form-label">Email</Form.Label>
        <div className="input-group">
          <span className="input-group-text icon-no-bg"><i className="bi bi-envelope"></i></span>
          <Form.Control
            type="email"
            name="email"
            value={editFormData.email}
            onChange={handleChange}
            className="form-control edit-input"
          />
        </div>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label className="form-label">Username</Form.Label>
        <div className="input-group">
          <span className="input-group-text icon-no-bg"><i className="bi bi-person-badge"></i></span>
          <Form.Control
            type="text"
            name="username"
            value={editFormData.username}
            onChange={handleChange}
            className="form-control edit-input"
          />
        </div>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label className="form-label">Birth Date</Form.Label>
        <div className="input-group">
          <span className="input-group-text icon-no-bg"><i className="bi bi-calendar3"></i></span>
          <Form.Control
            type="date"
            name="birthDate"
            value={editFormData.birthDate}
            onChange={handleChange}
            className="form-control edit-input"
          />
        </div>
      </Form.Group>
    </Form>
  </Modal.Body>
  {updateMessage && <div className="update-message">{updateMessage}</div>}
  <Modal.Footer className="edit-modal-footer">
    <Button onClick={handleSaveChanges} className="edit-modal-button save-button">Save Changes</Button>
  </Modal.Footer>
  </Modal>
      <Modal show={showRentalDetails} onHide={handleCloseRentalDetails} centered>
        <Modal.Header closeButton className="rental-modal-header">
        <Modal.Title className="rental-modal-title">Rental Details</Modal.Title>
        </Modal.Header>
        <Modal.Body className="rental-modal-body">
  {selectedRental && (
    <div>
      {selectedRental.bikeModel ? (
        <>
          <p><strong>Model:</strong> {selectedRental.bikeModel}</p>
          <p><strong>Description:</strong> {selectedRental.bikeDescription}</p>
        </>
      ) : (
        <>
          <p><strong>Model:</strong> {selectedRental.equipmentModel}</p>
          <p><strong>Description:</strong> {selectedRental.equipmentDescription}</p>
        </>
      )}
      <p><strong>Location:</strong> {selectedRental.locationAddress}</p>
      <p><strong>Rental Period:</strong>{" "}
        {formatDate(selectedRental.startDate)} to{" "}
        {formatDate(selectedRental.endDate)}
      </p>
      <p><strong>Total Price:</strong> {selectedRental.totalPrice} RON</p>
      <p><strong>Status:</strong> {selectedRental.rentalStatus}</p>
      {selectedRental.rentalStatus === "COMPLETED" && (
        <Button variant="primary" onClick={(e) => handleFeedbackClick(e, selectedRental)}>Review</Button>
      )}
      {selectedRental.rentalStatus === "PENDING" && (
        <div className="cancel-container">
          <p>Do you want to cancel this rental?</p>
          <button className="cancel-button" onClick={handleCancelRental}>Yes</button>
        </div>
      )}
    </div>
  )}
</Modal.Body>

      </Modal>
      <FeedbackModal
  show={feedbackModalShow}
  onHide={() => setFeedbackModalShow(false)}
  onSubmit={(feedbackId, feedback, isBike) => handleFeedbackSubmit(feedbackId, feedback, isBike)}
  rental={selectedRentalForFeedback && selectedRentalForFeedback.bikeModel ? selectedRentalForFeedback : null}
  equipmentRental={selectedRentalForFeedback && selectedRentalForFeedback.equipmentModel ? selectedRentalForFeedback : null}
  feedbackSubmitted={feedbackSubmitted}
  existingFeedback={existingFeedback}
/>
    </div>
    </div>
  );
}

export default MyAccount;
