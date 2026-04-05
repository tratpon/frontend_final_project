import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import { fetchAllUserAndAdvisor, updateStatusAccount } from "../../app/Api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Users, ShieldCheck, Mail, Phone, Loader2 } from "lucide-react";

export default function Admin() {
    const queryClient = useQueryClient();
    const [tab, setTab] = useState("all");
    const [search, setSearch] = useState("");

    const { data = [], isLoading } = useQuery({
        queryKey: ["adminusermange"],
        queryFn: fetchAllUserAndAdvisor
    });

    const mutation = useMutation({
        mutationFn: updateStatusAccount,
        onSuccess: () => {
            queryClient.invalidateQueries(["adminusermange"]);
        },
        onError: (err) => {
            alert("Error: " + err.message);
        }
    });

    const handleToggleStatus = (user) => {
        const nextStatus = user.Status === "active" ? "inactive" : "active";
        // เปลี่ยนจาก confirm ธรรมดาเป็นแบบที่ดูทางการขึ้นได้ในอนาคต
        if (window.confirm(`ยืนยันการเปลี่ยนสถานะของคุณ ${user.Fname} เป็น ${nextStatus.toUpperCase()}?`)) {
            mutation.mutate({
                id: user.UserID || user.AdvisorID,
                role: user.role,
                newStatus: nextStatus
            });
        }
    };

    const filteredUsers = data
        .filter(u => tab === "all" ? true : u.role === tab)
        .filter(u =>
            `${u.Fname} ${u.Lname}`.toLowerCase().includes(search.toLowerCase()) ||
            u.Email.toLowerCase().includes(search.toLowerCase())
        );

    return (
        <div className="min-h-screen bg-slate-50/50 flex">
            <Sidebar />

            <main className="flex-1 p-10 ml-72">
                {/* Header Section */}
                <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight">User Management</h1>
                        <p className="text-slate-500 font-medium">จัดการสิทธิ์และตรวจสอบสถานะผู้ใช้งานในระบบ</p>
                    </div>

                    {/* Search Bar */}
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                            <Search size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder="ค้นหาชื่อ หรือ อีเมล..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-12 pr-6 py-3.5 bg-white border border-slate-100 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 w-full md:w-96 transition-all font-medium text-slate-600"
                        />
                    </div>
                </header>

                {/* Tabs & Stats Summary */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
                    <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100 w-full sm:w-auto">
                        {["all", "user", "advisor"].map((t) => (
                            <button
                                key={t}
                                onClick={() => setTab(t)}
                                className={`flex-1 sm:flex-none px-8 py-2.5 rounded-xl text-sm font-black transition-all ${
                                    tab === t 
                                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" 
                                        : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                                }`}
                            >
                                {t.toUpperCase()}
                            </button>
                        ))}
                    </div>
                    
                    <div className="text-sm font-bold text-slate-400 bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm">
                        Total: <span className="text-indigo-600">{filteredUsers.length}</span> Accounts
                    </div>
                </div>

                {/* Table Header */}
                <div className="grid grid-cols-[1.5fr_1.5fr_1.2fr_0.8fr_1fr] text-[11px] font-black text-slate-400 mb-4 px-8 uppercase tracking-[0.15em]">
                    <div>User Profile</div>
                    <div>Contact Information</div>
                    <div>Phone Number</div>
                    <div>Role</div>
                    <div className="text-right">Account Control</div>
                </div>

                {/* User List */}
                <div className="flex flex-col gap-3 pb-20">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border border-dashed border-slate-200">
                             <Loader2 className="animate-spin text-indigo-500 mb-4" size={32} />
                             <p className="text-slate-400 font-bold">กำลังโหลดข้อมูลผู้ใช้งาน...</p>
                        </div>
                    ) : filteredUsers.length > 0 ? (
                        filteredUsers.map((user, i) => (
                            <div
                                key={i}
                                className="bg-white rounded-3xl px-8 py-5 grid grid-cols-[1.5fr_1.5fr_1.2fr_0.8fr_1fr] items-center shadow-sm border border-slate-100 hover:shadow-md hover:border-indigo-100 transition-all group"
                            >
                                {/* 1. User Info */}
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm group-hover:scale-105 transition-transform">
                                            {user.imageUrl ? (
                                                <img src={user.imageUrl} alt="Profile" className="w-full h-full object-cover" />
                                            ) : (
                                                <Users size={20} className="text-slate-400" />
                                            )}
                                        </div>
                                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${user.Status === 'active' ? 'bg-green-500' : 'bg-slate-300'}`} />
                                    </div>
                                    <div className="flex flex-col leading-tight">
                                        <span className="font-black text-slate-700 group-hover:text-indigo-600 transition-colors">
                                            {user.Fname} {user.Lname}
                                        </span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{user.Gender || "N/A"}</span>
                                    </div>
                                </div>

                                {/* 2. Email */}
                                <div className="flex items-center gap-2 text-slate-500">
                                    <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                                        <Mail size={14} />
                                    </div>
                                    <span className="text-sm font-medium truncate pr-4">{user.Email}</span>
                                </div>

                                {/* 3. Phone */}
                                <div className="flex items-center gap-2 text-slate-500 font-bold tracking-tight">
                                    <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                                        <Phone size={14} />
                                    </div>
                                    <span className="text-sm">{user.Phone || "—"}</span>
                                </div>

                                {/* 4. Role Badge */}
                                <div>
                                    {user.role === "advisor" ? (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-600 rounded-xl text-[10px] font-black uppercase tracking-wider border border-purple-100">
                                            <ShieldCheck size={12} />
                                            Advisor
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-wider border border-blue-100">
                                            <Users size={12} />
                                            Member
                                        </span>
                                    )}
                                </div>

                                {/* 5. Status Toggle */}
                                <div className="flex items-center justify-end gap-4">
                                    <div className="text-right flex flex-col items-end">
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${user.Status === "active" ? "text-green-500" : "text-slate-300"}`}>
                                            {user.Status || "active"}
                                        </span>
                                    </div>
                                    
                                    <button
                                        onClick={() => handleToggleStatus(user)}
                                        disabled={mutation.isPending}
                                        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 focus:outline-none shadow-inner ${
                                            user.Status === "active" ? "bg-green-500" : "bg-slate-200"
                                        }`}
                                    >
                                        <span
                                            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
                                                user.Status === "active" ? "translate-x-6" : "translate-x-1"
                                            }`}
                                        />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
                            <Users size={48} className="mx-auto mb-4 opacity-10" />
                            <p className="text-slate-400 font-bold text-lg">ไม่พบข้อมูลผู้ใช้งานที่ตรงตามเงื่อนไข</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}