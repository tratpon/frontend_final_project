import NavbarSwitcher from '../app/NavbarSwitcht.jsx';
import Footer from '../components/Footer.jsx';
import { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { registerUser } from '../app/Api.js';
import { useMutation } from '@tanstack/react-query';

export default function Register() {
    const [Fname, setFname] = useState("");
    const [Lname, setLname] = useState("");
    const [Username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const navigate = useNavigate();

    const registerMutation = useMutation({
        mutationFn: registerUser,
        onSuccess: () => {
            navigate("/main");
        },
        onError: (err) => {
            alert(err.response?.data?.message || err.message);
        }
    });

    const handleRegister = async () => {

        if (password !== confirmPassword) {
            alert("Password not match");
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            const firebaseUser = userCredential.user;

            await updateProfile(firebaseUser, {
                displayName: Username,
            });


            await registerMutation.mutateAsync({
                uid: firebaseUser.uid,
                username: Username,
                fname: Fname,
                lname: Lname,
                email: email
            });

        } catch (error) {
            alert(error.message);
        }
    };
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <NavbarSwitcher />

            {/* Page Content */}
            <div className="flex-1 flex items-center justify-center px-4 m-5">
                <div className="bg-white w-full max-w-lg rounded-lg shadow p-8">
                    <h2 className="text-3xl font-bold mb-6 text-center">Register</h2>

                    <div className="mb-4 flex gap-5">
                        <div>
                            <label className="block text-sm font-medium mb-1">UserName</label>
                            <input
                                type="Frist-name"
                                value={Fname}
                                onChange={(e) => setFname(e.target.value)}
                                className="w-full px-4 py-2 border rounded-md"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">UserName</label>
                            <input
                                type="Last-name"
                                value={Lname}
                                onChange={(e) => setLname(e.target.value)}
                                className="w-full px-4 py-2 border rounded-md"
                            />
                        </div>


                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">UserName</label>
                        <input
                            type="Username"
                            value={Username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-m font-medium mb-1">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md"
                        />
                    </div>


                    <div className="mb-4">
                        <label className="block text-m font-medium mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-m font-medium mb-1">Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md"
                        />
                    </div>



                    <p className="text-xs text-gray-500 mb-4">
                        It must be a combination of minimum 8 letters, numbers, and symbols.
                    </p>

                    {/* Login Button */}
                    <button
                        onClick={handleRegister}
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                    >
                        Register
                    </button>

                    {/* Google Login */}
                    <button
                        className="w-full mt-4 py-2 border rounded-md flex items-center justify-center gap-2 hover:bg-gray-50"
                    >
                        <span className="text-xl">🔵</span> {/* Temporary Google icon */}
                        <span>Log in with Google</span>
                    </button>

                    <hr className="my-6" />


                </div>
            </div>

            <Footer />
        </div>
    );
}
