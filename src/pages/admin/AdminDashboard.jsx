import NavbarAdim from "../../components/NavbarAdmin";
import Sidebar from "../../components/Sidebar"



export default function AdminDashboard() {
    return (
        <div className="min-h-screen bg-gray-200">
            <NavbarAdim />
            <Sidebar />

            {/* MAIN */}
            <main className="flex-1 pl-70 pt-30 pr-10">
                {/* STAT CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <StatCard icon="💰" title="Total Invested Amount" value="$150,000" />
                    <StatCard icon="👥" title="User Number" value="1,250" />
                    <StatCard icon="📈" title="Rate of hire" value="+5.80%" />
                </div>

                {/* CHARTS */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
                    <ChartCard title="Yearly Total Investment" />
                    <ChartCard title="Monthly Revenue" />
                </div>

                {/* BOTTOM */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <TopConsult />
                    <ChartCard title="Categories" />
                </div>
            </main>
        </div>
    );
}

function StatCard({ icon, title, value }) {
    return (
        <div className="bg-white rounded-xl p-6 flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-xl">
                {icon}
            </div>
            <div>
                <p className="text-sm text-gray-400">{title}</p>
                <p className="font-bold text-lg">{value}</p>
            </div>
        </div>
    );
}

function ChartCard({ title }) {
    return (
        <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold mb-4">{title}</h3>

            {/* Chart Placeholder */}
            <div className="h-52 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                Chart Area
            </div>
        </div>
    );
}

function TopConsult() {
    const users = ["Livia Bator", "Randy Press", "Workman"];

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold mb-4">Top Consult</h3>

            <div className="flex items-center gap-6">
                {users.map((name) => (
                    <div key={name} className="text-center">
                        <div className="w-14 h-14 rounded-full bg-gray-100 mx-auto mb-2" />
                        <p className="text-sm">{name}</p>
                    </div>
                ))}

                <button className="ml-auto w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    →
                </button>
            </div>
        </div>
    );
}
