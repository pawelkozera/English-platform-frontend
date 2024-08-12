import { useState, useEffect } from 'react';
import apiClient from './interceptor/axios-interceptor';
import './App.css';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken') || '');
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken') || '');

  console.log(localStorage.getItem('accessToken'));
  console.log(localStorage.getItem('refreshToken'));
  
  const handleSignup = async () => {
    try {
      const response = await apiClient.post('/api/v1/auth/signup', {
        email,
        password,
        firstName,
        lastName,
      });
      const { accessToken, refreshToken } = response.data;
      
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      console.log('Signup successful', response.data);
    } catch (error) {
      console.error('Error during signup', error);
    }
  };

  const handleSignin = async () => {
    try {
      const response = await apiClient.post('/api/v1/auth/signin', {
        email,
        password,
      });
      const { accessToken, refreshToken } = response.data;

      setAccessToken(accessToken);
      setRefreshToken(refreshToken);

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      console.log('Signin successful', response.data);
    } catch (error) {
      console.error('Error during signin', error);
    }
  };

  const handleHelloEndPoint = async () => {
    try {
      const response = await apiClient.get('/hello');
      console.log('Hello successful', response.data);
    } catch (error) {
      console.error('Error during hello', error);
    }
  };

  return (
    <div className="App">
      <h1>Signup and Signin Test</h1>

      <div className="form">
        <h2>Signup</h2>
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleSignup}>Signup</button>
      </div>

      <div className="form">
        <h2>Signin</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleSignin}>Signin</button>
      </div>

      <button onClick={handleHelloEndPoint}>HelloEndPoint</button>

      {accessToken && (
        <div>
          <h3>Access Token</h3>
          <p>{accessToken}</p>
        </div>
      )}

      {refreshToken && (
        <div>
          <h3>Refresh Token</h3>
          <p>{refreshToken}</p>
        </div>
      )}
    </div>
  );
}

export default App;
