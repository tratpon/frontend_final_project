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
import { MessageSquareText } from "lucide-react";
import { useAuth } from "../contexts/authContext.jsx";

export default function Community() {
  const [commentText, setCommentText] = useState({});
  const [postText, setPostText] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const type = searchParams.get("type") || "ทุกประเภท";
  const [openCommentId, setOpenCommentId] = useState(null);
  const [postId, setpostId] = useState("");
  const [view, setView] = useState("all"); // 🔥 toggle (all | mine)

  const { imageUserUrl, user } = useAuth();
  const queryClient = useQueryClient();

  // 🔹 โพสต์ทั้งหมด
  const { data: posts = [] } = useQuery({
    queryKey: ["posts", type],
    queryFn: () => fetchfilterPost(type),
  });
  console.log(posts);

  // 🔹 โพสต์ของฉัน
  const { data: yourPosts = [] } = useQuery({
    queryKey: ["yourPosts", type],
    queryFn: () => fetchYourPost(type),
  });
  console.log(yourPosts);
  const { data: types = [] } = useQuery({
    queryKey: ["types"],
    queryFn: fetchTypes,
  });

  const { data: comments = [], refetch: refetchComments } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => fetchComment(postId),
    enabled: !!postId,
  });
  console.log(comments);


  // 🔹 เพิ่มคอมเมนต์
  const addCommentMutation = useMutation({
    mutationFn: addComment,
    onSuccess: () => refetchComments(),
  });

  // 🔹 เพิ่มโพสต์
  const addPostMutation = useMutation({
    mutationFn: addPost,
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
      queryClient.invalidateQueries(["yourPosts"]);
      setPostText("");
      alert("รออนุมัติโพสต์");
    },
  });

  const handleAddPost = () => {
    if (!postText.trim()) return;
    addPostMutation.mutate({
      type: type,
      content: postText,
    });
  };

  const handleAddComment = (id) => {
    const text = commentText[id];
    if (!text?.trim()) return;

    addCommentMutation.mutate({
      PostID: id,
      Comment: text,
    });

    setCommentText({
      ...commentText,
      [id]: "",
    });
  };

  // 🔹 component post card
  const PostCard = (post) => (
    <div
      key={post.PostID}
      className="bg-white border rounded-xl p-4 sm:p-6 shadow-sm transition hover:shadow-xl duration-300"
    >
      {/* header */}
      <div className="flex items-center gap-3 justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
            {post.imageUserUrl ? (
              <img src={post.imageUserUrl} className="w-full h-full object-cover" />
            ) : (
              "👤"
            )}
          </div>
          <div>
            <div className="font-semibold">{post.Username}</div>
            <div className="font text-xs text-cyan-500">#{post.TypesName}</div>
          </div>
        </div>

        {post.status === "pending" ? (
          <div className="bg-red-50 text-red-600 border-red-200  rounded-2xl px-2">{post.status}</div>
        ) : (
          <div className="bg-green-50 text-green-600 border-green-200  rounded-2xl px-2">{post.status}</div>
        )
        }
      </div>


      <hr className="my-3" />

      {/* content */}
      <p className="text-gray-700">{post.content}</p>

      {/* actions */}
      <div className="flex justify-end items-center gap-2 mt-3 text-gray-600">
        <button
          onClick={() => {
            setpostId(post.PostID);
            setOpenCommentId(
              openCommentId === post.PostID ? null : post.PostID
            );
          }}
        >
          <MessageSquareText size={18} />
        </button>
        <span>{post.comment_count}</span>
      </div>

      {/* comments */}
      {openCommentId === post.PostID && (
        <div className="mt-4 border-t pt-4 space-y-3">
          {/* add comment */}
          {user && (
            <input
              type="text"
              value={commentText[post.PostID] || ""}
              onChange={(e) =>
                setCommentText({
                  ...commentText,
                  [post.PostID]: e.target.value,
                })
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddComment(post.PostID);
                }
              }}
              placeholder="เขียนความคิดเห็น..."
              className="w-full bg-gray-100 rounded-full px-4 py-2 text-sm"
            />
          )}

          {/* comment list */}
          <div className="space-y-4 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
            {comments.map((comment) => (
              <div key={comment.CommentID} className="flex gap-3 items-start">
                {/* Profile Image - ขนาดเล็กลงหน่อยสำหรับคอมเมนต์เพื่อให้ดูต่างจากโพสต์หลัก */}
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 shrink-0 border border-gray-100 ">
                  {comment.imageUserUrl ? (
                    <img
                      src={comment.imageUserUrl}
                      className="w-full h-full object-cover"
                      alt={comment.username}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">👤</div>
                  )}
                </div>

                <div className="flex-1 bg-gray-50 rounded-2xl px-3 py-2 border border-gray-100 min-w-0">
                  <div className="font-bold text-xs text-gray-800 mb-0.5 truncate">
                    {comment.username}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed break-words">
                    {comment.Comment}
                  </p>
                </div>
              </div>
            ))}

            {comments.length === 0 && (
              <p className="text-center text-[10px] text-gray-400 py-2 italic">ยังไม่มีความคิดเห็นในขณะนี้</p>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-white flex flex-col bg-linear-to-b from-blue-50 to-white">
      <NavbarSwitcher />

      <div className="max-w-3xl mx-auto w-full px-4 py-6 sm:py-10 flex-1 ">
        <header className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">คอมมูนิตี้</h1>
          <p className="text-gray-500 text-sm sm:text-base">พื้นที่สร้างสรรค์คำถาม</p>
        </header>
        {/* 🔹 create post */}
        {user === "user" && (
          <div className=" flex flex-col sm:flex-row gap-3 mb-6 sm:mb-10 ">

            <input
              type="text"
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddPost()}
              placeholder="คุณกำลังคิดอะไรอยู่..."
              className="flex-1 bg-white border rounded-lg px-4 py-2 hover:shadow-xl"
            />


            <select
              value={type}
              onChange={(e) => {
                const newParams = new URLSearchParams(searchParams);
                newParams.set("type", e.target.value);
                setSearchParams(newParams);
              }}
              className="bg-white border rounded-lg px-3 py-2 hover:shadow-xl"
            >
              <option value="">ทุกประเภท</option>
              {types.map((t) => (
                <option key={t.TypesID} value={t.TypesName}>
                  {t.TypesName}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* 🔥 Toggle Tabs */}
        <div className="flex gap-4 mb-6 border-b">
          <button
            onClick={() => setView("all")}
            className={`pb-2 ${view === "all"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-400"
              }`}
          >
            โพสต์ทั้งหมด
          </button>

          {user === "user" && (
            <button
              onClick={() => setView("mine")}
              className={`pb-2 ${view === "mine"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-400"
                }`}
            >
              โพสต์ของฉัน
            </button>

          )

          }


        </div>

        {/* 🔥 render ตาม tab */}
        <div className="space-y-6">
          {(view === "all" ? posts : yourPosts).map(PostCard)}

          {(view === "all" ? posts : yourPosts).length === 0 && (
            <div className="text-center text-gray-400 mt-10">
              ไม่มีโพสต์
            </div>
          )}
        </div>

      </div>

      <Footer />
    </div>
  );
}