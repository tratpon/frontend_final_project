import { createContext, useContext, useRef, useState, useEffect } from "react";

const VideoContext = createContext();

export function VideoProvider({ children }) {
    const jitsiApiRef = useRef(null);
    const containerRef = useRef(null);

    const [roomId, setRoomId] = useState(null);
    const [displayName, setDisplayName] = useState("");
    const [isMinimized, setIsMinimized] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // โหลด script
    useEffect(() => {
        if (window.JitsiMeetExternalAPI) return;

        const script = document.createElement("script");
        script.src = "https://meet.jit.si/external_api.js";
        script.async = true;
        document.body.appendChild(script);
    }, []);

    // init jitsi
    useEffect(() => {
        if (!roomId || !containerRef.current || !window.JitsiMeetExternalAPI)
            return;

        if (jitsiApiRef.current) {
            jitsiApiRef.current.dispose();
        }

        jitsiApiRef.current = new window.JitsiMeetExternalAPI("meet.jit.si", {
            roomName: roomId,
            parentNode: containerRef.current,
            width: "100%",
            height: "100%",
            userInfo: { displayName }
        });

        return () => {
            jitsiApiRef.current?.dispose();
            jitsiApiRef.current = null;
        };
    }, [roomId]);

    const startCall = (roomName, name = "Guest") => {
        setDisplayName(name);
        setRoomId(roomName);
        setIsMinimized(false);
        setIsFullscreen(false);
    };

    const endCall = () => {
        jitsiApiRef.current?.dispose();
        setRoomId(null);
        setIsFullscreen(false);
    };

    return (
        <VideoContext.Provider
            value={{
                startCall,
                endCall,
                fullscreen: () => setIsFullscreen(true),
                exitFullscreen: () => setIsFullscreen(false)
            }}
        >
            {children}

            {roomId && (
                <div
                    className={`fixed bg-black transition-all duration-300
                    ${
                        isFullscreen
                            ? "inset-0 z-[9999]" // 🔥 FULLSCREEN จริง
                            : isMinimized
                            ? "bottom-4 right-4 w-72 h-40 z-50 rounded-xl"
                            : "bottom-4 right-4 w-[420px] h-[600px] z-50 rounded-2xl"
                    }`}
                >
                    <div ref={containerRef} className="w-full h-full" />

                    {/* CONTROLS */}
                    <div className="absolute top-2 right-2 flex gap-2 z-[10000]">
                        {!isFullscreen && (
                            <button
                                onClick={() => setIsFullscreen(true)}
                                className="bg-purple-500 text-white px-2 py-1 text-xs rounded"
                            >
                                Full
                            </button>
                        )}

                        {isFullscreen && (
                            <button
                                onClick={() => setIsFullscreen(false)}
                                className="bg-gray-700 text-white px-2 py-1 text-xs rounded"
                            >
                                Exit
                            </button>
                        )}

                        <button
                            onClick={() => setIsMinimized(!isMinimized)}
                            className="bg-yellow-500 text-white px-2 py-1 text-xs rounded"
                        >
                            {isMinimized ? "ขยาย" : "ย่อ"}
                        </button>

                        <button
                            onClick={endCall}
                            className="bg-red-500 text-white px-2 py-1 text-xs rounded"
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