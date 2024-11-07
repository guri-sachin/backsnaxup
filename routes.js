
const express = require('express');
const compression = require('compression');

const multer = require('multer');
const axios = require('axios')
const crypto = require("crypto");
const path = require('path');
const db = require('./dbconnection');
const fs = require('fs');
const { parse, format, isValid } = require('date-fns');
const bcrypt = require('bcrypt');
const sharp = require('sharp');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const cors = require('cors')
const Razorpay = require('razorpay');
const { Routes } = require('react-router-dom');

// const mysql = require('mysql2');
require('dotenv').config();

const router = express.Router();



const SHIPROCKET_BASE_URL = process.env.REACT_APP_SHIPROCKET_BASE_URL;
const ROZAR_Key = process.env.REACT_ROZAR_KEY;
const ROZAR_SECRET = process.env.REACT_APP_KEY_SECRET;

// Example usage
console.log('Shiprocket Base URL:', SHIPROCKET_BASE_URL);

// const SHIPROCKET_BASE_URL = 'https://apiv2.shiprocket.in/v1/external';
let token = ''; // Store Shiprocket Token
router.use(compression());

// Set cache-control headers for static assets
const oneYear = 365 * 24 * 60 * 60 * 1000; // 1 year in milliseconds
router.use(express.static(path.join(__dirname, 'build'), {
    maxAge: oneYear // Cache static files for 1 year
}));

// Add a route for other endpoints if needed
// router.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
// });

// Shiprocket API Authentication
async function getAuthToken() {
  const credentials = {
    email: 'wedev@snaxup.com',
    password: 'Sn@xup@2610',
  };

  try {
    const response = await axios.post(`${SHIPROCKET_BASE_URL}/auth/login`, credentials);
    token = response.data.token; // Save the token
    console.log('Token retrieved successfully:', token);
  } catch (error) {
    console.error('Error retrieving token:', error);
    throw new Error('Authentication failed');
  }
}
//for user
const sendEmailToUser = async (billing_email, order_id, order_items) => {
  const mailOptions = {
    from: 'snaxupfoods@gmail.com',
    to: billing_email,
    subject: `Order Confirmation #${order_id}`,
    html: `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <div style="text-align: center; background-color: #f7f7f7; padding: 20px;">
        <h1 style="color: #ff6f61;">Thank you for your order!</h1>
        <p style="font-size: 18px;">Your order is confirmed.</p>
        <p style="font-size: 16px;">Order ID: <strong>#${order_id}</strong></p>
      </div>

      <div style="padding: 20px; border-bottom: 2px solid #ff6f61;">
        <h2 style="color: #ff6f61;">Order Summary</h2>
        <ul style="list-style-type: none; padding: 0; font-size: 16px;">
          ${order_items.map(item => 
            `<li>
              <strong>${item.name}</strong> (Qty: ${item.units})
            </li>`
          ).join('')}
        </ul>
      </div>

      <div style="padding: 20px; background-color: #f7f7f7;">
        <h3 style="color: #ff6f61;">Happy Shopping! 🎉</h3>
        <p>Your order is on its way! We hope you enjoy your new items. If you need anything, we're here to help. 😊</p>
        <p>Don't forget to check back for more great deals and surprises! ✨</p>
      </div>

      <div style="text-align: center; padding: 20px;">
          
      </div>

      <div style="text-align: center; padding: 20px;">
        <a href="https://b2b.snaxup.com" style="text-decoration: none; background-color: #ff6f61; color: #fff; padding: 10px 20px; border-radius: 5px; font-size: 16px;">Shop More</a>
      </div>

      <div style="text-align: center; padding: 10px; background-color: #ff6f61; color: #fff;">
        <p>Thanks for shopping with us! - SnaxUp Foods Team</p>
      </div>
    </div>`,
  };

  await transporter.sendMail(mailOptions);
};

//for shipping and admin

const sendEmailToAdminAndDeliveryPartner = async (order_id, billing_email, order_items, billing_city) => {
  const mailOptions = {
    from: 'snaxupfoods@gmail.com',
    to: ['webdev@snaxup.com', 'gurisachin09@gmail.com'],
    subject: `New Order #${order_id}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; background-color: #f7f7f7; padding: 20px; border-radius: 5px;">
        <h2 style="color: #4CAF50;">New Order Notification</h2>
        <p>A new order has been placed by <strong>${billing_email}</strong>.</p>
        <p><strong>Order ID:</strong> <span style="color: #333;">${order_id}</span></p>
        
        <h3 style="color: #4CAF50;">Order Items:</h3>
        <ul style="list-style-type: none; padding-left: 0;">
          ${order_items.map(item => `
            <li style="padding: 8px; background: #fff; margin: 5px 0; border-radius: 4px; border: 1px solid #ddd;">
              <strong>${item.name}</strong> (Qty: ${item.units})
            </li>
          `).join('')}
        </ul>

        <h3 style="color: #4CAF50;">Locations:</h3>
        <p><strong>Pickup Location:</strong></p>
        <p style="background: #fff; padding: 10px; border-radius: 4px; border: 1px solid #ddd;">Your Pickup Address Here</p>
        
        <p><strong>Drop Location (Customer's Address):</strong></p>
        <p style="background: #fff; padding: 10px; border-radius: 4px; border: 1px solid #ddd;">${billing_city}</p>
        
        <footer style="margin-top: 20px; text-align: center;">
          <p style="color: #777;">Thank you for your business!</p>
        </footer>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

{/* <p>${address.addressLine1}, ${address.addressLine2 ? address.addressLine2 + ', ' : ''}${address.city}, ${address.provience}, ${address.postalCode}, ${address.country}</p> */}

// Create Order API Route
router.post('/shiprocket/create-order', async (req, res) => {
  const {
    order_id,
    order_date,
    pickup_location,
    billing_customer_name,
    billing_last_name,
    billing_address,
    billing_city,
    billing_pincode,
    billing_state,
    billing_country,
    billing_email,
    billing_phone,
    shipping_is_billing,
    order_items,
    payment_method,
    sub_total,
    length,
    breadth,
    height,
    weight
  } = req.body; // Destructuring the incoming request body

  // Create the orderData object using the values from req.body
  const orderData = {
    order_id,
    order_date,
    pickup_location,
    billing_customer_name,
    billing_last_name,
    billing_address,
    billing_city,
    billing_pincode,
    billing_state,
    billing_country,
    billing_email,
    billing_phone,
    shipping_is_billing,
    order_items,
    payment_method,
    sub_total,
    length,
    breadth,
    height,
    weight
  };
  try {
    // Check if token is not set or expired
    if (!token) {
      console.log('Token not available, fetching a new token...');
      await getAuthToken(); // Fetch token before creating the order
    }
console.log("token",token)
    const response = await axios.post(`${SHIPROCKET_BASE_URL}/orders/create/adhoc`, orderData, {
      headers: { Authorization: `Bearer ${token}` }, // Use the token in the Authorization header
    });
    // Step 5: Trigger email notifications
    await sendEmailToAdminAndDeliveryPartner(order_id, billing_email, order_items,billing_city);
    await sendEmailToUser(billing_email, order_id, order_items);
    res.json({ message: 'Order created successfully', data: response.data });
  } catch (error) {
    console.error('Error creating order:', error.response.data);  // Log the full error response
    res.status(500).json({ error: 'Failed to create order', details: error.response.data });
}

});

//api for tracking
router.post('/shiprocket/track-order', async (req, res) => {
  const { awbCode } = req.body;  // AWB code (tracking number) of the shipment
  if (!token) {
    console.log('Token not available, fetching a new token...');
    await getAuthToken(); // Fetch token before creating the order
  }
console.log("token",token)
  try {
    const response = await axios.get(`${SHIPROCKET_BASE_URL}/courier/track/awb/${awbCode}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    res.json({ message: 'Tracking data fetched', data: response.data });
  } catch (error) {
    console.error('Error tracking shipment:', error);
    res.status(500).json({ error: 'Failed to track shipment' });
  }
});


// Create an instance of Razorpay with your API keys
const razorpay = new Razorpay({
  key_id: ROZAR_Key, // Replace with your Razorpay Key ID
  key_secret: ROZAR_SECRET // Replace with your Razorpay Key Secret
});

// Create an order
router.post('/create-order', async (req, res) => {
  const { amount, currency } = req.body; // Amount in smallest currency unit, like paise (₹1 = 100 paise)
  
  const options = {
      amount: amount * 100, // amount in the smallest currency unit
      currency: currency,
      receipt: 'receipt_order_1', // you can generate your custom receipt ID here
  };

  try {
      const order = await razorpay.orders.create(options);
      res.status(200).json(order);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// POST route to verify payment status by orderId

router.post('/verify-payment', async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const hmac = crypto.createHmac('sha256', ROZAR_SECRET);
  hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
  const calculatedSignature = hmac.digest('hex');

  if (calculatedSignature === razorpay_signature) {
    // Payment is verified
    await updatePaymentStatusInDB(orderId, 'Success', razorpay_payment_id);
    res.status(200).json({ message: 'Payment verified and status updated' });
  } else {
    res.status(400).json({ message: 'Payment verification failed' });
  }
});

// POST route to update order status by orderId
router.post('/update-order-status', async (req, res) => {
  const { orderId, status } = req.body;

  if (!orderId || !status) {
    return res.status(400).send({ message: 'Order ID and status are required' });
  }

  try {
    // Step 1: Update the order status in the database
    const updateOrderQuery = `UPDATE orders SET delvery_status = ? WHERE id = ?`;
    const [result] = await db.promise().query(updateOrderQuery, [status, orderId]);

    // Step 2: Check if the order was updated
    if (result.affectedRows === 0) {
      return res.status(404).send({ message: 'Order not found' });
    }

    // Step 3: Send success response
    res.status(200).send({ message: 'Order status updated successfully' });

  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(500).send({ message: 'Error updating order status' });
  }
});


// Serve static files from public/images
router.use('/images', express.static(path.join(__dirname, 'public/images')));

// Set up multer storage
const upload = multer({ 
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, 'public/images')); // Save files to public/images
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to file names
    }
  })
});


router.put('/upproducts/:id', upload.single('img'), (req, res) => {
  const id = req.params.id;
  
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Proceed with updating the img field in the database
  const img = `/images/${req.file.filename}`;
  
  // Example query to update the image in the database
  const query = 'UPDATE products SET img = ? WHERE id = ?';

  db.query(query, [img, id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    res.status(200).json({ message: 'Image updated successfully', img });
  });
});


// API endpoint to get data based on ID 
router.get('/products/:id', (req, res) => {
  const id = req.params.id;

  // Query to join the three tables and get data based on ID
  const query = `
    SELECT 
        products.id AS product_id,
        products.short AS product_short,
        products.title AS product_title,
        products.des AS product_des,
        products.points AS product_points,
        products.categores AS product_categores,
        products.sku AS product_sku,
        products.price AS product_price,
        products.size AS product_size,
        products.img AS product_img,
        products.feature_img AS feature_img,
        products.slug AS product_slug,
        products.points AS products_points,


         review.id AS review_id,
         review.msg AS review_message,
         review.email AS review_email,
      review.rating AS review_rating,
       actualp.p_price AS product_p_price,
              actualp.seoTitle AS seoTitle,
              actualp.seoDes AS seoDes,
                            actualp.seoKeyword AS seoKeyword,
                            actualp.PageName AS PageName,


       actualp.p_pice AS product_p_pice,
      actualp.editor AS actualp_editor,

        actualp.p_discount AS product_p_discount,
                    actualp.gifts_price AS gifts_price


    FROM 
      products
    LEFT JOIN 
      review ON products.id = review.p_id
    LEFT JOIN 
      actualp ON products.id = actualp.p_id
    WHERE 
      products.id = ?;
  `;

  // Execute the query
  db.query(query, [id], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    // Send results as response
    res.json(results);
  });
});


// To get products, optionally filtered by category
// API endpoint to get data based on either slug or id
router.get('/products', async (req, res) => {
  // Get the category from query params
  const { categore } = req.query;

  // Base query to join the three tables and get all data
  let query = `
    SELECT 
      products.id AS product_id,
      products.short AS product_short,
      products.title AS product_title,
      products.des AS product_des,
      products.points AS product_points,
      products.categores AS product_categores,
      products.sku AS product_sku,
      products.price AS product_price,
      products.size AS product_size,
      products.img AS product_img,
      products.feature_img AS product_feature_img,
      products.slug AS product_slug,

      actualp.p_price AS actualp_price,
      actualp.p_pice AS actualp_piece,
      actualp.p_discount AS actualp_discount,
      actualp.editor AS actualp_editor,
      actualp.seoTitle AS actualp_seoTitle,
      actualp.seoDes AS actualp_seoDes,
      actualp.seoKeyword AS actualp_seoKeyword,
      actualp.PageName AS actualp_PageName,
      actualp.gifts_price AS gifts_price

    FROM 
      products
    LEFT JOIN 
      actualp ON products.id = actualp.p_id
  `;

  // Modify the query if a category is provided and it's not "All-Products"
  if (categore && categore !== 'All-Products') {
    query += ` WHERE products.categores LIKE '%${categore}%'`;
  }
  
  try {
    // Execute the query
    db.query(query, (error, results) => {
      if (error) {
        console.error('Database query error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      // If query is successful, return the results
      res.json(results);
    });
  } catch (error) {
    // Catch any unexpected errors
    console.error('Unexpected error:', error);
    res.status(500).json({ error: 'Unexpected Server Error' });
  }
});

router.get('/trending-products', async (req, res) => {
  // Get the category from query params
  const { categore } = req.query;

  // Base query to join the three tables and get all data
  let query = `
    SELECT 
      products.id AS product_id,
      products.short AS product_short,
      products.title AS product_title,
      products.des AS product_des,
      products.points AS product_points,
      products.categores AS product_categores,
      products.sku AS product_sku,
      products.price AS product_price,
      products.size AS product_size,
      products.img AS product_img,
      products.feature_img AS product_feature_img,
      products.slug AS product_slug,

      actualp.p_price AS actualp_price,
      actualp.p_pice AS actualp_piece,
      actualp.p_discount AS actualp_discount,
      actualp.editor AS actualp_editor,
      actualp.seoTitle AS actualp_seoTitle,
      actualp.seoDes AS actualp_seoDes,
      actualp.seoKeyword AS actualp_seoKeyword,
      actualp.PageName AS actualp_PageName,
      actualp.gifts_price AS gifts_price

    FROM 
      products
    LEFT JOIN 
      actualp ON products.id = actualp.p_id
  `;

  // Modify the query if a category is provided and it's not "All-Products"
  if (categore && categore !== 'All-Products') {
    query += ` WHERE products.categores LIKE '%${categore}%'`;
  }

  // Add LIMIT 10 to restrict the results to 10
  query += ` LIMIT 10`;

  try {
    // Execute the query
    db.query(query, (error, results) => {
      if (error) {
        console.error('Database query error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      // If query is successful, return the results
      res.json(results);
    });
  } catch (error) {
    // Catch any unexpected errors
    console.error('Unexpected error:', error);
    res.status(500).json({ error: 'Unexpected Server Error' });
  }
});


//to get all chocolate 
router.get('/chocolate-products', async (req, res) => {
  // Query to join the three tables and get data where category is "chocolate"
  const query = `
    SELECT 
      products.id AS product_id,
      products.short AS product_short,
      products.title AS product_title,
      products.des AS product_des,
      products.points AS product_points,
      products.categores AS product_categores,
      products.sku AS product_sku,
      products.price AS product_price, -- Original product price
      products.size AS product_size,
      products.img AS product_img,
      products.feature_img AS product_feature_img,
      products.slug AS product_slug,
      
      actualp.p_price AS actualp_price, -- Renamed to avoid conflict
      actualp.p_pice AS actualp_piece,  -- Assuming this is 'p_price'
      actualp.p_discount AS actualp_discount,
      actualp.editor AS actualp_editor,
      actualp.seoTitle AS actualp_seoTitle,
      actualp.seoDes AS actualp_seoDes,
      actualp.seoKeyword AS actualp_seoKeyword,
      actualp.PageName AS actualp_PageName,
      actualp.gifts_price AS gifts_price
    FROM 
      products
    LEFT JOIN 
      actualp ON products.id = actualp.p_id
    WHERE 
      products.categores = 'chocolate'
    LIMIT 10;  -- Limit the results to 10
  `;

  try {
    // Execute the query
    db.query(query, (error, results) => {
      if (error) {
        console.error('Database query error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      // If query is successful, return the results
      res.json(results);
    });
  } catch (error) {
    // Catch any unexpected errors
    console.error('Unexpected error:', error);
    res.status(500).json({ error: 'Unexpected Server Error' });
  }
});



// Get latest 8 products excluding 'chocolate' category, without reviews
router.get('/products/latest/new', async (req, res) => {
  // Query to join the product and actualp tables, exclude "chocolate" category, and get the latest 8 products
  const query = `
   SELECT 
  products.id AS product_id,
  products.short AS product_short,
  products.title AS product_title,
  products.des AS product_des,
  products.points AS product_points,
  products.categores AS product_categores,
  products.sku AS product_sku,
  products.price AS product_price,
  products.size AS product_size,
  products.img AS product_img,
  products.feature_img AS product_feature_img,
  products.slug AS product_slug,

  MAX(actualp.p_price) AS actualp_price, 
  MAX(actualp.p_pice) AS actualp_piece, 
  MAX(actualp.p_discount) AS actualp_discount,
  MAX(actualp.editor) AS actualp_editor,
  MAX(actualp.seoTitle) AS actualp_seoTitle,
  MAX(actualp.seoDes) AS actualp_seoDes,
  MAX(actualp.seoKeyword) AS actualp_seoKeyword,
  MAX(actualp.PageName) AS actualp_PageName,
  MAX(actualp.gifts_price) AS gifts_price

FROM 
  products
LEFT JOIN 
  actualp ON products.id = actualp.p_id
WHERE 
  products.categores != 'chocolate'  
GROUP BY
  products.id
ORDER BY 
  products.id ASC 
LIMIT 8;

  `;

  try {
    // Execute the query
    db.query(query, (error, results) => {
      if (error) {
        console.error('Database query error:', error); // Log the error if query fails
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      // Log the results returned from the query
      console.log('Query results:', results);

      if (results.length === 0) {
        console.log('No products found');
        return res.status(404).json({ message: 'No products found' });
      }

      // If query is successful, return the results
      res.json(results);
    });
  } catch (error) {
    // Catch any unexpected errors
    console.error('Unexpected error:', error); // Log unexpected error
    res.status(500).json({ error: 'Unexpected Server Error' });
  }
});


// POST endpoint to upload product data with images
router.post('/products', upload.fields([
  { name: 'img', maxCount: 5 }, // Multiple images (max 5)
  { name: 'feature_img', maxCount: 1 } // Single feature image
]), async (req, res) => {
  const {
    product_short,
    product_title,
    product_des,
    product_points,
    product_categores,
    product_sku,
    product_price,
    product_size,
    product_slug,
    review_message,
    review_email,
    review_rating,
    product_p_price,
    product_p_pice,
    product_p_discount,
    product_p_taxes,
    product_p_seoTitle,
    product_p_seoDes,
    product_p_seoKeyword,
    product_p_PageName,
    product_p_editor,
    gifts_price
  } = req.body;

  // Debugging: Log uploaded files and form data
  console.log('Uploaded files:', req.files);
  console.log('Form data:', req.body);

  // Extracting uploaded files
  const images = req.files['img'] ? req.files['img'].map(file => file.filename) : [];
  const featureImage = req.files['feature_img'] ? req.files['feature_img'][0].filename : null;

  // Build URLs for the uploaded images
  const baseUrl = `${req.protocol}://${req.get('host')}/images/`;
  const imageUrls = images.map(img => baseUrl + img);
  const featureImageUrl = featureImage ? baseUrl + featureImage : null;
console.log("url",imageUrls,baseUrl,featureImageUrl)
  // Queries to insert data
  const productQuery = `
    INSERT INTO products (short, title, des, points, categores, sku, price, size, img, feature_img, slug)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const reviewQuery = `
    INSERT INTO review (p_id, msg, email, rating)
    VALUES (?, ?, ?, ?)
  `;
  const actualPriceQuery = `
    INSERT INTO actualp (p_id, p_price, p_pice, p_discount, taxes, seoTitle, seoDes, seoKeyword, PageName, editor, gifts_price)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  try {
    db.beginTransaction((transactionError) => {
      if (transactionError) {
        console.error('Transaction Error:', transactionError);
        return res.status(500).json({ error: 'Transaction Error' });
      }

      // Insert product data
      db.query(productQuery, [
        product_short, product_title, product_des, product_points, product_categores,
        product_sku, product_price, product_size, JSON.stringify(imageUrls), featureImageUrl, product_slug
      ], (productError, productResult) => {
        if (productError) {
          return db.rollback(() => {
            console.error('Product Insertion Error:', productError);
            res.status(500).json({ error: 'Product Insertion Error' });
          });
        }

        const productId = productResult.insertId;
        console.log('Product inserted, ID:', productId);

        // Insert review data
        db.query(reviewQuery, [productId, review_message, review_email, review_rating], (reviewError) => {
          if (reviewError) {
            return db.rollback(() => {
              console.error('Review Insertion Error:', reviewError);
              res.status(500).json({ error: 'Review Insertion Error' });
            });
          }

          // Insert actual pricing data
          db.query(actualPriceQuery, [productId, product_p_price, product_p_pice, product_p_discount, product_p_taxes, product_p_seoTitle, product_p_seoDes,
            product_p_seoKeyword, product_p_PageName, product_p_editor, gifts_price], (priceError) => {
            if (priceError) {
              return db.rollback(() => {
                console.error('Pricing Insertion Error:', priceError);
                res.status(500).json({ error: 'Pricing Insertion Error' });
              });
            }

            // Commit the transaction if all queries are successful
            db.commit((commitError) => {
              if (commitError) {
                return db.rollback(() => {
                  console.error('Commit Error:', commitError);
                  res.status(500).json({ error: 'Commit Error' });
                });
              }

              res.status(201).json({
                message: 'Product data uploaded successfully',
                images: imageUrls,
                featureImage: featureImageUrl
              });
            });
          });
        });
      });
    });
  } catch (error) {
    console.error('Unexpected Server Error:', error);
    res.status(500).json({ error: 'Unexpected Server Error' });
  }
});


// DELETE route to remove a product by ID
router.delete('/products/:id', async (req, res) => {
  // Extract the product ID from the request parameters
  const productId = req.params.id;

  // SQL queries to delete from all related tables
  const deleteProductQuery = `DELETE FROM products WHERE id = ?`;
  const deleteReviewsQuery = `DELETE FROM review WHERE p_id = ?`;
  const deleteActualpQuery = `DELETE FROM actualp WHERE p_id = ?`;

  // Start a transaction
  try {
    // Begin transaction
    db.query('START TRANSACTION');

    // Execute delete queries
    db.query(deleteReviewsQuery, [productId]);
    db.query(deleteActualpQuery, [productId]);
    db.query(deleteProductQuery, [productId]);

    // Commit transaction
    db.query('COMMIT');

    // If deletion is successful, send a success response
    res.status(200).json({ message: 'Product and related entries successfully deleted' });
  } catch (error) {
    // Rollback transaction in case of an error
    db.query('ROLLBACK');

    // Handle error
    console.error('Database transaction error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Define the login route
router.post('/login', async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).send({ error: 'Identifier and password are required' });
  }

  try {
    // Check if the identifier is an email or a phone number
    const isEmail = identifier.includes('@');
    const checkUserSql = isEmail
      ? 'SELECT * FROM signup WHERE email = ?'
      : 'SELECT * FROM signup WHERE phone = ?'; // Check phone if it's not an email

    db.query(checkUserSql, [identifier], async (err, results) => {
      if (err) {
        console.error('Error checking user:', err);
        return res.status(500).send({ error: 'Database error' });
      }

      if (results.length === 0) {
        return res.status(400).send({ error: 'Invalid email/phone or password' });
      }

      const user = results[0];

      // Compare the provided password with the hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).send({ error: 'Invalid email/phone or password' });
      }

      res.status(200).send({ message: 'Login successful', userId: user.id });
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ error: 'Internal server error' });
  }
});


router.post('/signup', async (req, res) => {
  const { fullname, phone, email, password } = req.body;

  if (!fullname || !email || !password || !phone) {
    return res.status(400).json({ message: 'Please fill in all required fields' });
  }

  try {
    // Check if the email or phone already exists in the database
    const checkQuery = 'SELECT * FROM signup WHERE email = ? OR phone = ?';
    db.query(checkQuery, [email, phone], async (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err });
      }

      if (result.length > 0) {
        // If a user with the same email or phone exists
        return res.status(400).json({ message: 'Email or phone number already exists' });
      }

      // If no existing user is found, proceed with registration
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user data into the database
      const insertQuery = 'INSERT INTO signup (fullname, phone, email, password) VALUES (?, ?, ?, ?)';
      db.query(insertQuery, [fullname, phone, email, hashedPassword], (err, result) => {
        if (err) {
          return res.status(500).json({ message: 'Database error during registration', error: err });
        }
        
        // Return user ID along with the success message
        const userId = result.insertId;  // Extract the user ID from the insert operation
        res.status(200).json({ message: 'User registered successfully', userId });
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Error in user registration', error });
  }
});

// POST route to create a new coupon
router.post('/create-coupon', (req, res) => {
  const { discount, qty, amount, code, categore } = req.body;

  // Basic validation
  if (!discount || !qty || !amount || !code ) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // SQL query to insert the new coupon into the database
  const sql = 'INSERT INTO coupon (discount, qty, amount, code, categore) VALUES (?, ?, ?, ?, ?)';

  // Execute the query
  db.query(sql, [discount, qty, amount, code, categore], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Error saving coupon to the database.' });
    }

    // Respond with success message
    res.status(200).json({ message: 'Coupon created successfully!', couponId: result.insertId });
  });
});


// GET route to retrieve all coupons
router.get('/get-all-coupons', (req, res) => {
  // SQL query to select all coupons from the database
  const sql = 'SELECT * FROM coupon';

  // Execute the query
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Error fetching coupons from the database.' });
    }

    // Respond with the list of coupons
    res.status(200).json(results);
  });
});



// GET route to retrieve all coupons
router.get('/banners', (req, res) => {
  // SQL query to select all coupons from the database
  const sql = 'SELECT * FROM homebanner';

  // Execute the query
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Error fetching coupons from the database.' });
    }

    // Respond with the list of coupons
    res.status(200).json(results);
  });
});



// POST route to add just _review
router.post('/just_review', (req, res) => {
  const {p_id, msg, email, rating,name,title} = req.body;

  // Basic validation
  if (!msg || !email || !rating || !p_id   || !name || !title ) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // SQL query to insert the new coupon into the database
  const sql = 'INSERT INTO review (p_id,msg, email, rating, name, title) VALUES (?, ?, ?, ?, ?, ?)';

  // Execute the query
  db.query(sql, [p_id, msg, email, rating,name, title], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Error saving coupon to the database.' });
    }

    // Respond with success message
    res.status(200).json({ message: 'uploaded successfully!', couponId: result.insertId });
  });
});

// POST route to update the 'active' field
router.post('/update_active', (req, res) => {
  const { id } = req.body;

  // Basic validation
  if (!id) {
    return res.status(400).json({ error: 'Product ID (id) is required.' });
  }

  // SQL query to update the 'active' field to 1 for the given p_id
  const sql = 'UPDATE review SET active = 1 WHERE id = ?';

  // Execute the query
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Error updating the active field in the database.' });
    }

    // Check if any rows were affected (if the p_id exists)
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'No record found with the provided id.' });
    }

    // Respond with success message
    res.status(200).json({ message: 'Active field updated successfully!' });
  });
});

// GET route to fetch reviews by p_id, but only where active = 1
router.get('/all_reviews/:p_id', (req, res) => {
  const { p_id } = req.params;

  // Validate if p_id is provided
  if (!p_id) {
    return res.status(400).json({ error: 'Product ID (p_id) is required.' });
  }

  // SQL query to fetch reviews based on p_id and active = 1
  const sql = 'SELECT * FROM review WHERE p_id = ? AND active = 1';

  // Execute the query
  db.query(sql, [p_id], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Error retrieving reviews from the database.' });
    }

    // If no reviews found
    if (results.length === 0) {
      return res.status(404).json({ message: 'No active reviews found for the given product ID.' });
    }

    // Respond with the active reviews data
    res.status(200).json(results);
  });
});

// GET route to fetch reviews by p_id, but only where active = 1
router.get('/all_reviews', (req, res) => {
  const { p_id } = req.params;

  // Validate if p_id is provided
  // if (!p_id) {
  //   return res.status(400).json({ error: 'Product ID (p_id) is required.' });
  // }

  // SQL query to fetch reviews based on p_id and active = 1
  const sql = 'SELECT * FROM review';

  // Execute the query
  db.query(sql, [p_id], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Error retrieving reviews from the database.' });
    }

    // If no reviews found
    if (results.length === 0) {
      return res.status(404).json({ message: 'No active reviews found for the given product ID.' });
    }

    // Respond with the active reviews data
    res.status(200).json(results);
  });
});



// GET route to select records where 'active' field is 1
router.get('/active_reviews', (req, res) => {

  // SQL query to select records where 'active' is 1
  const sql = 'SELECT * FROM review WHERE active = 1';

  // Execute the query
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Error fetching records from the database.' });
    }

    // Check if there are any results
    if (results.length === 0) {
      return res.status(404).json({ message: 'No active reviews found.' });
    }

    // Respond with the results
    res.status(200).json(results);
  });
});

// DELETE route to delete a review by id
router.delete('/delete_review/:id', (req, res) => {
  const { id } = req.params;

  // Validate if id is provided
  if (!id) {
    return res.status(400).json({ error: 'Review ID is required.' });
  }

  // SQL query to delete the review from the database
  const sql = 'DELETE FROM review WHERE id = ?';

  // Execute the query
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Error deleting review from the database.' });
    }

    // Check if the review was found and deleted
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Review not found or already deleted.' });
    }

    // Respond with success message
    res.status(200).json({ message: 'Review deleted successfully.' });
  });
});


// POST route to validate a coupon
router.post('/validate-coupon', (req, res) => {
  const { code, category, orderAmount } = req.body;

  // Validate input
  if (!code) {
    return res.status(400).json({ error: 'Coupon code is required.' });
  }

  // SQL query to find the coupon by code
  const sql = 'SELECT * FROM coupon WHERE code = ? LIMIT 1';

  // Execute the query
  db.query(sql, [code], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Error validating the coupon.' });
    }

    if (results.length === 0) {
      // Coupon not found
      return res.status(404).json({ error: 'Invalid coupon code.' });
    }

    const coupon = results[0];

    // // Check if the coupon category matches
    // if (coupon.category !== 'All' && coupon.category !== category) {
    //   return res.status(400).json({ error: 'Coupon is not valid for this category.' });
    // }

    // // Check if the coupon has any remaining quantity
    // if (coupon.qty <= 0) {
    //   return res.status(400).json({ error: 'Coupon usage limit has been reached.' });
    // }

    // Check if the order amount meets the minimum requirement
    if (coupon.amount > orderAmount) {
      return res.status(400).json({ error: `Minimum order amount to apply this coupon is ${coupon.amount}.` });
    }

    // If all checks pass, return a success message with discount percentage
    return res.status(200).json({
      message: 'Coupon is valid!',
      discount: coupon.discount, // assuming this is a percentage
    });
  });
});

module.exports = router;
// user: "surbhigulhana3@gmail.com", // Set this in your .env file
// pass: "hsae ltyz ogjq dbox" // Set this in your .env file

// Nodemailer setup
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: "snaxupfoods@gmail.com", // Set this in your .env file
    pass: "xbkx qpmv syij unzv" // Set this in your .env file
  }
});

//api for contactus  
router.post('/send-contactus', (req, res) => {
  const { name, msg, email, phone } = req.body;

  // Save email to database
  const sql = 'INSERT INTO contactus (name, msg, email, phone) VALUES (?, ?, ?, ?)';
  db.query(sql, [name, msg, email, phone], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send('Error saving to database.');
    }

    // Send email
    const mailOptions = {
      from: email, // Change this to your email address
      to: "webdev@snaxup.com",
      subject: 'New Inquiry',
      text: `Name: ${name}\nMessage: ${msg}\nPhone: ${phone}\nEmail: ${email}`

    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Email error:', error);
        return res.status(500).send('Error sending email.');
      }
      res.status(200).send('Email sent and saved successfully.');
    });
  });
});

router.post('/send-subscribe', (req, res) => {
  const { email } = req.body;

  // Check if email already exists in the database
  const checkEmailQuery = 'SELECT * FROM subscribe WHERE email = ?';
  db.query(checkEmailQuery, [email], (err, results) => {
    if (err) {
      console.error('Database error during email check:', err);
      return res.status(500).send('Error checking email in database.');
    }

    // If email already exists, send response
    if (results.length > 0) {
      return res.status(409).send('Email already exists.');
    }

    // If email does not exist, insert it into the database
    const insertEmailQuery = 'INSERT INTO subscribe (email) VALUES (?)';
    db.query(insertEmailQuery, [email], (err, result) => {
      if (err) {
        console.error('Database error during insert:', err);
        return res.status(500).send('Error saving email to database.');
      }

      // Send email
      const mailOptions = {
        from: email, // Change this to your email address
        to: 'webdev@snaxup.com',
        subject: 'New Subscription',
        text: `A new subscription has been received: \nEmail: ${email}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Email error:', error);
          return res.status(500).send('Error sending email.');
        }
        res.status(200).send('Email sent and saved successfully.');
      });
    });
  });
});



// Get all contacts
router.get('/contactus', async (req, res) => {
  try {
    const query = 'SELECT * FROM contactus';
    db.query(query, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database query failed' });
      }
      res.status(200).json(results);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});


// Get all contacts
router.get('/ratings_admin', async (req, res) => {
  try {
    const query = 'SELECT * FROM review';
    db.query(query, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database query failed' });
      }
      res.status(200).json(results);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});

// Route to fetch SEO data dynamically based on 'page'
router.get('/seo/:page', (req, res) => {
  const { page } = req.params; // Extract the page from URL parameters

  // SQL query to fetch data based on the 'page' parameter
  const query = `SELECT seoKeyword, seoTitle, seoDes FROM secaboutus WHERE page = ?`;

  db.query(query, [page], (err, results) => {
      if (err) {
          console.error('Error executing query:', err);
          res.status(500).json({ error: 'Database query failed' });
      } else if (results.length === 0) {
          res.status(404).json({ message: 'No data found for the given page' });
      } else {
          res.status(200).json(results);
      }
  });
});

// Get Banner text
router.get('/topBannertext', async (req, res) => {
  try {
    const query = 'SELECT * FROM top_banner';
    db.query(query, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database query failed' });
      }
      res.status(200).json(results);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});

// Get all users
router.get('/signup', async (req, res) => {
  try {
    const query = 'SELECT * FROM signup';
    db.query(query, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database query failed' });
      }
      res.status(200).json(results);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});


// DELETE a user by ID
router.delete('/signup/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    
    // SQL query to delete a user by ID
    const query = 'DELETE FROM signup WHERE id = ?';
    
    db.query(query, [userId], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database query failed' });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.status(200).json({ message: `User with ID ${userId} deleted successfully` });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});

// POST route to upload data to the gifts table
router.post('/gifts', upload.fields([
  { name: 'feature_img', maxCount: 1 },   // Single image for feature_img
  { name: 'img', maxCount: 6 }            // Multiple images for img (5-6)
]), (req, res) => {
  const { title, short, des, detaildes, points, price, mrp, seoTitle,seoDes,seoKeyword,PageName,tax,discount,slug,categore } = req.body;

  // Check if files are uploaded
  if (!req.files.feature_img || !req.files.img) {
    return res.status(400).json({ error: 'Please upload images for feature_img and img fields.' });
  }

  // Extracting uploaded files
  const images = req.files['img'] ? req.files['img'].map(file => file.filename) : [];
  const featureImage = req.files['feature_img'] ? req.files['feature_img'][0].filename : null;

  // Debug log to ensure proper images are being processed
  console.log("Uploaded files: ", req.files);
  console.log("Multiple images: ", images);
  console.log("Feature image: ", featureImage);

  // Build URLs for the uploaded images
  const baseUrl = `${req.protocol}://${req.get('host')}/images/`;  // Assuming images are in 'uploads' folder
  const imageUrls = images.map(img => baseUrl + img);
  const featureImageUrl = featureImage ? baseUrl + featureImage : null;

  // Log the URLs being generated
  console.log("URL for multiple images:", imageUrls);
  console.log("URL for feature image:", featureImageUrl);

  // SQL query to insert data
  const query = `INSERT INTO gifts (title, short, des, detaildes, points, feature_img, img, price, mrp, seoTitle,seoDes,seoKeyword,PageName,tax, discount, slug, categore) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  // Execute the query
  db.query(query, [title, short, des, detaildes, points, featureImageUrl, JSON.stringify(imageUrls), price, mrp, seoTitle,seoDes,seoKeyword,PageName,tax,discount,slug,categore], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      res.status(500).send('Error inserting data');
    } else {
      res.status(201).send('Gift data inserted successfully with images');
    }
  });
});

// Get all gifts data
router.get('/Allgifts', (req, res) => {
  // SQL query to fetch all gift data
  const query = `SELECT * FROM gifts`;

  // Execute the query
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching gifts:', err);
      return res.status(500).json({ error: 'Error fetching gifts data' });
    }

    // Check if there are no results
    if (results.length === 0) {
      return res.status(404).json({ message: 'No gifts found' });
    }

    // Send the gift details in the response
    res.status(200).json(results);
  });
});

// DELETE a gift by ID
router.delete('/DeletGift/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    
    // SQL query to delete a user by ID
    const query = 'DELETE FROM gifts WHERE id = ?';
    
    db.query(query, [userId], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database query failed' });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.status(200).json({ message: `User with ID ${userId} deleted successfully` });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});



// Get gift by ID
router.get('/gifts/:id', (req, res) => {
  const giftId = req.params.id;

  // SQL query to fetch the gift details by ID
  const query = `SELECT * FROM gifts WHERE id = ?`;

  // Execute the query
  db.query(query, [giftId], (err, results) => {
    if (err) {
      console.error('Error fetching gift:', err);
      return res.status(500).json({ error: 'Error fetching gift data' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Gift not found' });
    }

    // Send the gift details in the response
    res.status(200).json(results[0]);
  });
});



// POST route to upload data to the gifts box
// POST route to upload data to the gifts box
router.post('/gifts_box', upload.fields([
  { name: 'img', maxCount: 2 },   // Allow up to 2 images for the 'img' field
]), (req, res) => {
  const { title, size, space, box_price, mrp } = req.body;

  // Check if files are uploaded
  if (!req.files || !req.files['img'] || req.files['img'].length !== 2) {
    return res.status(400).json({ error: 'Please upload exactly 2 images for the feature_img field.' });
  }

  // Extracting uploaded images (both images from the 'img' field)
  const featureImages = req.files['img'].map(file => file.filename);

  // Build URLs for the uploaded images
  const baseUrl = `${req.protocol}://${req.get('host')}/images/`;  // Assuming images are in 'uploads' folder
  const featureImageUrls = featureImages.map(image => baseUrl + image);  // Array of image URLs

  // Log the URLs being generated
  console.log("URLs for feature images:", featureImageUrls);

  // SQL query to insert data (storing the image URLs as a stringified array or as per your DB schema)
  const query = `INSERT INTO custom_box (title, size, space, box_price, img, mrp) VALUES (?, ?, ?, ?, ?, ?)`;

  // Store the image URLs (could store as JSON, or separate columns, depending on your database design)
  const imgFieldValue = JSON.stringify(featureImageUrls);

  // Execute the query
  db.query(query, [title, size, space, box_price, imgFieldValue, mrp], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      res.status(500).send('Error inserting data');
    } else {
      res.status(201).send('Gift data inserted successfully with images');
    }
  });
});

// GET route to fetch a specific gift box by ID
router.get('/gifts_box/:id', (req, res) => {
  const giftBoxId = req.params.id;

  // SQL query to fetch the specific gift box by ID
  const query = `SELECT * FROM custom_box WHERE id = ?`;

  db.query(query, [giftBoxId], (err, result) => {
    if (err) {
      console.error('Error fetching gift box data:', err);
      return res.status(500).send('Error fetching data');
    }

    if (result.length === 0) {
      return res.status(404).send('Gift box not found');
    }

    res.status(200).json(result[0]); // Return the gift box data
  });
});



// Get all gifts data
router.get('/Allcustom_box', (req, res) => {
  // SQL query to fetch all gift data
  const query = `SELECT * FROM custom_box`;

  // Execute the query
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching gifts:', err);
      return res.status(500).json({ error: 'Error fetching gifts data' });
    }

    // Check if there are no results
    if (results.length === 0) {
      return res.status(404).json({ message: 'No gifts found' });
    }

    // Send the gift details in the response
    res.status(200).json(results);
  });
});

// DELETE a user by ID
router.delete('/Allboxs/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    
    // SQL query to delete a user by ID
    const query = 'DELETE FROM custom_box WHERE id = ?';
    
    db.query(query, [userId], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database query failed' });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.status(200).json({ message: `User with ID ${userId} deleted successfully` });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});



// POST route to upload banner images to the homebanner table
router.post('/home-banners', upload.fields([
  { name: 'firstBanner', maxCount: 1 },  // Upload single file for firstBanner

]), (req, res) => {
  
  // Check if files are uploaded
  if (!req.files.firstBanner ) {
    return res.status(400).json({ error: 'Please upload all three banners' });
  }

  // Extract filenames from req.files
  const firstBanner = req.files['firstBanner'][0].filename;

  // Build URLs for the uploaded images
  const baseUrl = `${req.protocol}://${req.get('host')}/images/`;
  const firstBannerUrl = baseUrl + firstBanner;

  // SQL query to insert data into the homebanner table
  const query = `INSERT INTO homebanner (firstBanner) VALUES (?)`;

  // Execute the query
  db.query(query, [firstBannerUrl], (err, result) => {
    if (err) {
      console.error('Error inserting banner images:', err);
      res.status(500).send('Error inserting banner images');
    } else {
      res.status(201).json({
        message: 'Banner images uploaded and stored successfully',
        data: {
          firstBanner: firstBannerUrl,
      
        }
      });
    }
  });
});


      // <p>${pickupLocation.addressLine1}, ${pickupLocation.addressLine2 ? pickupLocation.addressLine2 + ', ' : ''}${pickupLocation.city}, ${pickupLocation.provience}, ${pickupLocation.postalCode}, ${pickupLocation.country}</p>


// POST route to create a new order with guest user management
router.post('/orders', async (req, res) => {
  const { email, phone, totalAmount, discount, paymentMethod, address,afterdiscount, items } = req.body;
  let userId = null;

  try {
    // Step 1: Check if a user exists by email or phone
    const checkUserQuery = `SELECT id FROM signup WHERE email = ? OR phone = ?`;
    
    // Await the query to ensure it's properly resolved
    const [existingUser] = await db.promise().query(checkUserQuery, [email, phone]);

    if (existingUser.length > 0) {
      // If user exists, use their user_id
      userId = existingUser[0].id;
    } else {
      // If user doesn't exist, create a new user
      const createUserQuery = `INSERT INTO signup (email, phone) VALUES (?, ?)`;
      const [createUserResult] = await db.promise().query(createUserQuery, [email, phone]);
      userId = createUserResult.insertId;
    }

    // Step 2: Insert the address (either new or existing logic as previously shown)
    const { addressLine1, addressLine2, city, provience, postalCode, country, address_type } = address;
    const insertAddressQuery = `
      INSERT INTO addresses (user_id, address_line_1, address_line_2, city, provience, postal_code, country, phone, address_type) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    // Await the query to insert the address and get the inserted address ID
    const [insertAddressResult] = await db.promise().query(insertAddressQuery, [
      userId, addressLine1, addressLine2, city, provience, postalCode, country, phone, address_type
    ]);
    
    const addressId = insertAddressResult.insertId;

    // Step 3: Insert the order details
    const orderQuery = `INSERT INTO orders (user_id, total_amount, discount, order_status, payment_method, address_id,afterdiscount) VALUES (?, ?, ?, ?, ?, ?,?)`;
    const [orderResult] = await db.promise().query(orderQuery, [userId, totalAmount, discount, 'pending', paymentMethod, addressId, afterdiscount]);
    
    const orderId = orderResult.insertId;

    // Step 4: Insert the order items
    const orderItemsQuery = `INSERT INTO order_items (order_id, product_id, quantity, size, price, img,title) VALUES ?`;
    const orderItemsData = items.map(item => [orderId, item.productId, item.quantity, item.size, item.price, item.img, item.title]);

    // Await the query for inserting order items
    await db.promise().query(orderItemsQuery, [orderItemsData]);
    // // Step 5: Trigger email notifications
    // await sendEmailToAdminAndDeliveryPartner(orderId, email, items,address);
    // await sendEmailToUser(email, orderId, items);

    res.status(201).send({ message: 'Order created successfully', orderId });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error creating order' });
  }
});



// GET route to retrieve order details by order ID
router.get('/orders/:orderId', async (req, res) => {
  const { orderId } = req.params;

  // Validate orderId
  if (!orderId) {
    return res.status(400).json({ error: 'Order ID is required' });
  }

  try {
    // Query to get the order details along with user, items, and product titles
    const orderQuery = `
      SELECT 
        o.id AS orderId, 
        o.total_amount AS totalAmount, 
        o.discount, 
        o.payment_method AS paymentMethod, 
        a.address_line_1 AS addressLine1, 
        a.city, 
        a.provience, 
        a.postal_code AS postalCode, 
        a.country,
        GROUP_CONCAT(CONCAT(oi.product_id, ':', p.title, ':', oi.quantity, ':', oi.size, ':', oi.price) ORDER BY oi.id) AS items
      FROM 
        orders o
      JOIN 
        addresses a ON o.address_id = a.id
      JOIN 
        order_items oi ON o.id = oi.order_id
      JOIN 
        products p ON oi.product_id = p.id
      WHERE 
        o.id = ?
      GROUP BY 
        o.id
    `;

    // Execute the query
    const [rows] = await db.promise().query(orderQuery, [orderId]);

    // Check if the order exists
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Return the order details
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'An error occurred while fetching the order details' });
  }
});

// GET route to retrieve all orders for a user by user ID
router.get('/orders/user/:userId', async (req, res) => {
  const { userId } = req.params;

  // Validate userId
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    // Query to get all orders for the user along with the order details and items
    const ordersQuery = `
      SELECT 
        o.id AS orderId, 
        o.total_amount AS totalAmount, 
          o.afterdiscount, 
        o.discount, 
        o.payment_method AS paymentMethod, 
                o.delvery_status AS delvery_status, 

        o.order_status AS orderStatus,
        a.address_line_1 AS addressLine1, 
        a.city, 
        a.provience, 
        a.postal_code AS postalCode, 
        a.country,
    
        GROUP_CONCAT(CONCAT(oi.product_id, ';', oi.quantity, ';', oi.size, ';', oi.price, ';', oi.img, ';', oi.title) ORDER BY oi.id) AS items
      FROM 
        orders o
      JOIN 
        addresses a ON o.address_id = a.id
      JOIN 
        order_items oi ON o.id = oi.order_id
      WHERE 
        o.user_id = ?
      GROUP BY 
        o.id
    `;

    // Execute the query
    const [rows] = await db.promise().query(ordersQuery, [userId]);
// Debugging: Log rows to see if img data is present
console.log("Fetched orders:", rows);

    // Check if the user has any orders
    if (rows.length === 0) {
      return res.status(404).json({ error: 'No orders found for this user' });
    }

    // Return the order details
    res.status(200).json(rows);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'An error occurred while fetching the user orders' });
  }
});



// DELETE route to delete an order and its associated records
router.delete('/Deleteorders/:orderId', async (req, res) => {
  const { orderId } = req.params;
  const { reason } = req.body; // Extract the reason from the request body

  // Validate orderId and reason
  if (!orderId) {
    return res.status(400).json({ error: 'Order ID is required' });
  }
  if (!reason) {
    return res.status(400).json({ error: 'Reason for deletion is required' });
  }

  try {
    // Start transaction
    const connection = await db.getConnection();
    await connection.beginTransaction();

    // Fetch the order details to backup
    const orderDetailsQuery = `
      SELECT 
        oi.product_id, 
        o.id AS order_id, 
        o.user_id 
      FROM 
        orders o 
      JOIN 
        order_items oi ON o.id = oi.order_id 
      WHERE 
        o.id = ?`;

    const [orderDetails] = await connection.query(orderDetailsQuery, [orderId]);

    // Backup the order items before deletion
    for (const detail of orderDetails) {
      const backupQuery = `
        INSERT INTO order_backup (product_id, order_id, user_id, reason) 
        VALUES (?, ?, ?, ?)`;
      await connection.query(backupQuery, [detail.product_id, detail.order_id, detail.user_id, reason]);
    }

    // Delete from order_items table
    const deleteOrderItemsQuery = `DELETE FROM order_items WHERE order_id = ?`;
    await connection.query(deleteOrderItemsQuery, [orderId]);

    // Delete from orders table
    const deleteOrderQuery = `DELETE FROM orders WHERE id = ?`;
    const [deleteOrderResult] = await connection.query(deleteOrderQuery, [orderId]);

    // Check if the order was deleted
    if (deleteOrderResult.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'Order not found' });
    }

    // Delete from addresses table (if necessary)
    const deleteAddressQuery = `DELETE FROM addresses WHERE id = (SELECT address_id FROM orders WHERE id = ?)`;
    await connection.query(deleteAddressQuery, [orderId]);

    // Commit the transaction
    await connection.commit();

    // Return success response
    res.status(200).json({ message: 'Order and related records deleted successfully' });
  } catch (error) {
    console.error('Database error:', error);
    await connection.rollback();
    res.status(500).json({ error: 'An error occurred while deleting the order' });
  } finally {
    // Ensure that connection is released back to the pool
    if (connection) {
      connection.release();
    }
  }
});


// API to get all orders data
router.get('/Allorders', async (req, res) => {
  try {
    // Query to get all orders along with user and address details
    const query = `
      SELECT o.id AS orderId, o.total_amount, o.discount, o.order_status, o.payment_method,o.delvery_status, 
             u.fullname, u.phone,u.email, a.address_line_1, a.city, a.provience, a.postal_code, a.country
      FROM orders o
      JOIN signup u ON o.user_id = u.id
      JOIN addresses a ON o.address_id = a.id
    `;

    // Await the query to get the orders
    const [orders] = await db.promise().query(query);

    // Check if any orders were found
    if (orders.length === 0) {
      return res.status(404).send({ message: 'No orders found' });
    }

    // Return the orders data
    res.status(200).send(orders);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error retrieving orders data' });
  }
});


// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP
};

// POST route to send OTP
router.post('/send-otp', (req, res) => {
  const { email } = req.body;

  // Check if email exists
  db.query('SELECT * FROM signup WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).send('Database error');

    const otp = generateOTP();
    const otpExpiry = new Date(new Date().getTime() + 15 * 60000); // OTP valid for 15 mins

    if (results.length === 0) {
      // Insert new user
      db.query('INSERT INTO signup (email, otp, otp_expiry) VALUES (?, ?, ?)', [email, otp, otpExpiry], (err) => {
        if (err) return res.status(500).send('Database insert error');
      });
    } else {
      // Update existing user OTP and expiry
      db.query('UPDATE signup SET otp = ?, otp_expiry = ? WHERE email = ?', [otp, otpExpiry, email], (err) => {
        if (err) return res.status(500).send('Database update error');
      });
    }

    // Send OTP email
    const mailOptions = {
      from: "snaxupfoods@gmail.com",
      to: email,
      subject: 'Your OTP for Login',
      text: `Your OTP is ${otp}. It is valid for 15 minutes.`,
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) return res.status(500).send('Failed to send OTP email');
      res.status(200).send('OTP sent to email');
    });
  });
});

// POST route to verify OTP
router.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;

  // Check if OTP is valid
  db.query('SELECT * FROM signup WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).send('Database error');

    if (results.length === 0) return res.status(400).send('User not found');

    const user = results[0];
    const currentTime = new Date();

    if (user.otp !== otp) {
      return res.status(400).send('Invalid OTP');
    }

    if (currentTime > new Date(user.otp_expiry)) {
      return res.status(400).send('OTP expired');
    }

    // Successful OTP verification
    res.status(200).send({ message: 'OTP verified successfully', userId: user.id });
  });
});


// Register endpoint
router.post('/admin_register', async (req, res) => {
  const { username, password, user_type } = req.body;

  if (!username || !password || !user_type) {
    return res.status(400).json({ message: 'Please provide username, password, and user type.' });
  }

  // Check if user already exists
  db.query('SELECT * FROM admin_login WHERE email = ?', [username], async (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error.' });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    db.query('INSERT INTO admin_login (email, password, user_type) VALUES (?, ?, ?)', 
      [username, hashedPassword, user_type], (err, result) => {
        if (err) {
          return res.status(500).json({ message: 'Error registering user.' });
        }
        res.status(201).json({ message: 'User registered successfully!' });
    });
  });
});


// Login endpoint
router.post('/admin_login', (req, res) => {
  const { username, password } = req.body;

  db.query('SELECT * FROM admin_login WHERE email = ?', [username], async (err, results) => {
    if (err || results.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const user = results[0];

    // Check if user is verified
    if (user.secure === 0) {
      return res.status(403).json({ message: 'User is not verified.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  });
});


// Route to update order status
router.put('/Edit_order/:id', (req, res) => {
  const orderId = req.params.id;
  const { delvery_status } = req.body;

  if (!delvery_status) {
    return res.status(400).send({ error: 'Order status is required' });
  }

  const query = 'UPDATE orders SET delvery_status = ? WHERE id = ?';

  db.query(query, [delvery_status, orderId], (err, result) => {
    if (err) {
      console.error('Error updating order status:', err);
      return res.status(500).send({ error: 'Database error' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).send({ error: 'Order not found' });
    }

    res.send({ message: 'Order status updated successfully' });
  });
});


// PATCH endpoint to update product data with images
// PATCH endpoint to update product data with images
router.patch('/upadteProducts/:id', upload.fields([
  { name: 'img', maxCount: 5 },  // Multiple images (max 5)
  { name: 'feature_img', maxCount: 1 }  // Single feature image
]), async (req, res) => {
  const productId = req.params.id;

  // Extract the updated fields from the request body
  const {
    product_short,
    product_title,
    product_des,
    product_points,
    product_categores,
    product_sku,
    product_price,
    product_size,
    product_slug,
    review_message,
    review_email,
    review_rating,
    product_p_price,
    product_p_pice,
    product_p_discount,
    product_p_taxes,
    product_p_seoTitle,
    product_p_seoDes,
    product_p_seoKeyword,
    product_p_PageName,
    product_p_editor,
    gifts_price
  } = req.body;

  // Get existing product details from the database
  const getProductQuery = 'SELECT * FROM products WHERE id = ?';
  const getReviewQuery = 'SELECT * FROM review WHERE p_id = ?';
  const getActualPriceQuery = 'SELECT * FROM actualp WHERE p_id = ?';

  try {
    // Fetch the existing product, review, and price details
    db.query(getProductQuery, [productId], (productError, productResult) => {
      if (productError || productResult.length === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }

      const existingProduct = productResult[0];

      db.query(getReviewQuery, [productId], (reviewError, reviewResult) => {
        if (reviewError || reviewResult.length === 0) {
          return res.status(404).json({ error: 'Review not found' });
        }

        const existingReview = reviewResult[0];

        db.query(getActualPriceQuery, [productId], (priceError, priceResult) => {
          if (priceError || priceResult.length === 0) {
            return res.status(404).json({ error: 'Pricing data not found' });
          }

          const existingPrice = priceResult[0];

          // Extract images from the request if uploaded
          const images = req.files['img'] ? req.files['img'].map(file => file.filename) : JSON.parse(existingProduct.img);
          const featureImage = req.files['feature_img'] ? req.files['feature_img'][0].filename : existingProduct.feature_img;

          // Build URLs for the images
          const baseUrl = `${req.protocol}://${req.get('host')}/images/`;
          const imageUrls = images.map(img => baseUrl + img);
          const featureImageUrl = featureImage ? baseUrl + featureImage : null;

          // Create the update query for the product
          const updateProductQuery = `
            UPDATE products SET
              short = COALESCE(?, short),
              title = COALESCE(?, title),
              des = COALESCE(?, des),
              points = COALESCE(?, points),
              categores = COALESCE(?, categores),
              sku = COALESCE(?, sku),
              price = COALESCE(?, price),
              size = COALESCE(?, size),
              img = COALESCE(?, img),
              feature_img = COALESCE(?, feature_img),
              slug = COALESCE(?, slug)
            WHERE id = ?
          `;

          // Update the product in the database
          db.query(updateProductQuery, [
            product_short || existingProduct.short,
            product_title || existingProduct.title,
            product_des || existingProduct.des,
            product_points || existingProduct.points,
            product_categores || existingProduct.categores,
            product_sku || existingProduct.sku,
            product_price || existingProduct.price,
            product_size || existingProduct.size,
            JSON.stringify(imageUrls) || existingProduct.img,
            featureImageUrl || existingProduct.feature_img,
            product_slug || existingProduct.slug,
            productId
          ], (productUpdateError) => {
            if (productUpdateError) {
              return res.status(500).json({ error: 'Product update error' });
            }

            // Update the review data
            const updateReviewQuery = `
              UPDATE review SET
                msg = COALESCE(?, msg),
                email = COALESCE(?, email),
                rating = COALESCE(?, rating)
              WHERE p_id = ?
            `;

            db.query(updateReviewQuery, [
              review_message || existingReview.msg,
              review_email || existingReview.email,
              review_rating || existingReview.rating,
              productId
            ], (reviewUpdateError) => {
              if (reviewUpdateError) {
                return res.status(500).json({ error: 'Review update error' });
              }

              // Update the actual pricing data
              const updateActualPriceQuery = `
                UPDATE actualp SET
                  p_price = COALESCE(?, p_price),
                  p_pice = COALESCE(?, p_pice),
                  p_discount = COALESCE(?, p_discount),
                  taxes = COALESCE(?, taxes),
                  seoTitle = COALESCE(?, seoTitle),
                  seoDes = COALESCE(?, seoDes),
                  seoKeyword = COALESCE(?, seoKeyword),
                  PageName = COALESCE(?, PageName),
                  editor = COALESCE(?, editor),
                  gifts_price = COALESCE(?, gifts_price)
                WHERE p_id = ?
              `;

              db.query(updateActualPriceQuery, [
                product_p_price || existingPrice.p_price,
                product_p_pice || existingPrice.p_pice,
                product_p_discount || existingPrice.p_discount,
                product_p_taxes || existingPrice.taxes,
                product_p_seoTitle || existingPrice.seoTitle,
                product_p_seoDes || existingPrice.seoDes,
                product_p_seoKeyword || existingPrice.seoKeyword,
                product_p_PageName || existingPrice.PageName,
                product_p_editor || existingPrice.editor,
                gifts_price || existingPrice.gifts_price,
                productId
              ], (priceUpdateError) => {
                if (priceUpdateError) {
                  return res.status(500).json({ error: 'Pricing data update error' });
                }

                // If all updates are successful, send the response
                res.status(200).json({
                  message: 'Product updated successfully',
                  images: imageUrls,
                  featureImage: featureImageUrl
                });
              });
            });
          });
        });
      });
    });
  } catch (error) {
    console.error('Unexpected Server Error:', error);
    res.status(500).json({ error: 'Unexpected Server Error' });
  }
});


router.patch('/updateProductsimg/:id', upload.fields([
  { name: 'img', maxCount: 5 }  // Multiple images (max 5)
]), async (req, res) => {
  const productId = req.params.id;

  // Get existing product details from the database
  const getProductQuery = 'SELECT * FROM products WHERE id = ?';

  try {
    // Fetch the existing product details
    db.query(getProductQuery, [productId], (productError, productResult) => {
      if (productError || productResult.length === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }

      const existingProduct = productResult[0];

      // Extract existing image URLs from the database
      let existingImages = existingProduct.img ? JSON.parse(existingProduct.img) : [];

      // Extract new image filenames from the request if uploaded
      const newImages = req.files['img'] ? req.files['img'].map(file => `${req.protocol}://${req.get('host')}/images/${file.filename}`) : [];

      // Combine existing images with new images
      const updatedImages = [ ...newImages, ...existingImages];

      // Create the update query for the product
      const updateProductQuery = `
        UPDATE products SET
          img = ?
        WHERE id = ?
      `;

      // Update the product in the database
      db.query(updateProductQuery, [
        JSON.stringify(updatedImages),  // Save the updated image URLs as JSON string
        productId
      ], (productUpdateError) => {
        if (productUpdateError) {
          return res.status(500).json({ error: 'Product update error' });
        }

        // If the update is successful, send the response
        res.status(200).json({
          message: 'Product updated successfully',
          images: updatedImages
        });
      });
    });
  } catch (error) {
    console.error('Unexpected Server Error:', error);
    res.status(500).json({ error: 'Unexpected Server Error' });
  }
});


// PUT route to update a banner image in the homebanner table by ID
router.put('/home-banners/:id', upload.fields([
  { name: 'firstBanner', maxCount: 1 },  // Update single file for firstBanner
]), (req, res) => {
  
  // Get the banner ID from the URL parameters
  const bannerId = req.params.id;
console.log(req.files.firstBanner)
  // Check if files are uploaded
  if (!req.files.firstBanner) {
    return res.status(400).json({ error: 'Please upload the banner' });
  }

  // Extract the new filename from req.files
  const firstBanner = req.files['firstBanner'][0].filename;

  // Build the new URL for the uploaded banner image
  const baseUrl = `${req.protocol}://${req.get('host')}/images/`;
  const firstBannerUrl = baseUrl + firstBanner;

  // SQL query to update the banner image in the homebanner table based on the ID
  const query = `UPDATE homebanner SET firstBanner = ? WHERE id = ?`;

  // Execute the query
  db.query(query, [firstBannerUrl, bannerId], (err, result) => {
    if (err) {
      console.error('Error updating banner image:', err);
      res.status(500).send('Error updating banner image');
    } else {
      if (result.affectedRows === 0) {
        res.status(404).json({ message: 'Banner not found' });
      } else {
        res.status(200).json({
          message: 'Banner image updated successfully',
          data: {
            firstBanner: firstBannerUrl
          }
        });
      }
    }
  });
});

// Ensure that the images directory exists
// const imagesDirectory = path.join(__dirname, 'images');
// if (!fs.existsSync(imagesDirectory)) {
//   fs.mkdirSync(imagesDirectory, { recursive: true });
// }


// router.patch('/updateProductsimg/:id', upload.fields([
//   { name: 'img', maxCount: 5 }
// ]), async (req, res) => {
//   const productId = req.params.id;

//   // Get existing product details from the database
//   const getProductQuery = 'SELECT * FROM products WHERE id = ?';

//   try {
//     // Fetch the existing product details
//     db.query(getProductQuery, [productId], async (productError, productResult) => {
//       if (productError || productResult.length === 0) {
//         return res.status(404).json({ error: 'Product not found' });
//       }

//       const existingProduct = productResult[0];
//       let existingImages = existingProduct.img ? JSON.parse(existingProduct.img) : [];

//       const imageProcessingPromises = (req.files['img'] || []).map(async (file) => {
//         const originalFormat = file.mimetype;
//         const filePath = file.path;
//         let processedBuffer;

//         // Check if the image is in webp format
//         if (originalFormat === 'image/webp') {
//           processedBuffer = file.buffer;
//         } else {
//           // Convert to webp and compress the image
//           processedBuffer = await sharp(filePath)
//             .toFormat('webp', { quality: 80 })
//             .toBuffer();
//         }

//         // Compress the image to be between 50KB and 60KB
//         let sizeInKB = Buffer.byteLength(processedBuffer) / 1024;
//         let quality = 80;

//         while (sizeInKB > 60 && quality > 10) {
//           processedBuffer = await sharp(processedBuffer)
//             .toFormat('webp', { quality: quality -= 5 })
//             .toBuffer();
//           sizeInKB = Buffer.byteLength(processedBuffer) / 1024;
//         }

//         if (sizeInKB < 50) {
//           return res.status(400).json({ error: 'Compressed image is too small. Minimum size is 50KB.' });
//         }

//         // Use absolute path and a cleaner filename
//         const newFileName = `processed_${Date.now()}.webp`;
//         const newFilePath = path.join(imagesDirectory, newFileName);

//         // Save the processed image
//         await sharp(processedBuffer).toFile(newFilePath);

//         // Return the URL for the uploaded image
//         return `${req.protocol}://${req.get('host')}/images/${newFileName}`;
//       });

//       // Process all image uploads
//       const newImages = await Promise.all(imageProcessingPromises);
//       const updatedImages = [...existingImages, ...newImages.filter(img => img)];

//       // Create the update query for the product
//       const updateProductQuery = `
//         UPDATE products SET
//           img = ?
//         WHERE id = ?
//       `;

//       // Update the product in the database
//       db.query(updateProductQuery, [
//         JSON.stringify(updatedImages),
//         productId
//       ], (productUpdateError) => {
//         if (productUpdateError) {
//           return res.status(500).json({ error: 'Product update error' });
//         }

//         res.status(200).json({
//           message: 'Product updated successfully',
//           images: updatedImages
//         });
//       });
//     });
//   } catch (error) {
//     console.error('Unexpected Server Error:', error);
//     res.status(500).json({ error: 'Unexpected Server Error' });
//   }
// });

console.log('JWT_SECRET:', process.env.JWT_SECRET);


module.exports = router;
