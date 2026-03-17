
import { useAuth } from '../../contexts/AuthContext.jsx';
import { ROLES } from '../../app/roles.js';
import { useNavigate } from "react-router-dom";
import { useMutation } from '@tanstack/react-query';
import { useState } from "react";
import { adminlogin } from '../../app/Api.js';

export default function AdminLogin() {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useMutation({
    mutationFn: adminlogin,
    onSuccess: (data) => {
      console.log(data);
        setUser(ROLES.ADMIN);
        navigate("/");
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
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Page Content */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="bg-white w-full max-w-lg rounded-lg shadow p-8">
          <h2 className="text-3xl font-bold mb-6 text-center">Log In</h2>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loginMutation.isPending}
            className="w-full bg-blue-600 text-white py-2 mt-2 rounded-md hover:bg-blue-700"
          >
            {loginMutation.isPending ? "Logging in..." : "Log In"}
          </button>
        </div>
      </div>
    </div>
  );
}
