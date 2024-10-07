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
    title:'',
    space:'',
    box_price:'',
    product_slug:'',
    mrp:'',
     img:null
  

  });

  const handleChange = (event) => {
    const { name, value, type, files } = event.target;

  if (type === 'file') {
      // Update file input values
      setFormData(prevFormData => ({
        ...prevFormData,
        [name]: files
      }));
      console.log(name, files);
    } else {
      // Update other input values
      setFormData(prevFormData => ({
        ...prevFormData,
        [name]: value
      }));
    }
  };

  // const handleEditorChange = (froalaContent) => {
  //   // Update Froala Editor content
  //   setFormData(prevFormData => ({
  //     ...prevFormData,
  //     product_p_editor: froalaContent
  //   }));
  //   console.log("Editor content:", froalaContent);
  // };


    
  
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    // Check if files are selected
    if (!formData.img ) {
      alert('One of the file fields is null. Cannot submit the form.');
      return;
    }
  
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) {
        if (key === 'img') {
          for (let i = 0; i < formData[key].length; i++) {
            data.append(key, formData[key][i]);
          }
        } else {
          data.append(key, formData[key]);
        }
      }
    });
  
    try {
      const response = await axios.post('http://localhost:4000/api/gifts_box', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  
      // Check if response is successful
      if (response.status === 201) {
        Swal.fire('Success', 'Data uploaded successfully', 'success');
        // Optionally redirect or clear form
        // navigate('/success'); // Uncomment if you want to redirect
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
            <div className="container-fluid scrollable-content">
              <div className="container-fluid">
                <div className="mb-4">
                  <div className='propertys-div'>
                    <h1 className="h3 mb-0 text-white text-center pt-3">Box Information</h1>

                  </div>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className='row'>
                    <h3 className="pt-3">Products Basic Information</h3>
                    <div className="form-groups col-md-6">
                      <label htmlFor="title">Title</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="title"
                        name="title"
                        style={{ width: 500 }}
                        placeholder="Add your title"
                        value={formData.title}
                        onChange={handleChange}
                      />
                      <div className="pt-4">
                 
                        <div className="pt-4">
                    
                        </div>
                        
                    
               
                      </div>
                    </div>
                    <div className="form-group col-md-6">
                      <label htmlFor="slug">MRP</label>

                 
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="mrp"
                        name="mrp"
                        style={{ width: 500 }}
                        placeholder="Add MRP "
                        value={formData.mrp}
                        onChange={handleChange}
                      />
                      
                    

                   
                       <input
                       type="text"
                       className="form-control form-control-sm mt-4"
                       id="box_price"
                       name="box_price"
                       style={{ width: 500 }}
                       placeholder="Add Price "
                       value={formData.box_price}
                       onChange={handleChange}
                     />

                     
            
                    
       
                      
                    </div>
                  </div>
                  <div className='row mt-4'>
                    <h3 className="pt-3">Product Details</h3>
                    <div className="form-groups col-md-6">
  
                      <div className="row pt-4">
                        <div className="col-md-3">Feature image</div>
                        <div className="col-md-9">

                          <input
                            type="file"
                            className="form-control form-select-sm"
                            name="img"
                            accept="image/*"
                            style={{ width: 338 }}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                  
                      <div className="row pt-4">
                        <div className="col-md-9">
                        <input
                        type="text"
                        className="form-control form-control-sm"
                        id="size"
                        name="size"
                        style={{ width: 500 }}
                        placeholder="size"
                        value={formData.size}
                        onChange={handleChange}
                      />
                        
                        </div>
                      </div>
                    </div>
                    <div className="form-group col-md-6">
                      <label htmlFor="area">NO. Of Items</label>
                      <input
                        type="text"
                        className="form-control form-control-sm "
                        id="space"
                        name="space"
                        style={{ width: 500 }}
                        placeholder="Keys"
                        value={formData.space}
                        onChange={handleChange}
                      />
                
                     
                      
                    </div>
                  </div>

              
              

             
                  <div className='px-4'>
                    <button type="submit" className="btn btn-dark mt-3 px-5 mb-3">Submit</button>
                  </div>
                </form>
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

