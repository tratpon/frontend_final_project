import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Footer from "../components/Footer";
import NavbarSwitcher from "../app/NavbarSwitcht";
import {
  fetchfilterPost,
  fetchTypes,
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
  const type = searchParams.get("type") || "";
  const [openCommentId, setOpenCommentId] = useState(null);
  const [postId, setpostId] = useState("");

  const { imageUserUrl, user } = useAuth();
  const queryClient = useQueryClient();

  const { data: posts = [] } = useQuery({
    queryKey: ["posts", type],
    queryFn: () => fetchfilterPost(type),
  });

  const { data: types = [] } = useQuery({
    queryKey: ["types"],
    queryFn: fetchTypes,
    refetchInterval: 5000,
  });

  const { data: comments = [], refetch: refetchComments } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => fetchComment(postId),
    enabled: !!postId,
  });

  const addCommentMutation = useMutation({
    mutationFn: addComment,
    onSuccess: () => refetchComments(),
    onError: (err) => {
      alert(err.response?.data?.message || err.message);
    },
  });

  const addPostMutation = useMutation({
    mutationFn: addPost,
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
      setPostText("");
    },
    onError: (err) => {
      alert(err.response?.data?.message || err.message);
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

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <NavbarSwitcher />

      {/* Container */}
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-10 flex-1">
        {user && (
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-6 sm:mb-10">

            {/* Profile */}
            <div className="hidden md:flex w-10 h-10 rounded-full overflow-hidden bg-gray-200 items-center justify-center">
              {imageUserUrl ? (
                <img src={imageUserUrl} className="w-full h-full object-cover" />
              ) : (
                "👤"
              )}
            </div>



            {/* Input */}
            <input
              type="text"
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddPost();
              }}
              placeholder="คุณกำลังคิดอะไรอยู่..."
              className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm sm:text-base outline-none w-full"
            />

            {/* Filter */}
            <select
              value={type}
              onChange={(e) => {
                const newParams = new URLSearchParams(searchParams);
                newParams.set("type", e.target.value);
                setSearchParams(newParams);
                setOpenCommentId(null);
              }}
              className="border rounded-lg px-3 py-2 bg-white text-sm w-full sm:w-auto"
            >
              <option value="">All</option>
              {types.map((t) => (
                <option key={t.TypesID} value={t.TypesName}>
                  {t.TypesName}
                </option>
              ))}
            </select>
          </div>

        )}



        {/* Posts */}
        <div className="space-y-6">
          {posts.map((post) => (
            <div
              key={post.PostID}
              className="border rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition"
            >
              {/* Header */}
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                  {post.imageUserUrl ? (
                    <img src={post.imageUserUrl} className="w-full h-full object-cover" />
                  ) : (
                    "👤"
                  )}
                </div>

                <div>
                  <div className="font-semibold text-sm sm:text-base">
                    {post.Username}
                  </div>
                </div>
              </div>

              <hr className="my-3 sm:my-4" />

              {/* Content */}
              <p className="text-gray-700 text-sm sm:text-base break-words">
                {post.content}
              </p>

              {/* Actions */}
              <div className="flex justify-end items-center gap-2 mt-3 text-gray-600">
                <button
                  onClick={() => {
                    setpostId(post.PostID);
                    setOpenCommentId(
                      openCommentId === post.PostID ? null : post.PostID
                    );
                  }}
                  className="flex items-center gap-2"
                >
                  <MessageSquareText size={18} />
                </button>
                <span className="text-sm">{post.comment_count}</span>
              </div>

              {/* Comments */}
              {openCommentId === post.PostID && (
                <div className="mt-4 border-t pt-4 max-h-60 overflow-y-auto space-y-4">

                  {/* Add Comment */}
                  {user && (
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                        {imageUserUrl ? (
                          <img src={imageUserUrl} className="w-full h-full object-cover" />
                        ) : (
                          "👤"
                        )}
                      </div>

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
                        className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm"
                      />
                    </div>


                  )}



                  {/* Comment List */}
                  {comments.map((comment) => (
                    <div key={comment.CommentID} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                        {comment.imageUserUrl ? (
                          <img src={comment.imageUserUrl} className="w-full h-full object-cover" />
                        ) : (
                          "👤"
                        )}
                      </div>

                      <div
                        className={`rounded-2xl px-3 py-2 text-sm ${comment.CommenterType === "advisor"
                          ? "bg-blue-100"
                          : "bg-gray-100"
                          }`}
                      >
                        <div className="font-semibold text-xs sm:text-sm">
                          {comment.username}
                          {comment.CommenterType === "advisor" && " (Advisor)"}
                        </div>

                        <div className="text-gray-800 break-words">
                          {comment.Comment}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Empty */}
          {posts.length === 0 && (
            <div className="text-center text-gray-400 mt-10">
              No posts yet
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}