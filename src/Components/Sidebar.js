// Sidebar.js

import React from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
    return (
          <div>
             

{/* <!-- Sidebar --> */}
<ul class="navbar-nav  sidebar sidebar-dark accordion" id="accordionSidebar" style={{backgroundColor:"#176fc7"}}>
{/* 
  <!-- Sidebar - Brand --> */}
  <a class="sidebar-brand d-flex align-items-center justify-content-center" href={"/Admin"}>
    
    <div class="sidebar-brand-icon ">
    <img class="img-profile rounded" src="../logo.png" style={{height:60}}/>
    </div>
  </a>
  {/* <hr class="sidebar-divider my-0"/>
  <hr class="sidebar-divider"/> */}

{/* 
  
  <!-- Nav Item - Pages Collapse Menu --> */}
  <li class="nav-item">
    <Link class="nav-link" to={"/Admin"}>
     <i class="fas fa-fw fa-cog"></i>
      <span >Dashboard </span></Link>
  </li>
  
  <li class="nav-item">
    <a class="nav-link collapsed" href="users.html" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
      <i class="fas fa-fw fa-cog"></i>
      <span>Add Products</span>
    </a>
    <div id="collapseTwo" class="collapse" aria-labelledby="headingTwo" data-parent="#accordionSidebar">
      <div class="bg-white py-2 collapse-inner rounded">
        
      <Link to="/AddProduct" className="collapse-item">Add Product</Link>
        <Link to="/AddGifts" className="collapse-item">Add Gifts </Link>
        <Link to="/AddGiftBox" className="collapse-item">Add Gifts Box</Link>
        <Link to="/Addblogs" className="collapse-item">Add Blogs</Link>

        
        
        
      </div>
    </div>
  </li>
  <li class="nav-item">
    <a class="nav-link collapsed" href="users.html" data-toggle="collapse" data-target="#collapseFive" aria-expanded="true" aria-controls="collapseFive">
      <i class="fas fa-fw fa-cog"></i>
      <span>View Details</span>
    </a>
    <div id="collapseFive" class="collapse" aria-labelledby="headingTwo" data-parent="#accordionSidebar">
      <div class="bg-white py-2 collapse-inner rounded">
      
      <Link to="/ViewUsers" className="collapse-item">View Users</Link>
      <Link to="/ViewGiftbox" className="collapse-item">View Gift Box</Link>
      <Link to="/ViewGifts" className="collapse-item">View Gifts</Link>
      <Link to="/ViewRatings" className="collapse-item">View REVIEWS</Link>
      <Link to="/ViewHomebanners" className="collapse-item">View Banners</Link>
      <Link to="/BlogList" className="collapse-item">View Blogs</Link>
      <Link to="/ViewCoupan" className="collapse-item">View Coupn</Link>


      
        
        
      </div>
    </div>
  </li>
  <li class="nav-item">
    <Link class="nav-link" to={"/AddCoupn"}>
     <i class="fas fa-fw fa-cog"></i>
      <span >Create Coupn </span></Link>
  </li>
  <li class="nav-item">
    <Link class="nav-link" to={"/contactus"}>
     <i class="fas fa-fw fa-cog"></i>
      <span >Contact-us </span></Link>
  </li>
  <li class="nav-item">
    <Link class="nav-link" to={"/Vieworders"}>
     <i class="fas fa-fw fa-cog"></i>
      <span >View-Orders </span></Link>
  </li>
  <li class="nav-item">
    <Link class="nav-link" to={"/ViewProducts"}>
     <i class="fas fa-fw fa-cog"></i>
      <span >View-Products </span></Link>
  </li>
  <Link to="/" className="collapse-item"></Link>

  
{/* 
  <!-- Nav Item - Utilities Collapse Menu --> */}
  

  {/* <!-- Divider --> */}
  

  
 

 {/*  <!-- Sidebar Toggler (Sidebar) --> */}
 
</ul>
        </div>
    );
}

export default Sidebar;
