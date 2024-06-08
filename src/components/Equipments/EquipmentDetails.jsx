import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./EquipmentDetails.css"; 
import { addDays, addHours, startOfDay, endOfDay, setHours, setMinutes, setSeconds } from "date-fns";

const EquipmentDetails = () => {
  const { equipmentModelId } = useParams();
  const navigate = useNavigate();
  const [equipmentModel, setEquipmentModel] = useState(null);
  const [rentalDates, setRentalDates] = useState({
    startDate: "",
    endDate: "",
  });
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/equipments/equipmentModels/${equipmentModelId}`
        );
        if (response.ok) {
          const data = await response.json();
          setEquipmentModel(data);
        } else {
          console.error(`HTTP Error: ${response.status}`);
          setErrorMessage("Unable to load equipment details.");
        }
      } catch (error) {
        console.error("Network error:", error);
        setErrorMessage("Network error, please try again later.");
      }
    };

    const fetchUnavailableDates = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/equipmentRentals/unavailable-dates/${equipmentModelId}`
        );
        if (response.ok) {
          const data = await response.json();
          const formattedDates = data.map(period => ({
            startDate: new Date(period.startDate),
            endDate: new Date(period.endDate),
          }));
          setUnavailableDates(formattedDates);
        } else {
          console.error(`HTTP Error: ${response.status}`);
        }
      } catch (error) {
        console.error("Network error:", error);
      }
    };

    fetchEquipment();
    fetchUnavailableDates();
  }, [equipmentModelId]);

  const minimumRentalTime = addHours(new Date(), 6);

  const isDateUnavailable = (date) => {
    const checkDate = startOfDay(new Date(date)); 
    return unavailableDates.some(period => {
      const startPeriod = startOfDay(new Date(period.startDate));
      const endPeriod = endOfDay(new Date(period.endDate));
      return checkDate >= startPeriod && checkDate <= endPeriod;
    }) || checkDate < minimumRentalTime;
  };

  const handleDateChange = (name, date) => {
    setRentalDates((prev) => ({ ...prev, [name]: date }));
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      navigate("/login");
      alert("You must be logged in to rent equipment.");
      return;
    }

    const rentalDetails = {
      startDate: setHours(setMinutes(setSeconds(rentalDates.startDate, 0), 0), 6).toISOString(),
      endDate: setHours(setMinutes(setSeconds(rentalDates.endDate, 59), 59), 23).toISOString(),
  };

    try {
      const response = await fetch(
        `http://localhost:8080/api/equipmentRentals/createEquipmentRental/${equipmentModelId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(rentalDetails),
        }
      );

      if (response.ok) {
        setSuccessMessage("Equipment rental created successfully! Awaiting admin approval.");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create equipment rental.");
      }
    } catch (error) {
      setErrorMessage(error.message || "Network error, please try again later.");
    }
  };

  const mapsLink = equipmentModel?.locationAddress
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        equipmentModel.locationAddress
      )}`
    : "#";
    const CustomInput = React.forwardRef(({ value, onClick, label }, ref) => (
      <div
        className="input-group"
        onClick={onClick}
        style={{ cursor: "pointer" }}
      >
        <span className="input-group-text calendar-icon">
          <i className="bi bi-calendar3"></i>
        </span>
        <input
          type="text"
          className="form-control"
          value={value ? `${label}: ${value}` : label}
          readOnly
          ref={ref} 
        />
      </div>
    ));    

  return (
    <div className="equipment-details-container">
      <h2>Rent Equipment - {equipmentModel?.equipmentModel}</h2>
      {equipmentModel ? (
        <div className="equipment-info-container">
          <div className="equipment-image-container">
            <img
              src={equipmentModel.imageURL}
              alt={equipmentModel.equipmentModel}
              className="equipment-image"
            />
          </div>
          <div className="equipment-details">
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
              </a></p>
            <p className="price-per-day">
              <span>
                <strong>Price per day: </strong>
              </span>
              <span>{equipmentModel.pricePerDay} RON</span>
            </p>
            <form onSubmit={handleSubmit} className="rental-form">
              <div className="form-group">
                <label htmlFor="startDate"></label>
                <DatePicker
                  selected={rentalDates.startDate}
                  onChange={(date) => handleDateChange("startDate", date)}
                  customInput={<CustomInput label="Start Date" />}
                  filterDate={(date) => !isDateUnavailable(date)}
                  required
                  minDate={new Date()}
                  maxDate={addDays(new Date(), 60)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="endDate"></label>
                <DatePicker
                  selected={rentalDates.endDate}
                  onChange={(date) => handleDateChange("endDate", date)}
                  customInput={<CustomInput label="End Date" />}
                  filterDate={(date) => !isDateUnavailable(date)}
                  required
                  minDate={rentalDates.startDate || new Date()}
                  maxDate={addDays(new Date(), 60)}
                />
              </div>
              {errorMessage && (
                <div className="error-message">{errorMessage}</div>
              )}
              {successMessage && (
                <div className="success-message">{successMessage}</div>
              )}
              <button type="submit" className="btn btn-primary">Rent Equipment</button>
            </form>
          </div>
        </div>
      ) : (
        <p>Loading equipment details...</p>
      )}
    </div>
  );
};

export default EquipmentDetails;

