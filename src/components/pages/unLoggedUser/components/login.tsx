import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import apiClient from "@/interceptor/axios-interceptor";
import { useNavigate } from "react-router-dom";

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleSignin = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await apiClient.post('/api/v1/auth/signin', {
        email,
        password,
      });

      console.log('Signin successful', response.data);
      navigate(`/home`);
    } catch (error) {
      console.error('Error during signin', error);
    }
  };
      
  return (
    <form onSubmit={handleSignin}>
      <div className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full">Login</Button>
      </div>
    </form>
  )
}