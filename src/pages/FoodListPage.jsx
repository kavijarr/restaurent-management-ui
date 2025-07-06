import React, { useEffect, useState } from "react";
import axios from "axios";
import QuantityModal from "./QuantityModal";
import OrderDetailsModal from "./OrderDetailsModal"; // <-- import your modal here
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const FoodListPage = () => {
  const [foods, setFoods] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [cart, setCart] = useState([]);
  const [orderId, setOrderId] = useState(localStorage.getItem("orderId") || null);
  const [orderDetailsModalShow, setOrderDetailsModalShow] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const qrCode = queryParams.get("qrCode");

  useEffect(() => {
    if (!qrCode) {
      Swal.fire("QR Code Missing", "Invalid or missing QR Code!", "warning").then(() => {
        navigate("/");
      });
      return;
    }

    axios.get("http://192.168.1.112:8080/api/food").then((res) => {
      setFoods(res.data);
    });

    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    const savedOrderId = localStorage.getItem("orderId");
    const savedQr = localStorage.getItem("qrCode");

    if (savedOrderId && savedQr === qrCode) {
      axios.get("http://192.168.1.112:8080/api/order/is-active", {
        params: { orderId: savedOrderId },
      }).then((res) => {
        if (!res.data) {
          localStorage.removeItem("orderId");
          localStorage.removeItem("cart");
          localStorage.removeItem("qrCode");
          setOrderId(null);
          setCart([]);
        }
      }).catch((err) => {
        console.error("Order check failed", err);
      });
    }
  }, [qrCode, navigate]);

  useEffect(() => {
    if (!orderId) return;

    const interval = setInterval(async () => {
      try {
        const res = await axios.get("http://192.168.1.112:8080/api/order/is-active", {
          params: { orderId },
        });

        if (!res.data) {
          Swal.fire("Order Complete", "\u2705 Your order has been completed!", "success").then(() => {
            // Clear all storage and reset states
            localStorage.removeItem("orderId");
            localStorage.removeItem("qrCode");
            localStorage.removeItem("cart");
            setOrderId(null);
            setCart([]);

            // Redirect to thank you page
            navigate("/thank-you");
          });
          clearInterval(interval);
        }
      } catch (err) {
        console.error("Error checking order status:", err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [orderId, navigate]);

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
    let updatedCart;
    if (existing) {
      updatedCart = cart.map((item) =>
        item.food.id === selectedFood.id
          ? { ...item, qty: item.qty + qty }
          : item
      );
    } else {
      updatedCart = [...cart, { food: selectedFood, qty }];
    }
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setShowModal(false);
  };

  const handlePlaceOrder = async () => {
    if (!qrCode) {
      Swal.fire("QR Code Missing", "Missing QR code", "warning");
      return;
    }

    const existingOrderId = localStorage.getItem("orderId");
    const existingQrCode = localStorage.getItem("qrCode");

    if (existingOrderId && existingQrCode && existingQrCode !== qrCode) {
      Swal.fire("Order Conflict", "Another order is already in progress on this device. Please complete it first.", "error");
      return;
    }

    if (existingOrderId && existingQrCode === qrCode) {
      Swal.fire("Order Already Active", "You already have an active order for this table.", "info");
      return;
    }

    try {
      const startRes = await axios.post(
        "http://192.168.1.112:8080/api/order/start",
        null,
        { params: { qrCode } }
      );

      const currentOrderId = startRes.data.id;
      setOrderId(currentOrderId);
      localStorage.setItem("orderId", currentOrderId);
      localStorage.setItem("qrCode", qrCode);

      for (const item of cart) {
        await axios.post(
          "http://192.168.1.112:8080/api/order/add",
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

      await Swal.fire("Success", "\u2705 Order placed successfully!", "success");

      // Clear cart only, keep orderId so polling can check status
      setCart([]);
      localStorage.removeItem("cart");

      // Do NOT redirect here

    } catch (err) {
      console.error(err);
      Swal.fire("Error", "\u274C Failed to place order.", "error");
    }
  };

  // New handler to fetch and show order details
  const handleViewOrder = async () => {
    if (!orderId) {
      Swal.fire("No active order", "You have not placed any order yet.", "info");
      return;
    }
    try {
      const res = await axios.get(`http://192.168.1.112:8080/api/order/${orderId}`);
      setCurrentOrder(res.data);
      setOrderDetailsModalShow(true);
    } catch (error) {
      console.error("Failed to fetch order details:", error);
      Swal.fire("Error", "Failed to load order details", "error");
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
                    src={`http://192.168.1.112:8080${food.imageUrl}`}
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

      <button
        className="btn btn-warning position-fixed bottom-0 start-0 m-4 shadow-lg d-flex align-items-center"
        style={{ fontWeight: "600", fontSize: "1.25rem", borderRadius: "50px", padding: "10px 20px" }}
        data-bs-toggle="modal"
        data-bs-target="#cartModal"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          className="bi bi-cart3 me-2"
          viewBox="0 0 16 16"
        >
          <path d="M0 1.5A.5.5 0 0 1 .5 1h1a.5.5 0 0 1 .485.379L2.89 5H14.5a.5.5 0 0 1 .491.592l-1.5 7A.5.5 0 0 1 13 13H4a.5.5 0 0 1-.491-.408L1.01 2H.5a.5.5 0 0 1-.5-.5zm3.14 4l1.25 5.5h7.22l1.25-5.5H3.14zM5.5 16a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm7 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
        </svg>
        View Cart ({cart.length})
      </button>

      {/* New View Order button */}
      {orderId && (
        <button
          className="btn btn-info position-fixed bottom-0 end-0 m-4 shadow-lg"
          style={{ fontWeight: "600", fontSize: "1.25rem", borderRadius: "50px", padding: "10px 20px" }}
          onClick={handleViewOrder}
        >
          View Order
        </button>
      )}

      <div className="modal fade" id="cartModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Cart</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              {cart.length === 0 ? (
                <p>No items in cart.</p>
              ) : (
                <>
                  <ul className="list-group mb-3">
                    {cart.map((item, index) => (
                      <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                          {item.food.name} &nbsp;
                          <button
                            className="btn btn-sm btn-outline-secondary me-1"
                            onClick={() => {
                              const updatedCart = cart
                                .map((it, i) =>
                                  i === index ? { ...it, qty: Math.max(it.qty - 1, 0) } : it
                                )
                                .filter(it => it.qty > 0);
                              setCart(updatedCart);
                              localStorage.setItem("cart", JSON.stringify(updatedCart));
                            }}
                          >
                            -
                          </button>
                          <span>{item.qty}</span>
                          <button
                            className="btn btn-sm btn-outline-secondary ms-1"
                            onClick={() => {
                              const updatedCart = cart.map((it, i) =>
                                i === index ? { ...it, qty: it.qty + 1 } : it
                              );
                              setCart(updatedCart);
                              localStorage.setItem("cart", JSON.stringify(updatedCart));
                            }}
                          >
                            +
                          </button>
                          <br />
                          <small>Rs. {item.food.price * item.qty}</small>
                        </div>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => {
                            const updatedCart = cart.filter((_, i) => i !== index);
                            setCart(updatedCart);
                            localStorage.setItem("cart", JSON.stringify(updatedCart));
                          }}
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                  <div className="d-flex justify-content-between fw-bold">
                    <span>Total:</span>
                    <span>
                      Rs.{" "}
                      {cart.reduce((total, item) => total + item.food.price * item.qty, 0)}
                    </span>
                  </div>
                </>
              )}
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-success w-100"
                data-bs-dismiss="modal"
                onClick={handlePlaceOrder}
                disabled={cart.length === 0}
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>

      <QuantityModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleQuantityConfirm}
      />

      <OrderDetailsModal
        show={orderDetailsModalShow}
        onClose={() => setOrderDetailsModalShow(false)}
        order={currentOrder}
      />
    </div>
  );
};

export default FoodListPage;
