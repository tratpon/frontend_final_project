import Footer from "../components/Footer";
import NavbarLoin from "../components/NavbarLoing";


export default function Hisrory() {
    const data = [1, 2, 3,6];

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <NavbarLoin />

            {/* TITLE */}
            <h1 className="text-4xl font-bold text-center mt-12 mb-8">
                History
            </h1>

            {/* SEARCH */}
            <div className="flex justify-center mb-5">
                {/* Search Bar */}
                <div className="flex w-3/4 lg:w-5xl bg-white border rounded shadow-sm">
                    <div className="flex items-center px-3 text-gray-400">
                        🔍
                    </div>
                    <input
                        className="flex-1 py-3 px-2 outline-none"
                        placeholder="Search for..."
                    />
                    <select className="border-l px-3 text-sm text-gray-600">
                        <option>All Categories</option>
                        <option>test1</option>
                        <option>test1</option>
                        <option>test1</option>
                    </select>
                    <button className="px-6 bg-blue-600 text-white hover:bg-blue-700">
                        Search
                    </button>
                </div>
            </div>

            {/* HISTORY LIST */}
            <div className="flex flex-col gap-3 max-w-5xl mx-auto  w-full">
                {data.map((item, i) => (
                    <div
                        key={i}
                        className="bg-gray-100 rounded-xl flex items-center p-6"
                    >
                        {/* IMAGE */}
                        <div className="w-40 h-32 bg-gray-300 rounded-xl flex items-center justify-center mr-6">
                            ❌
                        </div>

                        {/* CONTENT */}
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                👤
                                <span className="font-semibold">Jane Doe</span>
                            </div>
                            <p className="text-gray-400 text-sm mb-2">
                                Senior Designer
                            </p>
                            <p className="text-sm text-gray-600 max-w-md">
                                Egestas elit dui scelerisque ut eu purus aliquam vitae
                                habitasse.
                            </p>
                        </div>

                        {/* STATUS */}
                        <div className="text-right min-w-[120px]">
                            <p className="font-semibold text-lg">Status</p>
                            <p className="font-bold mt-2">xx/xx/xx</p>
                        </div>
                    </div>
                ))}
            </div>
            <Footer />

        </div>
    );
}