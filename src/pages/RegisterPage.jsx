import NavbarSwitcher from '../app/NavbarSwitcht.jsx';
import Footer from '../components/Footer.jsx';
import { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { registerUser,loginRole } from '../app/Api.js';
import { useMutation } from '@tanstack/react-query';
import { UserPlus, User, Mail, Lock, Loader2, ArrowRight } from "lucide-react"; // เพิ่ม Icon
import { useAuth } from '../contexts/AuthContext.jsx';
import { ROLES } from '../app/roles.js';

export default function Register() {
    const [Fname, setFname] = useState("");
    const [Lname, setLname] = useState("");
    const [Username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isFirebaseLoading, setIsFirebaseLoading] = useState(false);
    const { setUser } = useAuth();
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
    const isLoading = isFirebaseLoading || registerMutation.isPending;

    const handleRegister = async (e) => {
        if (e) e.preventDefault();
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

        setIsFirebaseLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;
            await updateProfile(firebaseUser, { displayName: Username });
            await registerMutation.mutateAsync({
                uid: firebaseUser.uid,
                username: Username,
                fname: Fname,
                lname: Lname,
                email: email
            });
            loginMutation.mutate({ email, password });
        } catch (error) {
            if (auth.currentUser) await auth.currentUser.delete();
            alert("เกิดข้อผิดพลาด: " + error.message);
        } finally {
            setIsFirebaseLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
            <NavbarSwitcher />

            <main className="flex-1 flex items-center justify-center px-4 py-16 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
                <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl shadow-blue-900/5 p-8 md:p-12 border border-gray-100">

                    {/* Header */}
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-black text-gray-800 tracking-tight">สร้างบัญชีใหม่</h2>
                        <p className="text-gray-400 text-sm mt-2 font-medium">เริ่มต้นการปรึกษาออนไลน์กับผู้เชี่ยวชาญวันนี้</p>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-5">
                        {/* Name Group */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">ชื่อจริง</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                                    <input
                                        type="text"
                                        value={Fname}
                                        onChange={(e) => setFname(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white transition-all outline-none text-sm font-medium"
                                        placeholder="First Name"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">นามสกุล</label>
                                <input
                                    type="text"
                                    value={Lname}
                                    onChange={(e) => setLname(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white transition-all outline-none text-sm font-medium"
                                    placeholder="Last Name"
                                    required
                                />
                            </div>
                        </div>

                        {/* Username */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">ชื่อผู้ใช้ (Username)</label>
                            <input
                                type="text"
                                value={Username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white transition-all outline-none text-sm font-medium"
                                placeholder="เช่น somchai_kmitl"
                                required
                            />
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">อีเมล</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white transition-all outline-none text-sm font-medium"
                                    placeholder="example@email.com"
                                    required
                                />
                            </div>
                        </div>

                        {/* Passwords */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">รหัสผ่าน</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white transition-all outline-none text-sm font-medium"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">ยืนยันรหัสผ่าน</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white transition-all outline-none text-sm font-medium"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <p className="text-[10px] text-gray-400 font-bold italic ml-1 tracking-tight">
                            * รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร
                        </p>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-4 mt-4 rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${isLoading
                                ? "bg-blue-100 text-blue-400 cursor-not-allowed"
                                : "bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-200 active:scale-[0.98]"
                                }`}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    <span>กำลังประมวลผล...</span>
                                </>
                            ) : (
                                <>
                                    <span>ลงทะเบียน</span>
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-50 text-center">
                        <p className="text-sm font-bold text-gray-400">
                            มีบัญชีอยู่แล้ว?{" "}
                            <button
                                onClick={() => navigate("/login")}
                                className="text-blue-600 hover:text-blue-700 font-black underline underline-offset-4"
                            >
                                เข้าสู่ระบบ
                            </button>
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}