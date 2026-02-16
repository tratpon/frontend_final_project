import { Link } from "react-router-dom";

const Card = ({ serviceList }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {serviceList.map((service) => (
                <Link to={`/service/${service.ServiceID}`} key={service.ServiceID} className="bg-white border rounded-lg p-4">
                    <div className="w-full h-40 bg-gray-200 rounded mb-4"></div>
            
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                        <div>
                            <h3 className="font-medium">{service.ServiceName}</h3>
                            <p className="text-sm text-gray-500">{service.ServiceName}</p>
                        </div>
                    </div>

                    <p className="text-sm text-gray-600">{service.Front_Description}</p>

                    <div className="text-xs text-gray-400 text-right mt-4">
                        #### xxxx
                    </div>
                </Link>
            ))}
        </div>
    );

}
export default Card;