import NavbarAdvisor from "../../components/NavbarAdvisor";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchServiceByAdvisor, deleteService } from "../../app/Api";
import { Link } from "react-router-dom";
import DetailAdvisor from "../../components/advisor/DetailAdvisor";

export default function AdvisorServiceList() {
    const navigate = useNavigate()
    const queryClient = useQueryClient();

    const { data } = useQuery({
        queryKey: ["serviceslist"],
        queryFn: fetchServiceByAdvisor,
    })

    const services = data?.services ?? [];
    console.log(services)


    const handleEdit = (service) => {
        navigate(`/Advisor/ManegeService/${service}`)
    }

    const renderStars = (rating = 0) => {
        const full = Math.floor(rating);
        const half = rating % 1 >= 0.5;
        const empty = 5 - full - (half ? 1 : 0);

        return (
            <>
                {"★".repeat(full)}
                {half && "⭐"}
                {"☆".repeat(empty)}
            </>
        );
    };
    const deleteMutation = useMutation({
        mutationFn: deleteService,
        onSuccess: () => {
            alert('deleted')
            queryClient.invalidateQueries({ queryKey: ["serviceslist"] })
        }
    });

    const handleDelete = (id) => {
        const confirmDelete = window.confirm("คุณต้องการลบหรือไม่?");
        if (!confirmDelete) return;
        deleteMutation.mutate(id)
    };


    return (
        <div className="min-h-screen bg-gray-50">
            <NavbarAdvisor />

            <div className="w-full h-40 sm:h-52 md:h-64 relative overflow-hidden">
                {services.length > 0 && (
                    <img
                        src={services[0].ImageURL}
                        alt="banner"
                        className="w-full h-full object-cover blur-md scale-110"
                    />
                )}

                <div className="absolute inset-0 bg-black/30"></div>
            </div>

            <div className="max-w-8xl mx-auto px-6 -mt-32">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 ">

                    <DetailAdvisor />
                    <div className="lg:col-span-3 md:mt-40">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {services?.map((service) => (
                                <div key={service.ServiceID} className="flex flex-col border p-4 rounded bg-gray-50 h-full hover:-translate-y-2 hover:shadow-2xl duration-300">

                                    <Link to={`/detail/${service.ServiceID}`} className="flex flex-col flex-1">

                                        <div className="relative w-full h-32 sm:h-40 bg-gray-200 rounded mb-3 sm:mb-4 overflow-hidden">
                                            <div className="absolute top-2 right-2 z-10 bg-white/80 px-2 py-1 rounded shadow-sm">
                                                <p className="text-[10px] sm:text-xs font-bold text-green-600">
                                                    #{service.TypesName}
                                                </p>
                                            </div>

                                            {service.ImageURL ? (
                                                <img
                                                    src={service.ImageURL}
                                                    alt={service.ServiceName}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-gray-400">
                                                    No Image
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                                                {service.imageAdvisorUrl ? (
                                                    <img
                                                        src={service.imageAdvisorUrl}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    "👤"
                                                )}
                                            </div>

                                            <div>
                                                <h3 className="font-medium">{service.ServiceName}</h3>
                                                <p className="text-sm text-gray-500">
                                                    {service.Fadvisor} {service.Ladvisor}
                                                </p>

                                                <div className="flex gap-2 text-yellow-500 text-xs">
                                                    {renderStars(service.AvgRating)}
                                                    <span className="text-gray-500">{service.AvgRating}</span>
                                                    <span className="text-gray-500">({service.ReviewCount})</span>
                                                </div>
                                            </div>
                                        </div>

                                        <p className="text-sm text-gray-600 line-clamp-3 wrap-break-word">
                                            {service.Front_Description}
                                        </p>

                                        <div className="mt-auto text-xs text-gray-400 text-right pt-4">
                                            <div>{service.price} บาท</div>
                                            <div>{service.Duration} นาที</div>
                                        </div>

                                    </Link>

                                    <div className="flex gap-3 mt-5">
                                        <button
                                            onClick={() => handleEdit(service.ServiceID)}
                                            className="flex-1 bg-gray-100 py-2 rounded-lg hover:bg-gray-200 transition"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() => handleDelete(service.ServiceID)}
                                            className="flex-1 bg-red-100 text-red-600 py-2 rounded-lg hover:bg-red-200 transition"
                                        >
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