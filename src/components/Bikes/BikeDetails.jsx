import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./BikeDetails.css";
import { addDays, addHours } from "date-fns";

const BikeDetails = () => {
  const { modelId } = useParams();
  const navigate = useNavigate();
  const [bikeModel, setBikeModel] = useState(null);
  const [rentalDates, setRentalDates] = useState({
    startDate: "",
    endDate: "",
  });
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(
    () => {
      const fetchBikeModel = async () => {
        try {
          const response = await fetch(
            `http://localhost:8080/api/bikes/models/${modelId}`
          );
          if (response.ok) {
            const data = await response.json();
            setBikeModel(data);
          } else {
            console.error(`HTTP Error: ${response.status}`);
            setErrorMessage("Unable to load bike details.");
          }
        } catch (error) {
          console.error("Network error:", error);
          setErrorMessage("Network error, please try again later.");
        }
      };

      const fetchUnavailableDates = async () => {
        try {
          const response = await fetch(`http://localhost:8080/api/rentals/unavailable-dates/${modelId}`);
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

      fetchBikeModel();
      fetchUnavailableDates();
    },
    [modelId],
    [unavailableDates]
  );

  // Pragul minim pentru rezervare - 6 ore de la ora curentă
  const minimumRentalTime = addHours(new Date(), 6);

  // Resetează mesajele de eroare și setează noile date
  const handleDateChange = (name, date) => {
    setRentalDates((prev) => ({ ...prev, [name]: date }));
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      navigate("/login");
      return;
    }

    const formatDateTime = (date, time) => {
      return new Date(date.setHours(...time.split(":"))).toISOString();
    };

    try {
      const response = await fetch(
        `http://localhost:8080/api/rentals/createRental/${modelId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            startDate: formatDateTime(rentalDates.startDate, "06:00"),
            endDate: formatDateTime(rentalDates.endDate, "23:59:59"),
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Bike rental created successfully!");
        setErrorMessage("");
      } else {
        setSuccessMessage("");
        setErrorMessage(data.message || "Failed to create bike rental.");
      }
    } catch (error) {
      setSuccessMessage("");
      setErrorMessage("Network error, please try again later.");
    }
  };

  const isDateUnavailable = (date) => {
    const checkDate = new Date(date).setHours(6, 0, 0, 0); 
    return unavailableDates.some(period => {
      const startPeriod = new Date(period.startDate).setHours(0, 0, 0, 0);
      const endPeriod = new Date(period.endDate).setHours(0, 0, 0, 0);
      return checkDate >= startPeriod && checkDate <= endPeriod;
    }) || checkDate < minimumRentalTime;
  };
  
  const mapsLink = bikeModel?.locationAddress
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        bikeModel.locationAddress
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
    <div className="bike-details-container">
      <h2>Rent Bike - {bikeModel?.bikeModel}</h2>
      {bikeModel ? (
        <div className="bike-info-container">
          <div className="bike-image-container">
            <img
              src={bikeModel.imageURL}
              alt={bikeModel.bikeModel}
              className="bike-image"
            />
          </div>
          <div className="bike-details">
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
            <p className="price-per-day">
              <span>
                <strong>Price per day: </strong>
              </span>
              <span>{bikeModel.pricePerDay} RON</span>
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
              <button type="submit" className="btn btn-primary">
                Create Rental
              </button>
            </form>
          </div>
        </div>
      ) : (
        <p>Loading bike details...</p>
      )}
    </div>
  );
};

export default BikeDetails;
