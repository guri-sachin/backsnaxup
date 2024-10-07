import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../Dyv.css'; 

function Product() {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

const [username, setUsername] = useState('');


const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post('http://localhost:4000/api/admin_login', { username, password });
    const token = response.data.token;
    localStorage.setItem('token', token); 
    sessionStorage.setItem('userData', JSON.stringify(response.data));

    navigate('/Admin');
    Swal.fire('Success!', 'Logged in successfully!', 'success');
  } catch (error) {
    Swal.fire('Error!', error.response?.data?.message || 'Something went wrong!', 'error');
  }
};

  return (
    <div>
      <div className="wrapper fadeInDown">
        <div id="formContent">
          <h2 className="active">Sign in</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              id="pswd"
              className="fadeIn second forniputdyv"
              name="email"
              placeholder="Email"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <small id="emailHelp" className="form-text text-muted">
              We'll never share your email with anyone else.
            </small>
            <input
              type="text"
              id="password"
              className="fadeIn third forniputdyv"
              name="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <input type="submit" className="fadeIn fourth" value="Submit" />
          </form>
        </div>
      </div>
    </div>
  );
}

export default Product;



 