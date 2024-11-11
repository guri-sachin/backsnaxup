import React, { useEffect, useState } from 'react';
import Barcode from 'react-barcode';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import axios from 'axios';

const App = () => {


  const apiUrl = process.env.REACT_APP_BASE_URL;

 const [labelData, setLabelData] = useState(null);
  const [invoiceData, setInvoiceData] = useState(null);
  const [itemDetails, setItemDetails] = useState([]); 
  const [charges, setCharges] = useState(null);
  const [orderId, setOrderid] = useState(null);
  const [returnAddress, setReturnAddress] = useState({
    companyName: "Snaxup",
    address: "The SnaXup Company, Unit2, A123, DDA Sheds, Block A, Okhla Phase II, Okhla Industrial Estate, New Delhi, Delhi 110020",
    mobileNo: "+91 8929 446 677",
    gstNo: "GST1234567890"
  });
  const parseItemsString = (itemsString) => {
    if (itemsString && typeof itemsString === 'string') {
      return itemsString.split(',').map(item => {
        const [id, title, quantity, size, price] = item.split(':');
        return {
          id: parseInt(id),
          title,
          quantity: parseInt(quantity),
          size,
          price: parseFloat(price)
        };
      });
    } else {
      console.warn("Items data is missing or in an incorrect format.");
      return [];
    }
  };
  useEffect(() => {
    // Get the 'orderId' from the URL
    const queryParams = new URLSearchParams(window.location.search);
    setOrderid(queryParams.get('orderId'))
    console.log("order",orderId)
    if (orderId) {
      // Fetch the order details using the orderId
      axios.get(`${apiUrl}orders/${orderId}`)
        .then(response => {
          const propertyList = response.data;
console.log("list",propertyList)
          // Convert items string to an array
          const itemsData = parseItemsString(propertyList.items);
          const itemDetailsArray = itemsData.map(item => ({
            sku: item.sku || item.id,
            itemName: item.title || item.title,
            qty: item.quantity,
            amount: item.price,
            size:item.size
          }));

          // Set data in state
          setInvoiceData({
            deliverTo: propertyList.fname,
            address: propertyList.addressLine1,
            mobileNo: propertyList.phone,
            pincode: propertyList.postalCode,
            orderDate: propertyList.created_at,
            invoiceNo: propertyList.orderId,
            codAmount: propertyList.totalAmount,
            weight: propertyList.weight,
            dimensions: "10 x 10 x 10"
          });
          setItemDetails(itemDetailsArray);
          setCharges({
            shippingCharges:propertyList.paymentMethod === 'COD' ? '₹30' : 'FREE', // Conditional expression for shipping cost

            discountApplied: propertyList.discount || 0,
            orderTotal: propertyList.totalAmount
          });
        })
        .catch(error => {
          console.error('Error fetching order details:', error);
        });
    }
  }, [orderId]);


console.log("data",labelData)

  const generatePDF = () => {
    const doc = new jsPDF();

    // Add logo and Delivery Info
    doc.addImage('https://snaxup.com/cdn/shop/files/1200x628.jpg?v=1728038002&width=2048', 'JPEG', 10, 10, 40, 30);
    doc.setFontSize(12);
    doc.text(`Deliver To: ${invoiceData.deliverTo}`, 10, 50);
    doc.text(`Address: ${invoiceData.address}`, 10, 60);
    doc.text(`Mobile No: ${invoiceData.mobileNo}`, 10, 70);
    doc.text(`Pincode: ${invoiceData.pincode}`, 10, 80);

    // Order Date, Invoice No and Barcode
    doc.text(`Order Date: ${invoiceData.orderDate}`, 10, 100);
    doc.text(`Invoice No: ${invoiceData.invoiceNo}`, 10, 110);

    // Generate barcode for Invoice No using html2canvas
    const barcodeElement1 = document.getElementById('barcode1');
    html2canvas(barcodeElement1).then(canvas => {
      const barcodeImg1 = canvas.toDataURL('image/png');
      doc.addImage(barcodeImg1, 'PNG', 150, 90, 40, 20);

      // COD, Weight, Dimensions and Barcode for Pincode
      doc.setFontSize(14);
      doc.text(`COD: ${invoiceData.codAmount}`, 10, 130);
      // doc.text(`Weight: ${invoiceData.weight}`, 10, 140);
      doc.text(`Dimensions: ${invoiceData.dimensions}`, 10, 150);
      const barcodeElement2 = document.getElementById('barcode2');
      html2canvas(barcodeElement2).then(canvas => {
        const barcodeImg2 = canvas.toDataURL('image/png');
        doc.addImage(barcodeImg2, 'PNG', 150, 130, 40, 20);

        // Item Details and Charges Table
        doc.autoTable({
          startY: 160,
          head: [['SKU', 'Item Name', 'Qty','size', 'Amount']],
          body: [
            // Map each item in itemDetails to a row
            ...itemDetails.map(item => [
              item.sku,
              item.itemName,
              item.qty,
              item.size,
              `₹${item.amount}`
            ]),
            // Additional rows for charges and totals
            ['', 'Shipping Charges', '', `₹${charges.shippingCharges}`],
            ['', 'Discount Applied', '', `₹${charges.discountApplied}`],
            ['', 'Order Total', '', `₹${charges.orderTotal}`]
          ],
        });
        

    // Return Address with Text Wrapping
    const maxWidth = 180;  // Adjust the value as needed
    const addressLines = doc.splitTextToSize(returnAddress.address, maxWidth);
    doc.text(`Return Address: ${returnAddress.companyName}`, 10, doc.lastAutoTable.finalY + 10);
    doc.text(addressLines, 10, doc.lastAutoTable.finalY + 20);
    doc.text(`Mobile No: ${returnAddress.mobileNo}`, 10, doc.lastAutoTable.finalY + 30);
    doc.text(`GST No: ${returnAddress.gstNo}`, 10, doc.lastAutoTable.finalY + 40);

        // Save the PDF
        doc.save('invoice-label.pdf');
      });
    });
  };

  if (!labelData, !invoiceData, !itemDetails, !charges ) {
    return <p>Loading label data...</p>;
  }


  console.log("data",charges)

  return (
    <>
      <div className="invoice-container">
        {/* Delivery Info with Logo */}
        <pre>{JSON.stringify(labelData, null, 2)}</pre>
        <div className="flex items-start mb-4">
          <img 
            src="https://snaxup.com/cdn/shop/files/1200x628.jpg?v=1728038002&width=2048" 
            alt="SnaXup Logo" 
            className="h-10 mr-4" 
            width="80" 
            height="70" 
          />
          <div>
            <p className="mb-1"><strong>Deliver To:</strong> {invoiceData.deliverTo}</p>
            <p className="mb-1"><strong>Address:</strong> {invoiceData.address}</p>
            <p className="mb-1"><strong>Mobile No:</strong> {invoiceData.mobileNo}</p>
            <p className="mb-1"><strong>Pincode:</strong> {invoiceData.pincode}</p>
          </div>
        </div>

        {/* Order Date, Invoice No and First Barcode */}
        <div className="flex justify-between items-center my-4">
          <div>
            <p><strong>Order Date:</strong> {invoiceData.orderDate}</p>
            <p><strong>Invoice No:</strong> {invoiceData.invoiceNo}</p>
          </div>
          <div className="text-right" id="barcode1">
            <Barcode value={invoiceData.invoiceNo} width={1} height={50} format="CODE128" />
          </div>
        </div>

        {/* COD, Weight, Dimensions and Second Barcode */}
        <div className="flex justify-between items-center my-4">
          <div className="flex-1">
            <p className="text-2xl font-bold">COD</p>
            <p className="text-lg font-semibold">{invoiceData.codAmount}</p>
          </div>
          <div className="flex-1 text-right">
            <p><strong>Weight:</strong> {invoiceData.weight}</p>
            <p><strong>Dimensions (cm):</strong> {invoiceData.dimensions}</p>
            <div id="barcode2">
              <Barcode value={invoiceData.pincode} width={1} height={50} format="CODE128" />
            </div>
          </div>
        </div>

        {/* Item Details and Charges Table */}
        <div className="border-t pt-4">
          <table className="w-full text-left border-collapse border">
            <thead>
              <tr>
                <th className="border py-2 px-3">SKU</th>
                <th className="border py-2 px-3">Item Name</th>
                <th className="border py-2 px-3">Qty</th>
                <th className="border py-2 px-3">Amount</th>
              </tr>
            </thead>
            <tbody>
            {itemDetails.map((item, index) => (
        <tr key={index}>
          <td className="border py-2 px-3">{item.sku}</td>
          <td className="border py-2 px-3">{item.itemName}</td>
          <td className="border py-2 px-3">{item.qty}</td>
          <td className="border py-2 px-3">₹{item.amount}</td>
        </tr>
      ))}
              <tr>
                <td colSpan="3" className="border py-2 px-3 text-right font-semibold">Shipping Charges</td>
                <td className="border py-2 px-3">{charges.shippingCharges}</td>
              </tr>
              <tr>
                <td colSpan="3" className="border py-2 px-3 text-right font-semibold">Discount Applied</td>
                <td className="border py-2 px-3">₹{charges.discountApplied}</td>
              </tr>
              <tr>
                <td colSpan="3" className="border py-2 px-3 text-right font-semibold">Order Total</td>
                <td className="border py-2 px-3">₹{charges.orderTotal}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Return Address */}
        <div className="mt-6">
          <p className="text-xl font-semibold">Return Address:</p>
          <p>{returnAddress.companyName}</p>
          <p>{returnAddress.address}</p>
          <p>{returnAddress.mobileNo}</p>
          <p>{returnAddress.gstNo}</p>
        </div>

        {/* Button to Generate PDF */}
        <div className="text-center mt-8">
          <button 
            className="px-6 py-3 text-green bg-red-500 rounded-lg font-semibold"
            onClick={generatePDF}>
            Generate Label
          </button>
        </div>
      </div>
    </>
  );
};

export default App;
