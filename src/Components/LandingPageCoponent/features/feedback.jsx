import React, { useState, useEffect } from 'react';
import './feedback.css';
import axios from 'axios';
import { message } from 'antd';

export default function Container() {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  useEffect(() => {
    if (rating > 0 && feedback.trim() !== '') {
      setIsSubmitDisabled(false);
    } else {
      setIsSubmitDisabled(true);
    }
  }, [rating, feedback]);

  const handleStarClick = (index) => {
    setRating(index + 1);
  };

  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value);
  };

  const handleSubmitFeedback = () => {
    if (rating === 0 || feedback.trim() === '') {
      message.error('Please enter the review');
      return;
    }

    setIsSubmitDisabled(true);

    const url = `${process.env.REACT_APP_BACKEND_URL}/admin/feedback`;
    axios.post(url, {
      feedback: feedback,
      rating: rating
    })
      .then(res => {
        message.success('Thanks for the Feedback!');
      })
      .catch(err => {
        message.error('An error occurred while submitting your feedback. Please try again.');
        setIsSubmitDisabled(false);
      });
  };

  return (
    <>
      <div className="navigation">
        <p style={{ textAlign: 'center', fontSize: '3em' }}>Your Review</p>
      <div className="textarea-container">
        <textarea
          className="feedback-textarea"
          placeholder="Please leave your feedback here..."
          value={feedback}
          onChange={handleFeedbackChange}
        ></textarea>
      </div>

      <div className="rating-container">
        <p>Rate Your Experience</p>
        <div className="star-rating">
          {[...Array(5)].map((_, index) => (
            <i
              key={index}
              className={`fa fa-star ${index < rating ? 'active' : ''}`}
              aria-hidden="true"
              onClick={() => handleStarClick(index)}
            />
          ))}
        </div>
        <div className="submit">
          <button
            onClick={handleSubmitFeedback}
            type="submit"
            disabled={isSubmitDisabled}
          >
            Submit
          </button>
        </div>
      </div>
    </div >
    </>
  );
}