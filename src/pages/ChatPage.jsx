import React, { useState, useEffect, useRef } from 'react';
import { Phone, Video, Send, Search, X } from "lucide-react";
import NavbarSwitcher from "../app/NavbarSwitcht";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchRooms, createRoom, joinRoom } from "../app/RoomApi";

export default function ChatPage() {
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState('chat'); 
  const [roomData, setRoomData] = useState(null);
  const [myUserName] = useState('Jane Doe');

  const jitsiContainerRef = useRef(null);
  const jitsiApiRef = useRef(null);

  // --- API Queries ---
  const { data: rooms = [] } = useQuery({
    queryKey: ['rooms'],
    queryFn: fetchRooms,
    refetchInterval: 5000, 
  });
  
  const {isFetching} = useQuery({queryKey:['rooms'],queryFn: fetchRooms})
  // --- API Mutations ---
  const createCallMutation = useMutation({
    mutationFn: createRoom,
    onSuccess: (data) => {
      if (data.success) {
        setRoomData(data.room);
        setViewMode('video');
        queryClient.invalidateQueries({ queryKey: ['rooms'] });
      }
    },
    onError: () => alert('ไม่สามารถสร้างห้องได้')
  });

  const joinCallMutation = useMutation({
    mutationFn: ({ id, name }) => joinRoom(id, name),
    onSuccess: (data) => {
      if (data.success) {
        setRoomData(data.room);
        setViewMode('video');
      }
    },
    onError: (err) => alert(err.response?.data?.error || 'เข้าร่วมห้องไม่ได้')
  });

  // --- Jitsi Logic ---
  useEffect(() => {
    // โหลด Script Jitsi
    const script = document.createElement('script');
    script.src = 'https://meet.jit.si/external_api.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (jitsiApiRef.current) jitsiApiRef.current.dispose();
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (viewMode === 'video' && roomData && jitsiContainerRef.current) {
      if (jitsiApiRef.current) jitsiApiRef.current.dispose();

      const options = {
        roomName: roomData.id,
        width: '100%',
        height: '100%',
        parentNode: jitsiContainerRef.current,
        userInfo: { displayName: myUserName },
        interfaceConfigOverwrite: {
          TOOLBAR_BUTTONS: ['microphone', 'camera', 'desktop', 'hangup', 'chat', 'tileview']
        }
      };

      jitsiApiRef.current = new window.JitsiMeetExternalAPI('meet.jit.si', options);
      jitsiApiRef.current.addEventListener('readyToClose', () => endCall());
    }
  }, [viewMode, roomData]);

  const endCall = () => {
    if (jitsiApiRef.current) jitsiApiRef.current.dispose();
    setViewMode('chat');
    setRoomData(null);
  };

  const handleStartCall = () => {
    createCallMutation.mutate({ 
      roomName: `แชทกับ ${myUserName}`, 
      moderatorName: myUserName 
    });
  };

  return (
    <div className="flex flex-col h-screen bg-white font-sans">
      <NavbarSwitcher />
      
      <div className="flex flex-1 overflow-hidden bg-gray-100">
        
        {/* SIDEBAR */}
        <div className="w-80 bg-white border-r flex flex-col shadow-sm">
          <div className="p-4 border-b">
            <h2 className="font-bold text-lg mb-3">ห้องที่กำลังประชุม</h2>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
              <input className="w-full pl-9 pr-4 py-2 bg-gray-100 rounded-lg outline-none text-sm" placeholder="ค้นหาห้อง..." />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {rooms.length === 0 && <p className="text-center text-gray-400 text-sm mt-4 italic">ไม่มีห้องที่เปิดอยู่</p>}
            {rooms.map((room) => (
              <div 
                key={room.id} 
                onClick={() => joinCallMutation.mutate({ id: room.id, name: myUserName })}
                className="flex items-center justify-between p-3 hover:bg-blue-50 rounded-xl cursor-pointer border border-transparent hover:border-blue-100 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <Video size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{room.name}</p>
                    <p className="text-xs text-gray-400">Moderator: {room.moderator}</p>
                  </div>
                </div>
                <div className="bg-blue-600 text-white text-[10px] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                  Join
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MAIN AREA */}
        <div className="flex flex-col flex-1 relative bg-gray-50">
          
          {/* HEADER */}
          <div className="flex items-center justify-between bg-white border-b px-6 py-4 shadow-sm z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">JD</div>
              <div>
                <p className="font-bold text-gray-800">ฝ่ายสนับสนุนลูกค้า</p>
                <p className="text-xs text-green-500 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Online
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={handleStartCall}
                disabled={createCallMutation.isPending}
                className={`p-2.5 rounded-full transition-all ${
                  viewMode === 'video' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-blue-600 hover:text-white'
                }`}
              >
                {createCallMutation.isPending ? <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <Video size={22} />}
              </button>
              <button className="p-2.5 rounded-full bg-gray-100 text-gray-600 hover:bg-green-600 hover:text-white transition-all">
                <Phone size={22} />
              </button>
            </div>
          </div>

          {/* CONTENT AREA */}
          <div className="flex-1 overflow-hidden relative">
            
            {/* JITSI LAYER */}
            {viewMode === 'video' && (
              <div className="absolute inset-0 z-20 bg-black flex flex-col">
                <div className="p-3 bg-gray-900 text-white flex justify-between items-center px-6 border-b border-gray-800">
                  <div className="flex items-center gap-4 text-sm font-medium">
                    <span className="bg-blue-600 px-3 py-1 rounded-md">LIVE</span>
                    <span className="text-gray-300">Room: {roomData?.name}</span>
                  </div>
                  <button onClick={endCall} className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg flex items-center gap-2 text-sm font-bold transition-all shadow-lg">
                    <X size={16} /> วางสาย
                  </button>
                </div>
                <div className="flex-1" ref={jitsiContainerRef} />
              </div>
            )}

            {/* CHAT LAYER */}
            <div className={`flex flex-col h-full transition-all duration-300 ${viewMode === 'video' ? 'blur-md opacity-0 pointer-events-none' : 'opacity-100'}`}>
              <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                <div className="flex justify-start">
                  <div className="max-w-md p-4 rounded-2xl rounded-bl-none shadow-sm bg-white border border-gray-200 text-gray-700 leading-relaxed">
                    สวัสดีค่ะ ยินดีต้อนรับสู่บริการช่วยเหลือลูกค้า หากต้องการคุยผ่านวิดีโอ กดที่ปุ่ม <Video className="inline w-4 h-4" /> ด้านบนได้เลยค่ะ
                  </div>
                </div>
              </div>

              {/* INPUT */}
              <div className="p-4 bg-white border-t">
                <div className="max-w-4xl mx-auto flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                  <input
                    className="flex-1 bg-transparent outline-none text-gray-700 py-2"
                    placeholder="พิมพ์ข้อความที่นี่..."
                  />
                  <button className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-md active:scale-95">
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="fixed bottom-4 right-4 text-xs text-gray-400">
  {isFetching ? "🔄 กำลังอัปเดตข้อมูล..." : "✅ ข้อมูลเป็นปัจจุบัน"}
</div>
    </div>
  );
}