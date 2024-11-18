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
  const apiUrl = process.env.REACT_APP_BASE_URL;
  // useEffect(()=>{
  //   if(sessionStorage.getItem("userData") == null)
  //   {
  //     navigate('/')
  //   }
  // },[])
  const [froalaContent, setFroalaContent] = useState('');
  const froalaConfig = {
    placeholderText: 'Edit Your Content Here!',
    charCounterCount: false,
    toolbarButtons: [
      'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript',
      'fontFamily', 'fontSize', '|', 'color', 'emoticons', 'inlineStyle', 'paragraphStyle',
      '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote',
      'insertHR', '-', 'insertLink', 'insertImage', 'insertVideo', 'insertFile', 'insertTable',
      '|', 'undo', 'redo', 'clearFormatting', 'selectAll', 'html'
    ]
  };


  const [formData, setFormData] = useState({
    product_short: '',
    product_title: '',
    product_des: '',
    product_points: '',
    product_categores: '',
    product_sku: '',
    product_price: '',
    product_size: '',
    product_slug: '',
    product_p_price: [],
    product_p_pice: [],
    product_p_discount: '',
    product_p_taxes: '',
    product_p_seoTitle: '',
    product_p_seoDes: '',
    product_p_seoKeyword: '',
    product_p_PageName: '',
    product_p_editor: '',
    feature_img: null,
    img: null,
    gifts_price: '',
    product_hsn:''
  });
  
  const handleChange = (event) => {
    const { name, value, type, files } = event.target;
  
    if (type === 'file') {
      // Ensure we handle images sequentially without duplicates
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: Array.from(files)
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value
      }));
    }
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!formData.img || !formData.feature_img) {
      alert('Please select both the main and feature images before submitting.');
      return;
    }
  
    const data = new FormData();
  
    // Add regular fields
    Object.keys(formData).forEach((key) => {
      if (formData[key] && key !== 'img' && key !== 'feature_img') {
        data.append(key, formData[key]);
      }
    });
  
    // Append images in the exact order they are uploaded
    formData.img.forEach((file) => data.append('img', file));
    data.append('feature_img', formData.feature_img[0]);
  
    try {
      const response = await axios.post(`${apiUrl}products`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  
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
                    <h1 className="h3 mb-0 text-white text-center pt-3">Products Information</h1>

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
                        id="product_title"
                        name="product_title"
                        style={{ width: 500 }}
                        placeholder="Add your title"
                        value={formData.product_title}
                        onChange={handleChange}
                      />
                      <div className="pt-4">
                        <select
                          className="form-select form-select-sm"
                          aria-label=".form-select-sm example"
                          style={{ width: 500 }}
                          name="product_size"
                          value={formData.product_size}
                          onChange={handleChange}


                  
                        >
                          <option value="" selected>Product Specification</option>
                          <option value="Best Seller">Best Seller</option>
                          <option value="NEW">NEW</option>
                          <option value="Great Offer">Great Offer</option>
                          <option value="Best">Best</option>

                          <option value="">nothing</option>
                        </select>
                        <input
                        type="text"
                        className="form-control form-control-sm mt-4"
                        id="product_short"
                        name="product_short"
                        style={{ width: 500 }}
                        placeholder="Short Title"
                        value={formData.product_short}
                        onChange={handleChange}
                      />
                      
                       
                        <div className="pt-4">
                            <input
                        type="text"
                        className="form-control form-control-sm"
                        id="product_p_pice"
                        name="product_p_pice"
                        style={{ width: 500 }}
                        placeholder="Product price in Grams"
                       
                          value={formData.product_p_pice}
                          onChange={handleChange}
                      />
                   
                    
                        </div>
                        
                    
               
                      </div>
                    </div>
                    <div className="form-group col-md-6">
                      <label htmlFor="slug">Slug</label>

                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="product_slug"
                        name="product_slug"
                        style={{ width: 500 }}
                        placeholder="Slug"
                        value={formData.product_slug}
                        onChange={handleChange}
                      />
                      <input
                        type="text"
                        className="form-control form-control-sm mt-4"
                        id="product_price"
                        name="product_price"
                        style={{ width: 500 }}
                        placeholder="Add MRP "
                        value={formData.product_price}
                        onChange={handleChange}
                      />
                      
                      <div className="pt-4">
                        <select
                          className="form-select form-select-sm"
                          aria-label=".form-select-sm example"
                          style={{ width: 500 }}
                          name="product_categores"
                          value={formData.product_categores}
                          onChange={handleChange}
                        >
                          <option value="" selected>Categore Type</option>
                          <option value="Cookies">Cookies</option>
                          <option value="Beverages">Beverages </option>
                          <option value="Instant Premix<">Instant Premix</option>  
                          <option value="Masala & Seasoning">Masala & Seasoning</option> 
                          <option value="Natural Green Tea">Natural Green Tea</option> 
                          <option value="SuperSnacks">Super Snacks</option>  
                          <option value="chocolate">chocolate</option> 
                        </select></div>

                   
                       <input
                       type="text"
                       className="form-control form-control-sm mt-4"
                       id="product_p_price"
                       name="product_p_price"
                       style={{ width: 500 }}
                       placeholder="Add Price "
                       value={formData.product_p_price}
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
                            name="feature_img"
                            accept="image/*"
                            style={{ width: 338 }}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="row pt-4">
                        <div className="col-md-3">Gallery images</div>
                        <div className="col-md-9">
                          <input
                            type="file"
                            className="form-control form-select-sm"
                            name="img"
                            accept="image/*"
                            multiple
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
                        id="product_p_taxes"
                        name="product_p_taxes"
                        style={{ width: 500 }}
                        placeholder="Taxes"
                        value={formData.product_p_taxes}
                        onChange={handleChange}
                      />
                           <input
                        type="text"
                        className="form-control form-control-sm mt-4"
                        id="product_points"
                        name="product_points"
                        style={{ width: 500 }}
                        placeholder="Keys"
                        value={formData.product_points}
                        onChange={handleChange}
                      />
                        <input
                        type="text"
                        className="form-control form-control-sm mt-4"
                        id="product_hsn"
                        name="product_hsn"
                        style={{ width: 500 }}
                        placeholder="HSN"
                        value={formData.product_hsn}
                        onChange={handleChange}
                      />
                        </div>
                      </div>
                    </div>
                    <div className="form-group col-md-6">
                      <label htmlFor="area">SKU</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="product_sku"
                        name="product_sku"
                        style={{ width: 500 }}
                        placeholder="SKU"
                        value={formData.product_sku}
                        onChange={handleChange}
                      />
                      <textarea
                        className="form-control form-control-sm mt-4"
                        id="product_des"
                        name="product_des"
                        style={{ width: 500 }}
                        placeholder="description"
                        value={formData.product_des}
                        onChange={handleChange}
                      />
                       <input
                        type="text"
                        className="form-control form-control-sm mt-4"
                        id="product_p_discount"
                        name="product_p_discount"
                        style={{ width: 500 }}
                        placeholder="discount"
                        value={formData.product_p_discount}
                        onChange={handleChange}
                      />
                          <input
                        type="text"
                        className="form-control form-control-sm mt-4"
                        id="gifts_price"
                        name="gifts_price"
                        style={{ width: 500 }}
                        placeholder="Customize gift price"
                        value={formData.gifts_price}
                        onChange={handleChange}
                      />
                      
                    </div>
                  </div>

                  <div className='row'>
                    <h3 className="pt-3">Property SEO Details</h3>
                    <div className="form-groups col-md-6">
                      <label htmlFor="title">SEO Title</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="product_p_seoTitle"
                        name="product_p_seoTitle"
                        style={{ width: 500 }}
                        placeholder="Add your seo Title"
                        value={formData.product_p_seoTitle}
                        onChange={handleChange}
                      />
                      <div className="pt-4">
                      {/* <label htmlFor="title">SEO Keyword</label> */}
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="product_p_seoDes"
                        name="product_p_seoDes"
                        style={{ width: 500 }}
                        placeholder="Add your seo Des"
                        value={formData.product_p_seoDes}
                        onChange={handleChange}
                      />
                   
                      </div>
                    </div>
                    <div className="form-group col-md-6">
                      <label htmlFor="slug">SEO PageName</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="product_p_PageName"
                        name="product_p_PageName"
                        style={{ width: 500 }}
                        placeholder="PageName"
                        value={formData.product_p_PageName}
                        onChange={handleChange}
                      />
                      <input
                        type="text"
                        className="form-control form-control-sm mt-4"
                        id="product_p_seoKeyword"
                        name="product_p_seoKeyword"
                        style={{ width: 500 }}
                        placeholder="Add your seo Keyword"
                        value={formData.product_p_seoKeyword}
                        onChange={handleChange}
                      />
                     

                
                    </div>
                  </div>
              

                  <div className='mt-4 col-md-11'>
                    <h3 className='pt-2 pb-2'>Description</h3>
                   
                        {/* <FroalaEditor
        tag='textarea'
        model={formData.product_p_editor}
        onModelChange={handleEditorChange}
        config={froalaConfig}
      /> */}
     <textarea
  className="form-control form-control-sm mt-4 w-100" // w-100 for full width
  id="product_p_editor"
  name="product_p_editor"
  placeholder="description"
  value={formData.product_p_editor}
  onChange={handleChange}
  style={{ height: "200px" }} // height using inline style
/>

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

