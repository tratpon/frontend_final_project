import React, { useState, useEffect, useRef } from "react";
import { Video, Search, X } from "lucide-react";
import NavbarSwitcher from "../app/NavbarSwitcht";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchMySessions, joinFromBooking } from "../app/Api";

export default function ChatPage() {

  const [viewMode, setViewMode] = useState("chat");
  const [roomData, setRoomData] = useState(null);
  const [myUserName] = useState("My Name");

  const jitsiContainerRef = useRef(null);
  const jitsiApiRef = useRef(null);

  // ✅ Fetch booking sessions (Chat ที่ผูกกับ Booking)
  const { data: sessions = [], isFetching } = useQuery({
    queryKey: ["mySessions"],
    queryFn: fetchMySessions,
    refetchInterval: 10000,
  });

  // ✅ Join room จาก booking
  const joinMutation = useMutation({
    mutationFn: joinFromBooking,

    onSuccess: (data) => {
      setRoomData({ id: data.roomName });
      setViewMode("video");
    },

    onError: (err) => {
      alert(err.response?.data?.msg || "Cannot join room");
    }
  });

  // โหลด Jitsi script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://meet.jit.si/external_api.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (jitsiApiRef.current) jitsiApiRef.current.dispose();
      document.body.removeChild(script);
    };
  }, []);

  // เปิด Jitsi เมื่อ join สำเร็จ
  useEffect(() => {
    if (viewMode === "video" && roomData && jitsiContainerRef.current) {

      if (jitsiApiRef.current) {
        jitsiApiRef.current.dispose();
      }

      const options = {
        roomName: roomData.id,
        width: "100%",
        height: "100%",
        parentNode: jitsiContainerRef.current,
        userInfo: {
          displayName: myUserName
        },
        interfaceConfigOverwrite: {
          TOOLBAR_BUTTONS: [
            "microphone",
            "camera",
            "desktop",
            "hangup",
            "chat",
            "tileview"
          ]
        }
      };

      jitsiApiRef.current = new window.JitsiMeetExternalAPI(
        "meet.jit.si",
        options
      );

      jitsiApiRef.current.addEventListener("readyToClose", () => endCall());
    }
  }, [viewMode, roomData]);

  const endCall = () => {
    if (jitsiApiRef.current) jitsiApiRef.current.dispose();
    setViewMode("chat");
    setRoomData(null);
  };

  return (
    <div className="flex flex-col h-screen bg-white">

      <NavbarSwitcher />

      <div className="flex flex-1 overflow-hidden bg-gray-100">

        {/* SIDEBAR */}
        <div className="w-80 bg-white border-r flex flex-col">

          <div className="p-4 border-b">
            <h2 className="font-bold text-lg mb-3">
              Booking Sessions
            </h2>

            <div className="relative">
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={16}
              />
              <input
                className="w-full pl-9 pr-4 py-2 bg-gray-100 rounded-lg outline-none text-sm"
                placeholder="ค้นหา..."
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">

            {sessions.length === 0 && (
              <p className="text-center text-gray-400 text-sm mt-4">
                ไม่มี session
              </p>
            )}

            {sessions.map((room) => (
              <div
                key={room.ChatID}
                className="p-3 bg-gray-50 rounded-xl border"
              >
                <p className="text-sm font-semibold">
                  Booking #{room.BookID}
                </p>

                <p className="text-xs text-gray-400">
                  {new Date(room.StartTime).toLocaleString()}
                </p>

                <p className="text-xs mt-1 mb-2">
                  {room.Status === "waiting" && "⏳ ยังไม่ถึงเวลา"}
                  {room.Status === "active" && "🟢 เข้าได้"}
                  {room.Status === "closed" && "🔒 หมดเวลา"}
                </p>

                <button
                  disabled={room.Status !== "active"}
                  onClick={() =>
                    joinMutation.mutate(room.BookID)
                  }
                  className={`w-full py-2 rounded-lg text-sm font-semibold transition
                    ${
                      room.Status === "active"
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }
                  `}
                >
                  <Video size={16} className="inline mr-1" />
                  Join Room
                </button>

              </div>
            ))}

          </div>
        </div>

        {/* MAIN AREA */}
        <div className="flex-1 relative bg-black">

          {viewMode === "video" && (
            <div className="absolute inset-0 flex flex-col">

              <div className="bg-gray-900 text-white p-3 flex justify-between items-center">
                <span>LIVE SESSION</span>

                <button
                  onClick={endCall}
                  className="bg-red-500 px-4 py-1 rounded-lg flex items-center gap-2"
                >
                  <X size={16} />
                  End
                </button>
              </div>

              <div
                className="flex-1"
                ref={jitsiContainerRef}
              />
            </div>
          )}

          {viewMode === "chat" && (
            <div className="flex items-center justify-center h-full text-gray-400">
              เลือก Booking เพื่อเข้าห้อง
            </div>
          )}

        </div>
      </div>

      <div className="fixed bottom-4 right-4 text-xs text-gray-400">
        {isFetching ? "🔄 กำลังอัปเดต..." : "✅ ล่าสุด"}
      </div>

    </div>
  );
}