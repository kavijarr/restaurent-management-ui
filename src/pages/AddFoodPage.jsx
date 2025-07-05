import React, { useState } from 'react';

export default function AddFoodPage() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !price || !category) {
      setMessage('Please fill all required fields.');
      return;
    }

    const foodData = {
      name,
      price: parseFloat(price),
      category,
      imageUrl,
    };

    try {
      const response = await fetch('/api/foods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(foodData),
      });

      if (response.ok) {
        setMessage('Food added successfully!');
        setName('');
        setPrice('');
        setCategory('');
        setImageUrl('');
      } else {
        setMessage('Failed to add food.');
      }
    } catch (error) {
      console.error(error);
      setMessage('Error adding food.');
    }
  };

  return (
    <div className="container py-4">
      <h2>Add New Food</h2>

      {message && <div className="alert alert-info">{message}</div>}

      <form onSubmit={handleSubmit} className="w-100" style={{ maxWidth: '400px' }}>
        <div className="mb-3">
          <label className="form-label">Name *</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Price *</label>
          <input
            type="number"
            step="0.01"
            className="form-control"
            value={price}
            onChange={e => setPrice(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Category *</label>
          <input
            type="text"
            className="form-control"
            value={category}
            onChange={e => setCategory(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Image URL</label>
          <input
            type="text"
            className="form-control"
            value={imageUrl}
            onChange={e => setImageUrl(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-success">Add Food</button>
      </form>
    </div>
  );
}
