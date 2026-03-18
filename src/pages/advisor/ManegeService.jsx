import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchServiceByID,
  createService,
  updateService,
  addServiceImage,
  uploadToCloudinary,
  deleteServiceImage,
} from "../../app/Api";

export default function ManageService() {

  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const isEdit = !!id;

  const [uploading, setUploading] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);

  const [form, setForm] = useState({
    ServiceName: "",
    Front_Description: "",
    Full_Description: "",
    Duration: "",
    price: ""
  });

  // 🔵 fetch service
  const { data } = useQuery({
    queryKey: ["service", id],
    queryFn: () => fetchServiceByID(id),
    enabled: isEdit
  });

  const images = data?.image || [];

  // fill form when edit
  useEffect(() => {

    if (data?.service) {
      setForm({
        ServiceName: data.service.ServiceName,
        Front_Description: data.service.Front_Description,
        Full_Description: data.service.Full_Description,
        Duration: data.service.Duration,
        price: data.service.price
      });
    }

    if (data?.image?.length > 0) {
      setSelectedImage(data.image[0].ImageURL);
    }

  }, [data]);

  // 🟢 create
  const createMutation = useMutation({
    mutationFn: createService,
    onSuccess: () => {
      alert("Service created");
      navigate("/advisor/ServiceList");
    }
  });

  // 🟡 update
  const updateMutation = useMutation({
    mutationFn: updateService,
    onSuccess: () => {
      alert("Service updated");
      navigate("/advisor/ServiceList");
    }
  });

  // upload image
  const imageMutation = useMutation({
    mutationFn: addServiceImage,
    onSuccess: () => {
      queryClient.invalidateQueries(["service", id]);
    }
  });

  // delete image
  const deleteImageMutation = useMutation({
    mutationFn: deleteServiceImage,
    onSuccess: () => {
      queryClient.invalidateQueries(["service", id]);
    }
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEdit) {
      updateMutation.mutate({
        id,
        data: form
      });
    } else {
      createMutation.mutate(form);
    }
  };

  const handleUpload = async (file) => {

    if (images.length >= 4) {
      alert("Max 4 images");
      return;
    }

    try {

      setUploading(true);

      const cloud = await uploadToCloudinary(file);

      await imageMutation.mutateAsync({
        serviceID: id,
        imageURL: cloud.secure_url,
        publicID: cloud.public_id
      });

    } catch (err) {
      console.log(err);
    }

    setUploading(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">

      <h1 className="text-2xl font-bold mb-6">
        {isEdit ? "Edit Service" : "Create Service"}
      </h1>

      <form onSubmit={handleSubmit}>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* LEFT : Images */}
          <div className="md:col-span-2 space-y-4">

            {/* Main Image */}
            <div className="bg-gray-200 h-80 rounded flex items-center justify-center">

              {selectedImage ? (
                <img
                  src={selectedImage}
                  className="h-full w-full object-cover rounded"
                />
              ) : (
                <span className="text-gray-400">
                  Service Image
                </span>
              )}

            </div>

            {/* Gallery */}
            <div className="grid grid-cols-4 gap-4">

              {images.map((img) => (
                <div key={img.ImageID} className="relative">

                  <img
                    src={img.ImageURL}
                    onClick={() => setSelectedImage(img.ImageURL)}
                    className={`h-24 w-full object-cover rounded cursor-pointer
                    ${selectedImage === img.ImageURL
                        ? "ring-2 ring-blue-500"
                        : ""}`}
                  />

                  <button
                    type="button"
                    onClick={() => deleteImageMutation.mutate(img.ImageID)}
                    className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 rounded"
                  >
                    ✕
                  </button>

                </div>
              ))}

              {/* Upload */}
              {images.length < 4 && (

                <label className="h-24 border flex items-center justify-center cursor-pointer rounded bg-gray-100">

                  {uploading ? "Uploading..." : "+ Upload"}

                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => handleUpload(e.target.files[0])}
                  />

                </label>

              )}

            </div>

          </div>

          {/* RIGHT : FORM */}
          <div className="space-y-4">

            <div>
              <label className="text-sm font-medium">
                Service Name
              </label>

              <input
                name="ServiceName"
                value={form.ServiceName}
                onChange={handleChange}
                className="w-full mt-1 p-2 bg-gray-100 rounded"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Front Description
              </label>

              <textarea
                name="Front_Description"
                value={form.Front_Description}
                onChange={handleChange}
                className="w-full mt-1 p-2 bg-gray-100 rounded h-24"
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Duration (minutes)
              </label>

              <input
                type="number"
                name="Duration"
                value={form.Duration}
                onChange={handleChange}
                className="w-full mt-1 p-2 bg-gray-100 rounded"
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Price
              </label>

              <input
                name="price"
                value={form.price}
                onChange={handleChange}
                className="w-full mt-1 p-2 bg-gray-100 rounded"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {isEdit ? "Update Service" : "Create Service"}
            </button>

          </div>

          {/* Full Description */}
          <div className="md:col-span-3">

            <label className="text-sm font-medium">
              Full Description
            </label>

            <textarea
              name="Full_Description"
              value={form.Full_Description}
              onChange={handleChange}
              className="w-full mt-1 p-2 bg-gray-100 rounded h-32"
            />

          </div>

        </div>

      </form>

    </div>
  );
}