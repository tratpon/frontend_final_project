import NavbarAdim from "../../components/NavbarAdmin";
import Sidebar from "../../components/Sidebar";
import { useQuery } from "@tanstack/react-query";
import { fetchAdminDashboard } from "../../app/Api";
import { 
  TrendingUp, 
  Users, 
  Package, 
  DollarSign, 
  ArrowUpRight, 
  Medal, 
  Star,
  Loader2
} from "lucide-react";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";

export default function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["adminDashboard"],
    queryFn: fetchAdminDashboard
  });

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Loader2 className="animate-spin text-indigo-600" size={40} />
    </div>
  );

  const charts = data?.charts;
  const rankings = data?.rankings;
  const users = data?.userStats;

  const monthlyRevenue = charts?.monthlyRevenue || [];
  const bookingPerMonth = charts?.bookingPerMonth || [];
  const newUsers = users?.newUsers || [];

  const topAdvisors = rankings?.topAdvisors || [];
  const topServices = rankings?.topServices || [];

  // คำนวณกำไร 10% และเตรียมข้อมูลสำหรับ AreaChart
  const chartData = monthlyRevenue.map(item => ({
    ...item,
    profit: item.revenue * 0.10
  }));

  return (
    <div className="min-h-screen bg-slate-50/50 flex">
      <Sidebar />

      <main className="flex-1 ml-72 p-10">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Executive Overview</h1>
          <p className="text-slate-500 font-medium">วิเคราะห์รายได้และการเติบโตของแพลตฟอร์ม</p>
        </header>

        {/* STAT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard
            icon={<DollarSign size={24} />}
            title="Monthly Revenue / Profit"
            value={`฿${(monthlyRevenue.at(-1)?.revenue || 0).toLocaleString()}`}
            sup={`฿${(monthlyRevenue.at(-1)?.revenue * 0.10 || 0).toLocaleString()}`}
            color="bg-emerald-500"
            isProfit
          />
          <StatCard
            icon={<Package size={24} />}
            title="Monthly Bookings"
            value={bookingPerMonth.at(-1)?.total || 0}
            color="bg-indigo-500"
          />
          <StatCard
            icon={<Users size={24} />}
            title="Monthly New Users"
            value={newUsers.at(-1)?.total || 0}
            color="bg-orange-500"
          />
        </div>

        {/* CHARTS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <ChartCard title="Revenue & Profit Analysis" subtitle="ภาพรวมรายรับและกำไรสุทธิ (10%)">
            <div className="h-[300px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" name="รายได้รวม" />
                  <Area type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={3} fill="transparent" name="กำไรสุทธิ" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard title="Bookings Growth" subtitle="จำนวนการจองรายเดือน">
            <div className="h-[300px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bookingPerMonth}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="total" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={40} name="จำนวนการจอง" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        {/* RANKINGS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RankingCard title="Top Performing Advisors" icon={<Medal className="text-orange-500" />}>
            {topAdvisors.map((a, i) => (
              <RankingItem 
                key={a.AdvisorID} 
                name={`${a.Fadvisor} ${a.Ladvisor}`} 
                value={a.totalBooking} 
                rank={i + 1}
                unit="bookings"
              />
            ))}
          </RankingCard>

          <RankingCard title="Best Selling Services" icon={<Star className="text-yellow-500" />}>
            {topServices.map((s, i) => (
              <RankingItem 
                key={s.ServiceID} 
                name={s.ServiceName} 
                value={s.totalBooking} 
                rank={i + 1}
                unit="bookings"
              />
            ))}
          </RankingCard>
        </div>
      </main>
    </div>
  );
}

// --- Sub-Components ---

function StatCard({ icon, title, value, sup, color, trend, isProfit }) {
  return (
    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 flex flex-col justify-between group hover:border-indigo-100 transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center text-white shadow-lg shadow-indigo-100`}>
          {icon}
        </div>
        {trend && <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg uppercase">{trend}</span>}
      </div>
      <div>
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
        <div className="flex items-baseline gap-2">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">{value}</h2>
          {isProfit && (
            <div className="flex items-center text-emerald-600 font-bold text-sm bg-emerald-50 px-2 py-0.5 rounded-lg">
              <ArrowUpRight size={14} />
              {sup}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ChartCard({ title, subtitle, children }) {
  return (
    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 transition-all">
      <div className="mb-6">
        <h3 className="text-lg font-black text-slate-800 tracking-tight">{title}</h3>
        <p className="text-xs font-bold text-slate-400">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

function RankingCard({ title, icon, children }) {
  return (
    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-slate-50 rounded-xl">{icon}</div>
        <h3 className="text-lg font-black text-slate-800 tracking-tight">{title}</h3>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function RankingItem({ name, value, rank, unit }) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl hover:bg-slate-50 transition-colors group">
      <div className="flex items-center gap-4">
        <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm 
          ${rank === 1 ? 'bg-indigo-600 text-white' : 'bg-white text-slate-400 border border-slate-100'}`}>
          {rank}
        </span>
        <span className="font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">{name}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-lg font-black text-slate-800">{value}</span>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{unit}</span>
      </div>
    </div>
  );
}