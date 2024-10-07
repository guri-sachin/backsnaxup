
import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useNavigate, useHistory } from 'react-router-dom';
import { Route, Link, Routes } from 'react-router-dom';
import { fetch } from 'whatwg-fetch';
import { Form, Button, Navbar, Nav, Container, Carousel, Table } from 'react-bootstrap';
import Sidebar from '../Components/Sidebar'
import Navbarfg from '../Components/Navbar'
import Footer from '../Components/Footer'
import Swal from 'sweetalert2';
import '../App.css';



function PropertyList() {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  useEffect(()=>{
    if(sessionStorage.getItem("userData") == null)
    {
      navigate('/')
    }
  },[])
          const [properties, setProperties] = useState([]);
          useEffect(() => {
            // Fetch data from the API when the component mounts
            const fetchProperties = async () => {
              try {
                const response = await axios.get('http://localhost:4000/api/uploads-rent');
                setProperties(response.data);
              } catch (error) {
                console.error('Error fetching properties data:', error);
              }
            };
        
            fetchProperties();
          }, []);


          // // approve and reject api
          // const handleClick = async (property) => {
          //           try {
          //             const newStatus = property.approve === 1 ? 0 : 1;
          //             const response = await axios.put(`http://localhost:4000/api/update-approve/${property.id}`, {
          //               approve: newStatus
          //             });
          //             alert(response.data);
                
          //             // Update the properties state to reflect the change
          //             const updatedProperties = properties.map((prop) => 
          //               prop.id === property.id ? { ...prop, approve: newStatus } : prop
          //             );
          //             setProperties(updatedProperties);
          //           } catch (error) {
          //             console.error('Error updating approve status:', error);
          //             alert('Error updating approve status');
          //           }
          //         };

          const handleClick = async (property) => {
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
                const response = await axios.delete(`http://localhost:4000/api/delete-rent/${property.id}`);
                
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
        
        
          const handleEdit = (propertyId) => {
            navigate(`/EditeBRproperty/${propertyId}`);
          };
        
                
          return (
                    <div  >
                              {/* <!-- Page Wrapper --> */}
                              <div id="wrapper" >
                                        <Sidebar />
                                        {/* <!-- Sidebar --> */}
                                        <div id="content-wrapper" class="d-flex flex-column">
                                                  <div id="content">
                                                            <Navbarfg />
                                                            {/*  <!-- Begin Page Content --> */}
                                                            <div class="container-fluid scrollable-content">
                                                                      {/*  <!-- Page Heading --> */}
                                                                      <div class="d-sm-flex align-items-center justify-content-between mb-4">
                                                                      <div className='propertys-div'>
                    <h1 className="h3 mb-0 text-white text-center pt-3">All Propertys</h1>

                  </div>
                                                                                {/* <h1 class="h3 mb-0 text-gray-800">All Propertys</h1> */}

                                                                      </div>
                                                                      <table id="example" className="table table-striped table-bordered">
        <thead>
          <tr>
            <th className="bl5">title</th>
       
            <th className="bl5">Property Type</th>
            <th className="bl5">Action</th>
            <th className="bl5">Action</th>
          
          </tr>
        </thead>
        <tbody>
          
          {properties.map((property) => (
            <tr key={property.id}>
              <td>{property.id}</td>
              <td>{property.title}</td>
              <td>{property.propertyType}</td>
              <td>     
                      {/* <button className="status-button" onClick={() => handleClick(property)}>
      <span className={`status-dot ${property.approve === 1 ? 'active' : 'inactive'}`}></span>
      {property.approve === 1 ? 'Hide' : 'Show'}
    </button> */}
    <button className="btn btn-danger" onClick={() => handleClick(property)}>
     Delete
    </button>
    &nbsp;
    <button className="btn btn-primary" onClick={() => handleEdit(property.id)}>
                Edit
              </button>
    </td>
           
            </tr>
          ))}
        </tbody>
      </table>
                                                            </div>
                                                  </div> 
                                                  {/* <Footer /> */}
                                        </div>
                                        <a class="scroll-to-top rounded" href="#page-top">
                                                  <i class="fas fa-angle-up"></i>
                                        </a>
                              </div>
                    </div>
          );

}
export default PropertyList;
