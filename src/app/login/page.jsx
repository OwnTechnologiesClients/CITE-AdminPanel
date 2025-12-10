"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Mail, AlertCircle, Eye, EyeOff } from "lucide-react";
import { login } from "@/lib/api/auth";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(""); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Basic validation
    if (!formData.identifier || !formData.password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    // Backend accepts both email and username as identifier
    const identifier = formData.identifier.trim();

    try {
      // Call real API login function
      const { token, user } = await login(identifier, formData.password.trim());
      
      if (token) {
        // Token is automatically stored in localStorage by login function
        // Redirect to admin dashboard
        router.push("/admin");
        router.refresh();
      } else {
        throw new Error("No token received from server");
      }
    } catch (err) {
      // Handle different error types
      let errorMessage = "Invalid email or password. Please try again.";
      
      if (err.message) {
        // Use the error message from the API or our custom message
        errorMessage = err.message;
        
        // Provide more specific error messages for common cases
        if (err.message.includes('401') || err.message.includes('Unauthorized')) {
          errorMessage = "Invalid email or password. Please try again.";
        } else if (err.message.includes('Network') || err.message.includes('Failed to fetch')) {
          errorMessage = "Network error. Please check your connection and try again.";
        } else if (err.message.includes('500') || err.message.includes('Server')) {
          errorMessage = "Server error. Please try again later.";
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Card className="shadow-lg transition-all duration-300 hover:shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-primary/20">
                <Lock className="size-6 text-primary transition-transform duration-300" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold animate-in fade-in duration-700 delay-150">Admin Login</CardTitle>
            <CardDescription className="animate-in fade-in duration-700 delay-300">
              Enter your credentials to access the admin panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm animate-in fade-in slide-in-from-top-2 duration-300">
                  <AlertCircle className="size-4 shrink-0 animate-in spin-in-90 duration-500" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-2 animate-in fade-in slide-in-from-left-2 duration-500 delay-200">
                <Label htmlFor="identifier">Email, Username, or Phone Number</Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground transition-colors duration-200 group-focus-within:text-primary" />
                  <Input
                    id="identifier"
                    name="identifier"
                    type="text"
                    placeholder="owner, owner@cite.com, or +1234567890"
                    value={formData.identifier}
                    onChange={handleChange}
                    className="pl-9 transition-all duration-200 focus:scale-[1.01]"
                    required
                    disabled={loading}
                    autoComplete="username"
                  />
                </div>
              </div>

              <div className="space-y-2 animate-in fade-in slide-in-from-left-2 duration-500 delay-300">
                <Label htmlFor="password">Password</Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground transition-colors duration-200 group-focus-within:text-primary" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-9 pr-9 transition-all duration-200 focus:scale-[1.01]"
                    required
                    disabled={loading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-110 active:scale-95"
                    disabled={loading}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="size-4 transition-transform duration-200" />
                    ) : (
                      <Eye className="size-4 transition-transform duration-200" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm animate-in fade-in duration-500 delay-400">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="size-4 rounded border-input transition-all duration-200 group-hover:scale-110"
                  />
                  <span className="text-muted-foreground transition-colors duration-200 group-hover:text-foreground">Remember me</span>
                </label>
                <button
                  type="button"
                  className="text-primary hover:underline transition-all duration-200 hover:scale-105"
                  disabled={loading}
                >
                  Forgot password?
                </button>
              </div>

              <Button
                type="submit"
                className="w-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] animate-in fade-in duration-500 delay-500"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6 animate-in fade-in duration-700 delay-700">
          © 2025 CITE Admin Panel. All rights reserved.
        </p>
      </div>
    </div>
  );
}

