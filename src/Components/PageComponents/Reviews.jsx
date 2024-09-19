import React, { useState, useRef } from 'react';
import { Rate, Input, Button, Form } from 'antd';
import './CustomerReviews.css';
import CustomerDashboard from './CustomerDashboard';

const CustomerReviews = () => {
  const reviewsRef = useRef(null);
  const [showForm, setShowForm] = useState(false);
  const [form] = Form.useForm();

  const scrollToReviews = () => {
    reviewsRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const onFinish = (values) => {
    console.log('Review Submitted:', values);
    form.resetFields();
    setShowForm(false);
  };

  const reviews = [
    {
      name: 'John Doe',
      date: 'August 25, 2024',
      content: 'Excellent service! Highly recommend.',
      rating: 5,
    },
    {
      name: 'Jane Smith',
      date: 'August 24, 2024',
      content: 'Great products, fast shipping.',
      rating: 4,
    },
    {
      name: 'Emily Johnson',
      date: 'August 23, 2024',
      content: 'Customer support was very helpful.',
      rating: 5,
    },
    // Add more reviews as needed
  ];

  return (
    <div className="reviews-container">
      <CustomerDashboard />
      <h2 className="reviews-title">Latest Customer Reviews</h2>
      <div className="reviews-list">
        {reviews.map((review, index) => (
          <div className="review-card" key={index}>
            <div className="review-header">
              <h3 className="review-name">{review.name}</h3>
              <p className="review-date">{review.date}</p>
            </div>
            <p className="review-content">{review.content}</p>
            <div className="review-rating">
              <Rate disabled defaultValue={review.rating} />
            </div>
          </div>
        ))}
      </div>

      <Button
        type="primary"
        onClick={() => setShowForm(!showForm)}
        style={{ marginTop: '20px' }}
      >
        Post Your Review
      </Button>

      {showForm && (
        <Form
          form={form}
          className="review-form"
          onFinish={onFinish}
          layout="vertical"
          style={{ marginTop: '20px' }}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please enter your name' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Rating"
            name="rating"
            rules={[{ required: true, message: 'Please give a rating' }]}
          >
            <Rate />
          </Form.Item>

          <Form.Item
            label="Review"
            name="content"
            rules={[{ required: true, message: 'Please enter your review' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit Review
            </Button>
          </Form.Item>
        </Form>
      )}

      <div className="reviews-bottom" ref={reviewsRef}></div>
    </div>
  );
};

export default CustomerReviews;
