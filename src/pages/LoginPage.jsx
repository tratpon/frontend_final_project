import Footer from '../components/Footer.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { ROLES } from '../app/roles.js';
import NavbarSwitcher from '../app/NavbarSwitcht.jsx';
import { useNavigate } from "react-router-dom";
import { useMutation } from '@tanstack/react-query';
import { useState } from "react";
import { loginRole } from '../app/Api.js';

export default function Login() {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useMutation({
    mutationFn: loginRole,
    onSuccess: (data) => {
      if(data.role==ROLES.USER){
        setUser(ROLES.USER);
        navigate("/");
      }else{
        setUser(ROLES.ADVISOR);
        navigate("/");
      }
      console.log(data.role)
    },

    onError: (err) => {
      alert(err.response?.data?.message || err.message);
    }

  });
  const handleLogin = () => {

    if (!email || !password) {
      return alert("Please enter email and password");
    }

    loginMutation.mutate({
      email,
      password
    });
  };
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col ">
      <NavbarSwitcher />

      {/* Page Content */}
      <div className="flex-1 flex items-center justify-center px-4 bg-linear-to-b from-blue-50 to-white py-20">
        <div className="bg-white w-full max-w-lg rounded-lg shadow p-8">
          <h2 className="text-3xl font-bold mb-6 text-center">เข้าสู่ระบบ</h2>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">อีเมล</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="โปรดใส่ Email"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div className="mb-1">
            <label className="block text-sm font-medium mb-1">รหัสผ่าน</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="โปรดใส่รหัสผ่าน"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

        
           <p className="text-xs text-gray-500 mb-4">
                        ต้องมีตัวเลข หรือตัวอักษรอย่างน้อย 8 ตัว
                    </p>
          {/* Login Button */}

          <button
            onClick={handleLogin}
            disabled={loginMutation.isPending}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
          >
            {loginMutation.isPending ? "กำลังล็อกอิน..." : "ล็อกอิน"}
          </button>

          {/* Signup */}
          <p className="text-center text-sm text-gray-600">
            ยังไม่มีบัญชี?{" "}
            <a href="/register" className="text-blue-600 hover:underline">
              สมัครสมาชิก
            </a>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
