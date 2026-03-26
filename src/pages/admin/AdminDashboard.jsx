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
  ResponsiveContainer,
} from "recharts";

export default function AdminDashboard() {

  const { data, isLoading } = useQuery({
    queryKey: ["adminDashboard"],
    queryFn: fetchAdminDashboard
  });

  if (isLoading) return <div>Loading...</div>;

  console.log(data);

  // ✅ แก้ตรงนี้ (สำคัญมาก)
  const charts = data?.charts;
  const rankings = data?.rankings;
  const users = data?.userStats;

  const monthlyRevenue = charts?.monthlyRevenue || [];
  const bookingPerMonth = charts?.bookingPerMonth || [];
  const newUsers = users?.newUsers || [];

  const topAdvisors = rankings?.topAdvisors || [];
  const topServices = rankings?.topServices || [];

  const chartData = monthlyRevenue.map(item => ({
  ...item,
  profit: item.revenue * 0.10 
}));

  return (
    <div className="min-h-screen bg-gray-200">

     
      <Sidebar />

      <main className="flex-1 pl-70 pt-10 pr-10">

        {/* STAT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

          <StatCard
            icon="💰"
            title="รายได้/กำไร"
            value={`$${monthlyRevenue.at(-1)?.revenue || 0}`}
            sup={`$${monthlyRevenue.at(-1)?.revenue * 0.10 || 0}`}
          />

          <StatCard
            icon="📦"
            title="การจอง"
            value={bookingPerMonth.at(-1)?.total || 0}
          />

          <StatCard
            icon="👤"
            title="ผู้ใช้ไหม"
            value={newUsers.at(-1)?.total || 0}
          />

        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">

          <ChartCard title="รายรับรายเดือน">




            <ResponsiveContainer width="100%" height={250}>
  <LineChart data={chartData}> {/* ใช้ข้อมูลที่ map แล้ว */}
    <XAxis dataKey="month" />
    <YAxis />
    <Tooltip />
    
    {/* เส้นรายรับ */}
    <Line 
      type="monotone" 
      dataKey="revenue" 
      name="รายรับ" 
      stroke="#8884d8" 
      strokeWidth={2} 
    />
    
    {/* เส้นกำไร (เส้นที่สอง) */}
    <Line 
      type="monotone" 
      dataKey="profit" 
      name="กำไร" 
      stroke="#82ca9d" 
      strokeWidth={2} 
    />
  </LineChart>
</ResponsiveContainer>

          </ChartCard>

          <ChartCard title="การจองต่อแเดือน">

            <ResponsiveContainer width="100%" height={250}>
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
function StatCard({ icon, title, value, sup }) {

  return (
    <div className="bg-white rounded-xl p-6 flex items-center gap-4 shadow-sm">

      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-xl">
        {icon}
      </div>

      <div>
        <p className="text-sm text-gray-400">{title}</p>
        <div className="flex items-baseline font-bold text-lg">
          <p>{value}</p>
          {sup && <p className="text-green-600">/{sup}</p>}
        </div>
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

        {advisors?.map((a) => (
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

        {services?.map((s) => (
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