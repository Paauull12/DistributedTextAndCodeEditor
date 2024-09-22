import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; 

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); 

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post(`http://master_paul:4050/login`, { 'username': username, 'password': password });
      console.log(`the token is ${response.data.access_token}`);
      localStorage.setItem('token', response.data.access_token);
      navigate('/chat'); // Updated navigation method
    } catch (error) {
      console.error('Login failed:', error);
      setError('Login failed. Please try again.'); 
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <h2 className="text-center mb-4">Login</h2>
          <form onSubmit={handleLogin} className="border p-4 shadow-sm rounded">
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
            <button type="submit" className="btn btn-primary w-100">Login</button>
          </form>
          <p className="text-center mt-3">Don't have an account? <Link to="/register">Register here</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Login;
