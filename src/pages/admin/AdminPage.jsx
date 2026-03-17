import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import { fetchAllUserAndAdvisor } from "../../app/Api";
import { useQuery } from "@tanstack/react-query";

export default function Admin() {

    const [tab, setTab] = useState("all");
    const [search, setSearch] = useState("");

    const { data = [], isLoading } = useQuery({
        queryKey: ["adminusermange"],
        queryFn: fetchAllUserAndAdvisor
    });

    if (isLoading) return <div className="p-10">Loading...</div>;
    const filteredUsers = data
        .filter(u =>
            tab === "all" ? true : u.role === tab
        )
        .filter(u =>
            (u.Fname + " " + u.Lname)
                .toLowerCase()
                .includes(search.toLowerCase()) ||
            u.Email.toLowerCase().includes(search.toLowerCase())
        );

    

    return (
        <div className="min-h-screen bg-gray-200 flex">

            <Sidebar />

            <main className="flex-1 p-8 ml-64">

                {/* SEARCH */}
                <div className="flex items-center gap-3 mb-6">
                    🔍
                    <input
                        type="text"
                        placeholder="Search user..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-transparent border-b border-gray-500 focus:outline-none w-64"
                    />
                </div>

                {/* TABS */}
                <div className="flex gap-4 mb-6">

                    <button
                        onClick={() => setTab("all")}
                        className={`px-4 py-2 rounded-lg ${tab === "all"
                            ? "bg-blue-500 text-white"
                            : "bg-white"
                            }`}
                    >
                        All
                    </button>

                    <button
                        onClick={() => setTab("user")}
                        className={`px-4 py-2 rounded-lg ${tab === "user"
                            ? "bg-blue-500 text-white"
                            : "bg-white"
                            }`}
                    >
                        Users
                    </button>

                    <button
                        onClick={() => setTab("advisor")}
                        className={`px-4 py-2 rounded-lg ${tab === "advisor"
                            ? "bg-blue-500 text-white"
                            : "bg-white"
                            }`}
                    >
                        Advisors
                    </button>

                </div>

                {/* HEADER */}
                <div className="grid grid-cols-[2fr_3fr_2fr_1fr_1fr_40px] text-sm text-gray-600 mb-3 px-6">
                    <div>Name</div>
                    <div>Email</div>
                    <div>Phone</div>
                    <div>Gender</div>
                    <div>Role</div>
                    <div></div>
                </div>

                {/* LIST */}
                <div className="flex flex-col gap-4">

                    {filteredUsers.map((user, i) => (

                        <div
                            key={i}
                            className="bg-white rounded-xl px-6 py-4 grid grid-cols-[2fr_3fr_2fr_1fr_1fr_40px] items-center"
                        >

                            {/* NAME */}
                            <div className="flex items-center gap-3">

                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                    👤
                                </div>

                                <span className="font-medium">
                                    {user.Fname} {user.Lname}
                                </span>

                            </div>

                            {/* EMAIL */}
                            <div className="text-gray-600">
                                {user.Email}
                            </div>

                            {/* PHONE */}
                            <div className="text-gray-600">
                                {user.Phone||"null"}
                            </div>

                            {/* GENDER */}
                            <div>
                                <span className="px-4 py-1 rounded-full bg-blue-100 text-blue-600 text-sm">
                                    {user.Gender||"null"}
                                </span>
                            </div>

                            {/* ROLE */}
                            <div>

                                <span
                                    className={`px-3 py-1 rounded-full text-sm ${user.role === "advisor"
                                        ? "bg-purple-100 text-purple-600"
                                        : "bg-green-100 text-green-600"
                                        }`}
                                >
                                    {user.role}
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