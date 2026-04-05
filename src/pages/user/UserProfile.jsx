import { useState, useEffect } from "react";
import NavbarSwitcher from "../../app/NavbarSwitcht";
import Footer from "../../components/Footer";
import {
  fetchMyProfile,
  updateMyProfile,
  uploadImageMyProfile,
  uploadToCloudinary
} from "../../app/Api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Camera, User, Mail, Phone, Calendar } from "lucide-react";

export default function UserProfile() {
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    Username: "",
    Fname: "",
    Lname: "",
    Gender: "",
    Age: "",
    Email: "",
    Phone: "",
    imageUserUrl: ""
  });

  const [editMode, setEditMode] = useState(false);
  const [image, setImage] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["myProfile"],
    queryFn: fetchMyProfile
  });

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const updateMutation = useMutation({
    mutationFn: updateMyProfile,
    onSuccess: () => {
      queryClient.invalidateQueries(["myProfile"]);
      setEditMode(false);
      alert("อัปเดตโปรไฟล์เรียบร้อยแล้ว!");
    }
  });

  const uploadImageMutation = useMutation({
    mutationFn: uploadImageMyProfile,
    onSuccess: () => {
      queryClient.invalidateQueries(["myProfile"]);
      setImage(null);
      alert("เปลี่ยนรูปโปรไฟล์สำเร็จ!");
    }
  });

  const handleUpload = async () => {
    if (!image) return alert("กรุณาเลือกรูปภาพก่อน");

    try {
      const response = await uploadToCloudinary(image);
      if (!response.secure_url) {
        return alert("อัปโหลดไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
      }
      uploadImageMutation.mutate({ imageUserUrl: response.secure_url });
    } catch (error) {
      console.error("Upload error:", error);
      alert("เกิดข้อผิดพลาดบางอย่าง");
    }
  };

  const handleSubmit = () => {
    if (!editMode) return setEditMode(true);
    updateMutation.mutate(form);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <NavbarSwitcher />
    {
      isLoading && ( <div className="min-h-screen flex items-center justify-center text-slate-500">กำลังโหลด...</div>)
    }
      <div className="flex-1 py-10 px-4">
        {/* Main Card Container */}
        <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm transition-all duration-300">
          
          <h2 className="text-2xl font-bold text-slate-800 mb-8 text-center sm:text-left">ข้อมูลส่วนตัว</h2>

          {/* PROFILE IMAGE - Position: Center Top */}
          <div className="flex flex-col items-center mb-10">
            <div className="relative group">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-slate-100 border-4 border-white shadow-lg flex items-center justify-center transition-transform group-hover:scale-105">
                {form.imageUserUrl ? (
                  <img
                    src={form.imageUserUrl}
                    className="w-full h-full object-cover"
                    alt="User Profile"
                  />
                ) : (
                  <span className="text-4xl text-slate-300">👤</span>
                )}
              </div>
              
              <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-blue-700 transition-colors border-2 border-white">
                <Camera size={16} />
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </label>
            </div>

            {image && (
              <button
                onClick={handleUpload}
                className="mt-4 px-5 py-1.5 bg-blue-600 text-white rounded-full text-xs font-bold hover:bg-blue-700 shadow-md shadow-blue-100 transition-all animate-in fade-in slide-in-from-top-1"
              >
                ยืนยันการอัปโหลด
              </button>
            )}
          </div>

          {/* USERNAME SECTION - Read Only Layout */}
          <div className="mb-6">
            <Field label="ชื่อผู้ใช้งาน (Username)" value={form.Username} disabled />
          </div>

        

          {/* FORM FIELDS - Grid 2 Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            <Field label="ชื่อจริง" name="Fname" value={form.Fname} onChange={handleChange} disabled={!editMode} />
            <Field label="นามสกุล" name="Lname" value={form.Lname} onChange={handleChange} disabled={!editMode} />
            
            <div className="flex flex-col gap-1.5">
              <label className="block text-xs font-bold text-slate-500 ml-1 uppercase tracking-wider">เพศ (Gender)</label>
              <select
                name="Gender"
                value={form.Gender}
                onChange={handleChange}
                disabled={!editMode}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all appearance-none cursor-pointer ${
                  !editMode 
                    ? "bg-slate-50 border-slate-100 text-slate-400" 
                    : "bg-white border-blue-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 text-slate-700 shadow-sm"
                }`}
              >
                <option value="ชาย">ชาย</option>
                <option value="หญิง">หญิง</option>
                <option value="ไม่ระบุ">ไม่ระบุ</option>
                <option value="อื่นๆ">อื่นๆ</option>
              </select>
            </div>

            <Field label="อายุ" name="Age" value={form.Age} onChange={handleChange} disabled={!editMode} />
            <Field label="เบอร์โทรศัพท์" name="Phone" value={form.Phone} onChange={handleChange} disabled={!editMode} />
            <Field label="อีเมล (Email)" value={form.Email} disabled />
          </div>

          {/* ACTION BUTTONS - Position: Bottom Right */}
          <div className="flex justify-end mt-12 gap-3">
            {editMode && (
              <button
                onClick={() => {
                  setForm(data);
                  setEditMode(false);
                }}
                className="px-6 py-2.5 rounded-xl text-slate-500 font-bold hover:bg-slate-100 transition-colors text-sm"
              >
                ยกเลิก
              </button>
            )}

            <button
              onClick={handleSubmit}
              className={`px-10 py-2.5 rounded-xl text-white font-bold text-sm shadow-lg transition-all active:scale-95 ${
                editMode 
                  ? "bg-blue-600 shadow-blue-100 hover:bg-blue-700" 
                  : "bg-slate-900 shadow-slate-100 hover:bg-slate-800"
              }`}
            >
              {editMode ? "ตกลงและบันทึก" : "แก้ไขโปรไฟล์"}
            </button>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}

/**
 * Reusable Field Component
 * Maintains the original wireframe logic but improves visual styling
 */
function Field({ label, name, value, onChange, disabled }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-wider">{label}</label>
      <input
        name={name}
        value={value || ""}
        onChange={onChange}
        disabled={disabled}
        className={`w-full px-4 py-2.5 text-sm rounded-xl border transition-all outline-none ${
          disabled 
            ? "bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed" 
            : "bg-white border-blue-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 text-slate-700 shadow-sm"
        }`}
        placeholder={disabled ? "" : `ระบุ${label}`}
      />
    </div>
  );
}