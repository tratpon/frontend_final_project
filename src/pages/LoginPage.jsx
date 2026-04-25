import Footer from '../components/Footer.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { ROLES } from '../app/roles.js';
import NavbarSwitcher from '../app/NavbarSwitcht.jsx';
import { useNavigate } from "react-router-dom";
import { useMutation } from '@tanstack/react-query';
import { useState } from "react";
import { loginRole } from '../app/Api.js';
import {  Mail, Lock, Loader2 } from "lucide-react"; // เพิ่ม Icon เพื่อความสวยงาม

export default function Login() {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useMutation({
    mutationFn: loginRole,
    onSuccess: (data) => {
      // ตรวจสอบ Role และนำทาง
      if (data.role === ROLES.USER) {
        setUser(ROLES.USER);
      } else {
        setUser(ROLES.ADVISOR);
      }
      navigate("/");
    },
    onError: (err) => {
      alert(err.response?.data?.message || err.message);
    }
  });

  const handleLogin = () => {
    if (!email || !password) {
      return alert("โปรดกรอกอีเมลและรหัสผ่าน");
    }
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <NavbarSwitcher />

      <div className="flex-1 flex items-center justify-center px-4 bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12">
        <div className="bg-white w-full max-w-md rounded-[2rem] shadow-xl shadow-blue-900/5 p-10 border border-gray-100">
          
          {/* Header */}
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-gray-800 tracking-tight">เข้าสู่ระบบ</h2>
            <p className="text-gray-400 text-sm mt-2 font-medium">ยินดีต้อนรับกลับมา! โปรดระบุข้อมูลของคุณ</p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
            className="space-y-6"
          >
            {/* Email Field */}
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">
                อีเมล
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all outline-none text-sm font-medium"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">
                รหัสผ่าน
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all outline-none text-sm font-medium"
                />
              </div>
              <p className="text-[10px] font-bold text-gray-400 mt-2 ml-1 uppercase tracking-tighter">
                * ต้องมีตัวเลขหรือตัวอักษรอย่างน้อย 8 ตัว
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-blue-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {loginMutation.isPending ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>กำลังเข้าสู่ระบบ...</span>
                </>
              ) : (
                "เข้าสู่ระบบ"
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-10 text-center">
            <p className="text-sm font-bold text-gray-400">
              ยังไม่มีบัญชี?{" "}
              <button 
                onClick={() => navigate("/register")}
                className="text-blue-600 hover:text-blue-700 font-black transition-colors underline underline-offset-4"
              >
                สมัครสมาชิกใหม่
              </button>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}