import React, { useState, useEffect } from "react";

export default function QuantityModal({ show, onClose, onConfirm }) {
  const [quantity, setQuantity] = useState(1);

  // Reset quantity when modal opens
  useEffect(() => {
    if (show) {
      setQuantity(1);
    }
  }, [show]);

  const increment = () => setQuantity((q) => q + 1);
  const decrement = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  if (!show) return null;

  return (
    <>
      {/* Modal backdrop */}
      <div
        className="modal-backdrop fade show"
        style={{ zIndex: 1040 }}
        onClick={onClose}
      ></div>

      {/* Modal dialog */}
      <div
        className="modal d-block"
        tabIndex="-1"
        role="dialog"
        style={{ zIndex: 1050 }}
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Enter Quantity</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={onClose}
              ></button>
            </div>
            <div className="modal-body d-flex align-items-center">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={decrement}
                style={{ width: "40px", height: "40px" }}
              >
                -
              </button>
              <input
                type="number"
                className="form-control mx-2 text-center"
                min="1"
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, Number(e.target.value) || 1))
                }
                style={{ maxWidth: "80px" }}
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={increment}
                style={{ width: "40px", height: "40px" }}
              >
                +
              </button>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => onConfirm(quantity)}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
