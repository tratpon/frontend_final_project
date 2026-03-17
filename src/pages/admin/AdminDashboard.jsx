import NavbarAdim from "../../components/NavbarAdmin";
import Sidebar from "../../components/Sidebar";
import { useQuery } from "@tanstack/react-query";
import { fetchAdminDashboard } from "../../app/Api";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function AdminDashboard() {

  const { data } = useQuery({
    queryKey:["adminDashboard"],
    queryFn: fetchAdminDashboard
  });

  const charts = data?.data?.charts;
  const rankings = data?.data?.rankings;
  const users = data?.data?.userStats;

  const monthlyRevenue = charts?.monthlyRevenue || [];
  const bookingPerMonth = charts?.bookingPerMonth || [];
  const newUsers = users?.newUsers || [];

  const topAdvisors = rankings?.topAdvisors || [];
  const topServices = rankings?.topServices || [];

  return (
    <div className="min-h-screen bg-gray-200">

      <NavbarAdim />
      <Sidebar />

      <main className="flex-1 pl-70 pt-30 pr-10">

        {/* STAT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

          <StatCard
            icon="💰"
            title="Monthly Revenue"
            value={`$${monthlyRevenue?.[monthlyRevenue.length-1]?.revenue || 0}`}
          />

          <StatCard
            icon="📦"
            title="Bookings"
            value={bookingPerMonth?.[bookingPerMonth.length-1]?.total || 0}
          />

          <StatCard
            icon="👤"
            title="New Users"
            value={newUsers?.[newUsers.length-1]?.total || 0}
          />

        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">

          <ChartCard title="Monthly Revenue">

            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={monthlyRevenue}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" />
              </LineChart>
            </ResponsiveContainer>

          </ChartCard>


          <ChartCard title="Bookings per Month">

            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={bookingPerMonth}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" />
              </BarChart>
            </ResponsiveContainer>

          </ChartCard>

        </div>

        {/* BOTTOM */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <TopAdvisor advisors={topAdvisors} />
          <TopService services={topServices} />

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
function ChartCard({ title, children }) {

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">

      <h3 className="font-semibold mb-4">{title}</h3>

      {children}

    </div>
  );

}
function TopAdvisor({ advisors }) {

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">

      <h3 className="font-semibold mb-4">Top Advisors</h3>

      <div className="space-y-4">

        {advisors?.map((a)=>(
          <div
            key={a.AdvisorID}
            className="flex justify-between border-b pb-2"
          >

            <span>
              {a.Fadvisor} {a.Ladvisor}
            </span>

            <span className="text-gray-500">
              {a.totalBooking} bookings
            </span>

          </div>
        ))}

      </div>

    </div>
  );

}
function TopService({ services }) {

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">

      <h3 className="font-semibold mb-4">Top Services</h3>

      <div className="space-y-4">

        {services?.map((s)=>(
          <div
            key={s.ServiceID}
            className="flex justify-between border-b pb-2"
          >

            <span>{s.ServiceName}</span>

            <span className="text-gray-500">
              {s.totalBooking} bookings
            </span>

          </div>
        ))}

      </div>

    </div>
  );

}