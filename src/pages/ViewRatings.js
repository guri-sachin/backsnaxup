import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';
import Sidebar from '../Components/Sidebar';
import Navbar from '../Components/Navbar';

import Swal from 'sweetalert2';

import '../App.css';

function Ratings() {
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
        const response = await axios.get('http://localhost:4000/api/ratings_admin');
        setProperties(response.data);
      } catch (error) {
        console.error('Error fetching properties data:', error);
      }
    };

    fetchProperties();
  }, []);
    console.log("fedsv",properties)
    const [reviews, setReviews] = useState([]);
    const [responseMessage, setResponseMessage] = useState('');
        const [productId, setProductId] = useState('');
// Function to call the API 
const updateActiveField = async (id) => {
  console.log("ID:", id); // Log to check the ID
  try {
    const response = await fetch('http://localhost:4000/api/update_active', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),  // Sending the 'id' as required
    });

    const data = await response.json();

    if (response.ok) {
      setResponseMessage(data.message); // Success message
    } else {
      setResponseMessage(data.error); // Error message
    }
  } catch (error) {
    setResponseMessage('Error updating the active field.');
    console.error('Fetch error:', error);
  }
};

 // Function to delete a review by id
 const deleteReview = async (id) => {
  const confirmDelete = window.confirm('Are you sure you want to delete this review?');
  if (!confirmDelete) return;

  try {
    const response = await fetch(`http://localhost:4000/api/delete_review/${id}`, {
      method: 'DELETE',
    });

    const data = await response.json();

    if (response.ok) {
      setResponseMessage(data.message);
      setReviews(reviews.filter((review) => review.id !== id)); // Remove deleted review from state
    } else {
      setResponseMessage(data.error);
    }
  } catch (error) {
    setResponseMessage('Error deleting review.');
    console.error('Error:', error);
  }
};

  return (
    <div>
      <div id="wrapper">
        <Sidebar />
        <div id="content-wrapper" className="d-flex flex-column">
          <div id="content">
            <Navbar />
            {responseMessage && <p>{responseMessage}</p>}
            <div className="container-fluid scrollable-content">
              <div className="container-fluid">
                <div className="mb-4">
                  <div className='propertys-div'>
                    <h1 className="h3 mb-0 text-white text-center pt-3">All Gifts</h1>

                  </div>
                  <div className='mt-5'>
  <table id="example" className="table table-striped table-bordered table-responsive">
    <thead>
      <tr>
      <th className="bl5 text-nowrap" style={{ width: '200px' }}>Product ID</th>
        <th className="bl5 text-nowrap" style={{ width: '200px' }}>Message</th>
        <th className="bl5 text-nowrap" style={{ width: '200px' }}>Email</th>
        <th className="bl5 text-nowrap" style={{ width: '250px' }}>Ratings</th>

        <th className="bl5 text-nowrap" style={{ width: '200px' }}>Status</th>
        <th className="bl5 text-nowrap" style={{ width: '200px' }}>Action</th>

      </tr>
    </thead>
    <tbody>
      {properties.map((property) => (
        <tr key={property.id}>
                    <td className="text-nowrap">{property.p_id}</td>

          <td className="text-nowrap">{property.msg}</td>
          <td className="text-nowrap">{property.email}</td>
          <td className="text-nowrap">{property.rating}</td>
 
          <td className="text-nowrap">
          {property.active}
          </td>
          <td>
    <div class="dropdown">
  <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    Action
  </button>
  <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
  <a className="dropdown-item" onClick={() => updateActiveField(property.id)}>Accept</a>
  <a  class="dropdown-item" onClick={() => deleteReview(property.id)}>Reject</a>
    
    
  </div></div>
  
  </td>
        </tr>
      ))}
            {responseMessage && <p>{responseMessage}</p>}

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
    </div>
  );
}

export default Ratings;
