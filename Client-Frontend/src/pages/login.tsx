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
    <div className="min-w-screen min-h-screen w-full h-full flex justify-center items-center">
      <Card className="my-10 mr-10 bg-gray-50">
        <CardHeader className="py-8">
          <div className="flex gap-4 text-orange-500 flex-col md:flex-row justify-stretch md:justify-start items-start md:items-center">
            <h2 className="text-2xl font-semibold flex-grow text-center">
              Login
            </h2>
          </div>
        </CardHeader>
        <CardContent className="w-full max-w-full min-h-100">
          <form className="flex flex-col gap-3" onSubmit={submitHandler}>
            <div className="flex gap-2 items-center max-w-2/3">
              <Label className="w-[80px]">Email: </Label>
              <div className="flex-grow">
                <Input
                  type="email"
                  placeholder="JohnDoe@gmail.com"
                  className="!ring-0 !ring-offset-0 w-full"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2 items-center ">
              <Label className="w-[80px]">Password</Label>
              <div className="flex-grow">
                <Input
                  type="password"
                  placeholder="********"
                  className="!ring-0 !ring-offset-0 w-full"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  required
                />
              </div>
            </div>
            <Button className="my-3">Login</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
