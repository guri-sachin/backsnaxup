import { Form, Button, Container, Nav } from 'react-bootstrap';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Admin from './pages/Admin';
import PropertyList from './pages/PropertyList';
import AddProduct from './pages/AddProduct';
import Login from './pages/Login';  
import Contactus from './pages/Contactus';  
import ViewProducts from './pages/ViewProducts';  
import ViewUsers from './pages/ViewUsers';  
import AddGifts from './pages/AddGifts';  
import AddGiftBox from './pages/AddGiftBox';  
import AddCoupn from './pages/AddCoupn';  
import ViewGifts from './pages/ViewGifts';  
import ViewOrders from './pages/ViewOrders';  
import ViewGiftbox from './pages/ViewGiftbox';  
import ViewRatings from './pages/ViewRatings';  
import ViewHomebanners from './pages/ViewHomebanners';  


import ProtectedRoute from './ProtectedRoute';

import './App.css';
import UpdateProducts from './pages/Updateproducts';

function Home() {
  return (
    <div>
      <Routes>
        <Route path="/AddProduct" element={<ProtectedRoute element={<AddProduct />} />} />
 
        <Route path="/ViewRatings" element={<ProtectedRoute element={<ViewRatings />} />} />
        <Route path="/ViewHomebanners" element={<ProtectedRoute element={<ViewHomebanners />} />} />


        {/* Wrap the protected route like this */}
        <Route path="/Admin" element={<ProtectedRoute element={<Admin />} />} />
        <Route path="/UpdateProducts" element={<ProtectedRoute element={<UpdateProducts />} />} />
        <Route path="/Contactus" element={<ProtectedRoute element={<Contactus />} />} />
        <Route path="/" element={<Login />} />
        <Route path="/ViewProducts" element=  {<ProtectedRoute element={<ViewProducts />} />}/>
        <Route path="/ViewUsers" element=   {<ProtectedRoute element={<ViewUsers />} />}/>
        <Route path="/ViewOrders" element= {<ProtectedRoute element={<ViewOrders />} />}/>
        <Route path="/AddGifts" element= {<ProtectedRoute element={<AddGifts />} />}/>
        <Route path="/AddGiftBox" element=  {<ProtectedRoute element={<AddGiftBox />} />}/>
        <Route path="/AddCoupn" element= {<ProtectedRoute element={<AddCoupn />} />}/>
        <Route path="/ViewGiftbox" element= {<ProtectedRoute element={<ViewGiftbox />} />}/>
        <Route path="/ViewGifts" element=  {<ProtectedRoute element={<ViewGifts />} />}/>
      </Routes>
    </div>
  );
}

export default Home;
