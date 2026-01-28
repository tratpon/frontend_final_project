import NavbarAdim from "../../components/NavbarAdmin"
import Sidebar from "../../components/Sidebar"

export default function AdminApproveForm() {
    return (
        <div className="min-h-full">
            <NavbarAdim />
            {/* className="flex-1 pl-70 pt-30 pr-10" */}
            <main>
                <div className="grid grid-cols-2 gap-x-20 gap-y-8 max-w-5xl mx-auto">
                    <Field label="First name" />
                    <Field label="Last name" />


                    <Field label="Gender" />
                    <Field label="Age" />


                    <Field label="Phone" />
                    <Field label="E-mail" />


                    <Field label="วุฒิการศึกษา" />
                    <Field label="เลขใบประกอบวิชาชีพ (ถ้ามี)" />


                    <Field label="สาขาที่ให้คำปรึกษา" />
                    <Field label="ประสบการณ์ทำงานด้านนี้ (ปี)" />


                    <Field label="ปัจจุบันทำอาชีพอะไร" />


                    <div className="flex items-end">
                        <button className="ml-auto bg-green-600 text-white px-12 py-3 rounded-full text-lg font-semibold">
                            Approve
                        </button>
                    </div>
                </div>
            </main>

        </div>
    )
    function Field({ label }) {
        return (
            <div className="flex items-center gap-4">
                <div className="flex-1">
                    <label className="block text-sm mb-1">{label}</label>
                    <input
                        className="w-full bg-gray-100 px-3 py-2 rounded border border-gray-200"
                        placeholder="Placeholder"
                    />
                </div>
                <div className="w-5 h-5 border-2 border-black rounded-sm" />
            </div>
        );
    }
}
