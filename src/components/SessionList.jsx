import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    fetchMySessions,
    joinRoom,
    completedRoom,
    fetchMySessionsAdvisor
} from "../app/Api";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Clock, CheckCircle2, PlayCircle, XCircle, Calendar, MessageSquare } from "lucide-react";

export default function SessionList() {
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [filterStatus, setFilterStatus] = useState("all");
    const [hasAlerted, setHasAlerted] = useState(false);
    const [now, setNow] = useState(new Date().getTime());

    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { user } = useAuth();

    // อัปเดตเวลาปัจจุบันทุกๆ 30 วินาที เพื่อให้สถานะปุ่ม "เริ่มห้อง" เปลี่ยนตามจริง
    useEffect(() => {
        const timer = setInterval(() => setNow(new Date().getTime()), 30000);
        return () => clearInterval(timer);
    }, []);

    const { data: sessions = [], isLoading } = useQuery({
        queryKey: ["mySessions"],
        queryFn: user === "user" ? fetchMySessions : fetchMySessionsAdvisor,
        staleTime: 1000 * 60 * 5,
    });

    const getRoomStatus = (session) => {
        if (["active", "completed", "cancelled"].includes(session.RoomStatus)) {
            return session.RoomStatus;
        }
        const start = new Date(session.StartTime).getTime();
        const end = new Date(session.EndTime).getTime();

        if (now > end) return "completed";
        if (now < start) return "waiting";
        return session.RoomStatus;
    };

    // Notification Logic
    useEffect(() => {
        if (!hasAlerted && sessions.length > 0) {
            const fifteenMins = 15 * 60 * 1000;
            const upcoming = sessions.find(s => {
                const start = new Date(s.StartTime).getTime();
                return (start - now) > 0 && (start - now) <= fifteenMins;
            });

            if (upcoming) {
                alert(`🔔 มีนัดหมาย: ${upcoming.ServiceName} ในอีก 15 นาที`);
                setHasAlerted(true);
            }
        }
    }, [sessions, hasAlerted, now]);

    const filteredSessions = sessions.filter(s => filterStatus === "all" || getRoomStatus(s) === filterStatus);

    // Mutations
    const handleStartRoom = useMutation({
        mutationFn: joinRoom,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["mySessions"] })
    });

    const handleLeave = useMutation({
        mutationFn: completedRoom,
        onSuccess: (data) => {
            alert("จบการสนทนาเรียบร้อย");
            queryClient.invalidateQueries({ queryKey: ["mySessions"] });
        }
    });

    const SESSION_OPTIONS = [
        { value: "all", label: "ทั้งหมด" },
        { value: "waiting", label: "⏳ รอการปรึกษา" },
        { value: "active", label: "🟢 กำลังดำเนินการ" },
        { value: "completed", label: "🔒 เสร็จสิ้น" },
        { value: "cancelled", label: "❌ ยกเลิก" },
    ];

    if (isLoading) return <div className="p-10 text-center animate-pulse text-gray-400">กำลังโหลดรายการนัดหมาย...</div>;

    return (
        <div className="max-w-2xl mx-auto p-2">
            {/* FILTER TAB */}
            <div className="mb-6">
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full md:w-auto px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-bold text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                >
                    {SESSION_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* LIST */}
            <div className="space-y-4">
                {filteredSessions.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                        <Calendar className="mx-auto text-gray-200 mb-2" size={48} />
                        <p className="text-gray-400 text-sm font-bold uppercase tracking-tighter">ไม่พบนัดหมายในหมวดนี้</p>
                    </div>
                ) : (
                    filteredSessions.map(session => {
                        const status = getRoomStatus(session);
                        const start = new Date(session.StartTime).getTime();
                        const canStart = (start - now) <= 15 * 60 * 1000; // ให้เริ่มก่อนได้ 15 นาที


                        const isSelected = selectedRoom === session.RoomID;
                        const cardStyle = isSelected
                            ? "border-blue-500 bg-blue-50 shadow-lg shadow-blue-100 ring-2 ring-blue-500/20"
                            : status === "active"
                                ? "border-emerald-500 bg-emerald-50/60 shadow-md shadow-emerald-50"
                                : "border-gray-100 bg-white hover:border-gray-200";

                        return (
                            <div
                                key={session.RoomID}
                                onClick={() => { setSelectedRoom(session.RoomID), navigate(`/session?BookingID=${session.BookingID}`) }}
                                className={`group border rounded-[2rem] p-6 transition-all duration-500 cursor-pointer relative overflow-hidden ${cardStyle}`}
                            >
                                <div className="flex items-start gap-4">
                                    {/* Avatar */}
                                    <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100 shadow-sm">
                                        <img
                                            src={user === "user" ? session.imageAdvisorUrl : session.imageUserUrl}
                                            className="w-full h-full object-cover"
                                            onError={(e) => e.target.src = "https://ui-avatars.com/api/?name=User&background=random"}
                                            alt="profile"
                                        />
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-black text-gray-800 truncate pr-4">{session.ServiceName}</h3>
                                            <StatusBadge status={status} />
                                        </div>
                                        <p className="text-sm font-bold text-blue-600 mt-0.5">
                                            {user === "user" ? `Advisor: ${session.AdvisorName}` : `User: ${session.UserName}`}
                                        </p>
                                        <div className="flex items-center gap-3 mt-3 text-gray-400">
                                            <div className="flex items-center gap-1 text-[11px] font-black uppercase">
                                                <Clock size={14} />
                                                {session.StartTime?.split('T')[1]?.substring(0, 5)} - {session.EndTime?.split('T')[1]?.substring(0, 5)}
                                            </div>
                                            <div className="flex items-center gap-1 text-[11px] font-black uppercase">
                                                <Calendar size={14} />
                                                {new Date(session.StartTime).toLocaleDateString('th-TH', { day: '2-digit', month: 'short' })}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions for Advisor */}
                                {user === "advisor" && (
                                    <div className="mt-5 pt-4 border-t border-gray-50 flex gap-2">
                                        {status === "waiting" && canStart && (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleStartRoom(session.RoomID); }}
                                                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                                            >
                                                <PlayCircle size={18} /> เริ่มห้องสนทนา
                                            </button>
                                        )}
                                        {status === "active" && (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleLeave(session.RoomID, session.BookingID); }}
                                                className="w-full bg-rose-500 hover:bg-rose-600 text-white py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-100"
                                            >
                                                <XCircle size={18} /> จบการสนทนา
                                            </button>
                                        )}
                                    </div>
                                )}

                                {status === "active" && user === "user" && (
                                    <div className="mt-4 animate-pulse">
                                        <div className="bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase p-2 rounded-xl text-center border border-emerald-100">
                                            Advisor เปิดห้องแล้ว กดเพื่อเข้าสู่การสนทนา
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

// Sub-component สำหรับแสดงป้ายสถานะ
function StatusBadge({ status }) {
    const config = {
        waiting: { label: "Waiting", color: "bg-amber-50 text-amber-600 border-amber-100" },
        active: { label: "Live Now", color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
        completed: { label: "Finished", color: "bg-gray-100 text-gray-400 border-gray-200" },
        cancelled: { label: "Cancelled", color: "bg-rose-50 text-rose-600 border-rose-100" }
    };
    const { label, color } = config[status] || config.waiting;
    return (
        <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border ${color}`}>
            {label}
        </span>
    );
}