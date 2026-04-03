import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Footer from "../components/Footer";
import NavbarSwitcher from "../app/NavbarSwitcht";
import {
  fetchfilterPost,
  fetchTypes,
  fetchYourPost,
  fetchComment,
  addComment,
  addPost
} from "../app/Api.js";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MessageSquareText, Send, Image as ImageIcon, PlusCircle } from "lucide-react";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function Community() {
  const [commentText, setCommentText] = useState({});
  const [postText, setPostText] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const type = searchParams.get("type") || "";
  const [openCommentId, setOpenCommentId] = useState(null);
  const [postId, setpostId] = useState("");
  const [view, setView] = useState("all");

  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Queries (เหมือนเดิมแต่เพิ่ม isLoading เพื่อทำ Skeleton)
  const { data: posts = [], isLoading: loadingAll } = useQuery({
    queryKey: ["posts", type],
    queryFn: () => fetchfilterPost(type),
  });

  const { data: yourPosts = [] } = useQuery({
    queryKey: ["yourPosts", type],
    queryFn: () => fetchYourPost(type),
  });

  const { data: types = [] } = useQuery({
    queryKey: ["types"],
    queryFn: fetchTypes,
  });

  const { data: comments = [], refetch: refetchComments } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => fetchComment(postId),
    enabled: !!postId,
  });

  const addCommentMutation = useMutation({
    mutationFn: addComment,
    onSuccess: () => refetchComments(),
  });

  const addPostMutation = useMutation({
    mutationFn: addPost,
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
      queryClient.invalidateQueries(["yourPosts"]);
      setPostText("");
    },
  });

  const handleAddPost = () => {
    if (!postText.trim()) return;
    addPostMutation.mutate({
      type: type || "ทั่วไป", 
      content: postText,
      status: "pending",
    });
  };

  const statusStyles = {
    approve: "bg-emerald-50 text-emerald-600 border-emerald-100",
    pending: "bg-amber-50 text-amber-600 border-amber-100",
    reject: "bg-rose-50 text-rose-600 border-rose-100",
  };

  const PostCard = (post) => (
    <div
      key={post.PostID}
      className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full border-2 border-white shadow-sm overflow-hidden bg-slate-100 flex items-center justify-center">
            {post.imageUserUrl ? (
              <img src={post.imageUserUrl} className="w-full h-full object-cover" alt="user" />
            ) : (
              <span className="text-xl">👤</span>
            )}
          </div>
          <div>
            <div className="font-bold text-slate-800">{post.Username}</div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-600 rounded uppercase">
                {post.TypesName}
              </span>
              <span className="text-[10px] text-slate-400">เมื่อสักครู่</span>
            </div>
          </div>
        </div>

        {/* Status Badge - Only show for personal posts */}
        {view !== "all" && (
          <div className={`text-[10px] font-bold uppercase tracking-wider border px-3 py-1 rounded-full ${statusStyles[post.status] || 'bg-gray-50'}`}>
            {post.status === 'approve' ? '● Approved' : post.status === 'pending' ? '● Pending' : '● Rejected'}
          </div>
        )}
      </div>

      <p className="text-slate-700 leading-relaxed mb-4 whitespace-pre-wrap">{post.content}</p>

      <div className="flex items-center justify-between pt-4 border-t border-slate-50">
        <button
          onClick={() => {
            setpostId(post.PostID);
            setOpenCommentId(openCommentId === post.PostID ? null : post.PostID);
          }}
          className={`flex items-center gap-2 text-sm transition-colors ${openCommentId === post.PostID ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-blue-500'}`}
        >
          <MessageSquareText size={18} />
          <span>{post.comment_count || 0} ความคิดเห็น</span>
        </button>
      </div>

      {/* Comment Section */}
      {openCommentId === post.PostID && (
        <div className="mt-4 pt-4 bg-slate-50 -mx-5 px-5 rounded-b-2xl animate-in slide-in-from-top-2 duration-300">
          <div className="space-y-4 max-h-[400px] overflow-y-auto pb-4 custom-scrollbar">
            {comments.map((comment) => (
              <div key={comment.CommentID} className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-white shrink-0 border border-slate-200">
                  {comment.imageUserUrl ? (
                    <img src={comment.imageUserUrl} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px]">👤</div>
                  )}
                </div>
                <div className="flex-1 bg-white rounded-2xl px-4 py-2 border border-slate-100 shadow-sm">
                  <div className="font-bold text-xs text-slate-900 mb-0.5">{comment.username}</div>
                  <p className="text-sm text-slate-600 leading-relaxed">{comment.Comment}</p>
                </div>
              </div>
            ))}
            
            {comments.length === 0 && (
              <p className="text-center text-xs text-slate-400 py-4">ยังไม่มีใครแสดงความคิดเห็น มาเริ่มกันเลย!</p>
            )}
          </div>

          {user && (
            <div className="py-4 border-t border-slate-200 flex gap-2">
               <input
                type="text"
                value={commentText[post.PostID] || ""}
                onChange={(e) => setCommentText({ ...commentText, [post.PostID]: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && handleAddComment(post.PostID)}
                placeholder="พิมพ์ความคิดเห็นของคุณ..."
                className="flex-1 bg-white border border-slate-200 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <button 
                onClick={() => handleAddComment(post.PostID)}
                className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const displayedPosts = (() => {
    if (view === "all") return posts;
    const filterByStatus = (status) => yourPosts.filter(p => p.status === status);
    if (view === "mine") return filterByStatus("approve");
    if (view === "pending") return filterByStatus("pending");
    if (view === "reject") return filterByStatus("reject");
    return [];
  })();

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <NavbarSwitcher />
      
      <main className="max-w-3xl mx-auto w-full px-4 py-8 flex-1">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Community</h1>
          <p className="text-slate-500 italic">"แลกเปลี่ยนความคิดเห็น ปรึกษาผู้เชี่ยวชาญ และเติบโตไปด้วยกัน"</p>
        </header>

        {/* Create Post Area */}
        {user === "user" && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 mb-8 transition-all focus-within:shadow-md">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0 font-bold">
                U
              </div>
              <textarea
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                placeholder="คุณมีอะไรที่อยากปรึกษาหรือเปล่า..."
                className="w-full bg-transparent border-none focus:ring-0 text-slate-700 placeholder:text-slate-400 resize-none py-2 min-h-[80px]"
              />
            </div>
            
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
              <div className="flex gap-2">
                <select
                  value={type}
                  onChange={(e) => {
                    const newParams = new URLSearchParams(searchParams);
                    newParams.set("type", e.target.value);
                    setSearchParams(newParams);
                  }}
                  className="text-xs bg-slate-100 border-none rounded-lg px-3 py-2 text-slate-600 cursor-pointer hover:bg-slate-200 transition-colors"
                >
                  <option value="">เลือกหมวดหมู่</option>
                  {types.map((t) => (
                    <option key={t.TypesID} value={t.TypesName}>{t.TypesName}</option>
                  ))}
                </select>
              </div>
              
              <button
                onClick={handleAddPost}
                disabled={!postText.trim() || addPostMutation.isLoading}
                className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-full font-bold text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-200"
              >
                {addPostMutation.isLoading ? "กำลังส่ง..." : <><PlusCircle size={18} /> โพสต์เลย</>}
              </button>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between mb-6 overflow-x-auto no-scrollbar">
          <div className="flex gap-6 border-b border-slate-200 w-full">
            {[
              { id: "all", label: "ฟีดทั้งหมด" },
              { id: "mine", label: "โพสต์ของฉัน", userOnly: true },
              { id: "pending", label: "รออนุมัติ", userOnly: true },
              { id: "reject", label: "ไม่ผ่านการอนุมัติ", userOnly: true },
            ].map((tab) => (
              (!tab.userOnly || user === "user") && (
                <button
                  key={tab.id}
                  onClick={() => setView(tab.id)}
                  className={`pb-3 text-sm font-bold transition-all relative whitespace-nowrap ${
                    view === tab.id ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {tab.label}
                  {view === tab.id && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" />
                  )}
                </button>
              )
            ))}
          </div>
        </div>

        {/* Post List */}
        <div className="space-y-6">
          {loadingAll ? (
            <div className="text-center py-10 text-slate-400 animate-pulse">กำลังโหลดเรื่องราวที่น่าสนใจ...</div>
          ) : displayedPosts.length > 0 ? (
            displayedPosts.map(PostCard)
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
              <div className="text-5xl mb-4">🍃</div>
              <h3 className="text-lg font-bold text-slate-800">ที่นี่ดูเงียบเหงาจัง</h3>
              <p className="text-slate-400 text-sm">ยังไม่มีโพสต์ในหมวดหมู่นี้ เริ่มต้นบทสนทนาได้เลย!</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}