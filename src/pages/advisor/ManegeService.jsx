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
import { Image as ImageIcon, Plus, X, Loader2, Save, ArrowLeft, Clock, DollarSign } from "lucide-react";

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

  const { data, isLoading: isFetching } = useQuery({
    queryKey: ["service", id],
    queryFn: () => fetchServiceByID(id),
    enabled: isEdit
  });

  const images = data?.image || [];

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

  const createMutation = useMutation({
    mutationFn: createService,
    onSuccess: () => {
      alert("สร้างบริการเรียบร้อยแล้ว");
      navigate("/advisor/ServiceList");
    }
  });

  const updateMutation = useMutation({
    mutationFn: updateService,
    onSuccess: () => {
      alert("อัปเดตข้อมูลเรียบร้อยแล้ว");
      navigate("/advisor/ServiceList");
    }
  });

  const imageMutation = useMutation({
    mutationFn: addServiceImage,
    onSuccess: () => queryClient.invalidateQueries(["service", id])
  });

  const deleteImageMutation = useMutation({
    mutationFn: deleteServiceImage,
    onSuccess: () => queryClient.invalidateQueries(["service", id])
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEdit) {
      updateMutation.mutate({ id, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  const handleUpload = async (file) => {
    if (images.length >= 4) {
      alert("เพิ่มรูปภาพได้สูงสุด 4 รูป");
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
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  if (isEdit && isFetching) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-indigo-600" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="max-w-6xl mx-auto p-6 md:p-10">
        
        {/* Navigation & Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white rounded-full text-slate-400 hover:text-indigo-600 transition-all shadow-sm border border-transparent hover:border-slate-100"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">
              {isEdit ? "แก้ไขบริการ" : "เพิ่มบริการใหม่"}
            </h1>
            <p className="text-slate-500 font-medium">จัดการรายละเอียดและรูปภาพของบริการคุณ</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: Image Management */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white p-2 rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
              <div className="relative aspect-video md:aspect-[16/9] bg-slate-100 rounded-[2rem] overflow-hidden group">
                {selectedImage ? (
                  <img src={selectedImage} className="w-full h-full object-cover" alt="Service" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                    <ImageIcon size={64} strokeWidth={1} />
                    <p className="mt-2 font-medium">ยังไม่มีรูปภาพบริการ</p>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-4">
              {images.map((img) => (
                <div key={img.ImageID} className="relative group aspect-square">
                  <img
                    src={img.ImageURL}
                    onClick={() => setSelectedImage(img.ImageURL)}
                    className={`h-full w-full object-cover rounded-2xl cursor-pointer transition-all duration-300 shadow-sm
                    ${selectedImage === img.ImageURL ? "ring-4 ring-indigo-500 ring-offset-2 scale-95" : "hover:scale-105"}`}
                    alt="Gallery"
                  />
                  <button
                    type="button"
                    onClick={() => deleteImageMutation.mutate(img.ImageID)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}

              {/* Upload Slot */}
              {images.length < 4 && (
                <label className="aspect-square border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-all text-slate-400 hover:text-indigo-600 bg-white">
                  {uploading ? <Loader2 className="animate-spin" /> : <Plus size={24} />}
                  <span className="text-[10px] font-bold mt-1 uppercase tracking-wider">{uploading ? "Uploading" : "Add Image"}</span>
                  <input type="file" hidden accept="image/*" onChange={(e) => handleUpload(e.target.files[0])} disabled={uploading || !isEdit} />
                </label>
              )}
            </div>
            {!isEdit && (
              <p className="text-sm text-amber-600 bg-amber-50 p-4 rounded-2xl border border-amber-100 flex items-center gap-2 font-medium">
                <Loader2 size={16} /> คุณสามารถเพิ่มรูปภาพได้หลังจากที่ "สร้างบริการ" เสร็จสิ้นแล้ว
              </p>
            )}
          </div>

          {/* RIGHT: Form Fields */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-5">
              
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                   Service Name
                </label>
                <input
                  name="ServiceName"
                  placeholder="ชื่อบริการของคุณ..."
                  value={form.ServiceName}
                  onChange={handleChange}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all outline-none font-bold text-slate-700"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                   Summary (Front Description)
                </label>
                <textarea
                  name="Front_Description"
                  placeholder="คำอธิบายสั้นๆ สำหรับหน้าแสดงรายการ..."
                  value={form.Front_Description}
                  onChange={handleChange}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all outline-none h-24 resize-none text-slate-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Clock size={12} /> Duration
                  </label>
                  <select
                    name="Duration"
                    value={form.Duration}
                    onChange={handleChange}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all outline-none font-bold text-slate-700 appearance-none"
                  >
                    <option value="">เลือกเวลา</option>
                    {[30, 60, 90, 120].map(min => (
                      <option key={min} value={min}>{min} นาที</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <DollarSign size={12} /> Price
                  </label>
                  <input
                    name="price"
                    type="number"
                    placeholder="0.00"
                    value={form.price}
                    onChange={handleChange}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all outline-none font-bold text-slate-700"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                   Detailed Information
                </label>
                <textarea
                  name="Full_Description"
                  placeholder="เขียนอธิบายบริการของคุณอย่างละเอียด..."
                  value={form.Full_Description}
                  onChange={handleChange}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all outline-none h-40 resize-none text-slate-600"
                />
              </div>

              <button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 group disabled:bg-slate-300"
              >
                {createMutation.isPending || updateMutation.isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Save size={20} className="group-hover:scale-110 transition-transform" />
                )}
                {isEdit ? "บันทึกการเปลี่ยนแปลง" : "สร้างบริการใหม่"}
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}