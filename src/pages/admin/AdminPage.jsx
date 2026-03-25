import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import { fetchAllUserAndAdvisor, updateStatusAccount } from "../../app/Api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function Admin() {
    const queryClient = useQueryClient();
    const [tab, setTab] = useState("all");
    const [search, setSearch] = useState("");


    const { data = [], isLoading } = useQuery({
        queryKey: ["adminusermange"],
        queryFn: fetchAllUserAndAdvisor
    });

    console.log(data);



    const mutation = useMutation({
        mutationFn: updateStatusAccount,
        onSuccess: () => {
            queryClient.invalidateQueries(["adminusermange"]);
        },
        onError: (err) => {
            alert("Error: " + err.message);
        }
    });

    const handleToggleStatus = (user) => {
        const nextStatus = user.Status === "active" ? "inactive" : "active";

        if (window.confirm(`เปลี่ยนสถานะของ ${user.Fname} เป็น ${nextStatus}?`)) {
            mutation.mutate({
                id: user.UserID || user.AdvisorID,
                role: user.role,
                newStatus: nextStatus
            });
        }
    };

    if (isLoading) return <div className="p-10 font-bold">Loading data...</div>;

    const filteredUsers = data
        .filter(u => tab === "all" ? true : u.role === tab)
        .filter(u =>
            `${u.Fname} ${u.Lname}`.toLowerCase().includes(search.toLowerCase()) ||
            u.Email.toLowerCase().includes(search.toLowerCase())
        );

    return (
        <div className="min-h-screen bg-gray-100 flex">
            <Sidebar />

            <main className="flex-1 p-8 ml-64">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">User Management</h1>

                <div className="flex items-center gap-3 mb-6 bg-white p-3 rounded-xl shadow-sm w-fit">
                    <span className="text-gray-400">🔍</span>
                    <input
                        type="text"
                        placeholder="Search name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-transparent focus:outline-none w-80 text-sm"
                    />
                </div>


                <div className="flex gap-2 mb-6">
                    {["all", "user", "advisor"].map((t) => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className={`px-6 py-2 rounded-full font-medium transition-all text-sm ${tab === t ? "bg-blue-600 text-white shadow-md" : "bg-white text-gray-600 hover:bg-gray-50"
                                }`}
                        >
                            {t.toUpperCase()}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-[2fr_2.5fr_1.5fr_1fr_1.2fr_40px] text-xs font-bold text-gray-500 mb-3 px-6 uppercase tracking-wider">
                    <div>User Info</div>
                    <div>Email</div>
                    <div>Phone</div>
                    <div>Role</div>
                    <div>Status Control</div>
                    <div></div>
                </div>

                <div className="flex flex-col gap-3">
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map((user, i) => (
                            <div
                                key={i}
                                className="bg-white rounded-2xl px-6 py-4 grid grid-cols-[2fr_2.5fr_1.5fr_1fr_1.2fr_40px] items-center shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-200 to-gray-300 flex items-center justify-center text-lg overflow-hidden">
                                        {user.imageUrl ? (
                                            <img
                                                src={user.imageUrl}
                                                alt={`${user.Fname} profile`} 
                                                className="w-full h-full object-cover rounded-full"
                                            />
                                        ) : (
                                            "👤"
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-gray-800">{user.Fname} {user.Lname}</span>
                                        <span className="text-[10px] text-gray-400 uppercase font-bold">{user.Gender || "N/A"}</span>
                                    </div>
                                </div>


                                <div className="text-gray-600 text-sm truncate pr-4">{user.Email}</div>


                                <div className="text-gray-600 text-sm font-mono">{user.Phone || "-"}</div>

                                <div>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${user.role === "advisor" ? "bg-purple-100 text-purple-600" : "bg-blue-100 text-blue-600"
                                        }`}>
                                        {user.role}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleToggleStatus(user)}
                                        disabled={mutation.isPending}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${user.Status === "active" ? "bg-green-500" : "bg-gray-300"
                                            }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${user.Status === "active" ? "translate-x-6" : "translate-x-1"
                                                }`}
                                        />
                                    </button>
                                    <span className={`text-[11px] font-bold ${user.Status === "active" ? "text-green-600" : "text-gray-400"}`}>
                                        {user.Status?.toUpperCase() || "ACTIVE"}
                                    </span>
                                </div>


                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 text-gray-400 bg-white rounded-2xl shadow-sm">
                            No users found matching your search.
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}