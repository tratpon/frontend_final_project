import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchPostAdmin, fetchTypes, updatepoststatus } from "../../app/Api.js";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MessageSquareText } from "lucide-react";
import Sidebar from "../../components/Sidebar.jsx";



export default function AdminApprovePost() {
    const [commentText, setCommentText] = useState({});
    const [searchParams, setSearchParams] = useSearchParams()
    const type = searchParams.get("type") || "";
    const [openCommentId, setOpenCommentId] = useState(null);

    const { data: posts = [], isLoading } = useQuery({
        queryKey: ['posts', type],
        queryFn: () => fetchPostAdmin(type),

    });

    const { data: types = [] } = useQuery({
        queryKey: ['types'],
        queryFn: fetchTypes,
        refetchInterval: 5000,
    });

    const queryClient = useQueryClient();

    const updateStatusMutation = useMutation({
        mutationFn: (postId, status) =>
            updatepoststatus(postId, status),

        onSuccess: () => {
            queryClient.invalidateQueries(["posts", type]);
        }
    });

    console.log(posts)
    console.log(type)

    return (
        <div className="min-h-screen bg-gray-200">
            <Sidebar />
            <main className="ml-64 p-5">
                {/* Category Dropdown (dummy) */}
                <select value={type}
                    onChange={(e) => {
                        const newParams = new URLSearchParams(searchParams);
                        newParams.set("type", e.target.value);
                        setSearchParams(newParams);
                        setOpenCommentId(null);
                    }} className="border rounded-lg px-3 py-2 bg-white">
                    {types.map((type) => (
                        <option key={type.TypesID}>{type.TypesName}</option>
                    ))
                    }
                </select>

                <div className="w-full mt-5 space-y-8 max-w-4xl mx-auto ">
                    {!isLoading && posts.length === 0 && (
                    <div className="text-gray-400 text-center py-10">
                        No post
                    </div>
                )}
                    {posts.map((post) => (
                        <div
                            key={post.PostID}
                            className="border rounded-xl p-6 shadow-sm hover:shadow-md transition bg-white"
                        >
                            <div className="flex items-center gap-4 justify-between">
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                                        👤
                                    </div>
                                    <div>
                                        <div className="font-semibold">{post.Username}</div>
                                        {/* <div className="text-gray-500 text-sm">{post.Title}</div> */}
                                    </div>
                                </div>
                                <div className="flex gap-2" >
                                    <button
                                        onClick={() =>
                                            updateStatusMutation.mutate({
                                                postId: post.PostID,
                                                status: "approve"
                                            })
                                        }
                                        className="px-4 py-1 rounded-lg bg-green-500 text-white hover:bg-green-600"
                                    >
                                        Approve
                                    </button>

                                    <button
                                        onClick={() =>
                                            updateStatusMutation.mutate({
                                                postId: post.PostID,
                                                status: "reject"
                                            })
                                        }
                                        className="px-4 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600"
                                    >
                                        Reject
                                    </button>

                                </div>



                            </div>
                            <hr className="my-4" />
                            <p className="text-gray-700">{post.content}</p>
                            <div className="flex justify-end gap-2 text-gray-700">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setpostId(post.PostID)
                                        setOpenCommentId(openCommentId === post.PostID ? null : post.PostID)
                                    }
                                    }
                                    className="flex items-center gap-2"
                                >
                                    <MessageSquareText size={18} />
                                </button>
                            </div>
                            {openCommentId === post.PostID && (
                                <div className="mt-4 border-t pt-4 max-h-64 overflow-y-auto">
                                    {/* Input Comment */}
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                                        <input
                                            type="text"
                                            value={commentText[post.PostID] || ""}
                                            onChange={(e) =>
                                                setCommentText({
                                                    ...commentText,
                                                    [post.PostID]: e.target.value
                                                })
                                            }
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    handleAddComment(post.PostID);
                                                }
                                            }}
                                            placeholder="เขียนความคิดเห็น..."
                                            className="w-full bg-gray-100 rounded-full px-4 py-2"
                                        />
                                    </div>
                                    {/* ตัวอย่าง comment */}
                                    {comments.map((comment) => (
                                        <div key={comment.CommentID} className="mt-4 space-y-3">
                                            <div className="flex gap-3">
                                                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                                                <div
                                                    className={`rounded-2xl px-4 py-2 ${comment.CommenterType === 'advisor'
                                                        ? 'bg-blue-100'
                                                        : 'bg-gray-100'
                                                        }`}
                                                >
                                                    <div className="font-semibold text-sm">
                                                        {comment.username}
                                                        {comment.CommenterType === 'advisor' && ' (Advisor)'}
                                                    </div>
                                                    <div className="text-sm text-gray-800">
                                                        {comment.Comment}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </main>
        </div>

    );
}
