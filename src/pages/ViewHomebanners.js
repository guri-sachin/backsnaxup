import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';
import Sidebar from '../Components/Sidebar';
import Navbarfg from '../Components/Navbar';

import Swal from 'sweetalert2';

import '../App.css';

function Contactus({property}) {
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_BASE_URL;

    const [blogId, setBlogId] = useState(null);
  const [properties, setProperties] = useState([]);
  const [bannerId, setBannerId] = useState(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle file input change
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // Open modal on image click
  const handleImageClick = (e) => {
    const id = e.target.getAttribute('data-id'); // Get the banner ID from data-id attribute
    console.log("Banner ID:", id);
    setBannerId(id); 
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFile(null);
  };
  // Handle form submission (Update button clicked)
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      alert('Please select a banner image to upload');
      return;
    }

    const formData = new FormData();
    formData.append('firstBanner', selectedFile);
    try {
      const response = await fetch(`${apiUrl}home-banners/${bannerId}`, {
        method: 'PUT',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        alert('Banner updated successfully!');
        console.log(result);
        closeModal();
        // You may want to add a way to refresh the image displayed after the update.
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error updating banner:', error);
      alert('Error updating banner');
    }
  };

  useEffect(() => {
    // Fetch data from the API when the component mounts
    const fetchProperties = async () => {
      try {
        const response = await axios.get(`${apiUrl}banners`);
        setProperties(response.data);
      } catch (error) {
        console.error('Error fetching properties data:', error);
      }
    };

    fetchProperties();
  }, []);

    const handleDelete = async (propertyId) => {
          console.log("id",propertyId)
          // Show a confirmation dialog before deleting
          const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'This will delete the Banner and related entries!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
          });
      
          // If the user confirms, proceed with the deletion
          if (result.isConfirmed) {
            try {
              // Make the API request to delete the product
              await axios.delete(`${apiUrl}DeletGift/${propertyId}`);
      
              // Show success message
              Swal.fire(
                'Repace!',
                'The product has been deleted.',
                'success'
              );
            } catch (error) {
              // Handle error and show an error message
              console.error('Error deleting product:', error);
              Swal.fire(
                'Error!',
                'There was an issue deleting the product.',
                'error'
              );
            }
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
                    <h1 className="h3 mb-0 text-white text-center pt-3">All Gifts</h1>

                  </div>
                  <div className='mt-5'>
  <table id="example" className="table table-striped table-bordered table-responsive">
    <thead>
      <tr>
      <th className="bl5 text-nowrap" style={{ width: '500px' }}>BANNERS</th>
      
      </tr>
    </thead>
    <tbody>
      {properties.map((property) => (
        <tr key={property.id}>
      <td className="text-nowrap">
        <img
          src={property.firstBanner}
          alt={property.feature_img}
          style={{ width: '500px', height: '200px', objectFit: 'cover' }}
          className="img-fluid"
          data-id={property.id} // Add custom data-id attribute
          onClick={handleImageClick}  // Click event to open modal
        />
      </td>

     
        </tr>
      ))}
    </tbody>
  </table>


                  </div>
                        {/* Modal for updating banner image */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Update Banner Image</h2>
            <form onSubmit={handleSubmit}>
              <input type="file" accept="image/*" onChange={handleFileChange} />

              <button type="submit">Update Banner</button>
              <button type="button" onClick={closeModal}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Optional: Modal styling */}
      <style jsx>{`
        .modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          background: rgba(0, 0, 0, 0.5);
        }
        .modal-content {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        .modal-content h2 {
          margin-top: 0;
        }
        .modal-content button {
          margin: 10px;
        }
      `}</style>


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
