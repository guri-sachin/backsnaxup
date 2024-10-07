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
        const response = await axios.get('http://localhost:4000/api/Allgifts');
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
              await axios.delete(`http://localhost:4000/api/DeletGift/${propertyId}`);
      
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
                    <h1 className="h3 mb-0 text-white text-center pt-3">All Gifts</h1>

                  </div>
                  <div className='mt-5'>
  <table id="example" className="table table-striped table-bordered table-responsive">
    <thead>
      <tr>
      <th className="bl5 text-nowrap" style={{ width: '200px' }}>ID</th>
        <th className="bl5 text-nowrap" style={{ width: '200px' }}>Title</th>
        <th className="bl5 text-nowrap" style={{ width: '200px' }}>Price</th>
        <th className="bl5 text-nowrap" style={{ width: '250px' }}>MRP</th>

        <th className="bl5 text-nowrap" style={{ width: '200px' }}>Image</th>
        <th className="bl5 text-nowrap" style={{ width: '200px' }}>Action</th>

      </tr>
    </thead>
    <tbody>
      {properties.map((property) => (
        <tr key={property.id}>
                    <td className="text-nowrap">{property.id}</td>

          <td className="text-nowrap">{property.short}</td>
          <td className="text-nowrap">{property.price}</td>
          <td className="text-nowrap">{property.mrp}</td>
 
          <td className="text-nowrap">
          
                    <img src={property.feature_img}  alt={property.feature_img}   style={{ width: '100px', height: '100px', objectFit: 'cover' }} 
  className="img-fluid"></img>
          </td>
          <td><button className="btn btn-danger  mt-3 px-5 mb-3" onClick={() => handleDelete(property.id)} >
     Delete
    </button>
    <button type="button" className="btn btn-primary mt-3 px-5 mb-3"   >Edit</button></td>
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
    </div>
  );
}

export default Contactus;
