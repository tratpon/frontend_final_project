import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchPostAdmin, fetchTypes, updatepoststatus } from "../../app/Api.js";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Sidebar from "../../components/Sidebar.jsx";

export default function AdminApprovePost() {
  const [searchParams, setSearchParams] = useSearchParams();
  const type = searchParams.get("type") || "";
  const [activeTab, setActiveTab] = useState("pending");
  const queryClient = useQueryClient();

  // 🔹 Query posts
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["posts", type],
    queryFn: () => fetchPostAdmin(type),
  });

  // 🔹 Query types
  const { data: types = [] } = useQuery({
    queryKey: ["types"],
    queryFn: fetchTypes,
    refetchInterval: 5000,
  });

  // 🔹 Mutation update status
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

  // 🔹 Filter posts by active tab
  const filteredPosts = posts.filter((p) => {
    if (activeTab === "pending") return p.Status === "pending";
    if (activeTab === "approve") return p.Status === "approve";
    if (activeTab === "reject") return p.Status === "reject";
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-200">
      <Sidebar />
      <main className="ml-64 p-5">
        {/* Dropdown filter */}
        <select
          value={type}
          onChange={handleTypeChange}
          className="border rounded-lg px-3 py-2 bg-white mb-5"
        >
          <option value="">ทุกประเภท</option>
          {types.map((t) => (
            <option key={t.TypesID} value={t.TypesName}>
              {t.TypesName}
            </option>
          ))}
        </select>

        {/* 🔹 Tabs */}
        <div className="flex gap-3 mb-5">
          {["pending", "approve", "reject"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg ${
                activeTab === tab
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {tab === "pending"
                ? "Pending"
                : tab === "approve"
                ? "Approved"
                : "Rejected"}
            </button>
          ))}
        </div>

        {/* 🔹 Posts */}
        {isLoading && <div className="text-center text-gray-500">Loading...</div>}

        {!isLoading && filteredPosts.length === 0 && (
          <div className="text-center text-gray-400 py-10">No posts</div>
        )}

        {filteredPosts.map((post) => (
          <div
            key={post.PostID}
            className={`border rounded-xl p-6 shadow-sm hover:shadow-md transition mb-4 ${
              post.Status === "approve"
                ? "bg-green-50"
                : post.Status === "reject"
                ? "bg-red-50"
                : "bg-white"
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                  👤
                </div>
                <div className="font-semibold">{post.Username}</div>
              </div>

              <div className="flex gap-2">
                {post.Status === "pending" && (
                  <>
                    <button
                      onClick={() =>
                        updateStatusMutation.mutate({ postId: post.PostID, status: "approve" })
                      }
                      className="px-4 py-1 rounded-lg bg-green-500 text-white hover:bg-green-600"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() =>
                        updateStatusMutation.mutate({ postId: post.PostID, status: "reject" })
                      }
                      className="px-4 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </>
                )}

                {post.Status === "approve" && (
                  <button
                    onClick={() =>
                      updateStatusMutation.mutate({ postId: post.PostID, status: "reject" })
                    }
                    className="px-4 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600"
                  >
                    Reject
                  </button>
                )}

                {post.Status === "reject" && (
                  <button
                    onClick={() =>
                      updateStatusMutation.mutate({ postId: post.PostID, status: "approve" })
                    }
                    className="px-4 py-1 rounded-lg bg-green-500 text-white hover:bg-green-600"
                  >
                    Approve
                  </button>
                )}
              </div>
            </div>
            <hr className="my-4" />
            <p className="text-gray-700">{post.content}</p>
          </div>
        ))}
      </main>
    </div>
  );
}