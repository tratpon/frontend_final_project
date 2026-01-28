export default function ManegeSevice() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* LEFT : Images */}
        <div className="md:col-span-2 space-y-4">
          {/* Main Image */}
          <div className="relative bg-gray-200 h-80 rounded-lg flex items-center justify-center">
            <div className="w-24 h-24 border-4 border-gray-300 flex items-center justify-center">
              <span className="text-gray-400">IMG</span>
            </div>

            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full shadow px-3 py-2">
              ❯
            </button>
          </div>

          {/* Thumbnails */}
          <div className="flex gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex-1 bg-gray-200 h-24 rounded flex items-center justify-center"
              >
                <span className="text-gray-400">IMG</span>
              </div>
            ))}
          </div>

          {/* Upload Button */}
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm shadow">
            ⬆ Images
          </button>
        </div>

        {/* RIGHT : Form */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Name service</label>
            <input
              type="text"
              placeholder="Placeholder"
              className="w-full mt-1 p-2 bg-gray-100 rounded"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea
              placeholder="Placeholder"
              className="w-full mt-1 p-2 bg-gray-100 rounded h-24"
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              ระยะเวลา (30 / 60 / 90 นาที)
            </label>
            <input
              type="text"
              placeholder="Placeholder"
              className="w-full mt-1 p-2 bg-gray-100 rounded"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Prices</label>
            <input
              type="text"
              placeholder="Placeholder"
              className="w-full mt-1 p-2 bg-gray-100 rounded"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
