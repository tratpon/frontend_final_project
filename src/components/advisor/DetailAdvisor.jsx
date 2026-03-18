import { useState } from "react";
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

function YearSelect({ value, onChange, start = 2500, end = new Date().getFullYear() + 543 }) {
    const years = [];
    for (let y = end; y >= start; y--) {
        years.push(y);
    }

    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white text-gray-500"
        >
            <option value="">เลือกปี</option>
            {years.map((y) => (
                <option key={y} value={y}>
                    {y}
                </option>
            ))}
        </select>
    );
}

/* ─── reusable field ─────────────────────────────────────────── */
function Field({ label, value, onChange, placeholder, type = "text" }) {
    return (
        <div className="flex flex-col gap-1">
            {label && <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</label>}
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white transition"
            />
        </div>
    );
}

/* ─── section wrapper ────────────────────────────────────────── */
function Section({ title, children }) {
    return (
        <div className="mt-6">
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3 flex items-center gap-2">
                <span className="flex-1 h-px bg-indigo-100" />
                {title}
                <span className="flex-1 h-px bg-indigo-100" />
            </h4>
            {children}
        </div>
    );
}




/* ════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════ */
export default function DetailAdvisor() {
    const queryClient = useQueryClient();

    const [bio, setBio] = useState("");
    const [editingBio, setEditingBio] = useState(false);
    /* ── skill state ─────────── */
    const [skill, setSkill] = useState("");
    const [editingSkillId, setEditingSkillId] = useState(null);
    const [editSkillValue, setEditSkillValue] = useState("");

    /* ── education state ──────── */
    const [edu, setEdu] = useState({ degree: "", university: "", year: "" });
    const [editingEduId, setEditingEduId] = useState(null);
    const [editEdu, setEditEdu] = useState({ degree: "", university: "", year: "" });

    /* ── experience state ──────── */
    const [exp, setExp] = useState({ organization: "", position: "", startYear: "", endYear: "" });
    const [editingExpId, setEditingExpId] = useState(null);
    const [editExp, setEditExp] = useState({ organization: "", position: "", startYear: "", endYear: "" });

    /* ── query ──────────────────── */
    const { data, isLoading } = useQuery({
        queryKey: ["advisorProfile"],
        queryFn: fetchDetailAdvisor,
    });

    

    /* ── skill mutations ──────────── */
    const inv = () => queryClient.invalidateQueries({ queryKey: ["advisorProfile"] });

    const addBioMutation = useMutation({ mutationFn: updatebio, onSuccess: inv });

    const addSkillMutation = useMutation({ mutationFn: addSkill, onSuccess: inv });
    const updateSkillMutation = useMutation({ mutationFn: updateSkill, onSuccess: inv });
    const deleteSkillMutation = useMutation({ mutationFn: deleteSkill, onSuccess: inv });

    /* ── education mutations ───────── */
    const addEduMutation = useMutation({ mutationFn: addEducation, onSuccess: inv });
    const updateEduMutation = useMutation({ mutationFn: updateEducation, onSuccess: inv });
    const deleteEduMutation = useMutation({ mutationFn: deleteEducation, onSuccess: inv });

    /* ── experience mutations ──────── */
    const addExpMutation = useMutation({ mutationFn: addExperience, onSuccess: inv });
    const updateExpMutation = useMutation({ mutationFn: updateExperience, onSuccess: inv });
    const deleteExpMutation = useMutation({ mutationFn: deleteExperience, onSuccess: inv });

    /* ── loading ──────────────────── */
    if (isLoading)
        return (
            <div className="flex items-center justify-center h-64 text-slate-400 text-sm animate-pulse">
                กำลังโหลด...
            </div>
        );

    const { advisor, skills, education, experience, rating } = data;

    /* ── handlers: skill ─────────── */
    const handleAddSkill = () => {
        if (!skill.trim()) return;
        addSkillMutation.mutate({ description: skill });
        setSkill("");
    };
    const handleConfirmEditSkill = (id) => {
        updateSkillMutation.mutate({ id, description: editSkillValue });
        setEditSkillValue("");
        setEditingSkillId(null);
    };

    /* ── handlers: education ──────── */
    const handleAddEdu = () => {
        if (!edu.degree.trim() || !edu.university.trim()) return;
        addEduMutation.mutate({ degree: edu.degree, university: edu.university, graduationYear: edu.year });
        setEdu({ degree: "", university: "", year: "" });
    };
    const handleConfirmEditEdu = (id) => {
        updateEduMutation.mutate({ id, degree: editEdu.degree, university: editEdu.university, graduationYear: editEdu.year });
        setEditingEduId(null);
    };

    /* ── handlers: experience ──────── */
    const handleAddExp = () => {
        if (!exp.organization.trim() || !exp.position.trim()) return;
        addExpMutation.mutate({ organization: exp.organization, position: exp.position, startYear: exp.startYear, endYear: exp.endYear || null });
        setExp({ organization: "", position: "", startYear: "", endYear: "" });
    };
    const handleConfirmEditExp = (id) => {
        updateExpMutation.mutate({ id, organization: editExp.organization, position: editExp.position, startYear: editExp.startYear, endYear: editExp.endYear || null });
        setEditingExpId(null);
    };


    const handleUpdateBio = () => {
        addBioMutation.mutate({ bio });
        setEditingBio(false);
    };
    /* ════════════════════════════════════════════════════
       RENDER
    ═══════════════════════════════════════════════════════ */
    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden max-w-xl mx-auto font-sans">

            {/* ── banner ── */}
            <div className="h-32 bg-gradient-to-br from-indigo-400 via-violet-400 to-fuchsia-300 relative">
                <div className="absolute -bottom-10 left-6 w-20 h-20 rounded-2xl bg-white shadow-md flex items-center justify-center">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-200 to-violet-200" />
                </div>
            </div>

            <div className="px-6 pt-14 pb-6">

                {/* ── profile header ── */}
                <div className="flex items-start justify-between mb-1">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">
                            {advisor[0].Fadvisor} {advisor[0].Ladvisor}  ({advisor[0].Type}) 
                        </h2>
                        <p className="text-sm text-slate-500">{advisor.Age}</p>
                    </div>
                    
                    <div >
                        <span className="text-yellow-500">
                            {"★".repeat(Math.round(rating[0].AverageRating || 0))}
                            
                        </span>
                         <span className="text-gray-500 text-sm mx-1">
                            {rating[0].AverageRating || 0}   
                        </span>

                        <span className="text-gray-500 text-sm">
                            ({rating[0].ReviewCount})
                        </span>
                    </div>
                </div>

                <Section title="เกี่ยวกับฉัน">
                    {editingBio ? (
                        <div className="flex flex-col gap-2">
                            <textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                rows={4}
                                className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            />

                            <div className="flex gap-2 justify-end">
                                <button
                                    onClick={handleUpdateBio}
                                    disabled={addBioMutation.isPending}
                                    className="text-green-500"
                                >
                                    confirm
                                </button>

                                <button
                                    onClick={() => setEditingBio(false)}
                                    className="text-gray-400"
                                >
                                    cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-between items-start gap-2">
                            <p className="text-sm text-slate-600 whitespace-pre-line">
                                {advisor[0].Bio || "ยังไม่ได้เพิ่ม bio"}
                            </p>

                            <button
                                onClick={() => setEditingBio(true)}
                                className="text-blue-500 text-sm"
                            >
                                Edit
                            </button>
                        </div>
                    )}
                </Section>

                {/* ══════════ SKILLS ══════════ */}
                <Section title="ทักษะ">
                    <ul className="space-y-2">
                        {skills.map((s) => (
                            <li key={s.SkillID} className="flex items-center justify-between gap-2 bg-slate-50 rounded-lg px-3 py-2">
                                {editingSkillId === s.SkillID ? (
                                    <input
                                        value={editSkillValue}
                                        onChange={(e) => setEditSkillValue(e.target.value)}
                                        className="flex-1 text-sm border border-indigo-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                    />
                                ) : (
                                    <span className="flex-1 text-sm text-slate-700">{s.Description}</span>
                                )}
                                <div className="flex gap-2">
                                    {editingSkillId === s.SkillID ? (
                                        <button
                                            disabled={updateSkillMutation.isPending}
                                            onClick={() => handleConfirmEditSkill(s.SkillID)}
                                            className="text-green-500"
                                        >
                                            confirm
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => { setEditingSkillId(s.SkillID); setEditSkillValue(s.Description); }}
                                            className="text-blue-500"
                                        >
                                            Edit
                                        </button>
                                    )}
                                    <button
                                        onClick={() => deleteSkillMutation.mutate(s.SkillID)}
                                        disabled={deleteSkillMutation.isPending}
                                        className="text-red-500"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>

                    {/* add skill */}
                    <div className="flex gap-2 mt-3">
                        <input
                            value={skill}
                            onChange={(e) => setSkill(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
                            placeholder="เพิ่มทักษะใหม่..."
                            className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                        <button onClick={handleAddSkill} disabled={addSkillMutation.isPending}
                            className="bg-blue-500 text-white px-3 rounded">
                            +
                        </button>
                    </div>
                </Section>

                {/* ══════════ EDUCATION ══════════ */}
                <Section title="การศึกษา">
                    <ul className="space-y-2">
                        {education.map((e) => (
                            <li key={e.EducationID} className="bg-slate-50 rounded-lg px-3 py-2">
                                {editingEduId === e.EducationID ? (
                                    <div className="flex flex-col gap-2">
                                        <div className="grid grid-cols-2 gap-2">
                                            <Field placeholder="วุฒิการศึกษา" value={editEdu.degree} onChange={(v) => setEditEdu({ ...editEdu, degree: v })} />
                                            <Field placeholder="มหาวิทยาลัย" value={editEdu.university} onChange={(v) => setEditEdu({ ...editEdu, university: v })} />
                                        </div>
                                        <Field placeholder="ปีที่จบ" value={editEdu.year} onChange={(v) => setEditEdu({ ...editEdu, year: v })} />

                                        <div className="flex gap-2 justify-end">
                                            <button disabled={updateEduMutation.isPending} onClick={() => handleConfirmEditEdu(e.EducationID)} className="text-green-500">confirm</button>
                                            <button onClick={() => setEditingEduId(null)} className="text-gray-400">cancel</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-slate-700">{e.Degree}</p>
                                            <p className="text-xs text-slate-500">{e.University} · {e.GraduationYear}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="text-blue-500" onClick={() => { setEditingEduId(e.EducationID); setEditEdu({ degree: e.Degree, university: e.University, year: e.GraduationYear }); }}>Edit</button>
                                            <button className="text-red-500" disabled={deleteEduMutation.isPending} onClick={() => deleteEduMutation.mutate(e.EducationID)}>Delete</button>
                                        </div>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>

                    {/* add education */}
                    <div className="mt-3 bg-indigo-50 rounded-xl p-3 flex flex-col gap-2">
                        <div className="grid grid-cols-2 gap-2">
                            <Field placeholder="วุฒิการศึกษา" value={edu.degree} onChange={(v) => setEdu({ ...edu, degree: v })} />
                            <Field placeholder="มหาวิทยาลัย" value={edu.university} onChange={(v) => setEdu({ ...edu, university: v })} />
                        </div>
                        <YearSelect
                            value={edu.year}
                            onChange={(v) => setEdu({ ...edu, year: v })}
                        />
                        <button onClick={handleAddEdu} disabled={addEduMutation.isPending}
                            className="self-end bg-blue-500 text-white px-3 py-1 rounded">
                            +
                        </button>
                    </div>
                </Section>

                {/* ══════════ EXPERIENCE ══════════ */}
                <Section title="ประสบการณ์">
                    <ul className="space-y-2">
                        {experience.map((e) => (
                            <li key={e.ExperienceID} className="bg-slate-50 rounded-lg px-3 py-2">
                                {editingExpId === e.ExperienceID ? (
                                    <div className="flex flex-col gap-2">
                                        <div className="grid grid-cols-2 gap-2">
                                            <Field placeholder="องค์กร" value={editExp.organization} onChange={(v) => setEditExp({ ...editExp, organization: v })} />
                                            <Field placeholder="ตำแหน่ง" value={editExp.position} onChange={(v) => setEditExp({ ...editExp, position: v })} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <Field placeholder="ปีเริ่มต้น" value={editExp.startYear} onChange={(v) => setEditExp({ ...editExp, startYear: v })} />
                                            <Field placeholder="ปีสิ้นสุด" value={editExp.endYear} onChange={(v) => setEditExp({ ...editExp, endYear: v })} />
                                        </div>
                                        <div className="flex gap-2 justify-end">
                                            <button disabled={updateExpMutation.isPending} onClick={() => handleConfirmEditExp(e.ExperienceID)} className="text-green-500">confirm</button>
                                            <button onClick={() => setEditingExpId(null)} className="text-gray-400">cancel</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-slate-700">{e.Position}</p>
                                            <p className="text-xs text-slate-500">{e.Organization} · {e.StartYear} – {e.EndYear ?? "ปัจจุบัน"}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="text-blue-500" onClick={() => { setEditingExpId(e.ExperienceID); setEditExp({ organization: e.Organization, position: e.Position, startYear: e.StartYear, endYear: e.EndYear ?? "" }); }}>Edit</button>
                                            <button className="text-red-500" disabled={deleteExpMutation.isPending} onClick={() => deleteExpMutation.mutate(e.ExperienceID)}>Delete</button>
                                        </div>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>

                    {/* add experience */}
                    <div className="mt-3 bg-indigo-50 rounded-xl p-3 flex flex-col gap-2">
                        <div className="grid grid-cols-2 gap-2">
                            <Field placeholder="องค์กร" value={exp.organization} onChange={(v) => setExp({ ...exp, organization: v })} />
                            <Field placeholder="ตำแหน่ง" value={exp.position} onChange={(v) => setExp({ ...exp, position: v })} />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <Field placeholder="ปีเริ่มต้น" value={exp.startYear} onChange={(v) => setExp({ ...exp, startYear: v })} />
                            <Field placeholder="ปีสิ้นสุด (ว่างได้)" value={exp.endYear} onChange={(v) => setExp({ ...exp, endYear: v })} />
                        </div>
                        <button onClick={handleAddExp} disabled={addExpMutation.isPending}
                            className="self-end bg-blue-500 text-white px-3 py-1 rounded">
                            +
                        </button>
                    </div>
                </Section>

            </div>
        </div>
    );
}