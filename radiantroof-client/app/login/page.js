"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, LogIn, Briefcase, Users, TrendingUp } from "lucide-react";

export default function LoginPage() {
  const { user, login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("umoveez@gmail.com");
  const [password, setPassword] = useState("test");
  const [error, setError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  // Handle redirect when user is authenticated
  useEffect(() => {
    if (!user) return;
    
    console.log('🔄 User detected, redirecting based on role:', user.role);
    
    if (user.role === 'admin') {
      console.log('➡️ Redirecting admin to /admin');
      router.replace('/admin');
    } else if (user.role === 'invest') {
      console.log('➡️ Redirecting investor to /investors');
      router.replace('/investors');
    } else {
      console.log('➡️ Redirecting user to /dashboard');
      router.replace('/dashboard');
    }
  }, [user, router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log('📝 Form submitted, starting login...');
    setIsLoggingIn(true);
    setError("");
    
    try {
      console.log('🔐 Calling login function with email:', email);
      const result = await login(email, password);
      console.log('✅ Login successful, user:', result);
    } catch (err) {
      console.error('❌ Login error:', err);
      setError(err.message || "Invalid email or password. Please try again.");
      setIsLoggingIn(false);
    }
  };

  const quickFill = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError("");
  };

  // Loading state while logging in
  if (isLoggingIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="text-center bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/20">
          <div className="w-20 h-20 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-white mb-2">
            Logging you in...
          </p>
          <p className="text-white/60">Please wait while we verify your credentials</p>
        </div>
      </div>
    );
  }

  // Don't show login form if user is already logged in
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="text-center bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/20">
          <div className="w-20 h-20 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-white mb-2">
            Redirecting...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center px-4 py-12">
      <div className="relative w-full max-w-md">
        
        {/* Animated background elements */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-1000"></div>
        
        {/* Main card */}
        <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          
          {/* Header with decorative elements */}
          <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 px-8 pt-8 pb-6">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative z-10">
              <h1 className="text-3xl font-bold text-white text-center mb-2">
                Welcome Back
              </h1>
              <p className="text-blue-100 text-center text-sm">
                Sign in to continue to your dashboard
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="p-8 space-y-6" noValidate>
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80 block">
                Email Address
              </label>
              <div className={`relative transition-all duration-200 ${focusedField === 'email' ? 'transform scale-[1.02]' : ''}`}>
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full bg-white/5 border border-white/20 rounded-xl pl-10 pr-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                  required
                  disabled={isLoggingIn}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80 block">
                Password
              </label>
              <div className={`relative transition-all duration-200 ${focusedField === 'password' ? 'transform scale-[1.02]' : ''}`}>
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full bg-white/5 border border-white/20 rounded-xl pl-10 pr-12 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                  required
                  disabled={isLoggingIn}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-3">
                <p className="text-red-200 text-sm text-center">{error}</p>
              </div>
            )}

            {/* Sign In Button - FIXED */}
            <button
              type="submit"
              disabled={isLoggingIn || !email || !password}
              onClick={(e) => {
                console.log('🖱️ Sign In button clicked');
                if (!isLoggingIn && email && password) {
                  console.log('✅ Button enabled, form will submit');
                } else {
                  console.log('⚠️ Button disabled or missing credentials');
                }
              }}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 group"
            >
              <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              {isLoggingIn ? "Authenticating..." : "Sign In"}
            </button>

            {/* Demo Credentials */}
            <div className="pt-4 border-t border-white/10">
              <p className="text-xs text-white/50 text-center mb-3">Demo Credentials</p>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => quickFill("umoveez@gmail.com", "test")}
                  className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-all group text-left border border-blue-500/30"
                >
                  <Briefcase className="w-3 h-3 text-blue-400 mb-1" />
                  <p className="font-medium text-white/90">Admin</p>
                  <p className="text-white/50 text-[10px] truncate">umoveez@gmail.com</p>
                </button>
                <button
                  type="button"
                  onClick={() => quickFill("invest@test.com", "password")}
                  className="p-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-all group text-left border border-green-500/30"
                >
                  <TrendingUp className="w-3 h-3 text-green-400 mb-1" />
                  <p className="font-medium text-white/90">Investor</p>
                  <p className="text-white/50 text-[10px] truncate">invest@test.com</p>
                </button>
                <button
                  type="button"
                  onClick={() => quickFill("user@test.com", "password")}
                  className="p-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg transition-all group text-left border border-purple-500/30"
                >
                  <Users className="w-3 h-3 text-purple-400 mb-1" />
                  <p className="font-medium text-white/90">User</p>
                  <p className="text-white/50 text-[10px] truncate">user@test.com</p>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}