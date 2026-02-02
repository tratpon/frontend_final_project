import { Phone, Video } from "lucide-react";
import NavbarSwitcher from "../app/NavbarSwitcht";
export default function ChatPage() {
    return (
        <div className="flex flex-col h-screen bg-amber-500">
            <NavbarSwitcher />
            <div className="flex flex-1 bg-gray-200 overflow-hidden">
                {/* SIDEBAR */}
                <div className="w-72 bg-white border-r p-4">
                    <input
                        className="w-full mb-4 border-b outline-none"
                        placeholder="search for user"
                    />

                    <ul className="space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center gap-3 cursor-pointer">
                                <div className="w-10 h-10 rounded-full bg-gray-300" />
                                <div>
                                    <p className="font-medium">Jane Doe</p>
                                    <p className="text-sm text-gray-400">Senior Designer</p>
                                </div>
                            </div>
                        ))}
                    </ul>
                </div>

                {/* CHAT AREA */}
                <div className="flex flex-col flex-1">

                    {/* HEADER */}
                    <div className="flex items-center justify-between bg-gray-300 px-6 py-4">
                        <div>
                            <p className="font-semibold">Jane Doe</p>
                            <p className="text-sm text-gray-500">Senior Designer</p>
                        </div>

                        <div className="flex gap-4">
                            <Video className="cursor-pointer" />
                            <Phone className="cursor-pointer" />
                        </div>
                    </div>

                    {/* MESSAGE LIST */}
                    <div className="flex-1 p-6 space-y-6 overflow-y-auto">

                        {/* other */}
                        <div className="flex justify-start">
                            <div className="max-w-md p-4 rounded-2xl rounded-bl-none border bg-white">
                                ใช้สำหรับดูสถานะการจองได้ด้วย โดยจะขึ้นเวลาบอก
                            </div>
                        </div>

                        {/* me */}
                        <div className="flex justify-end">
                            <div className="max-w-md p-4 rounded-2xl rounded-br-none border bg-white">
                                รับทราบครับ เดี๋ยวตรวจสอบให้
                            </div>
                        </div>

                    </div>

                    {/* INPUT */}
                    <div className="p-4 bg-gray-200">
                        <div className="flex items-center gap-4 bg-white rounded-full px-6 py-3">
                            <input
                                className="flex-1 outline-none"
                                placeholder="Type your message..."
                            />
                            <button className="bg-black text-white px-6 py-2 rounded-full">
                                Send
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>

    );
}
