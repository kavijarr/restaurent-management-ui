import React from "react";

const OrderDetailsModal = ({ show, onClose, order }) => {
  if (!show || !order) return null;

  return (
    <>
      <div className="modal-backdrop fade show" style={{ zIndex: 1040 }} onClick={onClose}></div>
      <div className="modal d-block" tabIndex="-1" role="dialog" style={{ zIndex: 1050 }}>
        <div className="modal-dialog modal-dialog-scrollable" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Your Order #{order.id}</h5>
              <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <p><strong>Table:</strong> {order.tableName}</p>
              <p><strong>Created At:</strong> {new Date(order.createdAt).toLocaleString()}</p>
              <ul className="list-group mb-3">
                {order.items.map((item, index) => (
                  <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>{item.foodName} x {item.quantity}</div>
                    <div>Rs. {(item.price * item.quantity).toFixed(2)}</div>
                  </li>
                ))}
              </ul>
              <div className="d-flex justify-content-between fw-bold">
                <span>Total:</span>
                <span>Rs. {order.totalPrice.toFixed(2)}</span>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary w-100" onClick={onClose}>Close</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetailsModal;
