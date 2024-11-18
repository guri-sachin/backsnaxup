import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';


const UpdateProduct = ({ productId }) => {
  const { id } = useParams();
  const apiUrl = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await axios.get(`${apiUrl}products/${id}`);
        const property = response.data[0];
        console.log("proper",property)
        setFormData({
          title: property.product_title,
          description: property.actualp_editor,
          slug: property.product_slug, 
          points:property.products_points,
          tex:"18",
          sku:property.product_sku,
          short:property.product_short,
          mrp:property.product_price,
          price:property.product_p_price,
          grams:property.product_p_pice,
          des:property.product_des,
          discount:property.product_p_discount,

          gift:property.gifts_price,
          sizetype:property.product_size,
          categore:property.product_categores
          ,



          

          


          seoTitle:property.seoTitle,
          seoDes:property.seoDes,
          seoKeyword:property.seoKeyword,
          PageName:property.PageName,
        });
        //   setImages(property.images ? property.images.split(',') : []);
        // setFeature_image(property.feature_image);
        // setQr(property.qr);
      } catch (error) {
        console.error('Failed to fetch property data', error);
      }
    };
  
    fetchProperty();
  }, [id]);
          
  // State for form fields
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
    review_message: '',
    review_email: '',
    review_rating: '',
    product_p_price: '',
    product_p_pice: '',
    product_p_discount: '',
    product_p_taxes: '',
    product_p_seoTitle: '',
    product_p_seoDes: '',
    product_p_seoKeyword: '',
    product_p_PageName: '',
    product_p_editor: '',
    gifts_price: ''
  });

  // State for images
  const [images, setImages] = useState(null);
  const [featureImage, setFeatureImage] = useState(null);

  // State for handling API responses
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Handle input change for text fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === 'img') {
      setImages(files);
    } else if (name === 'feature_img') {
      setFeatureImage(files[0]);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
const productId = 50;
    // Reset messages
    setSuccessMessage('');
    setErrorMessage('');

    // Create FormData object for API request
    const updateData = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) {
        updateData.append(key, formData[key]);
      }
    });

    // Append images if they are uploaded
    if (images) {
      Array.from(images).forEach((img, index) => {
        updateData.append(`img`, img);
      });
    }
    if (featureImage) {
      updateData.append('feature_img', featureImage);
    }
    try {
      // Make API call to update the product
      const response = await axios.patch(`${apiUrl}upadteProducts/${productId}`, updateData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setSuccessMessage('Product updated successfully!');
    } catch (error) {
      console.error('Error updating product:', error);
      setErrorMessage('Failed to update product. Please try again.');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Update Product</h2>

      {/* Success or error messages */}
      {successMessage && <div className="text-green-600 mb-4">{successMessage}</div>}
      {errorMessage && <div className="text-red-600 mb-4">{errorMessage}</div>}
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
                        value={formData.title}
                        onChange={handleInputChange}
                      />
                      <div className="pt-4">
                        <select
                          className="form-select form-select-sm"
                          aria-label=".form-select-sm example"
                          style={{ width: 500 }}
                          name="product_size"
                          value={formData.sizetype}
                          onChange={handleInputChange}


                  
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
                        value={formData.short}
                        onChange={handleInputChange}
                      />
                      
                       
                        <div className="pt-4">
                            <input
                        type="text"
                        className="form-control form-control-sm"
                        id="product_p_pice"
                        name="product_p_pice"
                        style={{ width: 500 }}
                        placeholder="Product price in Grams"
                       
                          value={formData.grams}
                          onChange={handleInputChange}
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
                        value={formData.slug}
                        onChange={handleInputChange}
                      />
                      <input
                        type="text"
                        className="form-control form-control-sm mt-4"
                        id="product_price"
                        name="product_price"
                        style={{ width: 500 }}
                        placeholder="Add MRP "
                        value={formData.mrp}
                        onChange={handleInputChange}
                      />
                      
                      <div className="pt-4">
                        <select
                          className="form-select form-select-sm"
                          aria-label=".form-select-sm example"
                          style={{ width: 500 }}
                          name="product_categores"
                          value={formData.categore}
                          onChange={handleInputChange}
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
                       value={formData.price}
                       onChange={handleInputChange}
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
                            onChange={handleInputChange}
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
                            onChange={handleInputChange}
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
                        value={formData.tex}
                        onChange={handleInputChange}
                      />
                           <input
                        type="text"
                        className="form-control form-control-sm mt-4"
                        id="product_points"
                        name="product_points"
                        style={{ width: 500 }}
                        placeholder="Keys"
                        value={formData.points}
                        onChange={handleInputChange}
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
                        value={formData.sku}
                        onChange={handleInputChange}
                      />
                      <textarea
                        className="form-control form-control-sm mt-4"
                        id="product_des"
                        name="product_des"
                        style={{ width: 500 }}
                        placeholder="description"
                        value={formData.des}
                        onChange={handleInputChange}
                      />
                       <input
                        type="text"
                        className="form-control form-control-sm mt-4"
                        id="product_p_discount"
                        name="product_p_discount"
                        style={{ width: 500 }}
                        placeholder="discount"
                        value={formData.discount}
                        onChange={handleInputChange}
                      />
                          <input
                        type="text"
                        className="form-control form-control-sm mt-4"
                        id="gifts_price"
                        name="gifts_price"
                        style={{ width: 500 }}
                        placeholder="Customize gift price"
                        value={formData.gift}
                        onChange={handleInputChange}
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
                        value={formData.seoTitle}
                        onChange={handleInputChange}
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
                        value={formData.seoDes}
                        onChange={handleInputChange}
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
                        value={formData.PageName}
                        onChange={handleInputChange}
                      />
                      <input
                        type="text"
                        className="form-control form-control-sm mt-4"
                        id="product_p_seoKeyword"
                        name="product_p_seoKeyword"
                        style={{ width: 500 }}
                        placeholder="Add your seo Keyword"
                        value={formData.seoKeyword}
                        onChange={handleInputChange}
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
  value={formData.description}
  onChange={handleInputChange}
  style={{ height: "200px" }} // height using inline style
/>

                  </div>
                  <div className='px-4'>
                    <button type="submit" className="btn btn-dark mt-3 px-5 mb-3">Submit</button>
                  </div>
                </form>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Form fields */}
        <div className="mb-4">
          <label className="block mb-1">Product Title:</label>
          <input
            type="text"
            name="product_short"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full border px-3 py-2"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">Product Description:</label>
          <textarea
            type="text"
            style={{ width: 500 }}
            name="product_title"
            value={formData.description}
                        onChange={handleInputChange}
            className="w-full border px-3 py-2"
          />
        </div>

        {/* More form fields for product description, points, etc. */}
        {/* ... Other input fields (similar to above) */}

        {/* File Upload for Images */}
        <div className="mb-4">
          <label className="block mb-1">Product Images (Max 5):</label>
          <input
            type="file"
            name="img"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border px-3 py-2"
          />
        </div>

        {/* File Upload for Feature Image */}
        <div className="mb-4">
          <label className="block mb-1">Feature Image:</label>
          <input
            type="file"
            name="feature_img"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border px-3 py-2"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Update Product
        </button>
      </form>
    </div>
  );
};

export default UpdateProduct;
