import Footer from '../components/Footer.jsx';
import { useAuth } from '../contexts/authContext.jsx';
import { ROLES } from '../app/roles.js';
import NavbarSwitcher from '../app/NavbarSwitcht.jsx';
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () =>{
    setUser(ROLES.USER);
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <NavbarSwitcher/>

      {/* Page Content */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="bg-white w-full max-w-lg rounded-lg shadow p-8">
          <h2 className="text-3xl font-bold mb-6 text-center">Log In</h2>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Email Address</label>
            <input
              type="email"
              placeholder="Placeholder"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div className="mb-1">
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              placeholder="Placeholder"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <p className="text-xs text-gray-500 mb-4">
            It must be a combination of minimum 8 letters, numbers, and symbols.
          </p>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" />
              Remember me
            </label>
            <button className="text-sm text-blue-600 hover:underline">
              Forgot Password?
            </button>
          </div>

          {/* Login Button */}
          
          <button onClick={handleLogin} className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
            Log In
          </button>

          {/* Google Login */}
          <button
            className="w-full mt-4 py-2 border rounded-md flex items-center justify-center gap-2 hover:bg-gray-50"
          >
            <span className="text-xl">🔵</span> {/* Temporary Google icon */}
            <span>Log in with Google</span>
          </button>

          <hr className="my-6" />

          {/* Signup */}
          <p className="text-center text-sm text-gray-600">
            No account yet?{" "}
            <a href="/register" className="text-blue-600 hover:underline">
              Sign Up
            </a>
          </p>
        </div>
      </div>

      <Footer/>
    </div>
  );
}
