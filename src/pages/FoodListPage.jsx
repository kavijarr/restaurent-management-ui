import React, { useEffect, useState } from "react";
import axios from "axios";
import QuantityModal from "./QuantityModal";
import { useLocation, useNavigate } from "react-router-dom";

const FoodListPage = () => {
  const [foods, setFoods] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [cart, setCart] = useState([]);
  const [orderId, setOrderId] = useState(null); // store active order ID
  const location = useLocation();
  const navigate = useNavigate();

  // Extract qrCode from URL
  const queryParams = new URLSearchParams(location.search);
  const qrCode = queryParams.get("qrCode");

  useEffect(() => {
    if (!qrCode) {
      alert("Invalid or missing QR Code!");
      navigate("/"); // Go to landing if QR missing
      return;
    }

    // Fetch foods from backend
    axios.get("http://localhost:8080/api/food").then((res) => {
      setFoods(res.data);
    });
  }, [qrCode, navigate]);

  // Group foods by category
  const groupedFoods = foods.reduce((groups, food) => {
    if (!groups[food.category]) groups[food.category] = [];
    groups[food.category].push(food);
    return groups;
  }, {});

  const handleOrderClick = (food) => {
    setSelectedFood(food);
    setShowModal(true);
  };

  const handleQuantityConfirm = (qty) => {
    const existing = cart.find((item) => item.food.id === selectedFood.id);
    if (existing) {
      setCart((prev) =>
        prev.map((item) =>
          item.food.id === selectedFood.id
            ? { ...item, qty: item.qty + qty }
            : item
        )
      );
    } else {
      setCart((prev) => [...prev, { food: selectedFood, qty }]);
    }
    setShowModal(false);
  };

  const handlePlaceOrder = async () => {
    if (!qrCode) {
      alert("Missing QR code");
      return;
    }

    try {
      // Start or get existing active order for this table
      const startRes = await axios.post(
        "http://localhost:8080/api/order/start",
        null,
        { params: { qrCode } }
      );

      const currentOrderId = startRes.data.id;
      setOrderId(currentOrderId);

      // Add all cart items to this active order
      for (const item of cart) {
        await axios.post(
          "http://localhost:8080/api/order/add",
          null,
          {
            params: {
              qrCode,
              foodId: item.food.id,
              qty: item.qty,
            },
          }
        );
      }

      alert("Order placed successfully!");
      setCart([]);
    } catch (err) {
      console.error(err);
      alert("Failed to place order.");
    }
  };

  return (
    <div className="container my-4">
      <h2 className="mb-4">Food Menu</h2>

      {Object.entries(groupedFoods).map(([category, foods]) => (
        <div key={category} className="mb-5">
          <h3 className="mb-3">{category}</h3>
          <div className="row g-4">
            {foods.map((food) => (
              <div key={food.id} className="col-12 col-md-6 col-lg-4">
                <div className="card h-100">
                  <img
                    src={`http://localhost:8080${food.imageUrl}`}
                    className="card-img-top"
                    alt={food.name}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{food.name}</h5>
                    <p className="card-text mb-3">
                      <strong>Price:</strong> Rs. {food.price}
                    </p>
                    <button
                      className="btn btn-primary mt-auto"
                      onClick={() => handleOrderClick(food)}
                    >
                      Order
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {cart.length > 0 && (
        <div className="fixed-bottom bg-light p-3 border-top">
          <div className="container d-flex justify-content-between align-items-center">
            <span>
              🛒 {cart.length} item(s) in cart – Total: Rs.{" "}
              {cart.reduce((total, item) => total + item.food.price * item.qty, 0)}
            </span>
            <button className="btn btn-success" onClick={handlePlaceOrder}>
              Place Order
            </button>
          </div>
        </div>
      )}

      <QuantityModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleQuantityConfirm}
      />
    </div>
  );
};

export default FoodListPage;
