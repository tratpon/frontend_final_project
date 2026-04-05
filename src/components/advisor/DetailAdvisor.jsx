import { useState, useEffect } from "react";
import {
    fetchDetailAdvisor,
    addSkill,
    deleteSkill,
    updateSkill,
    addEducation,
    deleteEducation,
    updateEducation,
    addExperience,
    updateExperience,
    deleteExperience,
    updatebio
} from "../../app/Api";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { 
    User, 
    GraduationCap, 
    Briefcase, 
    Cpu, 
    Plus, 
    Edit2, 
    Trash2, 
    Check, 
    X,
    Star
} from "lucide-react";

/* ─── reusable components ────────────────────────────────────── */
function YearSelect({ value, onChange, start = 2500, end = new Date().getFullYear() + 543 }) {
    const years = [];
    for (let y = end; y >= start; y--) { years.push(y); }
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white text-gray-600 transition-all"
        >
            <option value="">เลือกปี</option>
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
    );
}

function Field({ label, value, onChange, placeholder, type = "text" }) {
    return (
        <div className="flex flex-col gap-1 w-full">
            {label && <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 tracking-tight">{label}</label>}
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white transition-all placeholder:text-slate-300"
            />
        </div>
    );
}

function Section({ title, icon: Icon, children }) {
    return (
        <div className="mt-8">
            <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600">
                    <Icon size={16} />
                </div>
                <h4 className="text-sm font-bold text-slate-800 tracking-tight">{title}</h4>
                <div className="flex-1 h-px bg-slate-100 ml-2" />
            </div>
            {children}
        </div>
    );
}

/* ─── Main Component ─────────────────────────────────────────── */
export default function DetailAdvisor() {
    const queryClient = useQueryClient();

    // States
    const [bio, setBio] = useState("");
    const [editingBio, setEditingBio] = useState(false);
    const [skill, setSkill] = useState("");
    const [editingSkillId, setEditingSkillId] = useState(null);
    const [editSkillValue, setEditSkillValue] = useState("");
    const [edu, setEdu] = useState({ degree: "", university: "", year: "" });
    const [editingEduId, setEditingEduId] = useState(null);
    const [editEdu, setEditEdu] = useState({ degree: "", university: "", year: "" });
    const [exp, setExp] = useState({ organization: "", position: "", startYear: "", endYear: "" });
    const [editingExpId, setEditingExpId] = useState(null);
    const [editExp, setEditExp] = useState({ organization: "", position: "", startYear: "", endYear: "" });

    // Queries & Mutations
    const { data, isLoading } = useQuery({
        queryKey: ["advisorProfile"],
        queryFn: fetchDetailAdvisor,
    });

    const inv = () => queryClient.invalidateQueries({ queryKey: ["advisorProfile"] });
    const addBioMutation = useMutation({ mutationFn: updatebio, onSuccess: inv });
    const addSkillMutation = useMutation({ mutationFn: addSkill, onSuccess: inv });
    const updateSkillMutation = useMutation({ mutationFn: updateSkill, onSuccess: inv });
    const deleteSkillMutation = useMutation({ mutationFn: deleteSkill, onSuccess: inv });
    const addEduMutation = useMutation({ mutationFn: addEducation, onSuccess: inv });
    const updateEduMutation = useMutation({ mutationFn: updateEducation, onSuccess: inv });
    const deleteEduMutation = useMutation({ mutationFn: deleteEducation, onSuccess: inv });
    const addExpMutation = useMutation({ mutationFn: addExperience, onSuccess: inv });
    const updateExpMutation = useMutation({ mutationFn: updateExperience, onSuccess: inv });
    const deleteExpMutation = useMutation({ mutationFn: deleteExperience, onSuccess: inv });

    useEffect(() => {
        const advisorData = data?.advisor;
        if (advisorData?.[0]?.Bio) {
            setBio(advisorData[0].Bio.trim());
        }
    }, [data]);

    if (isLoading) return (
        <div className="bg-white rounded-3xl p-10 shadow-sm flex flex-col items-center justify-center gap-4 border border-slate-100">
            <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
            <p className="text-slate-400 text-sm font-medium">กำลังเตรียมข้อมูลโปรไฟล์...</p>
        </div>
    );

    const { advisor, skills, education, experience, rating } = data;
    const avgRating = rating?.[0]?.AverageRating || 0;

    // Handlers
    const handleAddSkill = () => { if (skill.trim()) { addSkillMutation.mutate({ description: skill }); setSkill(""); } };
    const handleConfirmEditSkill = (id) => { updateSkillMutation.mutate({ id, description: editSkillValue }); setEditingSkillId(null); };
    const handleAddEdu = () => { if (edu.degree.trim()) { addEduMutation.mutate({ degree: edu.degree, university: edu.university, graduationYear: edu.year }); setEdu({ degree: "", university: "", year: "" }); } };
    const handleConfirmEditEdu = (id) => { updateEduMutation.mutate({ id, ...editEdu, graduationYear: editEdu.year }); setEditingEduId(null); };
    const handleAddExp = () => { if (exp.organization.trim()) { addExpMutation.mutate({ ...exp, endYear: exp.endYear || null }); setExp({ organization: "", position: "", startYear: "", endYear: "" }); } };
    const handleConfirmEditExp = (id) => { updateExpMutation.mutate({ id, ...editExp, endYear: editExp.endYear || null }); setEditingExpId(null); };

    return (
        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/60 border border-slate-50 font-sans">
            
            {/* Header Profile */}
            <div className="flex flex-col items-center text-center">
                <div className="relative group">
                    <div className="w-32 h-32 rounded-[2rem] overflow-hidden bg-slate-100 border-4 border-white shadow-lg group-hover:scale-105 transition-transform duration-300">
                        {advisor[0]?.imageAdvisorUrl ? (
                            <img src={advisor[0].imageAdvisorUrl} className="w-full h-full object-cover" alt="profile" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-4xl">👤</div>
                        )}
                    </div>
                </div>

                <div className="mt-4">
                    <h2 className="text-2xl font-black text-slate-800 leading-tight">
                        {advisor[0].Fadvisor} {advisor[0].Ladvisor}
                    </h2>
                    <div className="flex items-center justify-center gap-2 mt-1">
                        <span className="px-3 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-full uppercase tracking-wider">
                            {advisor[0].Type}
                        </span>
                        <span className="text-slate-400 text-sm">•</span>
                        <span className="text-slate-500 text-sm font-medium">อายุ {advisor[0].Age} ปี</span>
                    </div>
                </div>

                <div className="mt-3 flex items-center gap-1.5 bg-yellow-50 px-4 py-1.5 rounded-2xl border border-yellow-100">
                    <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} fill={i < Math.round(avgRating) ? "currentColor" : "none"} />
                        ))}
                    </div>
                    <span className="text-yellow-700 font-bold text-sm">{avgRating}</span>
                    <span className="text-yellow-600/50 text-xs">({rating?.[0]?.ReviewCount || 0} รีวิว)</span>
                </div>
            </div>

            {/* About Me Section */}
            <Section title="เกี่ยวกับฉัน" icon={User}>
                {editingBio ? (
                    <div className="flex flex-col gap-3">
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            rows={4}
                            className="w-full border border-indigo-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-50 transition-all shadow-inner"
                            placeholder="เขียนแนะนำตัวคุณสั้นๆ..."
                        />
                        <div className="flex gap-2 justify-end">
                            <button onClick={() => setEditingBio(false)} className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors">ยกเลิก</button>
                            <button onClick={() => { addBioMutation.mutate({ bio }); setEditingBio(false); }} className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md shadow-indigo-100 hover:bg-indigo-700 transition-all">บันทึกข้อมูล</button>
                        </div>
                    </div>
                ) : (
                    <div className="relative group">
                        <p className="text-sm text-slate-600 leading-relaxed bg-slate-50/50 p-4 rounded-2xl border border-slate-100 italic">
                            "{advisor[0].Bio || "ยังไม่ได้เพิ่มคำแนะนำตัว"}"
                        </p>
                        <button onClick={() => setEditingBio(true)} className="absolute -top-2 -right-2 p-2 bg-white shadow-md rounded-full text-slate-400 hover:text-indigo-600 transition-all opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100">
                            <Edit2 size={14} />
                        </button>
                    </div>
                )}
            </Section>

            {/* Skills Section */}
            <Section title="ทักษะและความเชี่ยวชาญ" icon={Cpu}>
                <div className="flex flex-wrap gap-2 mb-4">
                    {skills.map((s) => (
                        <div key={s.SkillID} className="group relative bg-white border border-slate-200 px-4 py-2 rounded-xl flex items-center gap-3 transition-all hover:border-indigo-300 hover:shadow-sm">
                            {editingSkillId === s.SkillID ? (
                                <input
                                    autoFocus
                                    value={editSkillValue}
                                    onChange={(e) => setEditSkillValue(e.target.value)}
                                    onBlur={() => handleConfirmEditSkill(s.SkillID)}
                                    onKeyDown={(e) => e.key === "Enter" && handleConfirmEditSkill(s.SkillID)}
                                    className="text-sm font-medium text-indigo-600 outline-none w-20"
                                />
                            ) : (
                                <span className="text-sm font-medium text-slate-700">{s.Description}</span>
                            )}
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => { setEditingSkillId(s.SkillID); setEditSkillValue(s.Description); }} className="text-slate-400 hover:text-indigo-600"><Edit2 size={12} /></button>
                                <button onClick={() => deleteSkillMutation.mutate(s.SkillID)} className="text-slate-400 hover:text-red-500"><Trash2 size={12} /></button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex gap-2 bg-slate-50 p-2 rounded-2xl border border-dashed border-slate-200">
                    <input
                        value={skill}
                        onChange={(e) => setSkill(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
                        placeholder="เพิ่มทักษะใหม่..."
                        className="flex-1 bg-transparent px-3 py-1 text-sm outline-none"
                    />
                    <button onClick={handleAddSkill} className="w-8 h-8 bg-white text-indigo-600 rounded-xl shadow-sm border border-slate-100 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all">
                        <Plus size={16} />
                    </button>
                </div>
            </Section>

            {/* Education Section */}
            <Section title="ประวัติการศึกษา" icon={GraduationCap}>
                <div className="space-y-3">
                    {education.map((e) => (
                        <div key={e.EducationID} className="group relative bg-slate-50 p-4 rounded-2xl border border-transparent hover:bg-white hover:border-slate-100 hover:shadow-sm transition-all">
                            {editingEduId === e.EducationID ? (
                                <div className="space-y-3">
                                    <div className="grid grid-cols-2 gap-2">
                                        <Field placeholder="วุฒิการศึกษา" value={editEdu.degree} onChange={(v) => setEditEdu({ ...editEdu, degree: v })} />
                                        <Field placeholder="มหาวิทยาลัย" value={editEdu.university} onChange={(v) => setEditEdu({ ...editEdu, university: v })} />
                                    </div>
                                    <YearSelect value={editEdu.year} onChange={(v) => setEditEdu({ ...editEdu, year: v })} />
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => setEditingEduId(null)} className="p-2 text-slate-400 hover:text-slate-600"><X size={16}/></button>
                                        <button onClick={() => handleConfirmEditEdu(e.EducationID)} className="p-2 text-green-500 hover:bg-green-50 rounded-lg"><Check size={16}/></button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">{e.Degree}</p>
                                        <p className="text-xs text-slate-500 mt-0.5">{e.University} • จบปี {e.GraduationYear}</p>
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                        <button onClick={() => { setEditingEduId(e.EducationID); setEditEdu({ degree: e.Degree, university: e.University, year: e.GraduationYear }); }} className="p-2 bg-white rounded-lg shadow-sm text-slate-400 hover:text-indigo-600 transition-colors"><Edit2 size={12}/></button>
                                        <button onClick={() => deleteEduMutation.mutate(e.EducationID)} className="p-2 bg-white rounded-lg shadow-sm text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={12}/></button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    
                    <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                            <Field label="วุฒิการศึกษา" placeholder="เช่น ปริญญาตรี" value={edu.degree} onChange={(v) => setEdu({ ...edu, degree: v })} />
                            <Field label="สถาบัน" placeholder="ชื่อมหาวิทยาลัย" value={edu.university} onChange={(v) => setEdu({ ...edu, university: v })} />
                        </div>
                        <YearSelect value={edu.year} onChange={(v) => setEdu({ ...edu, year: v })} />
                        <button onClick={handleAddEdu} className="w-full bg-indigo-600 text-white py-2 rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                            <Plus size={14} /> เพิ่มการศึกษา
                        </button>
                    </div>
                </div>
            </Section>

            {/* Experience Section */}
            <Section title="ประสบการณ์การทำงาน" icon={Briefcase}>
                <div className="space-y-3">
                    {experience.map((e) => (
                        <div key={e.ExperienceID} className="group relative bg-slate-50 p-4 rounded-2xl border border-transparent hover:bg-white hover:border-slate-100 hover:shadow-sm transition-all border-l-4 hover:border-l-indigo-500">
                            {editingExpId === e.ExperienceID ? (
                                <div className="space-y-3">
                                    <div className="grid grid-cols-2 gap-2">
                                        <Field placeholder="องค์กร" value={editExp.organization} onChange={(v) => setEditExp({ ...editExp, organization: v })} />
                                        <Field placeholder="ตำแหน่ง" value={editExp.position} onChange={(v) => setEditExp({ ...editExp, position: v })} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Field placeholder="ปีเริ่มต้น" value={editExp.startYear} onChange={(v) => setEditExp({ ...editExp, startYear: v })} />
                                        <Field placeholder="ปีสิ้นสุด" value={editExp.endYear} onChange={(v) => setEditExp({ ...editExp, endYear: v })} />
                                    </div>
                                    <div className="flex justify-end gap-2 pt-2">
                                        <button onClick={() => setEditingExpId(null)} className="p-2 text-slate-400 hover:text-slate-600"><X size={16}/></button>
                                        <button onClick={() => handleConfirmEditExp(e.ExperienceID)} className="p-2 text-green-500 hover:bg-green-50 rounded-lg"><Check size={16}/></button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">{e.Position}</p>
                                        <p className="text-xs text-indigo-600 font-medium">{e.Organization}</p>
                                        <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-bold">
                                            {e.StartYear} – {e.EndYear ?? "ปัจจุบัน"}
                                        </p>
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                        <button onClick={() => { setEditingExpId(e.ExperienceID); setEditExp({ organization: e.Organization, position: e.Position, startYear: e.StartYear, endYear: e.EndYear ?? "" }); }} className="p-2 bg-white rounded-lg shadow-sm text-slate-400 hover:text-indigo-600 transition-colors"><Edit2 size={12}/></button>
                                        <button onClick={() => deleteExpMutation.mutate(e.ExperienceID)} className="p-2 bg-white rounded-lg shadow-sm text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={12}/></button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    
                    <div className="bg-slate-50 p-4 rounded-2xl border border-dashed border-slate-300 space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                            <Field label="องค์กร" placeholder="เช่น บจก. ตัวอย่าง" value={exp.organization} onChange={(v) => setExp({ ...exp, organization: v })} />
                            <Field label="ตำแหน่ง" placeholder="เช่น ที่ปรึกษาอาวุโส" value={exp.position} onChange={(v) => setExp({ ...exp, position: v })} />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <Field label="ปีที่เริ่ม" placeholder="25XX" value={exp.startYear} onChange={(v) => setExp({ ...exp, startYear: v })} />
                            <Field label="ปีที่สิ้นสุด" placeholder="ปัจจุบัน (ว่างได้)" value={exp.endYear} onChange={(v) => setExp({ ...exp, endYear: v })} />
                        </div>
                        <button onClick={handleAddExp} className="w-full border-2 border-indigo-100 text-indigo-600 py-2 rounded-xl text-xs font-bold hover:bg-indigo-50 transition-all flex items-center justify-center gap-2">
                            <Plus size={14} /> เพิ่มประสบการณ์
                        </button>
                    </div>
                </div>
            </Section>
        </div>
    );
}