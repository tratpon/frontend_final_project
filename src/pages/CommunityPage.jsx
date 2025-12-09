import { useState, useRef, useEffect } from "react";
import NavbarLoin from "../components/NavbarLoing";
import Footer from "../components/Footer";


export default function Community() {
    return (
        <div className="min-h-screen bg-white ">
            <NavbarLoin />
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
                            placeholder="post"
                            className="flex-1 px-4 py-2 border rounded-full focus:ring-2 focus:ring-gray-300"
                        />

                        {/* Category Dropdown (dummy) */}
                        <button className="px-4 py-2 bg-gray-100 border rounded-md flex items-center gap-2">
                            All Categories <span>▼</span>
                        </button>
                    </div>
                </div>

                {/* CONTENT POST CARD */}
                <div className="w-full px-10 mt-10 space-y-8 max-w-4xl mx-auto">
                    {[1, 2].map((i) => (
                        <div
                            key={i}
                            className="border rounded-xl p-6 shadow-sm hover:shadow-md transition"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                                    👤
                                </div>
                                <div>
                                    <div className="font-semibold">Jane Doe</div>
                                    <div className="text-gray-500 text-sm">Senior Designer</div>
                                </div>
                            </div>

                            <hr className="my-4" />

                            <p className="text-gray-700">Content goes here...</p>
                        </div>
                    ))}
                </div>
            </div>


            <Footer />
        </div>
    );
}
