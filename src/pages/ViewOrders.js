import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../Components/Sidebar';
import Navbarfg from '../Components/Navbar';
import Swal from 'sweetalert2';
import '../App.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import bwipjs from 'bwip-js';
import LabelComponent from './Label';


function Contactus() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [properties, setProperties] = useState([]);
  const [labelData, setLabelData] = useState(null);

  const [error, setError] = useState('');
  const apiUrl = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    const fetchProperties = async () => {
      try {  
        const response = await axios.get(`${apiUrl}Allorders`);
        setProperties(response.data);
      } catch (error) {
        console.error('Error fetching properties data:', error);
      }
    };
    fetchProperties();
  }, []);
  const [selectedStatus, setSelectedStatus] = useState('Processing');


  const handleDelete = async (orderId) => {
    const { value: reason } = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will cancel the order and related entries!',
      icon: 'warning',
      input: 'textarea',
      inputLabel: 'Reason for Deletion',
      inputPlaceholder: 'Please enter the reason...',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });

    if (reason) {
      const result = await Swal.fire({
        title: 'Confirm Deletion',
        text: `Are you sure you want to delete this order?\nReason: ${reason}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel',
      });
      if (result.isConfirmed) {
        try {
          await axios.delete(`${apiUrl}Deleteorders/${orderId}`, {
            data: { reason },
          });
          Swal.fire('Deleted!', 'The order has been deleted.', 'success');
        } catch (error) {
          console.error('Error deleting order:', error);
          Swal.fire('Error!', 'There was an issue deleting the order.', 'error');
        }
      }
    } else {
      Swal.fire('Cancelled', 'Deletion was cancelled.', 'info');
    }
  };

  const fetchOrderDetails = async (orderId) => {
    setError('');
    setOrderDetails(null);
    setShowModal(true);

    if (!orderId) {
      setError('Order ID is required');
      return;
    }

    try {
      const response = await axios.get(`${apiUrl}orders/${orderId}`);
      setOrderDetails(response.data);
    } catch (err) {
      if (err.response) {
        setError(err.response.data.error || 'An error occurred');
      } else {
        setError('An error occurred while fetching order details');
      }
    }
  };


  // Function to handle the dropdown change
  const handleStatusChange = async (event, orderId) => {
    const newStatus = event.target.value;

    try {
      // Make a PUT request to update order status
      const response = await axios.put(`${apiUrl}Edit_order/${orderId}`, {
        delvery_status: newStatus,
      });

      if (response.data.message) {
        alert("Order status updated successfully!");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status.");
    }
  };

  const generateInvoice = async (orderId) => {
    try {
      // Fetch specific order details
      const response = await axios.get(`${apiUrl}orders/${orderId}`);
      const property = response.data;
  
      console.log("d", property);
  
      // Calculate tax breakdown
      const taxPercentage = 18;
      const totalAmount = parseFloat(property.totalAmount); // Convert to number
      if (isNaN(totalAmount)) {
        console.error("Total amount is not a valid number.");
        return; // Handle error accordingly
      }
      const taxAmount = totalAmount * (taxPercentage / 100);
      const baseAmount = totalAmount - taxAmount;
  
      // Generate the invoice in PDF format
      const doc = new jsPDF();
  
      // Add logo
      const logoBase64 = "../logo.png"; // Ensure this is a valid base64 encoded string or correct image path
      doc.addImage(logoBase64, 'PNG', 10, 10, 50, 30); // x, y, width, height
  
      // Get page dimensions for positioning
      const pageWidth = doc.internal.pageSize.getWidth();
      const rightMargin = 10; // Right margin from the edge of the page
  
      // Title and FSSAI Number positioning
      const invoiceText = "TAX INVOICE";
      const invoiceWidth = doc.getTextWidth(invoiceText);
      doc.setFontSize(18);
      doc.text(invoiceText, pageWidth - invoiceWidth - rightMargin, 30); // Right aligned Invoice title
  
      doc.setFontSize(10);
      const fssaiText = "FSSAI: 13321010000403";
      const fssaiWidth = doc.getTextWidth(fssaiText);
      doc.text(fssaiText, pageWidth - fssaiWidth - rightMargin, 40); // Right aligned FSSAI number
// Add Invoice No and Invoice Date on the left side below the logo
doc.setFontSize(12);
const invoiceNo = "Invoice No: SHFIPL-23-24-0";
const invoiceDate = "Invoice Date: 21/03/2024";
const placeS = "Place Of Supply : Haryana (06)";


// Set X-coordinate for left alignment
const leftMargin = 14; // Margin from the left edge
const invoiceY = 50; // Adjust this value to position below the logo
doc.text(invoiceNo, leftMargin, invoiceY); // Left aligned Invoice No
doc.text(invoiceDate, leftMargin, invoiceY + 10); // Left aligned Invoice Date
doc.text(placeS, leftMargin, invoiceY + 20); // Left aligned Invoice Date

      // Company Address
      const addressLines = [
        "SNAXUP HEALTHY FOODS INDIA PRIVATE LIMITED",
        "A-123, 1st Floor (Unit-2), DDA Shed, Okhla Industrial Area Ph-II,",
        "New Delhi 110020 IN, Phone: 011-45112494, +91-8929446677",
        "GSTIN 07ABHCS9739H1ZR, FSSAI No.: 13321010000403",
        "MSME/Udyam No: UDYAM-DL-09-0006501",
        "eMail: accounts@snaxup.com, Website: www.snaxup.com"
      ];
  
      // Set font size for address
      doc.setFontSize(10);
  
      // Positioning the address below the logo and invoice title
      let addressY = 45; // Initial Y position for the address
      const lineSpacing = 5; // Adjust this value for spacing between lines
  
      for (const line of addressLines) {
        const lineWidth = doc.getTextWidth(line);
        doc.text(line, (pageWidth - lineWidth - rightMargin), addressY);
        addressY += lineSpacing; // Move down for each line with controlled spacing
      }
  
      // Adjust Y-coordinate before tables
      const tableStartY = addressY + 10; // Add some space before the tables
  
      // Order Information Table
      doc.autoTable({
        startY: tableStartY,
        head: [['Order NO', 'Discount','Tax (18%)', 'Base Amount','Total Amount']],
        body: [[
          property.orderId,
          `${property.discount}%`,
          
          `₹${taxAmount.toFixed(2)}`,
          `₹${baseAmount.toFixed(2)}`,
          `₹${property.totalAmount}`
        ]],
      });
  
      // Customer Details
      // doc.text("Customer Details:", 14, doc.previousAutoTable.finalY + 10);
      // doc.autoTable({
      //   startY: doc.previousAutoTable.finalY + 15,
      //   body: [
      //     ["Phone", property.phone],
      //     ["Email", property.email]
      //   ],
      // });
  
      // Get page dimensions for the two-column layout
      const halfWidth = pageWidth / 2; // Width for each column
  
      // Address Details
      const addressYForAddresses = doc.previousAutoTable.finalY + 10; // Common Y position for both addresses
      doc.text("Shipping Address:", 14, addressYForAddresses);
  
      // Shipping Address Data
      const shippingAddressData = [
        ["Address Line 1", property.addressLine1],
        ["City", property.city],
        ["Province", property.provience],
        ["Country", property.country],
        ["Postal Code", property.postalCode]
      ];
  
      // Draw the shipping address in the left column
      doc.autoTable({
        startY: addressYForAddresses + 5, // Start just below the title
        head: [['Field', 'Value']],
        body: shippingAddressData,
        styles: { cellPadding: 2, minCellHeight: 10 },
        theme: 'grid',
        columnStyles: {
          0: { cellWidth: halfWidth * 0.35 }, // Adjust width for Field column
          1: { cellWidth: halfWidth * 0.40 }  // Adjust width for Value column
        }
      });
  
      // Positioning for Billing Address
      doc.text("Billing Address:", halfWidth + 14, addressYForAddresses); // Right column for billing address
  
      // Billing Address Data
      const billingAddressData = [
        ["Address Line 1", property.addressLine1],
        ["City", property.city],
        ["Province", property.provience],
        ["Country", property.country],
        ["Postal Code", property.postalCode]
      ];
  
      // Draw the billing address in the right column
      doc.autoTable({
        startY: addressYForAddresses + 5, // Start just below the title for billing address
        head: [['Field', 'Value']],
        body: billingAddressData,
        styles: { cellPadding: 4, minCellHeight: 10 },
        theme: 'grid',
        margin: { left: halfWidth } // Margin to push it to the right column
      });
  
      // Items Table
      if (property.items && typeof property.items === 'string') {
        doc.text("Items:", 14, doc.previousAutoTable.finalY + 10);
  
        // Convert items string to an array of item details
        const itemsData = property.items.split(',').map(item => {
          const [id,title, quantity, size, price] = item.split(':');
          return [id,title, quantity, size, `₹${parseFloat(price).toFixed(2)}`];
        });
  
        // Generate the items table with headers
        doc.autoTable({
          startY: doc.previousAutoTable.finalY + 15,
          head: [['Item No.','Name', 'Quantity', 'Size', 'Price', 'Tax (18%)']],
          body: itemsData.map(item => {
            const price = parseFloat(item[3].replace('₹', '')); // Get price as a number
            const itemTax = price * (taxPercentage / 100);
            return [...item, `₹${itemTax.toFixed(2)}`]; // Add tax amount
          })
        });
      } else {
        console.warn("Items data is missing or in an incorrect format.");
      }
  
      // Show and save the invoice
      doc.save(`Invoice_${property.orderId}.pdf`);
    } catch (err) {
      console.error('Error generating invoice:', err);
      Swal.fire('Error!', 'Unable to generate invoice.', 'error');
    }
  };
  
  
  const generateLabel = (property) => {
    // Your logic to populate `invoiceData`, `itemDetails`, `charges`, and `returnAddress` based on the selected property.
    setLabelData({
      invoiceData: {
          deliverTo: property.name,
          address: property.address,
          mobileNo: property.phone,
          pincode: property.pincode,
          orderDate: property.order_date,
          invoiceNo: property.orderId,
          codAmount: property.total_amount,
          weight: property.weight,
          dimensions: "10 x 10 x 10"
      },
      itemDetails: {
          sku: property.sku,
          itemName: property.item_name,
          qty: property.quantity,
          amount: property.total_amount
      },
      charges: {
          shippingCharges: property.shippingCharges || 0,
          discountApplied: property.discount || 0,
          orderTotal: property.total_amount
      },
      returnAddress: {
          companyName: "Snaxup",
          address: "The SnaXup Company, Unit2, A123, DDA Sheds, Block A, Okhla Phase II, Okhla Industrial Estate, New Delhi, Delhi 110020",
          mobileNo: "+91 8929 446 677",
          gstNo: "GST1234567890"
      }
  });
      // Convert the labelData to JSON and encode it for passing as a URL parameter
      const labelDataString = encodeURIComponent(JSON.stringify(labelData));

      // Open the new page with the label data
      window.open(`/label?data=${labelDataString}`, '_blank');
    // setLabelData({
    //     invoiceData: { /* populate based on property */ },
    //     itemDetails: { /* populate based on property */ },
    //     charges: { /* populate based on property */ },
    //     returnAddress: { /* populate based on property */ }
    // });
};

  

  // const generateLabel = (property) => {
  //   const doc = new jsPDF();
  
  //   // Set up label details similar to the uploaded PDF content
  //   doc.setFontSize(12);
  //   doc.text("Deliver To:", 10, 20);
  //   doc.text(`${property.name}`, 10, 30); // Assuming `property.name` has the recipient's name
  //   doc.text(`${property.address}`, 10, 40); // Assuming `property.address` has the full address
  //   doc.text(`MOBILE NO: ${property.phone}`, 10, 50);
  
  //   doc.text(`Order Date: ${property.order_date}`, 10, 60);
  //   doc.text(`Invoice No: #${property.orderId}`, 10, 70);
  //   doc.text(`COD`, 10, 80);
  //   doc.text(`₹${property.total_amount}`, 10, 90);
  //   doc.text(`WEIGHT : ${property.weight || 'N/A'} KG`, 10, 100);
  //   doc.text(`BLUEDART`, 10, 110);
  //   doc.text(`Dimensions (cm): 10 X 10 X 10`, 10, 120); // Replace with actual dimensions if available
  
  //   doc.text(`Order Total: ₹${property.total_amount}`, 10, 130);
  
  //   // Add other details as per your PDF content
  
  //   // Save the PDF
  //   doc.save(`Label_${property.orderId}.pdf`);
  // };


  console.log("properties",properties)

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
                    <h1 className="h3 mb-0 text-white text-center pt-3">All Order List</h1>

                  </div>                  <div className="mt-5">
                    <table id="example" className="table table-striped table-bordered table-responsive">
                      <thead>
                        <tr>
                          <th>ORDER ID</th>
                          <th>Discount</th>
                          <th>Price</th>
                          <th>Status</th>
                          <th>Del Status</th>

                          
                          <th>Payment Method</th>
                          <th>Phone/Email</th>
                          <th>Action</th>
                          <th>label</th>

                          <th>Change Status</th>

                        </tr>
                      </thead>
                      <tbody>
                        {properties.map((property) => (
                          <tr key={property.id}>
                            <td>{property.orderId}</td>
                            <td>{property.discount}</td>
                            <td>{property.total_amount}</td>
                            <td>{property.order_status}</td>
                            <td>{property.delvery_status}</td>
                            <td>{property.payment_method}</td>
                            <td>
                              {property.phone}
                              <br />
                              {property.email}
                            </td>
                            <td>
                              <button
                                className="btn btn-primary mt-3 px-5 mb-3"
                                onClick={() => fetchOrderDetails(property.orderId)}
                              >
                                Details
                              </button>
                              <button
                                type="button"
                                className="btn btn-danger mt-3 px-5 mb-3"
                                onClick={() => handleDelete(property.orderId)}
                              >
                                Cancel
                              </button>
               
                            </td>
                            <td>    <button
        type="button"
        className="btn btn-info mt-3 px-5 mb-3"
        onClick={() => generateLabel(property)}
      >
        Generate Label
      </button>
      <button
              type="button"
              className="btn btn-success mt-3 px-5 mb-3"
              // onClick={() => generateInvoice(property)}
              onClick={() => generateInvoice(property.orderId)}

            >
              Generate Invoice
            </button></td>
                            <td>  
                            <select
        id="orderStatus"
        value={property.order_status}
        onChange={(e) => handleStatusChange(e, property.orderId)}
        className="form-control mt-3 mb-3"
      >
        <option value="Processing">Processing</option>
        <option value="Processing">Order Confirm</option>

        <option value="Shipped">Shipped</option>
        <option value="Out for Delivery">Out for Delivery</option>
        <option value="Delivered">Delivered</option>
        <option value="Delayed">Delayed</option>
        <option value="Cancelled">Cancelled</option>
      </select>
                              </td>
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
        {/* {labelData && (
                <LabelComponent
                    invoiceData={labelData.invoiceData}
                    itemDetails={labelData.itemDetails}
                    charges={labelData.charges}
                    returnAddress={labelData.returnAddress}
                />
            )} */}
        {/* Modal Popup */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button
                className="close-modal"
                onClick={() => setShowModal(false)}
              >
                &times;
              </button>
              {orderDetails && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Order Details</h3>
                  <p><strong>Order ID:</strong> {orderDetails.orderId}</p>
                  <p><strong>Total Amount:</strong> ₹{orderDetails.totalAmount}</p>
                  <p><strong>Discount:</strong> ₹{orderDetails.discount || 0}</p>
                  <p><strong>Payment Method:</strong> {orderDetails.paymentMethod}</p>
                  <p>
                    <strong>Shipping Address:</strong>{' '}
                    {orderDetails.addressLine1}, {orderDetails.city}, {orderDetails.provience}, {orderDetails.postalCode}, {orderDetails.country}
                  </p>
                  <h4 className="text-lg font-semibold mb-2">Items:</h4>
                  <ul>
                    {orderDetails.items.split(',').map((item, index) => {
                      const [productId, quantity, size, price] = item.split(':');
                      return (
                        <li key={index}>
                          <strong>Product ID:</strong> {productId}, <strong>Quantity:</strong> {quantity}, <strong>Size:</strong> {size}, <strong>Price:</strong> ₹{price}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Contactus;
