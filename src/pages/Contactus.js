import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';
import Sidebar from '../Components/Sidebar';
import Navbarfg from '../Components/Navbar';


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
        const response = await axios.get('http://localhost:4000/api/contactus');
        setProperties(response.data);
      } catch (error) {
        console.error('Error fetching properties data:', error);
      }
    };

    fetchProperties();
  }, []);
    
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
                    <h1 className="h3 mb-0 text-white text-center pt-3">Contact-us Form Details</h1>

                  </div>
                  <div className='mt-5'>
                  <table id="example" className="table table-striped table-bordered">
        <thead>
          <tr>
          
            <th className="bl5">Name</th>
            <th className="bl5">Phone</th>
            <th className="bl5">Email</th>
            <th className="bl5">Message</th>
            <th className="bl5">Action</th>

          </tr>
        </thead>
        <tbody>
          {properties.map((property) => (
            <tr key={property.id}>
            
              <td>{property.name}</td>
              <td>{property.phone}</td>
              <td>{property.email}</td>
              <td>{property.msg} </td>
              <td> {property.created_at}    </td>
       
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
