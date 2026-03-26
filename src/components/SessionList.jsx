import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    fetchMySessions,
    joinRoom,
    completedRoom,
    fetchMySessionsAdvisor
} from "../app/Api";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function SessionList() {
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [filterStatus, setFilterStatus] = useState("all");

    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { user } = useAuth();

    // ✅ Fetch sessions
    const { data: sessions = [] } = useQuery({
        queryKey: ["mySessions"],
        queryFn: user === "user"
            ? fetchMySessions
            : fetchMySessionsAdvisor,
        staleTime: 1000 * 60 * 7,
        refetchOnWindowFocus: false,
    });
    console.log(sessions);


    // ✅ Status helper
    const getRoomStatus = (session) => {
        if (session.RoomStatus === "cancelled") return "cancelled";
        if (session.RoomStatus === "completed") return "completed";
        if (session.RoomStatus === "active") return "active";

        const now = Date.now();
        const start = new Date(session.start).getTime();
        const end = new Date(session.EndTime).getTime();

        if (now > end) return "cancelled";
        if (now < start) return "waiting";

        return session.RoomStatus; // ใช้ backend ที่เหลือ
    };

    // ✅ Filter sessions
    const filteredSessions = sessions.filter(session => {
        if (filterStatus === "all") return true;
        return getRoomStatus(session) === filterStatus;
    });
    console.log(filteredSessions);


    // ✅ Mutations
    const joinMutation = useMutation({
        mutationFn: joinRoom,
        onSuccess: () => {
            console.log("joinroom");

            queryClient.invalidateQueries({
                queryKey: ["mySessions"],
            });
        }
    });

    const leaveMutation = useMutation({
        mutationFn: completedRoom,
        onSuccess: (data) => {
            alert(data.message);
            queryClient.invalidateQueries({
                queryKey: ["mySessions"],
            });
        },
        onError: (error) => {
            console.error("ERROR:", error);
            const message =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                "เกิดข้อผิดพลาด";

            alert(message);
        }
    });

    // ✅ Handlers
    const handleStartRoom = (roomId) => {
        if (!confirm("คุณต้องการเริ่มต้นการสนทนาในห้องนี้ใช่หรือไม่?")) return;
        joinMutation.mutate(roomId);
    };

    const handleLeave = (roomId, BookingID) => {
        if (!confirm("คุณต้องการจบการสนทนาและออกจากห้องนี้ใช่หรือไม่?")) return;
        console.log(roomId, BookingID);

        leaveMutation.mutate({ roomId, BookingID });
    };

    return (
        <>
            {/* ✅ Filter Buttons */}
            <div className="mb-4">
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 rounded-lg border text-sm font-semibold bg-white"
                >
                    <option value="all">ทั้งหมด</option>
                    <option value="waiting">⏳ กำลังรอ</option>
                    <option value="active">🟢 เปิดใช้งาน</option>
                    <option value="completed">🔒 เสร์จสิ้น</option>
                    <option value="cancelled">❌ ยกเลิก</option>
                </select>
            </div>

            {/* ✅ Session List */}
            {filteredSessions.map(session => {
                const now = new Date();
                const start = new Date(session.StartTime);

                const status = getRoomStatus(session);

                const canStartEarly = (start - now) <= 15 * 60 * 1000;

                return (
                    <div
                        key={session.RoomID}
                        onClick={() => {
                            navigate(`/session?BookingID=${session.BookingID}`);
                            setSelectedRoom(session.RoomID);
                        }}
                        className={`border rounded-xl p-4 mb-4 flex-col justify-between cursor-pointer transition 
                            ${selectedRoom === session.RoomID
                                ? "bg-gray-200 border-black"
                                : "hover:bg-gray-100"}
                        `}
                    >

                        {/* Profile + Info */}
                        <div className="flex py-2">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center mr-2">
                                {user === "user" && (
                                    session?.imageAdvisorUrl
                                        ? <img src={session.imageAdvisorUrl} className="w-full h-full object-cover" alt="profile" />
                                        : "👤"
                                )}
                                {user === "advisor" && (
                                    session?.imageUserUrl
                                        ? <img src={session.imageUserUrl} className="w-full h-full object-cover" alt="profile" />
                                        : "👤"
                                )}
                            </div>

                            <div>
                                <p className="font-semibold">{session.ServiceName}</p>

                                {user === "user"
                                    ? <p className="text-sm text-gray-500">Advisor: {session.AdvisorName}</p>
                                    : <p className="text-sm text-gray-500">Username: {session.UserName}</p>
                                }

                                <p className="text-xs text-gray-400">
                                    {new Date(session.StartTime).toLocaleString("th-TH")}
                                </p>
                            </div>
                        </div>

                        {/* Status */}
                        <p className="text-xs mt-1 mb-2">
                            {status === "waiting" && "⏳ ยังไม่ถึงเวลา"}
                            {status === "active" && "🟢 เข้าได้"}
                            {status === "cancelled" && "🔒 ยกเลิก"}
                            {status === "completed" && "🔒 หมดเวลา"}
                        </p>

                        {/* Buttons */}
                        {user === "advisor" && status === "completed" && (
                            <p className="bg-gray-400 rounded-full px-6 py-3 text-white text-center font-semibold w-full">
                                สิ้นสุด
                            </p>
                        )}

                        {user === "advisor" && status === "waiting" && canStartEarly && (
                            <div className="flex items-center gap-4 bg-green-500 rounded-full px-6 py-3">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleStartRoom(session.RoomID);
                                    }}
                                    className="text-white font-semibold w-full"
                                >
                                    เริ่มห้อง
                                </button>
                            </div>
                        )}

                        {user === "advisor" && status === "active" && (
                            <div className="flex items-center gap-4 bg-red-500 rounded-full px-6 py-3">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        console.log('from test', session.RoomID, session.BookingID);

                                        handleLeave(session.RoomID, session.BookingID);
                                    }}
                                    className="text-white font-semibold w-full"
                                >
                                    จบห้อง
                                </button>
                            </div>
                        )}
                    </div>
                );
            })}
        </>
    );
}