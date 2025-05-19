import React, { useState, useEffect } from 'react';

const ManageOrder = () => {
  const [orders, setOrders] = useState([]);
  const [itemNumber, setItemNumber] = useState('');
  const [itemName, setItemName] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [estimatedDeliveryDay, setEstimatedDeliveryDay] = useState('');
  const [orderStatus, setOrderStatus] = useState('');
  const [orderId, setOrderId] = useState(''); // Used for updating orders

  // Fetch all orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:5001/order', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setOrders(data);
      } else {
        alert(`Error fetching orders: ${data.error}`);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      alert('Failed to fetch orders. Please try again.');
    }
  };

  const handleCreateOrder = async () => {
    try {
      const response = await fetch('http://localhost:5001/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          itemNumber,
          itemName,
          shippingAddress,
          estimatedDeliveryDay,
          orderStatus,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Order created successfully!');
        resetForm();
        fetchOrders(); // Refresh the orders list
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error('Error creating order:', err);
      alert('Failed to create order. Please try again.');
    }
  };

  const handleUpdateOrder = async () => {
    try {
      const response = await fetch(`http://localhost:5001/order/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          itemNumber,
          itemName,
          shippingAddress,
          estimatedDeliveryDay,
          orderStatus,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Order updated successfully!');
        resetForm();
        fetchOrders(); // Refresh the orders list
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error('Error updating order:', err);
      alert('Failed to update order. Please try again.');
    }
  };

  const resetForm = () => {
    setItemNumber('');
    setItemName('');
    setShippingAddress('');
    setEstimatedDeliveryDay('');
    setOrderStatus('');
    setOrderId('');
  };

  return (
    <div className="manage-order-container">
      <h1>Manage Orders</h1>

      {/* Order List Section */}
      <div className="orders-list">
        <h2>All Orders</h2>
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Item Number</th>
              <th>Item Name</th>
              <th>Shipping Address</th>
              <th>Delivery Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.itemNumber}</td>
                <td>{order.itemName}</td>
                <td>{order.shippingAddress}</td>
                <td>{order.estimatedDeliveryDay}</td>
                <td>{order.orderStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create/Update Order Section */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (orderId) {
            handleUpdateOrder();
          } else {
            handleCreateOrder();
          }
        }}
      >
        <input
          type="text"
          placeholder="Order ID (for updating)"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Item Number"
          value={itemNumber}
          onChange={(e) => setItemNumber(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Item Name"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Shipping Address"
          value={shippingAddress}
          onChange={(e) => setShippingAddress(e.target.value)}
          required
        />
        <input
          type="date"
          placeholder="Estimated Delivery Day"
          value={estimatedDeliveryDay}
          onChange={(e) => setEstimatedDeliveryDay(e.target.value)}
          required
        />
        <select
          value={orderStatus}
          onChange={(e) => setOrderStatus(e.target.value)}
          required
        >
          <option value="" disabled>
            Select Order Status
          </option>
          <option value="Pending">Pending</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
        </select>
        <button type="submit">{orderId ? 'Update Order' : 'Create Order'}</button>
      </form>
    </div>
  );
};

export default ManageOrder;
