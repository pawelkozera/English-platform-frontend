import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, GamepadIcon, TestTube, PlusCircle, FileText, Settings } from 'lucide-react';
import { Footer } from '@/components/common/footer';
import { Header } from './components/header';
import { InformationCards } from './components/informationCards';

export function MainPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'student' | 'teacher' | null>(null);

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoggedIn(true);
    setUserRole('student');
  }

  return (
    <div className="flex flex-col h-screen">
      <main className="flex-grow container mx-auto py-8">
        <Header />
        <InformationCards />

        <section className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Login or Sign Up</CardTitle>
              <CardDescription>Access your personalized learning experience</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                  <form onSubmit={handleLogin}>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="Enter your email" required />
                      </div>
                      <div>
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" placeholder="Enter your password" required />
                      </div>
                      <Button type="submit" className="w-full">Login</Button>
                    </div>
                  </form>
                </TabsContent>
                <TabsContent value="signup">
                  <form onSubmit={(e) => e.preventDefault()}>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="signup-email">Email</Label>
                        <Input id="signup-email" type="email" placeholder="Enter your email" required />
                      </div>
                      <div>
                        <Label htmlFor="signup-password">Password</Label>
                        <Input id="signup-password" type="password" placeholder="Create a password" required />
                      </div>
                      <div>
                        <Label htmlFor="role">I am a:</Label>
                        <select id="role" className="w-full border rounded-md p-2 bg-background">
                          <option value="student">Student</option>
                          <option value="teacher">Teacher</option>
                        </select>
                      </div>
                      <Button type="submit" className="w-full">Sign Up</Button>
                    </div>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  )
}