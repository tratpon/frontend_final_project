import NavbarAdim from "../../components/NavbarAdmin";
import Sidebar from "../../components/Sidebar"

export default function Admin() {
    const users = Array.from({ length: 20 });

    return (
        <div className=" min-h-screen bg-gray-200">
            <NavbarAdim />
            <Sidebar />
            <main className="flex-1 pl-70 pt-30">
                {/* SEARCH */}
                <div className="flex items-center gap-2 mb-6">
                    🔍
                    <input
                        type="text"
                        placeholder="search for user"
                        className="bg-transparent border-b border-gray-500 focus:outline-none w-64"
                    />
                </div>

                {/* HEADER */}
                <div className="grid grid-cols-[2fr_3fr_2fr_1fr_40px] text-sm text-gray-600 mb-3 px-6">
                    <div className="flex items-center gap-1">
                        Name ▼
                    </div>
                    <div className="flex items-center gap-1">
                        Email ▼
                    </div>
                    <div className="flex items-center gap-1">
                        Phone number ▼
                    </div>
                    <div className="flex items-center gap-1">
                        Gender ▼
                    </div>
                    <div />
                </div>

                {/* LIST */}
                <div className="flex flex-col gap-4">
                    {users.map((_, i) => (
                        <div className="bg-white rounded-xl px-6 py-4 grid grid-cols-[2fr_3fr_2fr_1fr_40px] items-center">
                            {/* NAME */}
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                    👤
                                </div>
                                <span className="font-medium">John Deo</span>
                            </div>

                            {/* EMAIL */}
                            <div className="text-gray-600">
                                johndoe2211@gmail.com
                            </div>

                            {/* PHONE */}
                            <div className="text-gray-600">
                                +33757005467
                            </div>

                            {/* GENDER */}
                            <div>
                                <span className="px-4 py-1 rounded-full bg-blue-100 text-blue-600 text-sm">
                                    Male
                                </span>
                            </div>

                            {/* MENU */}
                            <div className="text-gray-400 cursor-pointer text-xl">
                                ⋯
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}