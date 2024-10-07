import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';
import Sidebar from '../Components/Sidebar';
import Navbarfg from '../Components/Navbar';
import Swal from 'sweetalert2';

import '../App.css'

function CreateSubadmin() {
  const navigate = useNavigate();
  const baseUrl = process.env.REACT_APP_BASE_URL;
  useEffect(()=>{
    if(sessionStorage.getItem("userData") == null)
    {
      navigate('/')
    }
  },[])
   
          const [blogId, setBlogId] = useState(null);
         
      
          const [formData, setFormData] = useState({
                    email: '',
                    password: '',
                    usertype: '',
                  });
                
                  const handleChange = (event) => {
                    const { name, value } = event.target;
                    setFormData((prevFormData) => ({
                      ...prevFormData,
                      [name]: value,
                    }));
                  };
                
                  const handleSubmit = async (event) => {
                    event.preventDefault();
                
                    try {
                      const response = await axios.post('http://localhost:4000/api/users', formData);
                     Swal.fire('Success', 'User Created success', 'success');
                    } catch (error) {
                              if (error.response && error.response.status === 400) {
                                Swal.fire('Error', 'Email already exists'); 
                                      } else {
                                        Swal.fire('Error', 'Error creating user');
      // console.error('Error creating user:', error.response ? error.response.data : error.message);
                                      }
                                    
                      // console.error('Error creating user:', error.response ? error.response.data : error.message);
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
                    <h1 className="h3 mb-0 text-white text-center pt-3">SubAdmin</h1>

                  </div>
                  <div className='mt-5'>
                  <div class="container-fluid">

{/*  <!-- Page Heading --> */}
 <div class="d-sm-flex align-items-center justify-content-between mb-4">
   <h1 class="h3 mb-0 text-gray-800">Create SubAdmin</h1>
   
</div>
   <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="email">Mail-Id</label>
        <input
          type="email"
          className="form-control form-control-sm"
          id="email"
          name="email"
          style={{ width: 500 }}
          placeholder="mail"
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          className="form-control form-control-sm"
          id="password"
          name="password"
          style={{ width: 500 }}
          placeholder="new password"
          value={formData.password}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <select
          className="form-select form-select-sm"
          aria-label=".form-select-sm example"
          style={{ width: 500 }}
          name="usertype"
          value={formData.usertype}
          onChange={handleChange}
        >
          <option value="" disabled selected>User Type</option>
          <option value="Blog">Blog</option>
          <option value="Sco">Sco</option>
          <option value="IT">IT</option>
          <option value="Web">Web</option>
        </select>
      </div>
      <button type="submit" className="btn btn-primary">Create</button>
    </form>







</div>
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

export default CreateSubadmin;
