import { useNavigate, Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
    fetchAllServiceAdvisorByID,
    fetchDetailAdvisorByID,
} from "../app/Api";
import NavbarSwitcher from "../app/NavbarSwitcht";

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

export default function AdviserProfile() {
    const { id } = useParams();

    const navigate = useNavigate();

    /* advisor profile */
    const { data: advisorData, isLoading } = useQuery({
        queryKey: ["advisorProfile"],
        queryFn: () => fetchDetailAdvisorByID(id),
    });

    /* services */
    const { data } = useQuery({
        queryKey: ["services"],
        queryFn: () => fetchAllServiceAdvisorByID(id),
    });

    const services = data?.services ?? [];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64 text-slate-400 animate-pulse">
                กำลังโหลด...
            </div>
        );
    }

    const renderStars = (rating = 0) => {
        const full = Math.floor(rating);
        const half = rating % 1 >= 0.5;
        const empty = 5 - full - (half ? 1 : 0);

        return (
            <>
                {"★".repeat(full)}
                {half && "⭐"}
                {"☆".repeat(empty)}
            </>
        );
    };

    const { advisor, skills, education, experience, rating } = advisorData;

    return (
        <div className="min-h-screen bg-gray-50">

            <NavbarSwitcher />

            {/* banner */}
            <div className="w-full h-64 bg-gray-200 flex justify-center items-center">
                <div className="w-60 h-48 bg-gray-300"></div>
            </div>

            <div className="max-w-8xl mx-auto px-6 -mt-32">

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">

                    {/* PROFILE */}
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden max-w-xl mx-auto">

                        <div className="h-32 bg-linear-to-br from-indigo-400 via-violet-400 to-fuchsia-300 relative">
                            <div className="absolute -bottom-10 left-6 w-20 h-20 rounded-2xl bg-white shadow-md flex items-center justify-center">
                                <div className="w-16 h-16 rounded-xl bg-linear-to-br from-indigo-200 to-violet-200" />
                            </div>
                        </div>

                        <div className="px-6 pt-14 pb-6">

                            {/* profile header */}
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-800">
                                        {advisor[0].Fadvisor} {advisor[0].Ladvisor}
                                    </h2>
                                    <p className="text-sm text-slate-500">{advisor[0].Age}</p>
                                </div>

                                <div>
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

                            {/* bio */}
                            <Section title="เกี่ยวกับฉัน">
                                <p className="text-sm text-slate-600 whitespace-pre-line">
                                    {advisor[0].Bio || "ยังไม่ได้เพิ่ม bio"}
                                </p>
                            </Section>

                            {/* skills */}
                            <Section title="ทักษะ">
                                <ul className="space-y-2">
                                    {skills.map((s) => (
                                        <li
                                            key={s.SkillID}
                                            className="bg-slate-50 rounded-lg px-3 py-2 text-sm text-slate-700"
                                        >
                                            {s.Description}
                                        </li>
                                    ))}
                                </ul>
                            </Section>

                            {/* education */}
                            <Section title="การศึกษา">
                                <ul className="space-y-2">
                                    {education.map((e) => (
                                        <li key={e.EducationID} className="bg-slate-50 rounded-lg px-3 py-2">
                                            <p className="text-sm font-medium text-slate-700">{e.Degree}</p>
                                            <p className="text-xs text-slate-500">
                                                {e.University} · {e.GraduationYear}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            </Section>

                            {/* experience */}
                            <Section title="ประสบการณ์">
                                <ul className="space-y-2">
                                    {experience.map((e) => (
                                        <li key={e.ExperienceID} className="bg-slate-50 rounded-lg px-3 py-2">
                                            <p className="text-sm font-medium text-slate-700">{e.Position}</p>
                                            <p className="text-xs text-slate-500">
                                                {e.Organization} · {e.StartYear} – {e.EndYear ?? "ปัจจุบัน"}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            </Section>

                        </div>
                    </div>

                    {/* SERVICES */}
                    <div className="lg:col-span-3 mt-40">

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

                            {services.map((service) => (
                                <div
                                    key={service.ServiceID}
                                    className="flex flex-col border p-4 rounded bg-gray-50 h-full"
                                >
                                    <Link
                                        to={`/detail/${service.ServiceID}`}
                                        className="flex flex-col grow"
                                    >

                                        <div className="w-full h-40 bg-gray-200 rounded mb-4"></div>

                                        <div className="flex grow items-center gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-200"></div>

                                            <div>
                                                <h3 className="font-medium">{service.ServiceName}</h3>
                                                <p className="text-sm text-gray-500">{service.ServiceName}</p>
                                                <div className="flex gap-2 text-yellow-500 text-x">
                                                    {renderStars(service.AvgRating)}
                                                    <div className='text-sm text-gray-500'>{service.AvgRating}</div>
                                                    <div className='text-sm text-gray-500'>({service.ReviewCount})</div>
                                                </div>
                                            </div>


                                        </div>




                                        <p className="text-sm text-gray-600">
                                            {service.Front_Description}
                                        </p>

                                        <p className="text-xs text-gray-400 text-right mt-4">
                                            ⏱ {service.Duration}
                                        </p>

                                        <p className="text-xs text-gray-400 text-right">
                                            💰 {service.price} บาท
                                        </p>

                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}