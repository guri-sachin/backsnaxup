import React, { useState } from 'react';
import axios from 'axios';

const UpdateProduct = ({ productId }) => {
          
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
      const response = await axios.patch(`http://localhost:4000/api/upadteProducts/${productId}`, updateData, {
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

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Form fields */}
        <div className="mb-4">
          <label className="block mb-1">Product Short Description:</label>
          <input
            type="text"
            name="product_short"
            value={formData.product_short}
            onChange={handleInputChange}
            className="w-full border px-3 py-2"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">Product Title:</label>
          <input
            type="text"
            name="product_title"
            value={formData.product_title}
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
