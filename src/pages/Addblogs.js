import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FroalaEditor from 'react-froala-wysiwyg';
import 'froala-editor/js/plugins.pkgd.min.js';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/css/froala_style.min.css';
import axios from 'axios';
import Sidebar from '../Components/Sidebar';
import Navbarfg from '../Components/Navbar';
import Swal from 'sweetalert2';

import '../App.css';

function Blogs() {
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_BASE_URL;

          const [froalaContent, setFroalaContent] = useState('');
     // Function to get the current date in 'dd-MM-yy' format
const getCurrentDate = () => {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = String(date.getFullYear()).slice(-2); // Get the last two digits of the year
  return `${day}-${month}-${year}`;
};
          const [formData, setFormData] = useState({
            title: '',
            description: '',
            type:'',
            date: getCurrentDate(), 
            slug:'',
            featureImage: null,
            seoTitle:'',seoDesc:'', seoKeyword:'', PageName:''
          });
        
          const [blogId, setBlogId] = useState(null);
          const froalaConfig = {
            imageUploadURL: `${apiUrl}upload_image`, // Use your actual API URL
            imageUploadParams: {
              id: 'my_editor'
            },  
            toolbarButtons: [
              'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript',
              'fontFamily', 'fontSize', '|', 'color', 'emoticons', 'inlineStyle', 'paragraphStyle',
              '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote',
              'insertHR', '-', 'insertLink', 'insertImage', 'insertVideo', 'insertFile', 'insertTable',
              '|', 'undo', 'redo', 'clearFormatting', 'selectAll', 'html'
            ]
          };

          const handleChange = (e) => {
            const { name, value, files } = e.target;
            if (files) {
              setFormData({ ...formData, [name]: files[0] });
            } else {
              setFormData({ ...formData, [name]: value });
            }
          };
        
        
          const handleSubmit = async (e) => {

            e.preventDefault();
            const data = new FormData();
            data.append('title', formData.title);
            data.append('type', formData.type);
            data.append('content', froalaContent);
            data.append('date', formData.date);
            data.append('slug', formData.slug);
            data.append('seoTitle', formData.seoTitle);
            data.append('seoDesc', formData.seoDesc);
           
            data.append('seoKeyword', formData.seoKeyword);
            data.append('PageName', formData.PageName);
            if (formData.featureImage) {
              data.append('featureImage', formData.featureImage);
            }
            
              try {   
                const response = await axios.post(`${apiUrl}save_blog`, data, {
                  headers: {
                    'Content-Type': 'multipart/form-data'
                  }
                });
          //       setBlogId(response.data.id);
          Swal.fire('Success', 'Data updated successfully', 'success');
          //       navigate('/');
              } catch (error) {
                console.error('Error saving blog:', error);
                Swal.fire('Error', 'There was an error updating the data', 'error');
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
                    <h1 className="h3 mb-0 text-white text-center pt-3">Blogs Information</h1>

                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className='row'>
                      <h3 className="pt-3">Event Basic Information</h3>
                      <div className="form-groups col-md-6">
                        <label htmlFor="title">Title</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="title"
                          name="title"
                          style={{ width: 515 }}
                          placeholder="Add your title"
                          value={formData.title}
                          onChange={handleChange}
                        />
                        <div className="">
                        
                        </div>
                      </div>
                      <div className="form-group col-md-6">
                      <div className="row pt-4">
                            <div className="col-md-2">Image</div>
                            <div className="col-md-10">
                              <input
                                type="file"
                                className="form-control form-select-sm"
                                name="featureImage"
                                accept="image/*"
                                style={{ width: 390 }}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                      </div>
                      <div className='col-md-6'>
                      <select
                          className="form-select form-select-sm"
                          aria-label=".form-select-sm example"
                          style={{ width: 500 }}
                          name="type"
                          value={formData.type}
                          onChange={handleChange}
                        >
                          <option value="" selected disabled>Blog Type</option>
                          <option value="Community">Community</option>
                          <option value="Blog">Blog</option>
                          <option value="DEVELOPER">DEVELOPER</option>
                          <option value="TOURISM">TOURISM</option> 
                          <option value="PROPERTY">PROPERTY</option> 
                        </select>
                      </div>
                      <div className='col-md-6'>
                      <input
                          type="text"
                          className="form-control form-control-sm"
                          id="slug"
                          name="slug"
                          style={{ width: 515 }}
                          placeholder="Enter your slug"
                          value={formData.slug}
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
                        id="seoTitle"
                        name="seoTitle"
                        style={{ width: 500 }}
                        placeholder="Add your seo Title"
                        value={formData.seoTitle}
                        onChange={handleChange}
                      />
                      <div className="pt-4">
                      {/* <label htmlFor="title">SEO Keyword</label> */}
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="seoKeyword"
                        name="seoKeyword"
                        style={{ width: 500 }}
                        placeholder="Add your seo Keyword"
                        value={formData.seoKeyword}
                        onChange={handleChange}
                      />
                   
                      </div>
                      {/* <div className="pt-4">
                   
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="slug"
                        name="slug"
                        style={{ width: 500 }}
                        placeholder="Add your seo slug"
                        value={formData.slug}
                        onChange={handleChange}
                      />
                   
                      </div> */}
                    </div>
                    <div className="form-group col-md-6">
                      <label htmlFor="slug">SEO PageName</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="PageName"
                        name="PageName"
                        style={{ width: 500 }}
                        placeholder="PageName"
                        value={formData.PageName}
                        onChange={handleChange}
                      />
                      <input
                        type="text"
                        className="form-control form-control-sm mt-4"
                        id="seoDesc"
                        name="seoDesc"
                        style={{ width: 500 }}
                        placeholder="Add your seo Des"
                        value={formData.seoDesc}
                        onChange={handleChange}
                      />
                     

                      
                    </div>
                  </div>
                  </form>
                  <div className='mt-5'>
                    <FroalaEditor
        tag='textarea'
        model={froalaContent}
        onModelChange={setFroalaContent}
        config={froalaConfig}
      />
      
      {/* <button onClick={handleSubmit}>Submit</button> */}
      {blogId && <p>Blog uploaded successfully with ID: {blogId}</p>}
      </div>
      <button type="button" className="btn btn-dark mt-3 px-5 mb-3" onClick={handleSubmit}>Submit</button>
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

export default Blogs;
