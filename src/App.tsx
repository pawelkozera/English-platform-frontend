import { useState } from 'react';
import apiClient from './interceptor/axios-interceptor';
import './App.css';
import { Button } from "@/components/ui/button";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { MainPage } from './components/pages/unLoggedUser/main';

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
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="App">
        <MainPage></MainPage>
      </div>
    </ThemeProvider>
  );
}

export default App;
