import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./OwnerDashboard.css";

const OwnerDashboard = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showRentals, setShowRentals] = useState(false);
  const [pendingRentals, setPendingRentals] = useState([]);
  const [pendingEquipmentRentals, setPendingEquipmentRentals] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (showRentals) {
      fetchPendingRentals();
      fetchPendingEquipmentRentals();
    }
  }, [showRentals]);

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
      const data = await response.json();
      if (response.ok) {
        setPendingRentals(data);
      } else {
        throw new Error("Failed to fetch pending rentals");
      }
    } catch (error) {
      setError(error.message);
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
      const data = await response.json();
      if (response.ok) {
        setPendingEquipmentRentals(data);
      } else {
        throw new Error("Failed to fetch pending equipment rentals");
      }
    } catch (error) {
      setError(error.message);
    }
  };
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const handleApprove = async (rentalId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/rentals/approveRental/${rentalId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );
      if (response.ok) {
        alert("Rental approved successfully");
        fetchPendingRentals();
        if (!showRentals) setShowRentals(true);
      } else {
        throw new Error("Failed to approve rental");
      }
    } catch (error) {
      alert("Error approving rental: " + error.message);
    }
  };

  const handleReject = async (rentalId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/rentals/rejectRental/${rentalId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );
      if (response.ok) {
        alert("Rental rejected successfully");
        fetchPendingRentals(); // Refresh the list after action
      } else {
        throw new Error("Failed to reject rental");
      }
    } catch (error) {
      alert("Error rejecting rental: " + error.message);
    }
  };
  const handleApproveEquipmentRental = async (equipmentRentalId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/equipmentRentals/approveEquipmentRental/${equipmentRentalId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );
      if (response.ok) {
        alert("Equipment rental approved successfully");
        fetchPendingEquipmentRentals(); // Refresh the list after action
      } else {
        throw new Error("Failed to approve equipment rental");
      }
    } catch (error) {
      alert("Error approving equipment rental: " + error.message);
    }
  };

  const handleRejectEquipmentRental = async (equipmentRentalId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/equipmentRentals/rejectEquipmentRental/${equipmentRentalId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );
      if (response.ok) {
        alert("Equipment rental rejected successfully");
        fetchPendingEquipmentRentals(); // Refresh the list after action
      } else {
        throw new Error("Failed to reject equipment rental");
      }
    } catch (error) {
      alert("Error rejecting equipment rental: " + error.message);
    }
  };

  return (
    <div className="dashboard">
      <nav className="sub-navigation">
        <Link to="/admin/dashboard">Owner Page</Link>
        <Link to="/bikes-page">Bikes</Link>
      </nav>
      <div className="sidebar-and-content">
        <div className={`sidebar ${showSidebar ? "visible" : ""}`}>
          {showSidebar && (
            <>
              <button className="toggle-sidebar" onClick={toggleSidebar}>
                <i className="bi bi-list"></i> 
              </button>
              <button onClick={() => setShowRentals(true)}>
                Approve/Reject Rentals
              </button>
            </>
          )}
        </div>
        <div className="main-content">
          {!showSidebar && (
            <div className="header-content">
              <button className="toggle-sidebar" onClick={toggleSidebar}>
                <i className="bi bi-list"></i>{" "}
              </button>
              <h2>Owner page - Pending rentals</h2>
            </div>
          )}
          {error && <p>Error: {error}</p>}
          {showRentals && pendingRentals.length > 0 && (
            <div className="cards-container">
              {pendingRentals.map((rental) => (
  <div key={rental.rentalId} className="rental-card">
    <h3>Rental Details</h3>
    <div className="rental-content">
      <img
        src={rental.bikeImageURL}
        alt={`Bike ${rental.bikeModel}`}
        className="rental-image"
      />
      <div className="rental-details">
        <div className="rental-info">
          <p>
            <strong>User:</strong> {rental.username}
          </p>
          <p>
            <strong>Email:</strong> {rental.email}
          </p>
          <p>
            <strong>Bike Model:</strong> {rental.bikeModel}
          </p>
          <p>
            <strong>Period:</strong>{" "}
            {new Date(rental.startDate).toLocaleDateString()} to{" "}
            {new Date(rental.endDate).toLocaleDateString()}
          </p>
          <p>
            <strong>Total Price:</strong>{" "}
            {rental.totalPrice.toFixed(2)} RON
          </p>
          <p>
            <strong>Status:</strong> {rental.rentalStatus}
          </p>
        </div>
        <div className="actions">
        <div className="buttons">
          <p>Do you want to approve or reject this rental?</p>
          <button
            className="approve"
            onClick={() => handleApprove(rental.rentalId)}
          >
            <i className="bi bi-check">
              <span className="tooltip-text">Approve</span>
            </i>
          </button>
          <button
            className="reject"
            onClick={() => handleReject(rental.rentalId)}
          >
            <i className="bi bi-x">
              <span className="tooltip-text">Reject</span>
            </i>
          </button>
          </div>
        </div>
      </div>
    </div>
  </div>
))}

              {pendingEquipmentRentals.map((rental) => (
                <div key={rental.equipmentRentalId} className="rental-card">
                  <h3>Equipment Rental Details</h3>
                  <div className="rental-content">
                    <img
                      src={rental.equipmentImageURL}
                      alt={`Equipment ${rental.equipmentModel}`}
                      className="rental-image"
                    />
                    <div className="rental-details">
                    <div className="rental-info">
                      <p>
                        <strong>User:</strong> {rental.username}
                      </p>
                      <p>
                        <strong>Email:</strong> {rental.email}
                      </p>
                      <p>
                        <strong>Equipment Model:</strong>{" "}
                        {rental.equipmentModel}
                      </p>
                      <p>
                        <strong>Period:</strong>{" "}
                        {new Date(rental.startDate).toLocaleDateString()} to{" "}
                        {new Date(rental.endDate).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>Total Price:</strong>{" "}
                        {rental.totalPrice.toFixed(2)} RON
                      </p>
                      <p>
                        <strong>Status:</strong> {rental.rentalStatus}
                      </p>
                      </div>
                      <div className="actions">
                      <p>Do you want to approve or reject this rental?</p>
                      <div className="buttons">
                        <button
                          className="approve"
                          onClick={() =>
                            handleApproveEquipmentRental(
                              rental.equipmentRentalId
                            )
                          }
                        >
                          <i className="bi bi-check">
                            <span className="tooltip-text">Approve</span>
                          </i>
                        </button>
                        <button
                          className="reject"
                          onClick={() =>
                            handleRejectEquipmentRental(
                              rental.equipmentRentalId
                            )
                          }
                        >
                          <i className="bi bi-x">
                            <span className="tooltip-text">Reject</span>
                          </i>
                        </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
