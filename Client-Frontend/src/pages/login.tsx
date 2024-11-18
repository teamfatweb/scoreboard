import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();
  const { setJwt } = useAuth();

  const { mutateAsync: Login } = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email, password: password }),
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
    onSuccess: (data) => {
      setJwt(data);
      navigate("/");
    },
    onError: () => {},
  });

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      Login();
    } catch (e) {
      console.error(e);
    }
  };

  return (
<div className="min-w-screen min-h-screen flex justify-center items-center bg-gray-900">
  <Card className="my-10 p-8 bg-white shadow-lg rounded-lg w-full max-w-md">
    <CardHeader className="text-center mb-6">
      <h2 className="text-3xl font-semibold text-orange-600">Login</h2>
    </CardHeader>
    <CardContent className="w-full">
      <form className="flex flex-col gap-4" onSubmit={submitHandler}>
        {/* Email Input */}
        <div className="flex flex-col">
          <Label className="text-sm font-medium text-gray-700 mb-2">Email</Label>
          <Input
            type="email"
            placeholder="JohnDoe@gmail.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password Input */}
        <div className="flex flex-col">
          <Label className="text-sm font-medium text-gray-700 mb-2">Password</Label>
          <Input
            type="password"
            placeholder="********"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Login Button */}
        <Button className="mt-4 text-white py-2 px-6 rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200">
          Login
        </Button>
      </form>
    </CardContent>
  </Card>
</div>

  );
};

export default Login;
