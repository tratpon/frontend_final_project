const items = Array(10).fill({
    name: "Jane Doe",
    role: "Senior Designer",
    description:
        "Egestas elit dui scelerisque ut eu purus aliquam vitae habitasse.",
});

const Card = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item, index) => (
                <div key={index} className="bg-white border rounded-lg p-4">
                    <div className="w-full h-40 bg-gray-200 rounded mb-4"></div>

                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                        <div>
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="text-sm text-gray-500">{item.role}</p>
                        </div>
                    </div>

                    <p className="text-sm text-gray-600">{item.description}</p>

                    <div className="text-xs text-gray-400 text-right mt-4">
                        #### xxxx
                    </div>
                </div>
            ))}
        </div>
    );

}
export default Card;