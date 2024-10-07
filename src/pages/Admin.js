
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
 console.log(sessionStorage.getItem("data"))
 const baseUrl = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  // useEffect(()=>{
  //   if(sessionStorage.getItem("userData") == null)
  //   {
  //     navigate('/')
  //   }
  // },[])

  const  [username,setUsername] =useState('');
 
  const [products,setProducts] =useState([]);



function handel(e){
  setUsername(e.target.value);
  console.log(username)
}



function Out(){
  sessionStorage.removeItem('data');
  navigate("/Login")
}



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
          <div class="d-sm-flex align-items-center justify-content-between mb-4">
            <h1 class="h3 mb-0 text-gray-800">welcome to the admin panel</h1>
          
          </div>



          
</div>
    

    



</div>

<Footer/>

</div>

<a class="scroll-to-top rounded" href="#page-top">
    <i class="fas fa-angle-up"></i>
  </a>
</div>










    
    
  







</div>    
       
   );

}
export default Admin;
