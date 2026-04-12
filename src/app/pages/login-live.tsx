import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Link2, Lock, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { Checkbox } from '../components/ui/checkbox';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ApiClientError, api, storeAuthSession } from '../services/linkflow-api';

export function LoginPageLive() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('login');
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    setLoading(true);

    try {
      const session = await api.login({
        email: loginData.email,
        password: loginData.password,
      });

      storeAuthSession(session);

      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberMe');
      }

      toast.success(`Welcome back, ${session.user.username}.`);
      navigate('/dashboard');
    } catch (error) {
      if (error instanceof ApiClientError) {
        toast.error(`${error.code}: ${error.message}`);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Login failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();

    if (registerData.password !== registerData.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const user = await api.register({
        email: registerData.email,
        username: registerData.username,
        password: registerData.password,
      });

      localStorage.setItem('userName', user.username);
      localStorage.setItem('userEmail', user.email);
      localStorage.setItem('userRole', user.role);
      setLoginData({ email: registerData.email, password: '' });
      setTab('login');
      toast.success(`Registered ${user.username}. Sign in to continue.`);
    } catch (error) {
      if (error instanceof ApiClientError) {
        toast.error(`${error.code}: ${error.message}`);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Registration failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-[28px] border border-white/70 bg-white/88 p-8 shadow-[0_24px_70px_rgba(15,23,42,0.14)] backdrop-blur-xl md:p-10">
      <div className="text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2563EB] via-[#2563EB] to-[#1D4ED8] shadow-[0_16px_32px_rgba(37,99,235,0.28)]">
          <Link2 className="h-8 w-8 text-white" />
        </div>
        <h1 className="mt-5 text-[32px] font-semibold tracking-tight text-[#0f172a]">LinkFlow Account Access</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#64748b]">
          Sign in to continue to your dashboard, or create a new account to get started.
        </p>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="mt-7 w-full">
        <TabsList className="grid h-12 w-full grid-cols-2 rounded-2xl bg-[#eef2ff] p-1">
          <TabsTrigger value="login" className="rounded-xl text-sm font-medium">Login</TabsTrigger>
          <TabsTrigger value="register" className="rounded-xl text-sm font-medium">Register</TabsTrigger>
        </TabsList>

        <TabsContent value="login" className="pt-6">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                type="email"
                value={loginData.email}
                onChange={(event) => setLoginData((current) => ({ ...current, email: event.target.value }))}
                placeholder="you@example.com"
                className="h-11"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="login-password">Password</Label>
              <Input
                id="login-password"
                type="password"
                value={loginData.password}
                onChange={(event) => setLoginData((current) => ({ ...current, password: event.target.value }))}
                placeholder="Enter your password"
                className="h-11"
                required
              />
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-[#f8fafc] px-3 py-3 text-sm text-[#64748b]">
              <Checkbox
                id="remember-login"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(Boolean(checked))}
              />
              <label htmlFor="remember-login" className="cursor-pointer select-none">
                Remember this browser session.
              </label>
            </div>

            <Button
              type="submit"
              className="h-12 w-full rounded-xl bg-[#111827] text-[15px] hover:bg-[#0F172A]"
              disabled={loading}
            >
              <Lock className="w-4 h-4 mr-2" />
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="register" className="pt-6">
          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="register-username">Username</Label>
              <Input
                id="register-username"
                type="text"
                value={registerData.username}
                onChange={(event) => setRegisterData((current) => ({ ...current, username: event.target.value }))}
                placeholder="alice_2026"
                className="h-11"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="register-email">Email</Label>
              <Input
                id="register-email"
                type="email"
                value={registerData.email}
                onChange={(event) => setRegisterData((current) => ({ ...current, email: event.target.value }))}
                placeholder="you@example.com"
                className="h-11"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="register-password">Password</Label>
              <Input
                id="register-password"
                type="password"
                value={registerData.password}
                onChange={(event) => setRegisterData((current) => ({ ...current, password: event.target.value }))}
                placeholder="At least 8 characters"
                className="h-11"
                minLength={8}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="register-confirm-password">Confirm Password</Label>
              <Input
                id="register-confirm-password"
                type="password"
                value={registerData.confirmPassword}
                onChange={(event) => setRegisterData((current) => ({ ...current, confirmPassword: event.target.value }))}
                placeholder="Repeat the password"
                className="h-11"
                minLength={8}
                required
              />
            </div>

            <Button
              type="submit"
              className="h-12 w-full rounded-xl bg-[#2563EB] text-[15px] hover:bg-[#1D4ED8]"
              disabled={loading}
            >
              <Mail className="w-4 h-4 mr-2" />
              {loading ? 'Registering...' : 'Register Against Backend'}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
