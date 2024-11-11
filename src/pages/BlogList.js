import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';
import Sidebar from '../Components/Sidebar';
import Navbarfg from '../Components/Navbar';
import Swal from 'sweetalert2';



import '../App.css';

function BlogList({events}) {
  const apiUrl = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();

  const [blogId, setBlogId] = useState(null);
  const [properties, setProperties] = useState([]);
  useEffect(() => {
          // Fetch data from the API when the component mounts
          const fetchProperties = async () => {
            try {
             
              const response = await axios.get(`${apiUrl}blogs-all`);
              setProperties(response.data);
            } catch (error) {
              console.error('Error fetching properties data:', error);
            }
          };
      
          fetchProperties();
        }, []);
      
        const handleDelete = async (property) => {
          // Show confirmation dialog
          const result = await Swal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete the property with ID ${property.id}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
          });
      
          if (result.isConfirmed) {
            try {                            
              // Make DELETE request to the API   
              const response = await axios.delete(`${apiUrl}delete-blogs/${property.id}`);
              
              if (response.status === 200) {
                setProperties(properties.filter((p) => p.id !== property.id));
                // Show success message
                Swal.fire('Deleted!', 'The property has been deleted.', 'success');
              } else {
                // Show error message if the response is not successful
                Swal.fire('Error!', 'There was a problem deleting the property.', 'error');
              }
            } catch (error) {
              console.error('Failed to delete data', error);
              // Show error message
              Swal.fire('Error!', 'There was a problem deleting the property.', 'error');
            }
          }
        };
           
           
        const handleView = (propertyId) => {
          navigate(`/ViewBlog/${propertyId}`);
        };
      
        const handleEdit = (propertyId) => {
          navigate(`/Editeblogs/${propertyId}`);
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
                    <h1 className="h3 mb-0 text-white text-center pt-3">VIEW BLOGS</h1>

                  </div>
                  <div className='mt-5'>
                  <table id="example" className="table table-striped table-bordered table-responsive">
        <thead>
          <tr>
            <th className="bl5">ID</th>
            <th className="bl5">Title</th>
            <th className="bl5">vIEW</th>
            <th className="bl5">Delete</th>
            <th className="bl5">Edit</th>
          </tr>
        </thead>
        <tbody>
          {properties.map((property) => (
            <tr key={property.id}>
              <td>{property.id}</td>
              <td>{property.title}</td>
              <td> <button type="button" className="btn btn-dark mt-3 px-5 mb-3"  onClick={() => handleView(property.id)} >View</button></td>
             <td><button className="btn btn-danger  mt-3 px-5 mb-3" onClick={() => handleDelete(property)}>
     Delete
    </button>
    </td> 
              <td> <button type="button" className="btn btn-primary mt-3 px-5 mb-3"  onClick={() => handleEdit(property.id)} >Edit</button></td>
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

export default BlogList;
