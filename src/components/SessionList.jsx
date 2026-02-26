import { useQuery } from "@tanstack/react-query";
import { fetchMySessions } from "../app/Api";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function SessionList() {
    const [selectedRoom, setSelectedRoom] = useState(null);
    const navigate = useNavigate();
    const { data: sessions = [] } = useQuery({
        queryKey: ["mySessions"],
        queryFn: fetchMySessions,
    });
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
                        className={`border rounded-xl p-4 mb-4 flex justify-between cursor-pointer transition 
                                    ${selectedRoom === session.RoomID ? "bg-gray-200 border-black" : "hover:bg-gray-100"}
                                `}
                    >
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
                            {session.RoomStatus === "closed" && "🔒 หมดเวลา"}
                        </p>
                    </div>
                );

            })}

        </>
    );
}