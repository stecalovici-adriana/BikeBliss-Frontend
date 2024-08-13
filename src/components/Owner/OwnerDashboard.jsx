import React, { useState, useEffect } from "react";
import "./OwnerDashboard.css";

const OwnerDashboard = () => {
  const [showSidebar, setShowSidebar] = useState("sidebar-and-content");
  const [allRentals, setAllRentals] = useState([]);
  const [showRentals, setShowRentals] = useState(true);
  const [pendingRentals, setPendingRentals] = useState([]);
  const [pendingEquipmentRentals, setPendingEquipmentRentals] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState("allRentals");
  const [ownerName, setOwnerName] = useState("");

  const fetchOwnerName = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/users/details", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setOwnerName(`${data.firstName} ${data.lastName}`);
      } else {
        throw new Error("Failed to fetch owner name");
      }
    } catch (error) {
      setError(error.message);
    }
  };  

  useEffect(() => {
    fetchOwnerName();
    fetchAllRentals();
    if (activeSection === "rentals") {
      fetchPendingRentals();
      fetchPendingEquipmentRentals();
    } else if (activeSection === "users") {
      fetchUsers();
    }
  }, [activeSection]);
  const fetchAllRentals = async () => {
    try {
      const responses = await Promise.all([
        fetch("http://localhost:8080/api/rentals/all-bikeRentals", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }),
        fetch("http://localhost:8080/api/equipmentRentals/all-rentals", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        })
      ]);

      const data = await Promise.all(responses.map((response) => response.json()));
      setAllRentals([...data[0], ...data[1]]);
    } catch (error) {
      console.error("Error fetching all rentals:", error);
      setError("Error fetching all rentals");
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
        fetchPendingRentals(); 
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
        fetchPendingEquipmentRentals(); 
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
        fetchPendingEquipmentRentals(); 
      } else {
        throw new Error("Failed to reject equipment rental");
      }
    } catch (error) {
      alert("Error rejecting equipment rental: " + error.message);
    }
  };
  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/admin/listUsers", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setUsers(data);
      } else {
        throw new Error("Failed to fetch users");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const response = await fetch(`http://localhost:8080/api/admin/updateUserRole/${userId}?role=${newRole}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });
      if (response.ok) {
        setUsers(users.map(user => (user.id === userId ? { ...user, role: newRole } : user)));
        alert("User role updated successfully");
      } else {
        throw new Error("Failed to update user role");
      }
    } catch (error) {
      alert("Error updating user role: " + error.message);
    }
  };
  
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };
  return (
    <div className="dashboard">
      <div className="sidebar-and-content">
        <div className={`sidebar ${showSidebar ? "visible" : ""}`}>
          {showSidebar && (
            <>
              <button className="toggle-sidebar" onClick={toggleSidebar}>
                <i className="bi bi-list"></i> 
              </button>
              <div className="sidebar-header">
          <p className="sidebar-title">Owner</p>
          <img
          src="https://icons.veryicon.com/png/o/miscellaneous/yuanql/icon-admin.png"
          alt="User Icon"
          className="sidebar-image"
          />
           <p className="owner-name">{ownerName}</p>
        </div>
        <div className="dots-container">
  {Array.from({ length: 3 }).map((_, index) => (
    <div key={index} className="dot"></div>
  ))}
</div>

              <button onClick={() => setActiveSection("rentals")}>Approve/Reject Rentals</button>
              <button onClick={() => setActiveSection("users")}><i className="bi bi-people-fill"></i> Manage Users</button>
            </>
          )}
        </div>
        <div className="main-content">
          {!showSidebar && (
            <div className="header-content">
              <button className="toggle-sidebar" onClick={toggleSidebar}>
                <i className="bi bi-list"></i>{" "}
              </button>
            </div>
          )}
          {error && <p>Error: {error}</p>}
          {activeSection === "allRentals" && (
            <div className="cards-container">
              {allRentals.length > 0 ? (
                allRentals.map((rental, index) => (
                  <div key={rental.rentalId || rental.equipmentRentalId} className="rental-card">
                    <div className="rental-content">
                      <img
                        src={rental.bikeImageURL || rental.equipmentImageURL}
                        alt={rental.bikeModel || rental.equipmentModel}
                        className="rental-image"
                      />
                      <div className="rental-details">
                        <div className="rental-info">
                          <p>
                            <strong>Model:</strong> {rental.bikeModel || rental.equipmentModel}
                          </p>
                          <p>
                            <strong>User:</strong> {rental.username}
                          </p>
                          <p>
                            <strong>Email:</strong> {rental.email}
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
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-rentals-message">There are no rentals available at the moment.</p>
              )}
            </div>
          )}
          {activeSection === "rentals" && (
            <div className="cards-container">
              {pendingRentals.length > 0 || pendingEquipmentRentals.length > 0 ? (
                <>
                  {pendingRentals.map((rental) => (
                    <div key={rental.rentalId} className="rental-card">
                      
                      <div className="rental-content">
                        <img
                          src={rental.bikeImageURL}
                          alt={`Bike ${rental.bikeModel}`}
                          className="rental-image"
                        />
                        <div className="rental-details">
                          <div className="rental-info">
                          <p>
                              <strong>Model:</strong> {rental.bikeModel}
                            </p>
                            <p>
                              <strong>User:</strong> {rental.username}
                            </p>
                            <p>
                              <strong>Email:</strong> {rental.email}
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
                          
                        </div>
                        <div className="actions">
                          <p>Do you want to approve or reject this rental?</p>
                            <div className="buttons">
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
                  ))}

                  {pendingEquipmentRentals.map((rental) => (
                    <div key={rental.equipmentRentalId} className="rental-card">
                      
                      <div className="rental-content">
                        <img
                          src={rental.equipmentImageURL}
                          alt={`Equipment ${rental.equipmentModel}`}
                          className="rental-image"
                        />
                        <div className="rental-details">
                          <div className="rental-info">
                          <p>
                              <strong>Model:</strong>{" "}
                              {rental.equipmentModel}
                            </p>
                            <p>
                              <strong>User:</strong> {rental.username}
                            </p>
                            <p>
                              <strong>Email:</strong> {rental.email}
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
                  ))}
                </>
              ) : (
                <p className="no-rentals-message">There are no new rental requests at the moment.</p>
              )}
            </div>
          )}
       {activeSection === "users" && users.length > 0 && (
            <div className="users-container">
              <table>
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Username</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Role</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.userId}>
                      <td>{user.email}</td>
                      <td>{user.username}</td>
                      <td>{user.firstName}</td>
                      <td>{user.lastName}</td>
                      <td>{user.userRole}</td>
                      <td>
                        {user.userRole === "USER" ? (
                          <button onClick={() => handleRoleChange(user.userId, "ADMIN")}>Make Admin</button>
                        ) : (
                          <button onClick={() => handleRoleChange(user.userId, "USER")}>Revoke Admin</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
