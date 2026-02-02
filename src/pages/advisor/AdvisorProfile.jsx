import NavbarAdvisor from "../../components/NavbarAdvisor";
import Footer from "../../components/Footer";
import React from "react";

const StatCard = ({ icon, label, value }) => (
    <div className="flex items-center gap-4 border rounded-2xl p-6 w-full bg-white">
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-xl font-semibold">{value}</p>
        </div>
    </div>
);

const ServiceCard = () => (
    <div className="flex justify-between items-center border rounded-2xl p-6 bg-white w-full">
        <div>
            <p className="font-semibold">service name</p>
            <p className="text-sm text-gray-500">Invested Amount</p>
            <p className="font-semibold">$150,000</p>
        </div>
        <div className="text-right">
            <p className="text-sm text-gray-500">user Number</p>
            <p className="font-semibold">1,250</p>
        </div>
    </div>
);

export default function AdvisorProfile() {
    return (
        <div className="min-h-screen bg-gray-50">
            <NavbarAdvisor />
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 pt-5">

                {/* Profile Form */}
                <div className="lg:col-span-2 bg-white border rounded-2xl p-8">
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-3xl">
                            👤
                        </div>
                    </div>

                    <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input label="user name" />
                        <div className="md:col-span-2" />

                        <Input label="first name" />
                        <Input label="last name" />

                        <Input label="gender" />
                        <Input label="age" />

                        <Input label="phone" />
                        <Input label="e-mail" />
                    </form>
                </div>

                {/* Stats + Top Service */}
                <div className="space-y-6">
                    <StatCard
                        label="Total Invested Amount"
                        value="$150,000"
                        icon="💰"
                    />
                    <StatCard
                        label="user Number"
                        value="1,250"
                        icon="👥"
                    />

                    <div className="border rounded-2xl p-6 bg-white">
                        <h3 className="text-lg font-semibold mb-4">Top service</h3>
                        <div className="flex gap-4 overflow-x-auto">
                            <ServiceCard />
                            <ServiceCard />
                        </div>
                    </div>
                </div>
            </div>
        
        </div>
    );
}

const Input = ({ label }) => (
    <div>
        <label className="block text-sm text-gray-600 mb-1">
            {label}
        </label>
        <input
            type="text"
            placeholder="Placeholder"
            className="w-full rounded-lg bg-gray-100 px-4 py-2 outline-none focus:ring-2 focus:ring-black"
        />
    </div>
);
