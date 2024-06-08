import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import StarRating from './StarRating';

function FeedbackModal({ show, onHide, onSubmit, rental, feedbackSubmitted, existingFeedback }) {
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
    // Ensure rental is not null and has a rentalId
    if (rental && rental.rentalId) {
      onSubmit(rental.rentalId, { text: feedbackText, rating });
      handleClose();
    } else {
      alert('No rental selected.');
    }
  };  

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{feedbackSubmitted ? "Your Feedback" : "Provide Feedback"}</Modal.Title>
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
        <Button variant="secondary" onClick={handleClose}>Close</Button>
        {!feedbackSubmitted && (
          <Button variant="primary" onClick={handleSubmit}>Submit Feedback</Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}


export default FeedbackModal;
