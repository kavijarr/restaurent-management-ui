import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminPage = () => {
  const [tables, setTables] = useState([]);
  const [tableName, setTableName] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [orders, setOrders] = useState([]);

  const fetchOrders = () => {
    axios.get("http://192.168.1.112:8080/api/order").then((res) => {
      setOrders(res.data);
    });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleTableCreate = async () => {
    try {
      await axios.post("http://192.168.1.112:8080/api/tables", {
        name: tableName,
        qrCode,
      });
      alert("Table created");
      setTableName("");
      setQrCode("");
    } catch (err) {
      alert("Failed to create table");
    }
  };

  const handleCompleteOrder = async (orderId) => {
    try {
      await axios.post(`http://192.168.1.112:8080/api/order/complete`, null, {
        params: { orderId },
      });
      alert("Order marked as complete");
      fetchOrders();
    } catch (err) {
      alert("Failed to complete order");
    }
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4">Admin Panel</h2>

      {/* Create Table */}
      <div className="card mb-5">
        <div className="card-header">Create Table</div>
        <div className="card-body">
          <div className="mb-3">
            <label className="form-label">Table Name</label>
            <input
              type="text"
              className="form-control"
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">QR Code</label>
            <input
              type="text"
              className="form-control"
              value={qrCode}
              onChange={(e) => setQrCode(e.target.value)}
            />
          </div>
          <button className="btn btn-success" onClick={handleTableCreate}>
            Create Table
          </button>
        </div>
      </div>

      {/* Orders */}
      <div className="card">
        <div className="card-header">Current Orders</div>
        <div className="card-body table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Table</th>
                <th>Items</th>
                <th>Total Price</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center">
                    No orders available
                  </td>
                </tr>
              )}
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.tableName || "N/A"}</td>
                  <td>
                    <ul className="mb-0">
                      {(order.items || []).map((item, index) => (
                        <li key={index}>
                          {item.foodName || "Unknown Food"} × {item.quantity}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>Rs. {order.totalPrice}</td>
                  <td>{order.active ? "Yes" : "No"}</td>
                  <td>
                    {order.active && (
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleCompleteOrder(order.id)}
                      >
                        Mark Complete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
