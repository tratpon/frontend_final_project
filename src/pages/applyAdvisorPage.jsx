import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { applyAdvisor, fetchTypes } from "../app/Api";
import { useNavigate } from "react-router-dom";
import { Upload, Check, FileText, Award, ChevronLeft, Loader2 } from "lucide-react"; // แนะนำให้ลง lucide-react

export default function AdvisorApply() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    Fname: "",
    Lname: "",
    email: "",
    TypesID: "",
    experience_years: "",
    portfolio_url: "",
    certificate_url: "",
    license_number: ""
  });

  const { data: types = [] } = useQuery({
    queryKey: ["types"],
    queryFn: fetchTypes,
  });

  const mutation = useMutation({
    mutationFn: applyAdvisor,
    onSuccess: () => {
      queryClient.invalidateQueries(["applications"]);
      alert("ส่งใบสมัครเรียบร้อยแล้ว! กรุณารอการตรวจสอบจากผู้ดูแลระบบ");
      navigate("../");
    }
  });

  const [isUploading, setIsUploading] = useState({ portfolio_url: false, certificate_url: false });

  const handleUpload = async (e) => {
    const fieldName = e.target.name;
    try {
      const file = e.target.files[0];
      if (!file) return;

      setIsUploading(prev => ({ ...prev, [fieldName]: true }));
      
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "final_project");

      const res = await fetch(import.meta.env.VITE_API_cloudinary_file, {
        method: "POST",
        body: formData
      });

      const data = await res.json();
      
      setForm(prev => ({
        ...prev,
        [fieldName]: data.secure_url
      }));
    } catch (err) {
      console.error(err);
      alert("การอัปโหลดล้มเหลว กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsUploading(prev => ({ ...prev, [fieldName]: false }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === "TypesID" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mutation.isPending) return;
    mutation.mutate(form);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex justify-center items-center py-12 px-4">
      <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 w-full max-w-2xl overflow-hidden border border-gray-100">
        
        {/* HEADER */}
        <div className="bg-blue-600 p-8 text-white relative">
          <button 
            onClick={() => navigate(-1)}
            className="absolute left-6 top-8 text-blue-100 hover:text-white transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="text-center">
            <h2 className="text-2xl font-black mb-2 uppercase tracking-tight">Become an Advisor</h2>
            <p className="text-blue-100 text-sm font-medium">ร่วมเป็นส่วนหนึ่งของทีมผู้ให้คำปรึกษามืออาชีพกับเรา</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field
              label="ชื่อจริง"
              name="Fname"
              required
              placeholder="ภาษาไทย หรือ ภาษาอังกฤษ"
              value={form.Fname}
              onChange={handleChange}
            />
            <Field
              label="นามสกุล"
              name="Lname"
              required
              placeholder="ภาษาไทย หรือ ภาษาอังกฤษ"
              value={form.Lname}
              onChange={handleChange}
            />
          </div>

          <Field
            label="อีเมลติดต่องาน"
            name="email"
            type="email"
            required
            placeholder="example@gmail.com"
            value={form.email}
            onChange={handleChange}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase mb-2 tracking-widest">
                สาขาที่เชี่ยวชาญ
              </label>
              <select
                value={form.TypesID}
                name="TypesID"
                onChange={handleChange}
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-700 font-bold focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all cursor-pointer"
              >
                <option value="">เลือกสาขา...</option>
                {types.map((type) => (
                  <option key={type.TypesID} value={type.TypesID}>
                    {type.TypesName}
                  </option>
                ))}
              </select>
            </div>

            <Field
              label="ประสบการณ์ (ปี)"
              name="experience_years"
              type="number"
              required
              placeholder="เช่น 5"
              value={form.experience_years}
              onChange={handleChange}
            />
          </div>

          {/* UPLOAD SECTION */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UploadField 
              label="พอร์ตโฟลิโอ (PDF/Image)"
              name="portfolio_url"
              url={form.portfolio_url}
              onChange={handleUpload}
              loading={isUploading.portfolio_url}
              icon={<FileText size={20} />}
            />
            <UploadField 
              label="ใบรับรองวิชาชีพ (ถ้ามี)"
              name="certificate_url"
              url={form.certificate_url}
              onChange={handleUpload}
              loading={isUploading.certificate_url}
              icon={<Award size={20} />}
            />
          </div>

          <Field
            label="หมายเลขใบอนุญาตประกอบวิชาชีพ"
            name="license_number"
            placeholder="ระบุหมายเลขใบอนุญาต (ถ้ามี)"
            value={form.license_number}
            onChange={handleChange}
          />

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={mutation.isPending}
            className={`w-full py-4 rounded-2xl font-black text-lg transition-all shadow-lg flex items-center justify-center gap-2 ${
              mutation.isPending 
              ? "bg-gray-400 cursor-not-allowed text-white" 
              : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200 active:scale-[0.98]"
            }`}
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                กำลังส่งข้อมูล...
              </>
            ) : (
              "ส่งข้อมูลการสมัคร"
            )}
          </button>

        </form>
      </div>
    </div>
  );
}

// Sub-Component สำหรับ Input ปกติ
function Field({ label, name, value, onChange, required, type = "text", placeholder }) {
  return (
    <div className="space-y-2">
      <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-700 font-bold placeholder:font-medium placeholder:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
      />
    </div>
  );
}

// Sub-Component สำหรับการอัปโหลดไฟล์
function UploadField({ label, name, url, onChange, loading, icon }) {
  return (
    <div className="space-y-2">
      <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest">
        {label}
      </label>
      <label className={`relative h-28 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all ${
        url 
        ? "bg-emerald-50 border-emerald-200 text-emerald-600" 
        : "bg-gray-50 border-gray-200 text-gray-400 hover:border-blue-400 hover:bg-blue-50"
      }`}>
        {loading ? (
          <Loader2 className="animate-spin text-blue-500" />
        ) : url ? (
          <>
            <Check size={24} className="mb-1" />
            <span className="text-xs font-bold">อัปโหลดสำเร็จ</span>
            <a href={url} target="_blank" className="text-[10px] underline mt-1 text-emerald-700">คลิกเพื่อดูไฟล์</a>
          </>
        ) : (
          <>
            <div className="mb-1">{icon}</div>
            <span className="text-xs font-bold uppercase tracking-tighter">+ Upload File</span>
          </>
        )}
        <input type="file" name={name} hidden onChange={onChange} disabled={loading} />
      </label>
    </div>
  );
}