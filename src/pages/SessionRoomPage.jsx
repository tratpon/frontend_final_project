import React, { useState, useEffect, useRef, useMemo } from "react";
import { Video, Menu, X } from "lucide-react";
import NavbarSwitcher from "../app/NavbarSwitcht";
import { useQuery } from "@tanstack/react-query";
import {
  getRoomByBooking,
  fetchMessages,
  getRoomByBookingAdvisor,
} from "../app/Api";
import SessionList from "../components/SessionList";
import { useSearchParams } from "react-router-dom";
import { createSocket } from "../app/socket";
import { useAuth } from "../contexts/AuthContext";
import { useVideo } from "../contexts/VideoContext";

export default function SessionRoom() {
  const [searchParams] = useSearchParams();
  const BookingID = searchParams.get("BookingID");
  const [isCalling, setIsCalling] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const socketRef = useRef(null);
  const bottomRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [text, setText] = useState("");
  const [previewImageUrl, setPreviewImageUrl] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const { startCall } = useVideo();
  const { user } = useAuth();


  // ✅ 1. สกัดค่าจาก user object ให้เป็น String เพื่อป้องกัน Loop
  // ถ้า user เป็น object ให้ดึง role/id ออกมา ถ้าเป็น string อยู่แล้วก็ใช้เลย
  const myRole = useMemo(() => {
    if (typeof user === "string") return user;
    return user?.role || "user";
  }, [user]);

  const myIdFromAuth = useMemo(() => {
    if (typeof user === "object") return user?.id || user?.UserID;
    return user;
  }, [user]);

  // ✅ 2. QUERY ข้อมูลห้อง (ใช้ myRole ที่เป็น string ใน queryKey)
  const { data: roomInfo, isLoading: isRoomLoading } = useQuery({
    queryKey: ["roomByBooking", BookingID, myRole],
    queryFn: () =>
      myRole === "user"
        ? getRoomByBooking(BookingID)
        : getRoomByBookingAdvisor(BookingID),
    enabled: !!BookingID && !!myRole,
    staleTime: 1000 * 60 * 5, // ป้องกันการ Fetch ซ้ำซ้อนเมื่อเปลี่ยนหน้าจอ
  });

  const myId = myRole === "advisor" ? roomInfo?.AdvisorID : roomInfo?.UserID;
  const myUserName = myRole === "advisor" ? roomInfo?.AdvisorName : roomInfo?.UserName;

  // ✅ 3. QUERY ข้อความเก่า
  const { data: oldMessages } = useQuery({
    queryKey: ["messages", roomInfo?.RoomID],
    queryFn: () => fetchMessages(roomInfo.RoomID),
    enabled: !!roomInfo?.RoomID,
  });



  // Sync ข้อความเมื่อมีการเปลี่ยนห้องหรือโหลดข้อมูลเสร็จ
  useEffect(() => {
    if (oldMessages) {
      setMessages(oldMessages);
    } else {
      setMessages([]);
    }
  }, [oldMessages, roomInfo?.RoomID]);



  // ✅ 4. SOCKET (จัดการเรื่องการ Connect/Disconnect ให้สะอาด)
  useEffect(() => {
    if (!roomInfo?.RoomID || !myId) return;

    let isComponentMounted = true;

    async function setupSocket() {
      const socket = await createSocket();

      if (!isComponentMounted) {
        socket.disconnect();
        return;
      }

      socketRef.current = socket;
      socket.emit("joinRoom", roomInfo.RoomID);


      socket.off("callStarted");
      socket.on("callStarted", () => {
        console.log("📞 call start");
        setIsCalling(true);
      });

      socket.off("callEnded");
      socket.on("callEnded", () => {
        console.log("❌ call end");
        setIsCalling(false);
      });

      // ล้าง listener เก่าก่อนเสมอเพื่อกันข้อความซ้ำ
      socket.off("newMessage");
      socket.on("newMessage", (msg) => {
        setMessages((prev) => [...prev, msg]);
      });


    }

    setupSocket();

    return () => {
      isComponentMounted = false;
      if (socketRef.current) {
        socketRef.current.off("newMessage");
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [roomInfo?.RoomID, myId]);

  const handleUploadFile = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("upload_preset", "final_project");

    const res = await fetch(
      import.meta.env.VITE_API_cloudinary_upload,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    console.log(data.secure_url);

    // 🔥 ส่งเข้า socket
    socketRef.current.emit("sendFile", {
      roomId: roomInfo.RoomID,
      fileUrl: data.secure_url,
    });

    setSelectedFile(null);
  };

  const sendMessage = () => {
    if (!text.trim() || !socketRef.current) return;

    socketRef.current.emit("sendMessage", {
      roomId: roomInfo.RoomID,
      messageText: text,
      senderId: myId,
      senderRole: myRole
    });

    setText("");
  };

  const handleStartCall = () => {
    startCall(roomInfo.RoomURL);

    const now = new Date();

    socketRef.current.emit("startCall", {
      roomId: roomInfo.RoomID
    });

    // ✅ ส่ง message เข้า chat
    socketRef.current.emit("sendMessage", {
      roomId: roomInfo.RoomID,
      messageText: `📞 เริ่มการโทร ${formatTime(now)}`,
      senderId: myId,
      senderRole: myRole
    });

    setIsCalling(true);
  };

  const handleEndCall = () => {
    const now = new Date();

    socketRef.current.emit("endCall", {
      roomId: roomInfo.RoomID
    });

    // ✅ ส่ง message เข้า chat
    socketRef.current.emit("sendMessage", {
      roomId: roomInfo.RoomID,
      messageText: `❌ วางสาย ${formatTime(now)}`,
      senderId: myId,
      senderRole: myRole
    });

    setIsCalling(false);
  };



  // Auto Scroll เมื่อมีข้อความใหม่
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  const formatTime = (date) => {
    const d = new Date(date);
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  };

  if (isRoomLoading) return <div className="h-screen flex items-center justify-center text-gray-500">กำลังโหลด...</div>;

  return (
    <div className="flex flex-col h-screen bg-white">
      <NavbarSwitcher />

      <div className="flex flex-1 overflow-hidden relative">
        {/* MOBILE SIDEBAR */}
        {showSidebar && (
          <div className="fixed inset-0 bg-black/50 z-50 md:hidden" onClick={() => setShowSidebar(false)}>
            <div className="w-72 bg-white h-full p-4 shadow-xl" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6">
                <span className="font-bold">ห้องแชท</span>
                <X className="cursor-pointer text-gray-400" onClick={() => setShowSidebar(false)} />
              </div>
              <SessionList />
            </div>
          </div>
        )}

        {/* DESKTOP SIDEBAR */}
        <div className="hidden md:flex w-72 bg-white border-r flex-col">
          <div className="p-4 border-b bg-gray-50 font-bold text-lg">
            Sessions
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            <SessionList />
          </div>
        </div>

        {/* MAIN AREA */}
        <div className="flex-1 flex flex-col bg-gray-50">
          {/* HEADER */}
          <div className="flex items-center justify-between px-4 py-3 bg-white border-b shadow-sm">
            <button onClick={() => setShowSidebar(true)} className="md:hidden">
              <Menu size={20} />
            </button>


            <div className="text-center">
              <h3 className="text-sm font-bold text-gray-800">{roomInfo?.ServiceName || "Chat"}</h3>
              <p className="text-[10px] text-green-500 uppercase font-semibold"> ● {roomInfo?.RoomStatus}</p>
            </div>

            <div>
              <button
                onClick={() => {
                  if (roomInfo?.RoomStatus === "active") {
                    handleStartCall();
                  }
                }}
                className={`p-2 rounded-full transition ${roomInfo?.RoomStatus === "active"
                  ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
                  : "text-gray-300 cursor-not-allowed"
                  }`}
              >
                <Video size={22} />
              </button>
              <p className="text-[10px] text-green-500 uppercase font-semibold">
                {isCalling && " • มีคนเริ่มประชุม"}

              </p>
              {isCalling && (
                <button onClick={handleEndCall} className="text-red-500">
                  ปิด vediocall
                </button>
              )}
            </div>


          </div>

          {/* MESSAGES */}
          {/* MESSAGES */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <p className="text-center text-gray-400 text-xs mt-10">ยังไม่มีข้อความ</p>
            )}

            {messages.map((msg, i) => {
              const content = msg.content || msg.MessageText;
              const isMine =
                String(msg.SenderID) === String(myId) &&
                msg.SenderRole === myRole;

              const isSystem =
                content?.includes("📞") ||
                content?.includes("❌");

              // ✅ SYSTEM MESSAGE (อยู่กลางจอ)
              if (isSystem) {
                return (
                  <div key={i} className="text-center text-xs text-gray-400">
                    {content}
                  </div>
                );
              }

              if (msg.Type === "file") {
                const url = content;

                if (url.match(/\.(jpg|jpeg|png|webp|gif)$/i)) {
                  return (
                    <div key={i} className={isMine ? "text-right" : ""}>
                      <img
                        src={url}
                        alt="chat-attachment"
                        className="w-40 rounded-lg inline cursor-pointer hover:brightness-90 transition active:scale-95"
                        onClick={() => setSelectedImage(url)} // ✅ กดแล้วตั้งค่า State เพื่อขยายรูป
                      />
                    </div>
                  );
                }


                if (url.match(/\.pdf$/i)) {
                  return (
                    <a key={i} href={url} target="_blank" className="text-red-500 underline">
                      📄 เปิด PDF
                    </a>
                  );
                }

                return (
                  <a key={i} href={url} target="_blank" className="text-blue-500 underline">
                    📎 ดาวน์โหลดไฟล์
                  </a>
                );
              }

              // ✅ NORMAL MESSAGE
              return (
                <div
                  key={i}
                  className={`flex flex-col ${isMine ? "items-end" : "items-start"
                    }`}
                >
                  {/* bubble */}
                  <div
                    className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm shadow-sm ${isMine
                      ? "bg-blue-600 text-white"
                      : "bg-white border text-gray-700"
                      }`}
                  >
                    {content}
                  </div>

                  {/* time */}
                  <span className="text-[10px] text-gray-400 mt-1">
                    {formatTime(
                      msg.CreatedAt || msg.createdAt || new Date()
                    )}
                  </span>
                </div>
              );
            })}

            <div ref={bottomRef} />
          </div>
          {/* IMAGE LIGHTBOX MODAL */}
          {
            selectedImage && (
              <div
                className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4"
                onClick={() => setSelectedImage(null)} // คลิกพื้นหลังเพื่อปิด
              >
                <button
                  className="absolute top-5 right-5 text-white bg-white/10 p-2 rounded-full hover:bg-white/20 transition"
                  onClick={() => setSelectedImage(null)}
                >
                  <X size={30} />
                </button>

                <img
                  src={selectedImage}
                  alt="Full view"
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-in zoom-in duration-200"
                  onClick={(e) => e.stopPropagation()} // คลิกที่รูปจะไม่ปิด Modal
                />
              </div>
            )
          }
          {selectedFile && (
            <div className="p-2 bg-gray-100 border-t">
              <p className="text-xs">Preview:</p>

              {selectedFile.type.startsWith("image/") && (
                <img src={selectedFile.preview} className="w-32 rounded" />
              )}

              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleUploadFile}
                  className="text-blue-500 text-sm"
                >
                  ส่งไฟล์
                </button>

                <button
                  onClick={() => setSelectedFile(null)}
                  className="text-red-500 text-sm"
                >
                  ยกเลิก
                </button>
              </div>
            </div>
          )}
          {/* INPUT */}
          {roomInfo?.RoomStatus === "active" ? (

            <div className="p-3 bg-white border-t">

              <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 focus-within:ring-1 ring-blue-300">
                <input
                  type="file"
                  hidden
                  id="fileInput"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;

                    file.preview = URL.createObjectURL(file);
                    setSelectedFile(file);
                  }}
                />

                <label htmlFor="fileInput" className="cursor-pointer">
                  📎
                </label>
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  className="flex-1 bg-transparent outline-none text-sm"
                  placeholder="เขียนข้อความ..."
                />
                <button
                  onClick={sendMessage}
                  disabled={!text.trim()}
                  className="text-blue-600 font-bold text-sm disabled:opacity-40"
                >
                  ส่ง
                </button>
              </div>
            </div>
          ) : (
            <div className="p-3 text-center text-gray-400 text-xs bg-gray-50">
              การสนทนาสิ้นสุดลงแล้ว
            </div>
          )}
        </div>
      </div>
    </div>
  );
}