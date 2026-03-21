import React, { useState, useEffect, useRef } from "react";
import { Search, Video } from "lucide-react";
import NavbarSwitcher from "../app/NavbarSwitcht";
import { useQuery } from "@tanstack/react-query";
import { getRoomByBooking, fetchMessages, getRoomByBookingAdvisor } from "../app/Api";
import SessionList from "../components/SessionList";
import { useSearchParams } from "react-router-dom";
import { createSocket } from "../app/socket";
import { useAuth } from "../contexts/authContext";
import { useVideo } from "../contexts/VideoContext";

export default function SessionRoom() {
    const [searchParams] = useSearchParams();
    const BookingID = searchParams.get("BookingID");

    const [showSidebar, setShowSidebar] = useState(false);

    const socketRef = useRef(null);
    const bottomRef = useRef(null);

    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");

    const { startCall } = useVideo();
    const { user } = useAuth();

    // -------- QUERY --------
    const { data: roomInfo } = useQuery({
        queryKey: ["roomByBooking", BookingID, user],
        queryFn: () =>
            user === "user"
                ? getRoomByBooking(BookingID)
                : getRoomByBookingAdvisor(BookingID),
        enabled: !!BookingID && !!user,
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

    const { data: oldMessages = [] } = useQuery({
        queryKey: ["messages", roomInfo?.RoomID],
        queryFn: () => fetchMessages(roomInfo.RoomID),
        enabled: !!roomInfo?.RoomID,
    });

    useEffect(() => {
        if (oldMessages.length > 0) {
            setMessages(oldMessages);
        }
    }, [oldMessages]);

    // -------- SOCKET --------
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
            socket?.disconnect();
        };
    }, [roomInfo?.RoomID, myId]);

    const sendMessage = () => {
        if (!text.trim()) return;

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

            <div className="flex flex-1 overflow-hidden">

                {/* ✅ MOBILE SIDEBAR (overlay) */}
                {showSidebar && (
                    <div className="fixed inset-0 bg-black/40 z-40 md:hidden">
                        <div className="w-72 bg-white h-full p-3">
                            <button
                                onClick={() => setShowSidebar(false)}
                                className="mb-3 text-sm"
                            >
                                ❌ ปิด
                            </button>
                            <SessionList />
                        </div>
                    </div>
                )}

                {/* ✅ DESKTOP SIDEBAR */}
                <div className="hidden md:flex w-72 bg-white border-r flex-col">
                    <div className="p-4 border-b">
                        <h2 className="font-bold text-lg">Sessions</h2>
                    </div>
                    <div className="flex-1 overflow-y-auto p-3">
                        <SessionList />
                    </div>
                </div>

                {/* MAIN */}
                <div className="flex-1 flex flex-col">

                    {/* HEADER */}
                    <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-gray-200">

                        {/* 🔥 MOBILE MENU BUTTON */}
                        <button
                            onClick={() => setShowSidebar(true)}
                            className="md:hidden text-sm"
                        >
                            ☰
                        </button>

                        <p className="text-sm truncate">
                            {roomInfo?.ServiceName}
                        </p>

                        <Video
                            className={`${
                                roomInfo?.RoomStatus === "active"
                                    ? "cursor-pointer"
                                    : "text-gray-400"
                            }`}
                            onClick={() => {
                                if (roomInfo?.RoomStatus !== "active") return;
                                startCall(roomInfo.RoomURL, myUserName);
                            }}
                        />
                    </div>

                    {/* CHAT */}
                    <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-2 sm:space-y-3">
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
                                        className={`px-3 py-2 rounded-xl max-w-[75%] text-sm ${
                                            isMine
                                                ? "bg-blue-500 text-white"
                                                : "bg-white border"
                                        }`}
                                    >
                                        {msg.MessageText}
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={bottomRef} />
                    </div>

                    {/* INPUT */}
                    {roomInfo?.RoomStatus === "active" && (
                        <div className="p-3 sm:p-4 bg-gray-100">
                            <div className="flex items-center gap-2 sm:gap-4 bg-white rounded-full px-4 py-2">
                                <input
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    className="flex-1 outline-none text-sm"
                                    placeholder="พิมพ์ข้อความ..."
                                />
                                <button
                                    onClick={sendMessage}
                                    className="text-blue-500 text-sm font-semibold"
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