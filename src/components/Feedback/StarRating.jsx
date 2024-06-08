import React from 'react';
import './StarRating.css';

function StarRating({ rating, setRating }) {
    const handleRating = (rate) => {
        setRating(rate);
    };

    return (
        <div className="star-rating">
            {[...Array(5)].map((star, index) => {
                index += 1;
                return (
                    <button
                        type="button"
                        key={index}
                        className={index <= rating ? "on" : "off"}
                        onClick={() => handleRating(index)}
                        onMouseEnter={() => handleRating(index)}
                        onMouseLeave={() => setRating(rating)}
                    >
                        <span className="star">&#9733;</span>
                    </button>
                );
            })}
        </div>
    );
}

export default StarRating;
