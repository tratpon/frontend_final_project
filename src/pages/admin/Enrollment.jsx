import NavbarSwitcher from "../../app/NavbarSwitcht";
export default function Enrollment() {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <NavbarSwitcher/>
            <main className="flex-1 px-16 py-16">
                <div className="max-w-4xl mx-auto grid grid-cols-2 gap-x-24 gap-y-8">
                    <Field label="first name" />
                    <Field label="last name" />


                    <Field label="gender" />
                    <Field label="age" />


                    <Field label="phone" />
                    <Field label="e-mail" />


                    <div className="col-span-2 h-6" />


                    <Field label="วุฒิการศึกษา" />
                    <Field label="เลขใบประกอบวิชาชีพ (ถ้ามี)" />


                    <Field label="สาขาที่ให้คำปรึกษา" />
                    <Field label="ประสบการณ์ทำงานด้านนี้ (ปี)" />


                    <Field label="ปัจจุบันทำอาชีพอะไร" />
                    <div className="flex items-end">
                        <button className="ml-auto bg-green-600 text-white px-12 py-3 rounded-full text-lg font-semibold">
                            Enrollment
                        </button>
                    </div>
                </div>
            </main>

        </div>
    )
}

function Field({ label }) {
    return (
        <div>
            <label className="block text-sm mb-1">{label}</label>
            <input
                className="w-full bg-gray-100 px-4 py-2 rounded border border-gray-200"
                placeholder="Placeholder"
            />
        </div>
    );
}