import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Separator } from '../components/ui/separator';
import { Checkbox } from '../components/ui/checkbox';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { Link2, Github, Mail, Chrome } from 'lucide-react';
import { ApiClientError, api, storeAuthSession } from '../services/linkflow-api';

export function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
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

      toast.success(`登录成功，欢迎回来 ${session.user.username}`);
      navigate('/dashboard');
    } catch (error) {
      if (error instanceof ApiClientError) {
        toast.error(`${error.code}: ${error.message}`);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('登录失败');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (registerData.password !== registerData.confirmPassword) {
      toast.error('两次输入的密码不一致');
      return;
    }

    if (registerData.password.length < 8) {
      toast.error('密码长度至少为 8 位');
      return;
    }

    setLoading(true);

    try {
      const user = await api.register({
        email: registerData.email,
        username: registerData.username,
        password: registerData.password,
      });

      localStorage.setItem('userRole', user.role);
      localStorage.setItem('userName', user.username);
      localStorage.setItem('userEmail', user.email);
      toast.success(`注册成功，已创建用户 ${user.username}`);
      navigate('/dashboard');
    } catch (error) {
      if (error instanceof ApiClientError) {
        toast.error(`${error.code}: ${error.message}`);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('注册失败');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    toast.info(`即将跳转到 ${provider} 登录`);
    setTimeout(() => {
      localStorage.setItem('userRole', 'user');
      localStorage.setItem('userName', `${provider} User`);
      localStorage.setItem('userEmail', `user@${provider.toLowerCase()}.com`);
      toast.success('Demo 第三方登录成功');
      navigate('/dashboard');
    }, 900);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-xl p-8 w-full"
    >
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] rounded-xl mb-4">
          <Link2 className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-2xl font-semibold text-[#111827] mb-2">欢迎来到 LinkFlow</h1>
        <p className="text-sm text-[#6B7280]">智能短链管理平台</p>
      </div>

      <Tabs defaultValue="login" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="login">登录</TabsTrigger>
          <TabsTrigger value="register">注册</TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login-email">邮箱地址</Label>
              <Input
                id="login-email"
                type="email"
                placeholder="your@email.com"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="login-password">密码</Label>
                <a href="#" className="text-sm text-[#2563EB] hover:underline">
                  忘记密码？
                </a>
              </div>
              <Input
                id="login-password"
                type="password"
                placeholder="请输入密码"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                required
                className="h-11"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <label htmlFor="remember" className="text-sm text-[#6B7280] cursor-pointer select-none">
                记住我 30 天
              </label>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-[#2563EB] hover:bg-[#1D4ED8]"
              disabled={loading}
            >
              {loading ? '登录中...' : '登录'}
            </Button>

            <div className="relative my-6">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-xs text-[#9CA3AF]">
                或使用以下方式登录
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Button type="button" variant="outline" className="h-11" onClick={() => handleSocialLogin('Google')}>
                <Chrome className="w-5 h-5" />
              </Button>
              <Button type="button" variant="outline" className="h-11" onClick={() => handleSocialLogin('GitHub')}>
                <Github className="w-5 h-5" />
              </Button>
              <Button type="button" variant="outline" className="h-11" onClick={() => handleSocialLogin('Email')}>
                <Mail className="w-5 h-5" />
              </Button>
            </div>

            <div className="text-center text-sm text-[#6B7280] mt-6 p-4 bg-[#F9FAFB] rounded-lg">
              <p className="font-medium mb-2">当前说明</p>
              <div className="space-y-1 text-xs">
                <p>注册会真实调用后端 `POST /api/v1/auth/register`</p>
                <p>登录会真实调用后端 `POST /api/v1/auth/login` 并保存 JWT</p>
                <p className="text-[#9CA3AF]">管理员演示邮箱：admin@linkflow.com</p>
              </div>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="register">
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="register-username">用户名</Label>
              <Input
                id="register-username"
                type="text"
                placeholder="例如 alice_2026"
                value={registerData.username}
                onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                required
                className="h-11"
              />
              <p className="text-xs text-[#6B7280]">需与后端规则一致：3-40 位，字母数字点下划线横线</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="register-email">邮箱地址</Label>
              <Input
                id="register-email"
                type="email"
                placeholder="your@email.com"
                value={registerData.email}
                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="register-password">密码</Label>
              <Input
                id="register-password"
                type="password"
                placeholder="至少 8 位"
                value={registerData.password}
                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                required
                minLength={8}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="register-confirm">确认密码</Label>
              <Input
                id="register-confirm"
                type="password"
                placeholder="再次输入密码"
                value={registerData.confirmPassword}
                onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                required
                className="h-11"
              />
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox id="terms" required />
              <label htmlFor="terms" className="text-sm text-[#6B7280] cursor-pointer select-none leading-tight">
                我同意 <a href="#" className="text-[#2563EB] hover:underline">服务条款</a> 和{' '}
                <a href="#" className="text-[#2563EB] hover:underline">隐私政策</a>
              </label>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-[#2563EB] hover:bg-[#1D4ED8]"
              disabled={loading}
            >
              {loading ? '注册中...' : '创建账户'}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
