import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';
import Sidebar from '../Components/Sidebar';
import Navbarfg from '../Components/Navbar';

import Swal from 'sweetalert2';

import '../App.css';

function Contactus() {
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_BASE_URL;
  const [showModal, setShowModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [error, setError] = useState('');


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
        const response = await axios.get(`${apiUrl}products`);
        setProperties(response.data);
      } catch (error) {
        console.error('Error fetching properties data:', error);
      }
    };

    fetchProperties();
  }, []);
    console.log("fedsv",properties)

    const handleDelete = async (propertyId) => {
          console.log("id",propertyId)
          // Show a confirmation dialog before deleting
          const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'This will delete the product and related entries!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
          });
      
          // If the user confirms, proceed with the deletion
          if (result.isConfirmed) {
            try { 
              // Make the API request to delete the product
              await axios.delete(`${apiUrl}products/${propertyId}`);
      
              // Show success message
              Swal.fire(
                'Deleted!',
                'The product has been deleted.',
                'success'
              );
            } catch (error) {
              // Handle error and show an error message
              console.error('Error deleting product:', error);
              Swal.fire(
                'Error!',
                'There was an issue deleting the product.',
                'error'
              );
            }
          }
        };

        const fetchOrderDetails = async (id) => {
          console.log("Fg",id)
          setError('');
          setOrderDetails(null);
          setShowModal(true);
      
          if (!id) {
            setError('Order ID is required');
            return;
          }
      
          try {
            const response = await axios.get(`${apiUrl}products/${id}`);
            setOrderDetails(response.data[0]);
          } catch (err) {
            if (err.response) {
              setError(err.response.data.error || 'An error occurred');
            } else {
              setError('An error occurred while fetching order details');
            }
          }
        };
      
          
        const handleEdit = (propertyId) => {
          console.log("id",propertyId)
          navigate(`/Updateproducts/${propertyId}`);
        };
      
      console.log("details",orderDetails)
      
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
        <th className="bl5 text-nowrap" style={{ width: '250px' }}>SKU</th>
        <th className="bl5 text-nowrap" style={{ width: '200px' }}>Title</th>
        <th className="bl5 text-nowrap" style={{ width: '200px' }}>Price</th>
        <th className="bl5 text-nowrap" style={{ width: '250px' }}>Category</th>
        <th className="bl5 text-nowrap" style={{ width: '200px' }}>Image</th>
        <th className="bl5 text-nowrap" style={{ width: '200px' }}>Action</th>

      </tr>
    </thead>
    <tbody>
      {properties.map((property) => (
        <tr key={property.id}>
          <td className="text-nowrap">{property.product_sku}</td>
          <td className="text-nowrap">{property.product_short}</td>
          <td className="text-nowrap">{property.product_price}</td>
          <td className="text-nowrap">{property.product_categores}</td>
          <td className="text-nowrap">
          
                    <img src={property.product_feature_img}  alt={property.product_feature_img}   style={{ width: '100px', height: '100px', objectFit: 'cover' }} 
  className="img-fluid"></img>
          </td>
          <td><button className="btn btn-danger  mt-3 px-5 mb-3" onClick={() => handleDelete(property.product_id)} >
     Delete
    </button>
    <button type="button" className="btn btn-primary mt-3 px-5 mb-3" onClick={() => handleEdit(property.product_id)}  >Edit</button>
    <button
                                className="btn btn-primary mt-3 px-5 mb-3"
                                onClick={() => fetchOrderDetails(property.product_id)}
                              >
                                Details
                              </button></td>
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
                  <h3 className="text-xl font-semibold mb-4">Product Details</h3>
                  <p><strong>Product Title:</strong> {orderDetails.product_title}</p>
                  <p><strong>Categore:</strong> {orderDetails.product_categores}</p>
                  <p><strong>Size:</strong> {orderDetails.product_p_pice}</p>
                  <p><strong>M.R.P:</strong> {orderDetails.product_price}</p>
                  <p><strong>M.O.P:</strong> {orderDetails.product_p_price}</p>
                  <p><strong>Discount:</strong> {orderDetails.product_p_discount}</p>
                  <p><strong>SKU:</strong> {orderDetails.product_sku}</p>
                  <p><strong>KEY Points:</strong> {orderDetails.products_points}</p>
                  <p><strong>Product Des.:</strong> {orderDetails.actualp_editor}</p>
                  <h3 className="text-xl font-semibold mb-4">SEO Details</h3>
                  <p><strong>SEO Title:</strong> {orderDetails.seoTitle}</p>
                  <p><strong>SEO Des:</strong> {orderDetails.seoDes}</p>
                  



                  
              
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
