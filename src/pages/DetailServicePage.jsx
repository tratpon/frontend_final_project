import { Link, NavLink } from 'react-router-dom';
import NavbarSwitcher from '../app/NavbarSwitcht.jsx';
import Footer from '../components/Footer.jsx';
import { useParams } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { fetchDetailService } from '../app/Api.js';

export default function DetailServicePage() {

    const { id } = useParams();
    
    const { data: services = [] } = useQuery({
        queryKey: ['service', id],
        queryFn: () => fetchDetailService(id),
        refetchInterval: 5000,
    });
    if (services.length > 0) {
        console.log(services[0]);
    }
    return (
        <div>
            <NavbarSwitcher />
            <div className="min-h-screen px-6 py-10 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* LEFT CONTENT */}
                    <div className="lg:col-span-2">
                        <div>
                            {/* Main Image */}
                            <div className="w-full h-90 bg-gray-200 rounded-lg flex items-center justify-center">
                                <div className="w-40 h-40 bg-gray-300"></div>
                            </div>

                            {/* Small Images */}
                            <div className="grid grid-cols-4 gap-4 mt-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="h-20 bg-gray-200 rounded"></div>
                                ))}
                            </div>
                        </div>
                        <div className="mt-8 leading-relaxed text-gray-800 text-sm">
                            <p>
                                {services?.[0]?.Full_Description}
                            </p>
                        </div>
                        <div className="flex mt-10 mb-10">
                            {/* Rating Summary */}
                            <div className="mt-6 items-center">
                                <Link to='/AdviserProfile' className="w-20 h-20 flex flex-col justify-center items-center bg-gray-100 rounded-full">
                                    <span className="text-xl font-bold">5.0</span>
                                    <span className="text-xs text-gray-500">จาก 5</span>
                                </Link>

                                <div className="text-yellow-500 text-xl">
                                    {"★★★★★"}
                                </div>
                            </div>
                            <div class="border-l mx-20 border-gray-300"></div>
                            {/* Individual reviews */}
                            <div className="mt-6 grid grid-cols-2 gap-x-50 gap-y-5">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="">
                                        <div className="text-yellow-500 text-2xl mb-2">
                                            {"★★★★★"}
                                        </div>
                                        <p className="text-xl text-gray-700">xxxxxxxxxxx</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Reviewer info */}
                        <div className="mt-6 text-sm text-gray-600">
                            <div className="text-yellow-500 text-lg mb-2">
                                {"★★★★★"}
                            </div>
                            <p>
                                Towering performance by Matt Damon as a troubled working class…
                            </p>

                            <div className="flex items-center gap-3 mt-4">
                                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                                <span>Nguyen Shane</span>
                            </div>

                            <div className="text-xs text-gray-400 mt-2">
                                Oct 13, 2017
                            </div>
                        </div>
                        <div className="mt-6 text-sm text-gray-600">
                            <div className="text-yellow-500 text-lg mb-2">
                                {"★★★★★"}
                            </div>
                            <p>
                                Towering performance by Matt Damon as a troubled working class…
                            </p>

                            <div className="flex items-center gap-3 mt-4">
                                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                                <span>Nguyen Shane</span>
                            </div>

                            <div className="text-xs text-gray-400 mt-2">
                                Oct 13, 2017
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDEBAR */}
                    <div>
                        <div className="border rounded-xl p-6 shadow-sm">

                            {/* Calendar header */}
                            <div className="flex justify-between items-center mb-4">
                                <button>{"<"}</button>
                                <div className="font-medium">December 2021</div>
                                <button>{">"}</button>
                            </div>

                            {/* Calendar Grid */}
                            <div className="grid grid-cols-7 text-center text-sm">
                                {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
                                    <div key={d} className="text-gray-500 py-1">{d}</div>
                                ))}

                                {/* Days (mock layout) */}
                                {Array(35).fill(0).map((_, i) => (
                                    <div
                                        key={i}
                                        className={`py-2 rounded cursor-pointer ${i === 10 ? "bg-blue-600 text-white" : "text-gray-700"
                                            }`}
                                    >
                                        {i > 2 ? i - 2 : ""}
                                    </div>
                                ))}
                            </div>

                            {/* Time Slots */}
                            <NavLink to="/Booking" className="mt-6 grid grid-cols-2 gap-3">
                                {["10:00 am", "10:30 am", "11:00 am", "12:00 pm", "12:30 pm"].map((t) => (
                                    <button
                                        key={t}
                                        className="border rounded-lg py-2 text-sm hover:bg-gray-100"
                                    >
                                        {t}
                                    </button>
                                ))}
                            </NavLink>
                        </div>
                    </div>

                </div>

            </div>
            <Footer />
        </div>

    )
}
