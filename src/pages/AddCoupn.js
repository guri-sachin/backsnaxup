import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import Axios for making HTTP requests

import Sidebar from '../Components/Sidebar';
import Navbarfg from '../Components/Navbar';
import Footer from '../Components/Footer';
import Editor from '../Components/Editor';
import FroalaEditor from 'react-froala-wysiwyg';
import 'froala-editor/js/plugins.pkgd.min.js';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/css/froala_style.min.css';
import Swal from 'sweetalert2';



import '../App.css';

function Admin() {
  const navigate = useNavigate();
  const baseUrl = process.env.REACT_APP_BASE_URL;
  // useEffect(()=>{
  //   if(sessionStorage.getItem("userData") == null)
  //   {
  //     navigate('/')
  //   }
  // },[])


  // Initialize state for form fields
  const [formData, setFormData] = useState({
    discount: '',
    qty: '',
    amount: '',
    code: '',
    categore: '',
  });

  // Handle input changes and update formData
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Create FormData object
    const data = new FormData();
    
    // Append form data to FormData object
    data.append('discount', formData.discount);
    data.append('qty', formData.qty);
    data.append('amount', formData.amount);
    data.append('code', formData.code);
    data.append('categore', formData.categore);

    console.log('FormData being sent:', Object.fromEntries(data)); // Debugging to check data

    try {
      const response = await axios.post('http://localhost:4000/api/create-coupon', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Check if response is successful
      if (response.status === 201) {
        Swal.fire('Success', 'Data uploaded successfully', 'success');
      } else {
        Swal.fire('Error', 'Unexpected response from server', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'There was an error uploading the data', 'error');
      console.error('Error submitting the form!', error.response ? error.response.data : error.message);
    }
  };
  
  console.log("bf0", formData)
  return (
    <div>
      <div id="wrapper">
        <Sidebar />
        <div id="content-wrapper" className="d-flex flex-column">
          <div id="content">
            <Navbarfg />
            <div id="content">
            {/* Add Navbar and other components */}
            <div className="container-fluid">
              <div className="container-fluid">
                <h1 className="h3 mb-0 text-center pt-3">Create coupon</h1>

                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <h3 className="pt-3">Coupon Information</h3>

                    {/* Discount Field */}
                    <div className="form-groups col-md-6">
                      <label htmlFor="discount">Discount</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="discount"
                        name="discount"
                        placeholder="Add discount"
                        value={formData.discount}
                        onChange={handleChange}
                      />
                    </div>

                    {/* Quantity Field */}
                    <div className="form-groups col-md-6">
                      <label htmlFor="qty">Quantity</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="qty"
                        name="qty"
                        placeholder="Add quantity"
                        value={formData.qty}
                        onChange={handleChange}
                      />
                    </div>

                    {/* Amount Field */}
                    <div className="form-groups col-md-6 mt-4">
                      <label htmlFor="amount">Amount</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="amount"
                        name="amount"
                        placeholder="Add amount"
                        value={formData.amount}
                        onChange={handleChange}
                      />
                    </div>

                    {/* Code Field */}
                    <div className="form-groups col-md-6 mt-4">
                      <label htmlFor="code">Code</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="code"
                        name="code"
                        placeholder="Add code"
                        value={formData.code}
                        onChange={handleChange}
                      />
                    </div>

                    {/* Category Field */}
                    <div className="form-groups col-md-6 mt-4">
                      <label htmlFor="categore">Category</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="categore"
                        name="categore"
                        placeholder="Add category"
                        value={formData.categore}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="px-4">
                    <button type="submit" className="btn btn-dark mt-3 px-5 mb-3">Submit</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
            {/* <Footer /> */}
          </div>
        </div>
        <a className="scroll-to-top rounded" href="#page-top">
          <i className="fas fa-angle-up"></i>
        </a>
      </div>
    </div>
  );
}

export default Admin;

