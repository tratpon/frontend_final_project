import React, { useState, useEffect, useRef } from "react";
import { Search, Video, X } from "lucide-react";
import NavbarSwitcher from "../app/NavbarSwitcht";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
    getRoomByBooking,
    joinRoom,
    leaveRoom,
    fetchMessages
} from "../app/Api";
import SessionList from "../components/SessionList";
import { useSearchParams } from "react-router-dom";
import { createSocket } from "../app/socket";
import { useAuth } from "../contexts/authContext";

export default function SessionRoom() {

    const [searchParams] = useSearchParams();
    const BookingID = searchParams.get("BookingID");

    const socketRef = useRef(null);
    const bottomRef = useRef(null);
    const joinedRef = useRef(false);

    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [viewMode, setViewMode] = useState("default");

    const { user } = useAuth();

    // ---------------- GET ROOM ----------------
    const { data: roomInfo } = useQuery({
        queryKey: ["roomByBooking", BookingID],
        queryFn: () => getRoomByBooking(BookingID),
        enabled: !!BookingID,
        refetchOnWindowFocus: false
    });

    // role + id
    const myRole = user;
    const myId = myRole === "advisor"
        ? roomInfo?.AdvisorID
        : roomInfo?.UserID;

    // ---------------- OLD MESSAGES ----------------
    const { data: oldMessages = [] } = useQuery({
        queryKey: ["messages", roomInfo?.RoomID],
        queryFn: () => fetchMessages(roomInfo.RoomID),
        enabled: !!roomInfo?.RoomID,
        refetchOnWindowFocus: false
    });

    useEffect(() => {
        setMessages(prev => {
            if (JSON.stringify(prev) === JSON.stringify(oldMessages)) return prev;
            return oldMessages;
        });
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

                setMessages(prev => {

                    const withoutOptimistic = prev.filter(
                        m => !(
                            m.tempId &&
                            m.MessageText === msg.MessageText &&
                            m.SenderID === myId
                        )
                    );

                    const exists = withoutOptimistic.some(
                        m =>
                            !m.tempId &&
                            m.SenderID === msg.SenderID &&
                            m.MessageText === msg.MessageText &&
                            m.CreatedAt === msg.CreatedAt
                    );

                    if (exists) return withoutOptimistic;

                    return [...withoutOptimistic, msg];
                });

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

    // ---------------- SEND MESSAGE ----------------
    const sendMessage = () => {

        if (!text.trim() || !socketRef.current) return;

        const tempId = `temp-${Date.now()}`;

        const optimisticMsg = {
            tempId,
            SenderID: myId,
            SenderRole: myRole,
            MessageText: text,
            CreatedAt: new Date().toISOString()
        };

        setMessages(prev => [...prev, optimisticMsg]);

        socketRef.current.emit("sendMessage", {
            roomId: roomInfo.RoomID,
            messageText: text
        });

        setText("");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    // ---------------- AUTO SCROLL ----------------
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // ---------------- JOIN / LEAVE ----------------
    const joinMutation = useMutation({
        mutationFn: joinRoom,
        onSuccess: () => setViewMode("chat")
    });

    const leaveMutation = useMutation({
        mutationFn: leaveRoom
    });

    useEffect(() => {

        if (!roomInfo?.RoomID) return;
        if (joinedRef.current) return;

        joinedRef.current = true;
        joinMutation.mutate(roomInfo.RoomID);

        return () => {
            leaveMutation.mutate(roomInfo.RoomID);
            joinedRef.current = false;
        };

    }, [roomInfo?.RoomID]);

    // ---------------- UI ----------------
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
                            className="cursor-pointer hover:text-blue-600"
                            onClick={() => setViewMode(prev => prev === "video" ? "chat" : "video")}
                        />
                    </div>

                    {viewMode === "video" ? (

                        <div className="flex-1 flex flex-col items-center justify-center bg-black gap-4">
                            <p className="text-white text-lg">Video Call</p>
                            <button
                                className="mt-4 flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full"
                                onClick={() => setViewMode("chat")}
                            >
                                <X size={16} /> ออกจาก Video
                            </button>
                        </div>

                    ) : (

                        <>
                            <div className="flex-1 overflow-y-auto p-6 space-y-3">
                                {messages.map((msg, i) => {

                                    const isMine =
                                        msg.SenderID === myId &&
                                        msg.SenderRole === myRole;

                                    return (
                                        <div
                                            key={msg.tempId ?? msg.MessageID ?? i}
                                            className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                                        >
                                            <div className={`p-3 rounded-xl border max-w-xs text-sm ${
                                                isMine
                                                    ? "bg-blue-500 text-white border-blue-500"
                                                    : "bg-white text-gray-800"
                                            } ${msg.tempId ? "opacity-70" : "opacity-100"}`}>
                                                {msg.MessageText}
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={bottomRef} />
                            </div>

                            <div className="p-4 bg-gray-200">
                                <div className="flex items-center gap-4 bg-white rounded-full px-6 py-3">
                                    <input
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                        onKeyDown={handleKeyDown}
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
                        </>
                    )}

                </div>

            </div>
        </div>
    );
}