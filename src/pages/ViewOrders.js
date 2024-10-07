import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';
import Sidebar from '../Components/Sidebar';
import Navbarfg from '../Components/Navbar';

import Swal from 'sweetalert2';

import '../App.css';

function Contactus() {
  const navigate = useNavigate();
  const baseUrl = process.env.REACT_APP_BASE_URL;
  // useEffect(()=>{
  //   if(sessionStorage.getItem("userData") == null)
  //   {
  //     navigate('/')
  //   }
  // },[])
    const [blogId, setBlogId] = useState(null);
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    // Fetch data from the API when the component mounts
    const fetchProperties = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/Allorders');
        setProperties(response.data);
      } catch (error) {
        console.error('Error fetching properties data:', error);
      }
    };

    fetchProperties();
  }, []);
    console.log("fedsv",properties)

    const handleDelete = async (orderId) => {
      // Prompt for the reason using SweetAlert
      const { value: reason } = await Swal.fire({
        title: 'Are you sure?',
        text: 'This will cancel the order and related entries!',
        icon: 'warning',
        input: 'textarea', // Use textarea for the reason input
        inputLabel: 'Reason for Deletion',
        inputPlaceholder: 'Please enter the reason...',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel',
      });
    
      // Check if the user provided a reason and confirmed deletion
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
    
        // If the user confirms, proceed with the deletion
        if (result.isConfirmed) {
          try {
            await axios.delete(`http://localhost:4000/api/Deleteorders/${orderId}`, {
              data: { reason } // Include the reason in the request body
            });
    
            Swal.fire('Deleted!', 'The order has been deleted.', 'success');
            // Optionally update your state here
          } catch (error) {
            console.error('Error deleting order:', error);
            Swal.fire('Error!', 'There was an issue deleting the order.', 'error');
          }
        }
      } else {
        Swal.fire('Cancelled', 'Deletion was cancelled.', 'info');
      }
    };
    
        
        const [orderDetails, setOrderDetails] = useState(null);
        const [error, setError] = useState('');
      
        const fetchOrderDetails = async (orderId) => {
          setError('');
          setOrderDetails(null);
      
          if (!orderId) {
            setError('Order ID is required');
            return;
          }
      
          try {
            const response = await axios.get(`http://localhost:4000/api/orders/${orderId}`);
            setOrderDetails(response.data);
          } catch (err) {
            if (err.response) {
              setError(err.response.data.error || 'An error occurred');
            } else {
              setError('An error occurred while fetching order details');
            }
          }
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

                  </div>
                  <div className='mt-5'>
  <table id="example" className="table table-striped table-bordered table-responsive">
    <thead>
      <tr>
        <th className="bl5 text-nowrap" style={{ width: '250px' }}>ORDER ID</th>
        <th className="bl5 text-nowrap" style={{ width: '200px' }}>Discount</th>
        <th className="bl5 text-nowrap" style={{ width: '200px' }}>Price</th>
        <th className="bl5 text-nowrap" style={{ width: '250px' }}>Status</th>
        <th className="bl5 text-nowrap" style={{ width: '200px' }}>Phone/ Email</th>
        <th className="bl5 text-nowrap" style={{ width: '200px' }}>Action</th>

      </tr>
    </thead>
    <tbody>
      {properties.map((property) => (
        <tr key={property.id}>
          <td className="text-nowrap">{property.orderId
          }</td>
          <td className="text-nowrap">{property.discount}</td>
          <td className="text-nowrap">{property.total_amount
          }</td>
          <td className="text-nowrap">{property.
order_status}</td>
          <td className="text-nowrap">
          {property.phone}
          {property.email}
                    
          </td>
          <td><button className="btn btn-primary   mt-3 px-5 mb-3" onClick={() => fetchOrderDetails(property.orderId)} >
  Details
    </button>
    <button type="button" className="btn btn-danger mt-3 px-5 mb-3"    onClick={() => handleDelete(property.orderId)} >   Cancel</button></td>
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
        <a className="scroll-to-top rounded" href="#page-top">
          <i className="fas fa-angle-up"></i>
        </a>
      </div>
      <div>
      <h2>Retrieve Order Details</h2>
      <input
        type="text"
        // value={orderId}
        // onChange={(e) => setOrderId(e.target.value)}
        placeholder="Enter Order ID"
      />
      <button onClick={fetchOrderDetails}>Fetch Order Details</button>

      {error && <div style={{ color: 'red' }}>{error}</div>}
      {orderDetails && (
        <div>
          <h3>Order Details</h3>
          <p><strong>Order ID:</strong> {orderDetails.orderId}</p>
          <p><strong>Total Amount:</strong> ${orderDetails.totalAmount}</p>
          <p><strong>Discount:</strong> ${orderDetails.discount || 0}</p>
          <p><strong>Payment Method:</strong> {orderDetails.paymentMethod}</p>
          <p><strong>Address:</strong> {orderDetails.addressLine1}, {orderDetails.city}, {orderDetails.provience}, {orderDetails.postalCode}, {orderDetails.country}</p>
          <h4>Items:</h4>
          <ul>
            {orderDetails.items.split(',').map((item, index) => {
              const [productId, quantity, size, price] = item.split(':');
              return (
                <li key={index}>
                  Product ID: {productId}, Quantity: {quantity}, Size: {size}, Price: ${price}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
    </div>
  );
}

export default Contactus;
