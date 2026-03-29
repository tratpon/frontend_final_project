import Footer from "../../components/Footer";
import NavbarSwitcher from "../../app/NavbarSwitcht";
import { useQuery } from "@tanstack/react-query";
import { fetchPayoutByAdvisor } from "../../app/Api";
import { useState } from "react";

export default function AdvisorPayoutHistory() {
  const [statusFilter, setStatusFilter] = useState("all");

  const {
    data: payouts = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ["advisorPayout"],
    queryFn: fetchPayoutByAdvisor,
    refetchOnWindowFocus: false
  });

  // 🎯 filter
  const filtered = payouts.filter((item) => {
    if (statusFilter === "all") return true;
    return item.Status === statusFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-yellow-500";
      case "paid":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NavbarSwitcher />

      {/* ✅ สำคัญ: ทำให้ content ยืดเต็มจอ */}
      <main className="flex-1">

        <h1 className="text-3xl font-bold text-center mt-10 mb-6">
          ประวิติการจ่ายเงิน
        </h1>

        {/* FILTER */}
        <div className="flex justify-center gap-2 mb-6 flex-wrap">
          {["all", "pending", "paid"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-full border ${
                statusFilter === status
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-600"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="text-center mt-10">โหลด..</div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center text-red-500 mt-10">
            Error loading data
          </div>
        )}

        {/* Empty */}
        {!isLoading && payouts.length === 0 && (
          <div className="text-center text-gray-500 mt-20">
            ไม่มีประวัติ
          </div>
        )}

        {/* LIST */}
        <div className="max-w-5xl mx-auto w-full px-4 space-y-4 mb-10">
          {filtered.map((item) => (
            <div
              key={item.PayoutID}
              className="bg-gray-100 p-5 rounded-xl shadow-sm flex flex-col sm:flex-row gap-4"
            >
              {/* LEFT */}
              <div className="flex-1">
                <p className="font-semibold text-lg">
                  การจองที่ #{item.BookID}
                </p>

                <p className="text-gray-500 text-sm">
                  บริการ: {item.ServiceName}
                </p>

                <p className="text-gray-500 text-sm">
                  วันที่: {new Date(item.AvailableDate).toLocaleDateString()}
                </p>
              </div>

              {/* MONEY */}
              <div className="flex flex-col text-sm">
                <p>ยอด: {item.Amount} ฿</p>
                <p>ค่าธรรมเนียม: {item.PlatformFee} ฿</p>
                <p className="font-bold text-green-600">
                  ยอดสุทธิ: {item.NetAmount} ฿
                </p>
              </div>

              {/* STATUS */}
              <div className="flex flex-col items-end">
                <p className={`font-semibold ${getStatusColor(item.Status)}`}>
                  {item.Status}
                </p>

                {item.PaidAt && (
                  <p className="text-xs text-gray-500">
                    จ่าย:{" "}
                    {new Date(item.PaidAt).toLocaleDateString("th-TH")}
                  </p>
                )}
              </div>

              {/* SLIP */}
              <div className="w-20 h-20 border rounded overflow-hidden">
                {item.SlipURL ? (
                  <img
                    src={item.SlipURL}
                    alt="slip"
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => window.open(item.SlipURL)}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    -
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

      </main>

      <Footer />
    </div>
  );
}