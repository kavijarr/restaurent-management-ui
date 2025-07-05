import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  const handleStartOrder = () => {
    // Replace "/foods" with your actual route for food listing page
    navigate('/foods');
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light p-3">
      <h1 className="mb-4 text-center fw-bold">Welcome to Cafe Wow</h1>
      <button
        className="btn btn-primary btn-lg px-5 py-3 shadow"
        onClick={handleStartOrder}
      >
        Start Order
      </button>
    </div>
  );
}
