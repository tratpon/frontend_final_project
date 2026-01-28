import NavbarSwitcher from "../../app/NavbarSwitcht"
import Footer from "../../components/Footer";
export default function UserProfile() {
    return (
        <div className="flex flex-col min-h-screen">
            <NavbarSwitcher />
            <div className="grow py-10">
                <div className="min-h-sceen max-w-3xl mx-auto border rounded-2xl p-10">
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                            👤
                        </div>
                    </div>

                    <div className="mb-6">
                        <Field label="user name" />
                    </div>
                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <Field label="first name" />
                        <Field label="last name" />


                        <Field label="gender" />
                        <Field label="age" />


                        <Field label="phone" />
                        <Field label="e-mail" />

                    </div>
                    <div className="flex items-end">
                        <button className="ml-auto bg-green-600 text-white px-12 py-3 rounded-full text-lg font-semibold">
                            submmit
                        </button>
                    </div>


                </div>
            </div>
            <Footer />
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