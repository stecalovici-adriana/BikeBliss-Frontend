import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./BikeDetails.css";
import { addDays, addHours, startOfDay, endOfDay, setHours, setMinutes, setSeconds } from "date-fns";
import StarRating from '../Feedback/StarRating'; 

const BikeDetails = () => {
  const { modelId } = useParams();
  const navigate = useNavigate();
  const [bikeModel, setBikeModel] = useState(null);
  const [rentalDates, setRentalDates] = useState({
    startDate: "",
    endDate: "",
  });
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [averageRating, setAverageRating] = useState(0); 
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);
  const [showFeedbacks, setShowFeedbacks] = useState(false);

  useEffect(() => {
    const fetchBikeModel = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/bikes/models/${modelId}`);
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
    const fetchAverageRating = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/feedback/average-ratings/${modelId}`);
        if (response.ok) {
          const avgRating = await response.json();
          setAverageRating(avgRating);
        } else {
          console.log('Failed to fetch average rating');
        }
      } catch (error) {
        console.error('Error fetching average rating:', error);
      }
    };

    fetchBikeModel();
    fetchUnavailableDates();
    fetchAverageRating();
  }, [modelId]);

  const minimumRentalTime = addHours(startOfDay(new Date()), 6); 
  const maximumRentalDays = 14;

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
        return;
    }

    const startDate = rentalDates.startDate;
    const endDate = rentalDates.endDate;

    if (!startDate || !endDate) {
      setErrorMessage("Please select both start and end dates.");
      return;
    }

    const daysBetween = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    if (daysBetween < 1 || daysBetween > maximumRentalDays) {
      setErrorMessage(`The rental period must be between 1 and ${maximumRentalDays} days.`);
      return;
    }

    const rentalDetails = {
      startDate: setHours(setMinutes(setSeconds(startDate, 0), 0), 6).toISOString(),
      endDate: setHours(setMinutes(setSeconds(endDate, 59), 59), 23).toISOString(),
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
          body: JSON.stringify(rentalDetails),
        }
      );

      if (response.ok) {
        setSuccessMessage("Bike rental created successfully! Awaiting admin approval.");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create bike rental.");
      }
    } catch (error) {
      setErrorMessage(error.message || "Network error, please try again later.");
    }
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
const fetchFeedbacks = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/feedback/detailsFeedback/${modelId}`);
            if (response.ok) {
                const data = await response.json();
                setFeedbacks(data);
                setShowFeedbacks(true);
            } else {
                console.error('Failed to fetch feedback');
                setFeedbacks([]);
            }
        } catch (error) {
            console.error('Error fetching feedback:', error);
            setFeedbacks([]);
        }
    };

    const toggleFeedbacks = () => {
      if (showFeedbacks) {
        setShowFeedbacks(false);
      } else {
        fetchFeedbacks();
      }
    };

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
              <div className="ratings-and-feedback">
              <div>
                <div className="average-rating">
                  <strong>Reviews</strong>
                  <div onClick={toggleFeedbacks}>
                    <StarRating rating={Math.round(averageRating)} setRating={() => {}} />
                  </div>
                </div>
              </div>
              {showFeedbacks && (
                <div className="feedback-section">
                  {feedbacks.map(feedback => (
                    <div key={feedback.feedbackId} className="feedback-entry">
                      <p><strong>{feedback.username}</strong> - {new Date(feedback.feedbackDate).toLocaleString()}</p>
                      <StarRating rating={feedback.rating} setRating={() => {}} />
                      <p>{feedback.feedbackText}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
              {errorMessage && (
                <div className="error-message">{errorMessage}</div>
              )}
              {successMessage && (
                <div className="success-message">{successMessage}</div>
              )}
              <button type="submit" className="btn btn-primary">
                Rent
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