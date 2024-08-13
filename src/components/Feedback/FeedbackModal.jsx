import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import StarRating from './StarRating';
import './FeedbackModal.css'; 

function FeedbackModal({ show, onHide, onSubmit, rental, equipmentRental, feedbackSubmitted, existingFeedback }) {
  const [feedbackText, setFeedbackText] = useState('');
  const [rating, setRating] = useState(0);

  useEffect(() => {
    if (feedbackSubmitted && existingFeedback) {
      setFeedbackText(existingFeedback.text);
      setRating(existingFeedback.rating);
    } else {
      setFeedbackText('');
      setRating(0);
    }
    console.log('Feedback Submitted:', feedbackSubmitted);
    console.log('Existing Feedback:', existingFeedback);
  }, [feedbackSubmitted, existingFeedback, show]);

  const handleClose = () => {
    setFeedbackText('');
    setRating(0);
    onHide();
  };

  const handleSubmit = () => {
    if (!feedbackText.trim()) {
      alert('Please enter some feedback before submitting.');
      return;
    }
    if (rating === 0) {
      alert('Please select a rating.');
      return;
    }
    if (rental && rental.rentalId) {
      onSubmit(rental.rentalId, { text: feedbackText, rating }, true);
    } else if (equipmentRental && equipmentRental.equipmentRentalId) {
      onSubmit(equipmentRental.equipmentRentalId, { text: feedbackText, rating }, false);
    } else {
      alert('No rental selected.');
      return;
    }
    handleClose();
  };  

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{feedbackSubmitted ? "Your Feedback" : "Give Feedback"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Feedback</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              readOnly={feedbackSubmitted}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Rating</Form.Label>
            <StarRating rating={rating} setRating={feedbackSubmitted ? () => {} : setRating} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        {!feedbackSubmitted && (
          <Button variant="primary" onClick={handleSubmit}>Submit Feedback</Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}


export default FeedbackModal;
