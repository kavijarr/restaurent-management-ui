import React, { useState } from 'react';
import axios from 'axios';

function CreateFood() {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    image: null,
  });

  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'image') {
      const file = files[0];
      setFormData({ ...formData, image: file });
      setPreview(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('price', formData.price);
    submitData.append('category', formData.category);
    submitData.append('image', formData.image);

    try {
      await axios.post('http://localhost:8080/api/food/upload', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage('Food created successfully!');
      setFormData({ name: '', price: '', category: '', image: null });
      setPreview(null);
    } catch (err) {
      console.error(err);
      setMessage('Failed to create food');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Create Food</h2>

      {message && <div className="alert alert-info">{message}</div>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <label className="form-label">Food Name</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Price (Rs)</label>
          <input
            type="number"
            name="price"
            className="form-control"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Category</label>
          <input
            type="text"
            name="category"
            className="form-control"
            value={formData.category}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Image</label>
          <input
            type="file"
            name="image"
            className="form-control"
            accept="image/*"
            onChange={handleChange}
            required
          />
        </div>

        {preview && (
          <div className="mb-3">
            <img src={preview} alt="Preview" className="img-thumbnail" style={{ maxWidth: '200px' }} />
          </div>
        )}

        <button type="submit" className="btn btn-primary">Create Food</button>
      </form>
    </div>
  );
}

export default CreateFood;
