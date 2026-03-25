import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import NavbarAdim from "../../components/NavbarAdmin";
import Sidebar from "../../components/Sidebar";
import QRCode from "react-qr-code";
import {
    fetchPayout,
    updatePayoutWithSlip,
    uploadToCloudinary,
} from "../../app/Api";

export default function AdminPayout() {
    const { data, isLoading, refetch } = useQuery({
        queryKey: ["Payout"],
        queryFn: fetchPayout,
    });

    const payout = data?.row;
    const [selectedFile, setSelectedFile] = useState({});
    const [activeTab, setActiveTab] = useState("pending"); 

    const handleSubmit = async (payoutID) => {
        try {
            const file = selectedFile[payoutID];
            if (!file) return alert("กรุณาเลือกสลิป");

            const upslipFile = await uploadToCloudinary(file);

            await updatePayoutWithSlip({
                payoutID,
                upslipFile: upslipFile.url,
            });

            alert("ทำรายการสำเร็จ (paid)");
            refetch();
        } catch (err) {
            console.error(err);
            alert("เกิดข้อผิดพลาด");
        }
    };

    // ✅ filter ตาม tab
    const filteredPayouts = payout?.filter(
        (item) => item.PayoutStatus === activeTab
    );

    if (isLoading) {
        return <div className="p-10 text-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <NavbarAdim />
            <Sidebar />

            <div className="ml-64 pt-24 px-10">
                <h1 className="text-3xl font-bold mb-6">
                    💰 Payout Management
                </h1>

                {/* ✅ ปุ่มเลือก */}
                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => setActiveTab("pending")}
                        className={`px-4 py-2 rounded-lg font-semibold ${
                            activeTab === "pending"
                                ? "bg-yellow-500 text-white"
                                : "bg-gray-200"
                        }`}
                    >
                        ⏳ Pending
                    </button>

                    <button
                        onClick={() => setActiveTab("paid")}
                        className={`px-4 py-2 rounded-lg font-semibold ${
                            activeTab === "paid"
                                ? "bg-green-600 text-white"
                                : "bg-gray-200"
                        }`}
                    >
                        ✅ Paid
                    </button>
                </div>

                {/* ✅ รายการ */}
                <div className="grid gap-6">
                    {filteredPayouts?.map((item) => (
                        <div
                            key={item.PayoutID}
                            className="bg-white rounded-2xl shadow-md p-6 grid md:grid-cols-3 gap-6 items-center"
                        >
                            {/* LEFT */}
                            <div className="space-y-2">
                                <div className="text-lg font-semibold">
                                    Advisor #{item.AdvisorID}
                                </div>

                                <div className="text-gray-600">
                                    Amount: {item.Amount} ฿
                                </div>

                                <div className="text-gray-500 text-sm">
                                    Fee: {item.PlatformFee} ฿
                                </div>

                                <div className="text-xl font-bold text-green-600">
                                    Net: {item.NetAmount} ฿
                                </div>

                                <span
                                    className={`inline-block mt-2 px-3 py-1 text-sm rounded-full text-white ${
                                        item.PayoutStatus === "paid"
                                            ? "bg-green-500"
                                            : "bg-yellow-500"
                                    }`}
                                >
                                    {item.PayoutStatus}
                                </span>
                            </div>

                            {/* CENTER */}
                            <div className="flex justify-center">
                                <QRCode
                                    value={item.QRPayout || ""}
                                    size={160}
                                />
                            </div>

                            {/* RIGHT */}
                            <div className="space-y-3">
                                {activeTab === "pending" && (
                                    <>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="block w-full text-sm border rounded p-2"
                                            onChange={(e) =>
                                                setSelectedFile({
                                                    ...selectedFile,
                                                    [item.PayoutID]:
                                                        e.target.files[0],
                                                })
                                            }
                                        />

                                        <button
                                            onClick={() =>
                                                handleSubmit(item.PayoutID)
                                            }
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
                                        >
                                            Upload Slip & Pay
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}