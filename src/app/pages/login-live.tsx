import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Link2, Lock, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { BackendCapabilityAlert } from '../components/backend-capability-alert';
import { Button } from '../components/ui/button';
import { Checkbox } from '../components/ui/checkbox';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ApiClientError, api } from '../services/linkflow-api';

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

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    toast.error('The current backend snapshot does not provide a login endpoint yet.');
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
      toast.success(`Registered ${user.username}. The app remains in unauthenticated dev mode.`);
      navigate('/links');
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
    <div className="bg-white rounded-xl shadow-xl p-8 w-full space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] rounded-xl mb-4">
          <Link2 className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-2xl font-semibold text-[#111827] mb-2">LinkFlow Dev Access</h1>
        <p className="text-sm text-[#6B7280]">The frontend now follows the current backend capabilities only.</p>
      </div>

      <BackendCapabilityAlert
        title="Current backend scope"
        description="Registration is live. Login and social sign-in are not implemented yet, so the UI no longer fakes successful authentication."
        tone="warning"
      />

      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>

        <TabsContent value="login" className="pt-4">
          <form onSubmit={handleLogin} className="space-y-4">
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
                placeholder="Not wired yet"
                className="h-11"
                required
              />
            </div>

            <div className="flex items-center gap-2 text-sm text-[#6B7280]">
              <Checkbox id="dev-login-disabled" checked={false} disabled />
              <label htmlFor="dev-login-disabled">Login is intentionally disabled until the backend exposes it.</label>
            </div>

            <Button type="submit" className="w-full h-11 bg-[#111827] hover:bg-[#0F172A]">
              <Lock className="w-4 h-4 mr-2" />
              Explain Missing Login
            </Button>

            <div className="relative py-2">
              <Separator />
            </div>

            <p className="text-xs text-[#6B7280] leading-5">
              Development tip: use the Register tab once, then continue directly to the short-link pages.
              The app shell is not auth-gated yet.
            </p>
          </form>
        </TabsContent>

        <TabsContent value="register" className="pt-4">
          <form onSubmit={handleRegister} className="space-y-4">
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

            <Button type="submit" className="w-full h-11 bg-[#2563EB] hover:bg-[#1D4ED8]" disabled={loading}>
              <Mail className="w-4 h-4 mr-2" />
              {loading ? 'Registering...' : 'Register Against Backend'}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
