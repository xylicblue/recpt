// src/components/ReceiptForm.jsx

import React from "react";
import { FaPlus, FaTrash } from "react-icons/fa";

const ReceiptForm = ({ details, setDetails, items, setItems, errors }) => {
  const handleDetailChange = (e) => {
    const { name, value } = e.target;
    setDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const newItems = [...items];
    newItems[index][name] = value;
    setItems(newItems);
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      { id: Date.now(), description: "", quantity: 1, price: 0 },
    ]);
  };

  const handleDeleteItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  return (
    <div className="receipt-form">
      <div className="form-section">
        <div className="form-group">
          <label>Company Name</label>
          <input
            type="text"
            name="companyName"
            value={details.companyName}
            onChange={handleDetailChange}
            className={errors.companyName ? "input-error" : ""}
          />
          {errors.companyName && (
            <p className="error-text">{errors.companyName}</p>
          )}
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Company Address</label>
            <input
              type="text"
              name="companyAddress"
              value={details.companyAddress}
              onChange={handleDetailChange}
            />
          </div>
          <div className="form-group">
            <label>Company Contact</label>
            <input
              type="text"
              name="companyPhone"
              value={details.companyPhone}
              onChange={handleDetailChange}
            />
          </div>
        </div>
      </div>

      {/* --- Client & Receipt Details Section --- */}
      <div className="form-section">
        <h3>Bill To:</h3>
        <div className="form-group">
          <label>Client Name</label>
          <input
            type="text"
            name="clientName"
            value={details.clientName}
            onChange={handleDetailChange}
            className={errors.clientName ? "input-error" : ""}
          />
          {errors.clientName && (
            <p className="error-text">{errors.clientName}</p>
          )}
        </div>
        <div className="form-group">
          <label>Client Address</label>
          <input
            type="text"
            name="clientAddress"
            value={details.clientAddress}
            onChange={handleDetailChange}
          />
        </div>
        <div className="form-row">
          {/* THIS IS THE BLOCK TO CHANGE */}
          <div className="form-group">
            <label>Receipt Number</label>
            {/* Replace the input with a <p> tag */}
            <p className="form-static-text">{details.receiptNumber || "..."}</p>
          </div>
          <div className="form-group">
            <label>Receipt Date</label>
            <input
              type="date"
              name="receiptDate"
              value={details.receiptDate}
              onChange={handleDetailChange}
            />
          </div>
        </div>
      </div>

      <div className="form-section items-section">
        <h3>Services / Items</h3>
        {items.map((item, index) => (
          <div key={item.id} className="item-row">
            <div className="item-description-group">
              <input
                type="text"
                name="description"
                placeholder="Service Description"
                value={item.description}
                onChange={(e) => handleItemChange(index, e)}
                className={errors.items?.[index] ? "input-error" : ""}
              />
              {errors.items?.[index] && (
                <p className="error-text">{errors.items[index]}</p>
              )}
            </div>
            <input
              type="number"
              name="quantity"
              placeholder="Qty"
              value={item.quantity}
              onChange={(e) => handleItemChange(index, e)}
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={item.price}
              onChange={(e) => handleItemChange(index, e)}
            />
            <button
              type="button"
              onClick={() => handleDeleteItem(index)}
              className="delete-item-btn"
            >
              <FaTrash />
            </button>
          </div>
        ))}
        <button type="button" onClick={handleAddItem} className="add-item-btn">
          <FaPlus /> Add Item
        </button>
      </div>

      <div className="form-section">
        <div className="form-group">
          <label>Discount ($)</label>
          <input
            type="number"
            name="discount"
            value={details.discount}
            onChange={handleDetailChange}
            style={{ maxWidth: "150px" }}
          />
        </div>
      </div>
    </div>
  );
};

export default ReceiptForm;
