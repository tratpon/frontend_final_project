import { createContext, useContext, useRef, useState, useEffect } from "react";

const VideoContext = createContext();

export function VideoProvider({ children }) {
    const jitsiApiRef = useRef(null);
    const containerRef = useRef(null);

    const [roomId, setRoomId] = useState(null);
    const [displayName, setDisplayName] = useState("");
    const [isMinimized, setIsMinimized] = useState(false);

    // โหลด script
    useEffect(() => {
        if (window.JitsiMeetExternalAPI) return;

        const script = document.createElement("script");
        script.src = "https://meet.jit.si/external_api.js";
        script.async = true;
        document.body.appendChild(script);
    }, []);

    // ✅ สร้าง Jitsi หลังจาก DOM render แล้ว
    useEffect(() => {
        if (!roomId || !containerRef.current || !window.JitsiMeetExternalAPI)
            return;

        // ถ้ามีของเก่าให้ลบทิ้ง
        if (jitsiApiRef.current) {
            jitsiApiRef.current.dispose();
        }

        const options = {
            roomName: roomId,
            width: "100%",
            height: "100%",
            parentNode: containerRef.current,
            userInfo: {
                displayName
            }
        };

        jitsiApiRef.current = new window.JitsiMeetExternalAPI(
            "meet.jit.si",
            options
        );

        return () => {
            if (jitsiApiRef.current) {
                jitsiApiRef.current.dispose();
                jitsiApiRef.current = null;
            }
        };
    }, [roomId]);

    const startCall = (roomName, name) => {
        setDisplayName(name);
        setRoomId(roomName);
        setIsMinimized(false);
    };

    const endCall = () => {
        if (jitsiApiRef.current) {
            jitsiApiRef.current.dispose();
            jitsiApiRef.current = null;
        }
        setRoomId(null);
        setIsMinimized(false);
    };

    return (
        <VideoContext.Provider
            value={{
                startCall,
                endCall,
                isInCall: !!roomId,
                minimize: () => setIsMinimized(true),
                maximize: () => setIsMinimized(false)
            }}
        >
            {children}

            {roomId && (
                <div
                    className={`fixed z-50 bg-black shadow-xl transition-all duration-300
                    ${
                        isMinimized
                            ? "bottom-4 right-4 w-80 h-48 rounded-xl overflow-hidden"
                            : "inset-0"
                    }`}
                >
                    <div ref={containerRef} className="w-full h-full" />

                    <div className="absolute top-2 right-2 flex gap-2">
                        {!isMinimized && (
                            <button
                                onClick={() => setIsMinimized(true)}
                                className="bg-yellow-500 text-white px-2 py-1 rounded"
                            >
                                ย่อ
                            </button>
                        )}

                        {isMinimized && (
                            <button
                                onClick={() => setIsMinimized(false)}
                                className="bg-blue-500 text-white px-2 py-1 rounded"
                            >
                                ขยาย
                            </button>
                        )}

                        <button
                            onClick={endCall}
                            className="bg-red-500 text-white px-2 py-1 rounded"
                        >
                            วางสาย
                        </button>
                    </div>
                </div>
            )}
        </VideoContext.Provider>
    );
}

export const useVideo = () => useContext(VideoContext);