import React, { useEffect, useState } from 'react';

export default function FoodListPage() {
  const [foods, setFoods] = useState([]);
  const [order, setOrder] = useState([]);

  // Fetch foods from backend API (replace with your real API)
  useEffect(() => {
    fetch('/api/foods') 
      .then(res => res.json())
      .then(data => setFoods(data))
      .catch(console.error);
  }, []);

  // Group foods by category
  const groupedFoods = foods.reduce((acc, food) => {
    if (!acc[food.category]) acc[food.category] = [];
    acc[food.category].push(food);
    return acc;
  }, {});

  // Handle Order button click
  const handleOrderClick = (food) => {
    const qtyStr = prompt(`Enter quantity for ${food.name}:`, "1");
    const qty = parseInt(qtyStr, 10);
    if (qty > 0) {
      setOrder(prev => {
        // check if food already in order
        const existing = prev.find(item => item.food.id === food.id);
        if (existing) {
          // update quantity
          return prev.map(item =>
            item.food.id === food.id
              ? { ...item, quantity: item.quantity + qty }
              : item
          );
        }
        // add new item
        return [...prev, { food, quantity: qty }];
      });
      alert(`${qty} x ${food.name} added to order.`);
    } else {
      alert('Invalid quantity.');
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Menu</h2>

      {Object.keys(groupedFoods).map(category => (
        <div key={category} className="mb-5">
          <h3 className="mb-3">{category}</h3>
          <div className="row">
            {groupedFoods[category].map(food => (
              <div key={food.id} className="col-6 col-md-4 col-lg-3 mb-4">
                <div className="card h-100 shadow-sm">
                  <img
                    src={food.imageUrl || 'https://via.placeholder.com/150'}
                    className="card-img-top"
                    alt={food.name}
                    style={{ height: '150px', objectFit: 'cover' }}
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{food.name}</h5>
                    <p className="card-text">${food.price.toFixed(2)}</p>
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
    </div>
  );
}
