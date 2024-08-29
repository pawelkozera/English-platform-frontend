import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import apiClient from "@/interceptor/axios-interceptor";
import { useNavigate } from "react-router-dom";

export function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('student');

  const navigate = useNavigate();

  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      console.error('Passwords do not match');
      return;
    }

    try {
      const response = await apiClient.post('/api/v1/auth/signup', {
        email,
        password,
        firstName,
        lastName,
        role,
      });

      console.log('Signup successful', response.data);
      navigate(`/home`);
    } catch (error) {
      console.error('Error during signup', error);
    }
  };

  return (
    <form onSubmit={handleSignup}>
      <div className="space-y-4">
        <div>
          <Label htmlFor="signup-first-name">First name</Label>
          <Input
            id="signup-first-name"
            type="text"
            placeholder="Enter your first name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="signup-last-name">Last Name</Label>
          <Input
            id="signup-last-name"
            type="text"
            placeholder="Enter your last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="signup-email">Email</Label>
          <Input
            id="signup-email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="signup-password">Password</Label>
          <Input
            id="signup-password"
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="signup-password-confirm">Confirm password</Label>
          <Input
            id="signup-password-confirm"
            type="password"
            placeholder="Confirm a password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="role">I am a:</Label>
          <select
            id="role"
            className="w-full border rounded-md p-2 bg-background"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
        </div>
        <Button type="submit" className="w-full">Sign Up</Button>
      </div>
    </form>
  )
}