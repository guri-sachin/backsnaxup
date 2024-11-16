
import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useNavigate, useHistory} from 'react-router-dom';
import { Route, Link, Routes} from 'react-router-dom';
import {fetch} from 'whatwg-fetch';
import {Form,Button,Navbar,Nav,Container,Carousel,Table} from 'react-bootstrap';
import Sidebar from '../Components/Sidebar'
import Navbarfg  from '../Components/Navbar'
import Footer from '../Components/Footer'
import '../App.css';


function Admin()
{
 const apiUrl = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();

  const  [username,setUsername] =useState('');
 



function handel(e){
  setUsername(e.target.value);
  console.log(username)
}



function Out(){
  sessionStorage.removeItem('data');
  navigate("/Login")
}

const [product3,setProducts3] =useState([]);
const [product2,setProducts2] =useState([]);
const [product1,setProducts1] =useState([]);
const [product,setProducts] =useState([]);



 useEffect(()=>{
    axios.get(`${apiUrl}Allorders`).then(res=>setProducts(res.data));
},[]);
console.log("pl",product)
useEffect(()=>{
  axios.get(`${apiUrl}myallorder`).then(res=>setProducts1(res.data.orders));
},[]);



   return(
    

 <div  >
   {/* <!-- Page Wrapper --> */}
<div id="wrapper" >
<Sidebar/>
{/* <!-- Sidebar --> */}


{/* 
<!-- Content Wrapper --> */}
    <div id="content-wrapper" class="d-flex flex-column">
     {/*  <!-- Main Content --> */}
      <div id="content">
        {/* !-- Topbar --> */}
       <Navbarfg/>
       {/*  <!-- Begin Page Content --> */}
        <div class="container-fluid">



         {/*  <!-- Page Heading --> */}
        

          <div class="row">
          
          <div class="col-md-6">
          <div class="da">
          <div class="da1">Total Number of Orders</div>
          <div class="da2" >
            
            {product.length}
            </div> 
          </div>
          </div>
          <div class="col-md-6">
          <div class="da">
          <div class="da1">Today New Orders</div>
          <div class="da2" >{product1.length}</div> {/* dummy data 1 */}
          </div>
          </div>
<hr></hr>
          {/* <div class="col-md-6">
          <div class="da">
          <div class="da1">Today New Orders</div>
          <div class="da2" >{product3.length}</div> 
          </div>
          </div>
          <div class="col-md-6">
          <div class="da">
          <div class="da1">New Requests</div>
          <div class="da2" >{product2.length}</div> 
          </div>
          </div> */}
            <hr></hr>
          </div>

          
</div>
    

    



</div>

{/* <Footer/> */}

</div>

<a class="scroll-to-top rounded" href="#page-top">
    <i class="fas fa-angle-up"></i>
  </a>
</div>










    
    
  







</div>    
       
   );

}
export default Admin;
