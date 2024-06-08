import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";
import "./MyAccount.css";
import FeedbackModal from './Feedback/FeedbackModal';

function MyAccount() {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [rentals, setRentals] = useState([]);
  const [editShow, setEditShow] = useState(false);
  const [showRentals, setShowRentals] = useState(false);
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
  const [feedbackModalShow, setFeedbackModalShow] = useState(false);
  const [selectedRentalForFeedback,setSelectedRentalForFeedback] = useState(null);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [existingFeedback, setExistingFeedback] = useState(null);

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

    fetchUserDetails();
    fetchRentals();
    fetchActiveRentals();
    fetchPendingRentals();
    fetchCompletedRentals();
  }, [navigate]);

  useEffect(() => {
    const fetchAllRentals = async () => {
      try {
        const responses = await Promise.all([
          fetch("http://localhost:8080/api/rentals/active-rentals", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            },
          }),
          fetch("http://localhost:8080/api/rentals/pending-rentals", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            },
          }),
          fetch("http://localhost:8080/api/rentals/completed-rentals", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            },
          }),
        ]);

        const data = await Promise.all(
          responses.map((response) => response.json())
        );

        setRentals(data.flat());
      } catch (error) {
        console.error("Error fetching all rentals:", error);
      }
    };

    fetchAllRentals();
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

    console.log(`Updating user details for ID: ${userDetails.userId}`); 

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
      handleCloseEdit();
      alert("User details updated successfully.");
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
    if (!selectedRental || !selectedRental.rentalId) {
        alert('No rental selected or rental ID is missing.');
        return;
    }

    const token = localStorage.getItem("jwtToken");
    console.log(`Attempting to cancel rental with ID: ${selectedRental.rentalId}`); 

    try {
        const response = await fetch(`http://localhost:8080/api/rentals/cancelRental/${selectedRental.rentalId}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error(`Failed to cancel rental: ${errorData.message}`, errorData);
            alert(`Failed to cancel rental: ${errorData.message}`);
            return;
        }

        alert('Rental canceled successfully.');
        setRentals(prevRentals => prevRentals.filter(rental => rental.rentalId !== selectedRental.rentalId));
        setSelectedRental(null);
    } catch (error) {
        console.error("An error occurred while canceling the rental:", error);
        alert("An error occurred while canceling the rental.");
    }
};

const handleFeedbackClick = async (event, rental) => {
  event.stopPropagation();
  try {
    const response = await fetch(`http://localhost:8080/api/feedback/${rental.rentalId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
      }
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const text = await response.text(); // Read response body as text first to check if it's empty
    if (!text) {
      console.log('No feedback data available.');
      setFeedbackSubmitted(false);
      setExistingFeedback(null);
    } else {
      const feedbackData = JSON.parse(text); // Safely parse JSON only if there is data
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
        return { ...rental, feedbackSubmitted: true }; // Add this property to track feedback submission
      }
      return rental;
    }));
  };
  const handleFeedbackSubmit = async (rentalId, feedback) => {
    try {
      const response = await fetch(`http://localhost:8080/api/feedback/submit/${rentalId}`, {
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
        setFeedbackSubmitted(true); // Indicate that feedback has now been submitted
        setExistingFeedback(feedback); // Update the existing feedback
        setFeedbackModalShow(false); // Close the modal
        updateRentalsAfterFeedback(rentalId); // Optionally update the rental list
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

  return (
    <div className="my-account-container">
      <div className="user-details-section">
        <div className="userAvatar">
          {userDetails.firstName[0] +
            (userDetails.lastName ? userDetails.lastName[0] : "")}
        </div>
        <div className="header-section">
          <h2>Welcome {userDetails.firstName}, </h2>
          <i
            className="bi bi-gear-fill"
            onClick={handleShowEdit}
            style={{ cursor: "pointer" }}
          ></i>{" "}
        </div>
        <Button
          onClick={handleShowEdit}
          variant="outline-secondary"
          className="account-settings-button"
          style={{ margin: "10px 0" }}
        >
          <i className="bi bi-gear-fill"></i> Account settings
          <i className="bi bi-caret-right-fill"></i>
        </Button>
        <Button
          onClick={() => {
            setShowRentals(true);
            setShowActiveRentals(false);
            setShowPendingRentals(false);
            setShowCompletedRentals(false);
          }}
          variant="outline-secondary"
          className="account-settings-button"
          style={{ margin: "10px 0" }}
        >
          <i className="bi bi-bicycle"></i> All Rentals
          <i className="bi bi-caret-right-fill"></i>
        </Button>
        <Button
          onClick={() => {
            setShowActiveRentals(true);
            setShowRentals(false);
            setShowPendingRentals(false);
            setShowCompletedRentals(false);
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
          }}
          variant="outline-secondary"
          className="account-settings-button"
          style={{ margin: "10px 0" }}
        >
          <i className="bi bi-archive"></i> Completed Rentals
          <i className="bi bi-caret-right-fill"></i>
        </Button>
      </div>
      {showActiveRentals && activeRentals.length > 0 && (
        <div className="rentals-section">
          <h2>Active Rentals</h2>
          <ul className="rentals-list">
            {activeRentals.map((rental, index) => (
              <li
                key={index}
                className="rental-item"
                onClick={() => handleRentalClick(rental)}
              >
                <div className="rental-preview">
                  <img
                    src={rental.bikeImageURL}
                    alt="Bike"
                    className="rental-bike-image"
                  />
                  <div className="rental-brief">
                    <p>
                      Bike rented from {formatDate(rental.startDate)} to{" "}
                      {formatDate(rental.endDate)}
                    </p>
                    <i className="bi bi-caret-right-fill expand-icon"></i>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showPendingRentals && pendingRentals.length > 0 && (
        <div className="rentals-section">
          <h2>Pending Rentals</h2>
          <ul className="rentals-list">
            {pendingRentals.map((rental, index) => (
              <li
                key={index}
                className="rental-item"
                onClick={() => handleRentalClick(rental)}
              >
                <div className="rental-preview">
                  <img
                    src={rental.bikeImageURL}
                    alt="Bike"
                    className="rental-bike-image"
                  />
                  <div className="rental-brief">
                    <p>
                      Bike rented from {formatDate(rental.startDate)} to{" "}
                      {formatDate(rental.endDate)}
                    </p>
                    <i className="bi bi-caret-right-fill expand-icon"></i>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showCompletedRentals && completedRentals.length > 0 && (
  <div className="rentals-section">
    <h2>Completed Rentals</h2>
    <ul className="rentals-list">
      {completedRentals.map((rental, index) => (
        <li key={rental.rentalId} className="rental-item" onClick={() => handleRentalClick(rental)}>
          <div className="rental-preview">
            <img src={rental.bikeImageURL} alt="Bike" className="rental-bike-image" />
            <div className="rental-brief">
              <p>Bike rented from {formatDate(rental.startDate)} to {formatDate(rental.endDate)}</p>
              <i className="bi bi-caret-right-fill expand-icon"></i>
            </div>
          </div>
        </li>
      ))}
    </ul>
  </div>
)}

      {showRentals && (
        <div className="rentals-section">
          <h2>All Rentals</h2>
          {rentals.length > 0 ? (
            <ul className="rentals-list">
              {rentals.map((rental, index) => (
                <li
                  key={index}
                  className="rental-item"
                  onClick={() => handleRentalClick(rental)}
                >
                  <div className="rental-preview">
                    <img
                      src={rental.bikeImageURL}
                      alt="Bike"
                      className="rental-bike-image"
                    />
                    <div className="rental-brief">
                      <p>
                        Bike rented from {formatDate(rental.startDate)} to{" "}
                        {formatDate(rental.endDate)}
                      </p>
                      <i className="bi bi-caret-right-fill expand-icon"></i>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No rentals found.</p>
          )}
        </div>
      )}
      <Modal show={editShow} onHide={handleCloseEdit} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                value={editFormData.firstName}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                value={editFormData.lastName}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={editFormData.email}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={editFormData.username}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Birth Date</Form.Label>
              <Form.Control
                type="date"
                name="birthDate"
                value={editFormData.birthDate}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEdit}>
            {" "}
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            {" "}
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showRentalDetails}
        onHide={handleCloseRentalDetails}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Rental Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRental && (
            <div>
              <p>
                <strong>Model:</strong> {selectedRental.bikeModel}
              </p>
              <p>
                <strong>Description:</strong> {selectedRental.bikeDescription}
              </p>
              <p>
                <strong>Location:</strong> {selectedRental.locationAddress}
              </p>
              <p>
                <strong>Rental Period:</strong>{" "}
                {formatDate(selectedRental.startDate)} to{" "}
                {formatDate(selectedRental.endDate)}
              </p>
              <p>
                <strong>Total Price:</strong> {selectedRental.totalPrice} RON
              </p>
              <p>
                <strong>Status:</strong> {selectedRental.rentalStatus}
              </p>
              {selectedRental && selectedRental.rentalStatus === "COMPLETED" && (
  <Button variant="primary" onClick={(e) => handleFeedbackClick(e, selectedRental)}>Review</Button>
)}

    {selectedRental.rentalStatus === "PENDING" && (
      <div className="cancel-container">
      <p>Do you want to cancel this rental?</p>
      <button
        className="cancel-button"
        onClick={() => handleCancelRental(selectedRental.id)}
      >
        Yes
      </button>
      </div>
    )}
 
</div>
          )}
        </Modal.Body>
      </Modal>
      <FeedbackModal
  show={feedbackModalShow}
  onHide={() => setFeedbackModalShow(false)}
  onSubmit={handleFeedbackSubmit}
  rental={selectedRentalForFeedback}
  feedbackSubmitted={feedbackSubmitted}
  existingFeedback={existingFeedback}
/>


    </div>
  );
}

export default MyAccount;
