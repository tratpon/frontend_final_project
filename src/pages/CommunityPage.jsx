import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Footer from "../components/Footer";
import NavbarSwitcher from "../app/NavbarSwitcht";
import { fetchfilterPost, fetchTypes, fetchComment, addComment, addPost } from '../app/Api.js';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MessageSquareText } from "lucide-react";



export default function Community() {
    const [commentText, setCommentText] = useState({});
    const [postText, setPostText] = useState("");
    const [searchParams, setSearchParams] = useSearchParams()
    const type = searchParams.get("type") || "";
    const [openCommentId, setOpenCommentId] = useState(null);
    const [postId, setpostId] = useState("");

    const { data: posts = [] } = useQuery({
        queryKey: ['posts', type],
        queryFn: () => fetchfilterPost(type),

    });

    const { data: types = [] } = useQuery({
        queryKey: ['types'],
        queryFn: fetchTypes,
        refetchInterval: 5000,
    });

    const { data: comments = [], refetch: refetchComments } = useQuery({
        queryKey: ['comments', postId],
        queryFn: () => fetchComment(postId),
        enabled: !!postId,
    });
    
    const addCommentMutation = useMutation({
        mutationFn: addComment,
        onSuccess: () => {
            refetchComments();
        },
        onError: (err) => {
            alert(err.response?.data?.message || err.message);
        }
    });
    const handleAddPost = () => {
        if (!postText.trim()) return;

        addPostMutation.mutate({
            type: type,
            content: postText
        });
    };

    // 🟨 HANDLE ENTER
    const handleAddComment = (id) => {
        const text = commentText[id];
        if (!text?.trim()) return;

        addCommentMutation.mutate({
            PostID: id,
            Comment: text
        });
        console.log(id, text)

        setCommentText({
            ...commentText,
            [id]: ""
        });
    };

    const queryClient = useQueryClient();

    const addPostMutation = useMutation({
        mutationFn: addPost,
        onSuccess: () => {
            queryClient.invalidateQueries(['posts']);
            setPostText("");
        },
        onError: (err) => {
            alert(err.response?.data?.message || err.message);
        }
    });
    console.log(posts)
    console.log(type)
    console.log(comments)
    return (
        <div className="min-h-screen bg-white ">
            <NavbarSwitcher />
            <div className="min-h-screen">
                {/* Search + Category */}
                <div className="w-full px-10 mt-10 flex flex-col items-center">
                    <div className="flex items-center gap-4 w-full max-w-3xl">
                        {/* Search Icon */}
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                            👤
                        </div>

                        {/* Search Input */}
                        <input
                            type="text"
                            value={postText}
                            onChange={(e) => setPostText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleAddPost();
                                }
                            }}
                            placeholder="คุณกำลังคิดอะไรอยู่..."
                            className="flex-1 bg-gray-100 rounded-full px-4 py-2 outline-none text-sm"
                        />

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
                    </div>
                </div>

                {/* CONTENT POST CARD */}
                <div className="w-full px-10 mt-10 space-y-8 max-w-4xl mx-auto">
                    {posts.map((post) => (
                        <div
                            key={post.PostID}
                            className="border rounded-xl p-6 shadow-sm hover:shadow-md transition"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                                    👤
                                </div>
                                <div>
                                    <div className="font-semibold">{post.Username}</div>
                                    {/* <div className="text-gray-500 text-sm">{post.Title}</div> */}
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

                                {post.comment_count}
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
            </div>


            <Footer />
        </div>
    );
}
