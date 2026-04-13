"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Lottie from "lottie-react";
import animationData from "@/public/animation/login.json";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { CookieManager } from "@/lib/cookieUtils";
import api from "@/lib/apiClient";
import { toast } from "sonner";
import Image from "next/image";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await api.post("login", {
        username: email,
        password: password,
      });

      const data = response.data;

      if (data.status === "success") {
        // ✅ save cookie (same as working project)
        CookieManager.set("token", data.token, {
          path: "/",
          sameSite: "lax",
        });

        localStorage.setItem("user_auth_data", JSON.stringify(data.user));

        toast.success("Login successful 🎉");

        // ✅ IMPORTANT: use hard redirect (same as working project)
        window.location.href = "/salesDashboard";
      } else {
        toast.error(data.message || "Invalid credentials");
        setError(data.message || "Login failed");
      }
    } catch (err: any) {
      toast.error("Invalid Username Or Password");
      setError("Invalid Username Or Password");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden ">
        <CardContent className="grid  md:grid-cols-2">
          {/* Animation */}
          <div className="bg-muted relative hidden md:block">
            <div className="flex items-center justify-center h-full">
              <Lottie
                animationData={animationData}
                loop
                autoplay
                className="w-80"
              />
            </div>
          </div>

          {/* Form */}
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <Image
                  src="/elitesale-login.png" // place image inside /public folder
                  alt="Logo"
                  width={130}
                  height={50}
                  className="mb-2"
                />
                {/* <p className="text-muted-foreground">
                  Login to your Acme Inc account
                </p> */}
              </div>

              {/* Email */}
              <Field>
                <FieldLabel htmlFor="username">UserName</FieldLabel>
                <Input
                  id="username"
                  type="text"
                  placeholder="admin123"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Field>

              {/* Password */}
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                </div>

                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pr-10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </Field>

              {/* Error Message */}
              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              {/* Login Button */}
              <Field>
                <Button
                  type="submit"
                  className="w-full bg-[#022235]"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </Field>

              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator>

              {/* Social Buttons */}
              <Field className="grid grid-cols-3 gap-4">
                <Button variant="outline" type="button">
                  Apple
                </Button>
                <Button variant="outline" type="button">
                  Google
                </Button>
                <Button variant="outline" type="button">
                  Meta
                </Button>
              </Field>

              <FieldDescription className="text-center">
                Don&apos;t have an account? <a href="#">Sign up</a>
              </FieldDescription>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      <FieldDescription className="lg:px-6 px-1 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
