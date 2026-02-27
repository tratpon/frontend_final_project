import React, { useState, useEffect, useRef } from "react";
import { Search, Video } from "lucide-react";
import NavbarSwitcher from "../app/NavbarSwitcht";
import { useQuery } from "@tanstack/react-query";
import { getRoomByBooking, fetchMessages } from "../app/Api";
import SessionList from "../components/SessionList";
import { useSearchParams } from "react-router-dom";
import { createSocket } from "../app/socket";
import { useAuth } from "../contexts/AuthContext";
import { useVideo } from "../contexts/VideoContext";

export default function SessionRoom() {
    const [searchParams] = useSearchParams();
    const BookingID = searchParams.get("BookingID");

    const socketRef = useRef(null);
    const bottomRef = useRef(null);

    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");

    const { startCall } = useVideo();
    const { user } = useAuth();

    // ---------------- GET ROOM ----------------
    const { data: roomInfo } = useQuery({
        queryKey: ["roomByBooking", BookingID],
        queryFn: () => getRoomByBooking(BookingID),
        enabled: !!BookingID,
        refetchOnWindowFocus: false
    });

    const myRole = user;

    const myId =
        myRole === "advisor"
            ? roomInfo?.AdvisorID
            : roomInfo?.UserID;

    const myUserName =
        myRole === "advisor"
            ? roomInfo?.AdvisorName
            : roomInfo?.UserName;

    // ---------------- OLD MESSAGES ----------------
    const { data: oldMessages = [] } = useQuery({
        queryKey: ["messages", roomInfo?.RoomID],
        queryFn: () => fetchMessages(roomInfo.RoomID),
        enabled: !!roomInfo?.RoomID,
        refetchOnWindowFocus: false
    });

    useEffect(() => {
        setMessages(oldMessages);
    }, [oldMessages]);

    // ---------------- SOCKET ----------------
    useEffect(() => {
        if (!roomInfo?.RoomID || !myId) return;

        let socket;

        async function connectSocket() {
            socket = await createSocket();
            socketRef.current = socket;

            socket.emit("joinRoom", roomInfo.RoomID);

            socket.on("newMessage", (msg) => {
                setMessages((prev) => [...prev, msg]);
            });
        }

        connectSocket();

        return () => {
            if (socket) {
                socket.off("newMessage");
                socket.disconnect();
            }
        };
    }, [roomInfo?.RoomID, myId]);

    const sendMessage = () => {
        if (!text.trim() || !socketRef.current) return;

        const optimisticMsg = {
            SenderID: myId,
            SenderRole: myRole,
            MessageText: text,
            CreatedAt: new Date().toISOString()
        };

        setMessages((prev) => [...prev, optimisticMsg]);

        socketRef.current.emit("sendMessage", {
            roomId: roomInfo.RoomID,
            messageText: text
        });

        setText("");
    };

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="flex flex-col h-screen bg-white">
            <NavbarSwitcher />

            <div className="flex flex-1 overflow-hidden bg-gray-100">
                {/* SIDEBAR */}
                <div className="w-80 bg-white border-r flex flex-col">
                    <div className="p-4 border-b">
                        <h2 className="font-bold text-lg mb-3">Booking Sessions</h2>
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                            <input
                                className="w-full pl-9 pr-4 py-2 bg-gray-100 rounded-lg outline-none text-sm"
                                placeholder="ค้นหา..."
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-3">
                        <SessionList />
                    </div>
                </div>

                {/* MAIN */}
                <div className="flex-1 flex flex-col h-full">
                    {/* HEADER */}
                    <div className="flex items-center justify-between bg-gray-300 px-6 py-4">
                        <div>
                            <p className="font-semibold">{roomInfo?.AdvisorName}</p>
                            <p className="text-sm text-gray-500">{roomInfo?.ServiceName}</p>
                        </div>

                        <Video
                            className={`${
                                roomInfo?.RoomStatus === "active"
                                    ? "cursor-pointer hover:text-blue-600"
                                    : "text-gray-400 cursor-not-allowed"
                            }`}
                            onClick={() => {
                                if (roomInfo?.RoomStatus !== "active") return;
                                startCall("ewewewewewee", myUserName);
                            }}
                        />
                    </div>

                    {/* CHAT */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-3">
                        {messages.map((msg, i) => {
                            const isMine =
                                msg.SenderID === myId &&
                                msg.SenderRole === myRole;

                            return (
                                <div
                                    key={i}
                                    className={`flex ${
                                        isMine ? "justify-end" : "justify-start"
                                    }`}
                                >
                                    <div
                                        className={`p-3 rounded-xl border max-w-xs text-sm ${
                                            isMine
                                                ? "bg-blue-500 text-white border-blue-500"
                                                : "bg-white text-gray-800"
                                        }`}
                                    >
                                        {msg.MessageText}
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={bottomRef} />
                    </div>

                    {roomInfo?.RoomStatus === "active" && (
                        <div className="p-4 bg-gray-200">
                            <div className="flex items-center gap-4 bg-white rounded-full px-6 py-3">
                                <input
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    className="flex-1 outline-none text-sm"
                                    placeholder="พิมพ์ข้อความ..."
                                />
                                <button
                                    onClick={sendMessage}
                                    className="text-blue-500 font-semibold"
                                >
                                    ส่ง
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}