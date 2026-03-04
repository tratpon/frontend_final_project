import NavbarAdvisor from "../../components/NavbarAdvisor";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchServiceByAdvisor } from "../../app/Api";
import { Link } from "react-router-dom";
import DetailAdvisor from "../../components/advisor/DetailAdvisor";

export default function AdvisorServiceList() {
    const Navigate = useNavigate()
    function test() {
        Navigate("/")
    }

    const { data } = useQuery({
        queryKey: ["services"],
        queryFn: fetchServiceByAdvisor,
    })

    const services = data?.services ?? [];
    console.log(services)


    const handleEdit = () => {
        Navigate("/Advisor/ManegeService")
    }

    const handleDelete = (id) => {
        const confirmDelete = window.confirm("คุณต้องการลบหรือไม่?");
        if (!confirmDelete) return;

    };


    return (
        <div className="min-h-screen bg-gray-50">
            <NavbarAdvisor />
            <div className="w-full h-64 bg-gray-200 flex justify-center items-center">
                <div className="w-60 h-48 bg-gray-300"></div>
            </div>

            <div className="max-w-8xl mx-auto px-6 -mt-32">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 ">

                    <DetailAdvisor/>

                    <div className="lg:col-span-3 mt-40">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {services?.map((service) => (
                                <div key={service.id} className="flex flex-col border p-4 rounded bg-gray-50 h-full">
                                    <Link to={`/detail/${service.ServiceID}`} className="flex flex-col grow">
                                        <div className="w-full h-40 bg-gray-200 rounded mb-4"></div>
                                        <div className="flex grow items-center gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                                            <div>
                                                <h3 className="font-medium">{service.ServiceName}</h3>
                                                <p className="text-sm text-gray-500">{service.ServiceName}</p>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600">{service.Front_Description}</p>
                                        <p className="text-xs text-gray-400 text-right mt-4">⏱ {service.Duration}</p>
                                        <p className="text-xs text-gray-400 text-right mt-4">💰 {service.price} บาท</p>
                                    </Link>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3 mt-5">
                                        <button onClick={() => handleEdit(service.id)} className="flex-1  bg-gray-100 py-2 rounded-lg hover:bg-gray-200 transition">
                                            Edit
                                        </button>
                                        <button onClick={() => handleDelete(service.id)} className="flex-1 bg-red-100 text-red-600 py-2 rounded-lg hover:bg-red-200 transition">
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <Link to="/Advisor/ManegeService" className="bg-white border rounded-lg p-4">
                                <div className="flex items-center justify-center w-full h-full bg-gray-200 rounded mb-4">
                                    <span className="text-3xl text-gray-400 group-hover:text-blue-500 font-light">+</span>
                                </div>

                            </Link>
                        </div>


                    </div>

                </div>
            </div>
        </div>
    )

}