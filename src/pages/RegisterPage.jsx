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
            alert("รหัสไม่ตรงกัน");
            return;
        }

        if (password.length < 8 ) {
            alert("รหัสต้องมีมากกว่า 8 ตัว");
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
            if (auth.currentUser) {
                await auth.currentUser.delete();
            }
            alert(error.message);
        }
    };
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <NavbarSwitcher />

            {/* Page Content */}
            <div className="flex-1 flex items-center justify-center px-4 m-5 bg-linear-to-b from-blue-50 to-white py-20">
                <div className="bg-white w-full max-w-lg rounded-lg shadow p-8 ">
                    <h2 className="text-3xl font-bold mb-6 text-center">ลงทะเบียน</h2>

                    <div className="mb-4 flex gap-5">
                        <div>
                            <label className="block text-sm font-medium mb-1">ชื่อ</label>
                            <input
                                type="Frist-name"
                                value={Fname}
                                onChange={(e) => setFname(e.target.value)}
                                className="w-full px-4 py-2 border rounded-md"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">นามสกุล</label>
                            <input
                                type="Last-name"
                                value={Lname}
                                onChange={(e) => setLname(e.target.value)}
                                className="w-full px-4 py-2 border rounded-md"
                                required
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
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-m font-medium mb-1">อีเมล</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md"
                            required
                        />
                    </div>


                    <div className="mb-4">
                        <label className="block text-m font-medium mb-1">รหัสผ่าน</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-m font-medium mb-1">ยืนยันรหัสผ่าน</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md"
                        />
                    </div>



                    <p className="text-xs text-gray-500 mb-4">
                        ต้องมีตัวเลข หรือตัวอักษรอย่างน้อย 8 ตัว
                    </p>

                    {/* Login Button */}
                    <button
                        onClick={handleRegister}
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                    >
                        ลงทะเบียน
                    </button>

                    

                    <hr className="my-6" />


                </div>
            </div>


            <Footer />
        </div>
    );
}
