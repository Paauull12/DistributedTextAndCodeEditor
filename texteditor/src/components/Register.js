import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Updated hook

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(''); 

    if (!username || !password) {
      setError('Please fill out all fields.');
      return;
    }

    try {
      const response = await axios.post(`http://master_paul:4050/register`, { 'username': username, 'password': password });
      console.log(`the token is ${response.data.access_token}`);
      localStorage.setItem('token', response.data.access_token);
      navigate('/chat');
    } catch (error) {
      console.error('Registration failed:', error);
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <h2 className="text-center mb-4">Register</h2>
          <form onSubmit={handleRegister} className="border p-4 shadow-sm rounded">
            <div className="form-group mb-3">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                className="form-control"
                id="username"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-danger text-center">{error}</p>} {/* Display error message */}
            <button type="submit" className="btn btn-primary w-100">Register</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
