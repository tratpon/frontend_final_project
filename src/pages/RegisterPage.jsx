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
    
    // เพิ่ม local state สำหรับเช็คช่วงที่ Firebase กำลังทำงาน (ก่อนส่งไป mutation)
    const [isFirebaseLoading, setIsFirebaseLoading] = useState(false);

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

    // สถานะรวมว่าระบบกำลังประมวลผลอยู่หรือไม่
    const isLoading = isFirebaseLoading || registerMutation.isPending;

    const handleRegister = async (e) => {
        if (e) e.preventDefault();

        // --- 1. Validation ---
        if (!Fname || !Lname || !Username || !email || !password) {
            alert("กรุณากรอกข้อมูลให้ครบทุกช่อง");
            return;
        }

        if (password !== confirmPassword) {
            alert("รหัสผ่านไม่ตรงกัน");
            return;
        }

        if (password.length < 8) {
            alert("รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร");
            return;
        }

        // --- 2. Process ---
        setIsFirebaseLoading(true);
        try {
            // สร้าง User ใน Firebase
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            const firebaseUser = userCredential.user;

            // อัปเดต Profile ใน Firebase
            await updateProfile(firebaseUser, {
                displayName: Username,
            });

            // ส่งข้อมูลไปบันทึกใน Database ของเราเองผ่าน API
            await registerMutation.mutateAsync({
                uid: firebaseUser.uid,
                username: Username,
                fname: Fname,
                lname: Lname,
                email: email
            });

        } catch (error) {
            // หากเกิด Error ระหว่างทาง ให้ลบ User ออกจาก Firebase (Rollback) เพื่อป้องกันข้อมูลขยะ
            if (auth.currentUser) {
                await auth.currentUser.delete();
            }
            alert("เกิดข้อผิดพลาด: " + error.message);
        } finally {
            setIsFirebaseLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <NavbarSwitcher />

            {/* Page Content */}
            <div className="flex-1 flex items-center justify-center px-4 m-5 bg-gradient-to-b from-blue-50 to-white py-20">
                <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-8">
                    <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">ลงทะเบียน</h2>

                    <form onSubmit={handleRegister}>
                        <div className="mb-4 flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium mb-1 text-gray-700">ชื่อ</label>
                                <input
                                    type="text"
                                    value={Fname}
                                    onChange={(e) => setFname(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition"
                                    placeholder="ชื่อจริง"
                                    required
                                />
                            </div>

                            <div className="flex-1">
                                <label className="block text-sm font-medium mb-1 text-gray-700">นามสกุล</label>
                                <input
                                    type="text"
                                    value={Lname}
                                    onChange={(e) => setLname(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition"
                                    placeholder="นามสกุล"
                                    required
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1 text-gray-700">ชื่อผู้ใช้ (Username)</label>
                            <input
                                type="text"
                                value={Username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition"
                                placeholder="Username"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1 text-gray-700">อีเมล</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition"
                                placeholder="example@email.com"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1 text-gray-700">รหัสผ่าน</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition"
                                placeholder="อย่างน้อย 8 ตัวอักษร"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1 text-gray-700">ยืนยันรหัสผ่าน</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition"
                                placeholder="กรอกรหัสผ่านอีกครั้ง"
                                required
                            />
                        </div>

                        <p className="text-xs text-gray-500 mb-6 italic">
                            * รหัสผ่านต้องประกอบด้วยตัวอักษรหรือตัวเลขอย่างน้อย 8 ตัว
                        </p>

                        {/* Register Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-3 rounded-md font-bold transition flex items-center justify-center gap-2 ${
                                isLoading
                                    ? "bg-blue-300 cursor-not-allowed text-white"
                                    : "bg-blue-600 text-white hover:bg-blue-700 shadow-md active:scale-95"
                            }`}
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    กำลังดำเนินการ...
                                </>
                            ) : (
                                "ลงทะเบียน"
                            )}
                        </button>
                    </form>

                    <hr className="my-6 border-gray-200" />
                    
                    <p className="text-center text-sm text-gray-600">
                        มีบัญชีอยู่แล้ว? <a href="/login" className="text-blue-600 hover:underline font-semibold">เข้าสู่ระบบ</a>
                    </p>
                </div>
            </div>

            <Footer />
        </div>
    );
}