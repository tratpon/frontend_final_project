import { Link } from "react-router-dom";

const items = Array(10).fill({
    name: "Jane Doe",
    role: "Senior Designer",
    description:
        "Egestas elit dui scelerisque ut eu purus aliquam vitae habitasse.",
    detail: "/detail"
});

const EditCard = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item, index) => (
                <div to={item.detail} key={index} className="bg-white border rounded-lg p-4">
                    <Link to={item.detail}>
                        <div className="w-full h-40 bg-gray-200 rounded mb-4"></div>

                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                            <div>
                                <h3 className="font-medium">{item.name}</h3>
                                <p className="text-sm text-gray-500">{item.role}</p>
                            </div>
                        </div>

                        <p className="text-sm text-gray-600">{item.description}</p>
                    </Link>


                    <div className="text-xs text-right mt-4 flex justify-between">
                        <Link type="button" to="/Advisor/ManegeService" className="bg-red-600 px-2 rounded-full text-white"> edit </Link>
                        #### xxxx
                    </div>
                </div>
            ))}

            <Link to="/Advisor/ManegeService" className="bg-white border rounded-lg p-4">
                <div className="flex items-center justify-center w-full h-full bg-gray-200 rounded mb-4">
                    <span className="text-3xl text-gray-400 group-hover:text-blue-500 font-light">+</span>
                </div>

            </Link>
        </div>
    );

}
export default EditCard;