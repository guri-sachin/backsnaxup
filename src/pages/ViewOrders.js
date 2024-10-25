import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../Components/Sidebar';
import Navbarfg from '../Components/Navbar';
import Swal from 'sweetalert2';
import '../App.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function Contactus() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [properties, setProperties] = useState([]);
  const [error, setError] = useState('');
  const apiUrl = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    const fetchProperties = async () => {
      try {  
        const response = await axios.get(`${apiUrl}Allorders`);
        setProperties(response.data);
      } catch (error) {
        console.error('Error fetching properties data:', error);
      }
    };
    fetchProperties();
  }, []);
  const [selectedStatus, setSelectedStatus] = useState('Processing');


  const handleDelete = async (orderId) => {
    const { value: reason } = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will cancel the order and related entries!',
      icon: 'warning',
      input: 'textarea',
      inputLabel: 'Reason for Deletion',
      inputPlaceholder: 'Please enter the reason...',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });

    if (reason) {
      const result = await Swal.fire({
        title: 'Confirm Deletion',
        text: `Are you sure you want to delete this order?\nReason: ${reason}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel',
      });
      if (result.isConfirmed) {
        try {
          await axios.delete(`${apiUrl}Deleteorders/${orderId}`, {
            data: { reason },
          });
          Swal.fire('Deleted!', 'The order has been deleted.', 'success');
        } catch (error) {
          console.error('Error deleting order:', error);
          Swal.fire('Error!', 'There was an issue deleting the order.', 'error');
        }
      }
    } else {
      Swal.fire('Cancelled', 'Deletion was cancelled.', 'info');
    }
  };

  const fetchOrderDetails = async (orderId) => {
    setError('');
    setOrderDetails(null);
    setShowModal(true);

    if (!orderId) {
      setError('Order ID is required');
      return;
    }

    try {
      const response = await axios.get(`${apiUrl}orders/${orderId}`);
      setOrderDetails(response.data);
    } catch (err) {
      if (err.response) {
        setError(err.response.data.error || 'An error occurred');
      } else {
        setError('An error occurred while fetching order details');
      }
    }
  };


  // Function to handle the dropdown change
  const handleStatusChange = async (event, orderId) => {
    const newStatus = event.target.value;

    try {
      // Make a PUT request to update order status
      const response = await axios.put(`${apiUrl}Edit_order/${orderId}`, {
        order_status: newStatus,
      });

      if (response.data.message) {
        alert("Order status updated successfully!");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status.");
    }
  };


  const generateInvoice = (property) => {
    // Calculate tax breakdown
    const taxPercentage = 18;
    const taxAmount = property.total_amount * (taxPercentage / 100);
    const baseAmount = property.total_amount - taxAmount;
  
    // Generate the invoice in PDF format
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(18);
    doc.text("Invoice", 14, 22);
  
    // Order Information Table
    doc.autoTable({
      startY: 30,
      head: [['Order ID', 'Discount', 'Total Amount', 'Tax (18%)', 'Base Amount', 'Order Status']],
      body: [[
        property.orderId,
        `${property.discount}%`,
        `₹${property.total_amount}`,
        `₹${taxAmount.toFixed(2)}`,
        `₹${baseAmount.toFixed(2)}`,
        property.order_status
      ]],
    });
  
    // Customer Details
    doc.text("Customer Details:", 14, doc.previousAutoTable.finalY + 10);
    doc.autoTable({
      startY: doc.previousAutoTable.finalY + 15,
      body: [
        ["Phone", property.phone],
        ["Email", property.email]
      ],
    });
  
    // Show and save the invoice
    doc.save(`Invoice_${property.orderId}.pdf`);
  };

  return (
    <div>
      <div id="wrapper">
        <Sidebar />
        <div id="content-wrapper" className="d-flex flex-column">
          <div id="content">
            <Navbarfg />
            <div className="container-fluid scrollable-content">
              <div className="container-fluid">
                <div className="mb-4">
                <div className='propertys-div'>
                    <h1 className="h3 mb-0 text-white text-center pt-3">Product List</h1>

                  </div>                  <div className="mt-5">
                    <table id="example" className="table table-striped table-bordered table-responsive">
                      <thead>
                        <tr>
                          <th>ORDER ID</th>
                          <th>Discount</th>
                          <th>Price</th>
                          <th>Status</th>
                          <th>Payment Method</th>
                          <th>Phone/Email</th>
                          <th>Action</th>
                          <th>Change Status</th>

                        </tr>
                      </thead>
                      <tbody>
                        {properties.map((property) => (
                          <tr key={property.id}>
                            <td>{property.orderId}</td>
                            <td>{property.discount}</td>
                            <td>{property.total_amount}</td>
                            <td>{property.order_status}</td>
                            <td>{property.payment_method}</td>
                            <td>
                              {property.phone}
                              <br />
                              {property.email}
                            </td>
                            <td>
                              <button
                                className="btn btn-primary mt-3 px-5 mb-3"
                                onClick={() => fetchOrderDetails(property.orderId)}
                              >
                                Details
                              </button>
                              <button
                                type="button"
                                className="btn btn-danger mt-3 px-5 mb-3"
                                onClick={() => handleDelete(property.orderId)}
                              >
                                Cancel
                              </button>
                              <button
              type="button"
              className="btn btn-success mt-3 px-5 mb-3"
              onClick={() => generateInvoice(property)}
            >
              Generate Invoice
            </button>
                            </td>
                            <td>  
                            <select
        id="orderStatus"
        value={property.order_status}
        onChange={(e) => handleStatusChange(e, property.orderId)}
        className="form-control mt-3 mb-3"
      >
        <option value="Processing">Processing</option>
        <option value="Shipped">Shipped</option>
        <option value="Out for Delivery">Out for Delivery</option>
        <option value="Delivered">Delivered</option>
        <option value="Delayed">Delayed</option>
        <option value="Cancelled">Cancelled</option>
      </select>
                              </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Popup */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button
                className="close-modal"
                onClick={() => setShowModal(false)}
              >
                &times;
              </button>
              {orderDetails && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Order Details</h3>
                  <p><strong>Order ID:</strong> {orderDetails.orderId}</p>
                  <p><strong>Total Amount:</strong> ₹{orderDetails.totalAmount}</p>
                  <p><strong>Discount:</strong> ₹{orderDetails.discount || 0}</p>
                  <p><strong>Payment Method:</strong> {orderDetails.paymentMethod}</p>
                  <p>
                    <strong>Shipping Address:</strong>{' '}
                    {orderDetails.addressLine1}, {orderDetails.city}, {orderDetails.provience}, {orderDetails.postalCode}, {orderDetails.country}
                  </p>
                  <h4 className="text-lg font-semibold mb-2">Items:</h4>
                  <ul>
                    {orderDetails.items.split(',').map((item, index) => {
                      const [productId, quantity, size, price] = item.split(':');
                      return (
                        <li key={index}>
                          <strong>Product ID:</strong> {productId}, <strong>Quantity:</strong> {quantity}, <strong>Size:</strong> {size}, <strong>Price:</strong> ₹{price}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Contactus;
