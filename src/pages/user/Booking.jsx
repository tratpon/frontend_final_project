import NavbarSwitcher from "../../app/NavbarSwitcht";
import Footer from "../../components/Footer";

export default function Booking() {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <NavbarSwitcher/>
         
            <main className="flex-1 px-16 py-12">
                <div className="grid grid-cols-3 gap-16 max-w-6xl mx-auto">
                    {/* Booking Form */}
                    <div className="col-span-2 space-y-6">
                        <h2 className="text-lg font-semibold">booking from</h2>

                        <div className="grid grid-cols-2 gap-6">
                            <Field label="Name" />
                            <Field label="e-mail" />
                        </div>

                        <Field label="phone" />
                        <Field label="note" />
                    </div>

                    {/* Booking Detail */}
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-lg font-semibold border-b pb-2">Booking Detail</h2>
                            <div className="text-sm mt-4 space-y-2">
                                <p>ชื่อบริการ / หัวข้อการปรึกษา</p>
                                <p>ผู้ให้คำปรึกษา</p>
                                <p>รูปแบบ (Video / โทร / แชต)</p>
                                <p>ระยะเวลา (60 นาที)</p>
                                <p>วันที่ xx/xx/xx เวลา</p>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold">prices</h3>
                            <div className="flex justify-between border-b py-2 text-sm">
                                <span>total</span>
                                <span>250 บาท</span>
                            </div>
                        </div>

                        <div className="pt-4">
                            <div className="w-40 h-40 bg-gray-100 flex items-center justify-center">
                                <span className="text-xs text-gray-400">QR Code</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer/>
        </div>
    )
}
function Field({ label }) {
  return (
    <div>
      <label className="block text-sm mb-1">{label}</label>
      <input
        className="w-full bg-gray-100 px-3 py-2 rounded border border-gray-200"
        placeholder="Placeholder"
      />
    </div>
  );
}
