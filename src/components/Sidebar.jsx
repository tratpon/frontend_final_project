const Sidebar = () => {
    return (
        <aside className="fixed w-64 bg-white p-6 float-right">
            <div className="mb-10 font-bold text-lg">WebbyFrames</div>

            <nav className="flex flex-col gap-6 text-gray-400">
                <div className="flex items-center gap-3 text-blue-600 font-medium">
                    🏠 <span>xxxxxxx</span>
                </div>
                <div className="flex items-center gap-3">
                    💰 <span>xxxxxxx</span>
                </div>
                <div className="flex items-center gap-3">
                    👤 <span>xxxxxxx</span>
                </div>
            </nav>
        </aside>
    );

}
export default Sidebar;