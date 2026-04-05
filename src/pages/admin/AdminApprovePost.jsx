import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchPostAdmin, fetchTypes, updatepoststatus } from "../../app/Api.js";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Sidebar from "../../components/Sidebar.jsx";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  User,
  Tag,
  Loader2,
  MessageSquare
} from "lucide-react";

export default function AdminApprovePost() {
  const [searchParams, setSearchParams] = useSearchParams();
  const type = searchParams.get("type") || "";
  const [activeTab, setActiveTab] = useState("pending");
  const queryClient = useQueryClient();

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["posts", type],
    queryFn: () => fetchPostAdmin(type),
  });

  const { data: types = [] } = useQuery({
    queryKey: ["types"],
    queryFn: fetchTypes,
    refetchInterval: 10000, // ปรับเป็น 10 วินาทีเพื่อให้ไม่ดึงบ่อยเกินไป
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ postId, status }) => updatepoststatus(postId, status),
    onSuccess: () => {
      queryClient.invalidateQueries(["posts", type]);
    },
  });

  const handleTypeChange = (e) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("type", e.target.value);
    setSearchParams(newParams);
  };

  const filteredPosts = posts.filter((p) => p.Status === activeTab);

  return (
    <div className="min-h-screen bg-slate-50/50 flex">
      <Sidebar />

      <main className="flex-1 ml-72 p-10">
        {/* Header Section */}
        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Post Moderation</h1>
            <p className="text-slate-500 font-medium">ตรวจสอบและอนุมัติเนื้อหาจากผู้ใช้งานในระบบ</p>
          </div>
        </header>

        {/* Status Tabs */}
        <div className="flex gap-2 mb-8 bg-slate-100 p-1.5 rounded-2xl w-fit">
          {[
            { id: "pending", label: "Pending", icon: <Clock size={16} />, color: "active:bg-amber-500" },
            { id: "approve", label: "Approved", icon: <CheckCircle2 size={16} />, color: "active:bg-emerald-500" },
            { id: "reject", label: "Rejected", icon: <XCircle size={16} />, color: "active:bg-red-500" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all ${activeTab === tab.id
                ? "bg-white text-slate-800 shadow-sm"
                : "text-slate-400 hover:text-slate-600"
                }`}
            >
              {tab.icon}
              {tab.label}
              <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-md ${activeTab === tab.id ? "bg-slate-100 text-slate-600" : "bg-slate-200/50 text-slate-400"
                }`}>
                {posts.filter(p => p.Status === tab.id).length}
              </span>
            </button>
          ))}
        </div>

        {/* Content Feed */}
        <div className="space-y-6 max-w-6xl">
          <div className="flex items-center max-w-70"> {/* Type Filter */}
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm">
              <Filter size={18} className="text-slate-400" />
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Category:</span>
              <select
                value={type}
                onChange={handleTypeChange}
                className="bg-transparent focus:outline-none font-bold text-slate-600 text-sm cursor-pointer"
              >
                <option value="">All Categories</option>
                {types.map((t) => (
                  <option key={t.TypesID} value={t.TypesName}>
                    {t.TypesName}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border border-dashed border-slate-200">
              <Loader2 className="animate-spin text-indigo-500 mb-4" size={32} />
              <p className="text-slate-400 font-bold">กำลังโหลดโพสต์...</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-slate-200">
              <MessageSquare size={48} className="mx-auto mb-4 opacity-10" />
              <p className="text-slate-400 font-bold text-lg">ไม่มีโพสต์ในหมวดหมู่นี้</p>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <div
                key={post.PostID}
                className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group "
              >
                <div className="p-8">
                  {/* Post Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
                        <User size={24} />
                      </div>
                      <div>
                        <h3 className="font-black text-slate-800 tracking-tight">{post.Username}</h3>
                        <div className="flex items-center gap-2 text-indigo-500">
                          <Tag size={12} />
                          <span className="text-[10px] font-black uppercase tracking-widest">{post.TypesName || "Uncategorized"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      {activeTab !== "approve" && (
                        <button
                          onClick={() => updateStatusMutation.mutate({ postId: post.PostID, status: "approve" })}
                          disabled={updateStatusMutation.isPending}
                          className="flex items-center gap-2 px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black rounded-xl shadow-lg shadow-emerald-100 transition-all active:scale-95"
                        >
                          <CheckCircle2 size={16} />
                          APPROVE
                        </button>
                      )}
                      {activeTab !== "reject" && (
                        <button
                          onClick={() => updateStatusMutation.mutate({ postId: post.PostID, status: "reject" })}
                          disabled={updateStatusMutation.isPending}
                          className="flex items-center gap-2 px-5 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-black rounded-xl shadow-lg shadow-red-100 transition-all active:scale-95"
                        >
                          <XCircle size={16} />
                          REJECT
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100/50">
                    <p className="text-slate-600 leading-relaxed font-medium whitespace-pre-wrap">
                      {post.content}
                    </p>
                  </div>
                </div>

                {/* Status Indicator Bar */}
                <div className={`h-1.5 w-full ${post.Status === 'approve' ? 'bg-emerald-500' :
                  post.Status === 'reject' ? 'bg-red-500' : 'bg-amber-400'
                  }`} />
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}