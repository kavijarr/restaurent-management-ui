import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const StartPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const qrCode = searchParams.get("qrCode");

  const handleStartOrder = () => {
    if (!qrCode) {
      alert("Invalid QR Code");
      return;
    }

    // Save to session/localStorage (optional)
    sessionStorage.setItem("qrCode", qrCode);

    // Navigate to food list page
    navigate(`/foods?qrCode=${qrCode}`);
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="text-center p-4 border rounded shadow bg-white">
        <h2 className="mb-4">Welcome to Our Restaurant</h2>
        <p className="mb-4">You're ordering from: <strong>{qrCode || "Unknown Table"}</strong></p>
        <button className="btn btn-primary btn-lg" onClick={handleStartOrder}>
          Start Order
        </button>
      </div>
    </div>
  );
};

export default StartPage;
