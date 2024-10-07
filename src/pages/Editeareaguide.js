import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FroalaEditor from 'react-froala-wysiwyg';
import 'froala-editor/js/plugins.pkgd.min.js';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/css/froala_style.min.css';
import axios from 'axios';
import Sidebar from '../Components/Sidebar';
import Navbarfg from '../Components/Navbar';
import '../App.css';

function Blogs() {
  const navigate = useNavigate();
  const baseUrl = process.env.REACT_APP_BASE_URL;
  useEffect(()=>{
    if(sessionStorage.getItem("userData") == null)
    {
      navigate('/')
    }
  },[])
  const [froalaContent, setFroalaContent] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortTitle:'',
    seoTitle:'',
    seoDesc:'',
    seoKeyword:'',
    PageName:'',
    featureImage: null,
  });
  const { id } = useParams();

  const froalaConfig = {
    imageUploadURL: 'http://localhost:4000/api/upload_image', // Use your actual API URL
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
    data.append('description', formData.description);
    data.append('editor', froalaContent);
    data.append('shortTitle', formData.shortTitle);
    data.append('seoTitle', formData.seoTitle);
    data.append('seoDesc', formData.seoDesc);
    data.append('seoKeyword', formData.seoKeyword);
    data.append('PageName', formData.PageName);
    
    
    if (formData.featureImage) {
      data.append('featureImage', formData.featureImage);
    }

    console.log('Form Data Entries:');
    for (let pair of data.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    





    try {
      let response;
      if (id) {
        const response = await axios.put(`http://localhost:4000/api/update_areaguide/${id}`, data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
       
      } else {
        // response = await axios.post('http://localhost:4000/api/save_blog', data, {
        //   headers: {
        //     'Content-Type': 'multipart/form-data'
        //   }
        // });
        alert('Blog saved successfully!');
      }
      alert('Area guide updated successfully!');
    
    } catch (error) {
      console.error('Error updating:', error);
    }
  };

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/areaguide/${id}`);
        const property = response.data;
        setFormData({
          title: property.title,
          description: property.description,
          shortTitle: property.shortTitle,
          seoTitle:property.seoTitle,
          seoDesc:property.seoDesc,
          seoKeyword:property.seoKeyword,
          PageName:property.PageName,
          featureImage: null,
        });
        setFroalaContent(property.editor);
      } catch (error) {
        console.error('Failed to fetch property data', error);
      }
    };

    fetchProperty();
  }, [id]);

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
                    <h1 className="h3 mb-0 text-white text-center pt-3">Area Guide Information</h1>
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
                      </div>
                      <div className="form-group col-md-6">
                        <textarea
                          className="form-control form-control-sm mt-4"
                          id="description"
                          name="description"
                          style={{ width: 500 }}
                          placeholder="Description"
                          value={formData.description}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="form-group col-md-6">
                        <textarea
                          className="form-control form-control-sm mt-4"
                          id="shortTitle"
                          name="shortTitle"
                          style={{ width: 500 }}
                          placeholder="Short Title"
                          value={formData.shortTitle}
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
