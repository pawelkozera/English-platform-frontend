import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Login } from "./login";
import { Register } from "./register";

export function LoginOrRegisterCard() {
  return (
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
              <Login />
            </TabsContent>
            <TabsContent value="signup">
              <Register />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </section>
  );
}