// import './Dyv.css';
import './App.css';
import { useNavigate, useLocation } from "react-router-dom";
import {Form,Button,Navbar,nav,Container,Carousel,Table,Card,Row,Col} from 'react-bootstrap';
import React, { useState,useEffect } from 'react';
import axios from "axios";

import Swal from "sweetalert2";

import {BrowserRouter,Link,Routes,Route,MemoryRouter, NavLink} from 'react-router-dom';
import { AiFillShop } from 'react-icons/ai';

function Product() {
  const baseUrl = process.env.REACT_APP_BASE_URL;

  const  [email, setEmail] =useState('');
  const  [password, setPassword] =useState('');
  const navigate = useNavigate();
  function handelDemo2(e)
  {
      setPassword(e.target.value);
      console.log(password);
  }
  function handelDemo3(e)
  {
      setEmail(e.target.value);
      console.log(email);
  }


  async function Show1()
  {
   
      const data2 ={"username":email,"password":password};
      
      const config = {
          method :'POST',
          headers:{
          'Accept':'application/json',
          'Content-Type':'application/json',
       },
          body: JSON.stringify(data2)
       }
    
  const response = await fetch ('https://api.shieldradr.com:3001/login',config)
 
  const data3 = await response.json();
  console.log(data3)
 if(data3 =="success"){
   
   sessionStorage.setItem("data", JSON.stringify(data3));
 
   console.log(data3)
      navigate("/Dashboard")
 }else{
   console.log("not");
   Swal.fire({
     icon: 'warning',
     // title: 'Password Changed',
     text: "wrong email or password",
 })
}
 
    
      }




  return (
    <div>
      
 <div class="wrapper fadeInDown">
  <div id="formContent">
  
    <h2 class="active"> Sign in </h2>
  

   
   

    <form>
    
      <input type="text" id="pswd" class="fadeIn second" name="login" placeholder="User Name" onChange={handelDemo3}/>
      <small id="emailHelp" class="form-text text-muted">We'll never share your data with anyone else.</small>
      <input type="text" id="password" class="fadeIn third" name="login" placeholder="Password" onChange={handelDemo2}/>

      <input type="button" class="fadeIn fourth" value="Submit" onClick={Show1}/>
    </form>


   

  </div>
</div>

    </div>
    
  );
}

export default  Product;


 