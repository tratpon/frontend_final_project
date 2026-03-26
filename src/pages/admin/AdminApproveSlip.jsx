import { useQuery } from "@tanstack/react-query";
import Sidebar from "../../components/Sidebar";
import { fetchBookingsByAdmin, updateStatusSlip } from "../../app/Api";


export default function AdminApproveSlip() {
    const { data, isLoading, refetch } = useQuery({
        queryKey: ["pendingBookings"],
        queryFn: fetchBookingsByAdmin,
    });
    console.log(data);

    const handlestatus = async (BillID, status, AvailabilityID,bookingID) => {
        try {
            await updateStatusSlip({
                BillID,  
                status,
                AvailabilityID,
                bookingID
            });
            alert(`สถานะถูกเปลี่ยนเป็น ${status} เรียบร้อยแล้ว`);
            refetch(); 
        } catch (err) {
            console.error(err);
            alert("เกิดข้อผิดพลาดในการอัปเดตสถานะ");
        }
    };


    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar />

            <div className="ml-64 pt-10 px-10 pb-10 space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800">Pending Bookings</h1>
                    <button
                        onClick={refetch}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition shadow-sm"
                    >
                        Refresh Data
                    </button>
                </div>

                {/* Grid Header (ส่วนหัวแบบจำลอง) */}
                <div className="hidden lg:grid grid-cols-8 gap-4 px-6 py-3 text-gray-600 ">
                    <div>User</div>
                    <div className="col-span-2">Service</div>
                    <div>Date/Time</div>
                    <div>Price</div>
                    <div>Slip</div>
                    <div className="col-span-2 text-center">Actions</div>
                </div>

                {/* Grid Body */}
                <div className="grid grid-cols-1 gap-4">
                    {data?.map((item) => (
                        <div
                            key={item.BookID}
                            className="grid grid-cols-1 lg:grid-cols-8 gap-4 items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition"
                        >
                            {/* User */}
                            <div className="flex flex-col">
                                <span className="font-medium">{item.UserName}</span>
                            </div>

                            {/* Service */}
                            <div className="lg:col-span-2 flex flex-col">
                                <span className="text-sm font-semibold text-blue-600">{item.ServiceName}</span>
                                <div>{new Date(item.AvailableDate).toLocaleDateString('th-TH')}</div>
                                <div className="text-xs">{item.StartTime} - {item.EndTime}</div>
                            </div>

                            {/* Date/Time */}
                            <div className="flex flex-col text-sm text-gray-600">
                                <span className="font-medium">{new Date(item.CreatedAt).toLocaleDateString('th-TH')}</span>
                                <span className="font-medium">{new Date(item.CreatedAt).toTimeString().slice(0, 5)}</span>

                            </div>
                            {/* Price */}
                            <div>
                                <span className="font-bold text-gray-700">{item.Amount} ฿</span>
                            </div>

                            {/* Slip Image */}
                            <div className="flex justify-start lg:justify-center">
                                <div className="w-16 h-16 rounded-lg overflow-hidden border bg-gray-50 flex items-center justify-center">
                                    {item.SlipURL ? (
                                        <img
                                            src={item.SlipURL}
                                            alt="Slip"
                                            className="w-full h-full object-cover cursor-zoom-in hover:scale-110 transition"
                                            onClick={() => window.open(item.SlipURL, "_blank")}
                                        />
                                    ) : (
                                        <span className="text-2xl opacity-20">👤</span>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="lg:col-span-2 flex gap-2 justify-end lg:justify-center border-t lg:border-none pt-4 lg:pt-0">
                                <button
                                    className="flex-1 lg:flex-none bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                                    onClick={() => handlestatus(item.BillID, "paid",item.AvailabilityID,item.BookID)} // แก้ชื่อสถานะให้ตรงกับ Database (เช่น confirmed/rejected)
                                >
                                    Approve
                                </button>
                                <button
                                    className="flex-1 lg:flex-none bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                                    onClick={() => handlestatus(item.BillID, "failed",item.AvailabilityID,item.BookID)}
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {data?.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed">
                        <p className="text-gray-400">No pending bookings found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}