import { useQuery, useMutation ,useQueryClient  } from "@tanstack/react-query";
import { fetchMySessions, joinRoom, leaveRoom } from "../app/Api";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";



export default function SessionList() {
    const [selectedRoom, setSelectedRoom] = useState(null);
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { user } = useAuth();

    const { data: sessions = [] } = useQuery({
        queryKey: ["mySessions"],
        queryFn: fetchMySessions,
    });
    console.log(sessions, selectedRoom)

    const joinMutation = useMutation({
        mutationFn: joinRoom,
        onSuccess: () => {
        queryClient.invalidateQueries(["mySessions"]);
    }
    });

    const leaveMutation = useMutation({
        mutationFn: leaveRoom,
        onSuccess: () => {
        queryClient.invalidateQueries(["mySessions"]);
    }
    });

    const handleStartRoom = (roomId) => {
        if (!confirm("Do you want to start this room?")) return;
        joinMutation.mutate(roomId);
    };

    const handleLeave = (roomId) => {
        if (!confirm("Do you want to end this room?")) return;
        leaveMutation.mutate(roomId);
    };
    console.log(sessions)
    return (
        <>
            {sessions.map(session => {
                const now = new Date();
                const start = new Date(session.StartTime);
                const end = new Date(session.EndTime);

                let status = "completed";
                if (now < start) status = "waiting";
                else if (now >= start && now <= end) status = "active";

                return (
                    <div
                        key={session.RoomID}
                        onClick={() => { navigate(`/session?BookingID=${session.BookingID}`), setSelectedRoom(session.RoomID) }}
                        className={`border rounded-xl p-4 mb-4 flex-col justify-between cursor-pointer transition 
                                    ${selectedRoom === session.RoomID ? "bg-gray-200 border-black" : "hover:bg-gray-100"}
                                `}
                    >
                        <div className="flex py-2">
                            <div>
                                <p className="font-semibold">{session.ServiceName}</p>
                                <p className="text-sm text-gray-500">
                                    Advisor: {session.AdvisorName}
                                </p>
                                <p className="text-xs text-gray-400">
                                    {new Date(session.StartTime).toLocaleString()}
                                </p>
                            </div>

                            <p className="text-xs mt-1 mb-2">
                                {session.RoomStatus === "waiting" && "⏳ ยังไม่ถึงเวลา"}
                                {session.RoomStatus === "active" && "🟢 เข้าได้"}
                                {session.RoomStatus === "cancelled" && "🔒 ยกเลิก"}
                                {session.RoomStatus === "completed" && "🔒 หมดเวลา"}
                            </p>
                        </div>
                        
                        {user === "advisor" && session.RoomStatus === "completed" && (
                            <p className=" gap-4 bg-gray-400 rounded-full px-6 py-3 text-white text-center font-semibold w-full">
                                completed
                            </p>
                        )}

                        {user === "advisor" && session.RoomStatus === "waiting" && (
                            <div className="flex items-center gap-4 bg-green-500 rounded-full px-6 py-3">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleStartRoom(session.RoomID);
                                    }}
                                    className="text-white font-semibold w-full"
                                >
                                    Start Room
                                </button>
                            </div>
                        )}
                        {user === "advisor" && session.RoomStatus === "active" && (
                            <div className="flex items-center gap-4 bg-red-500 rounded-full px-6 py-3">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleLeave(session.RoomID);
                                    }}
                                    className="text-white font-semibold w-full"
                                >
                                    End Room
                                </button>
                            </div>
                        )}
                    </div>
                );

            })}

        </>
    );
}