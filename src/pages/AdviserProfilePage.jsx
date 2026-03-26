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

    console.log(data);

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
        <div className="min-h-screen">

            <NavbarSwitcher />

            {/* banner */}
            <div className="w-full h-40 sm:h-52 md:h-64 relative overflow-hidden">
                {services.length > 0 && (
                    <img
                        src={services[0].ImageURL}
                        alt="banner"
                        className="w-full h-full object-cover blur-md scale-110"
                    />
                )}


                <div className="absolute inset-0 bg-black/30"></div>
            </div>


            <div className="max-w-8xl mx-auto px-6 -mt-32 ">

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 ">

                    <div className="bg-white rounded-2xl px-6 pt-5 pb-6 mx-2 relative">
                        {/* profile header */}
                        <div className="flex flex-col items-center  justify-center gap-2">
                            <div className="w-25 h-25 sm:w-30 sm:h-30 rounded-full overflow-hidden bg-gray-200">
                                {advisor[0].imageAdvisorUrl ? (
                                    <img
                                        src={advisor[0].imageAdvisorUrl}
                                        className="w-full h-full object-cover"
                                        alt="profile"
                                    />
                                ) : (
                                    "👤"
                                )}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">
                                    {advisor[0].Fadvisor} {advisor[0].Ladvisor}
                                </h2>
                                <p className="text-sm text-slate-500">{advisor.Age}</p>
                            </div>
                            <h2 className="text-x text-slate-800">
                                ({advisor[0].TypesName})
                            </h2>

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

                    {/* SERVICES */}
                    <div className="lg:col-span-3 md:mt-40 ">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ">
                            {services?.map((service) => (
                                <div key={service.ServiceID} className="flex flex-col border p-4 rounded bg-gray-50 h-full hover:-translate-y-2 hover:shadow-2xl duration-300">
                                    <Link to={`/detail/${service.ServiceID}`} className="flex flex-col flex-1">

                                        <div className="relative w-full h-32 sm:h-40 bg-gray-200 rounded mb-3 sm:mb-4 overflow-hidden">
                                            <div className="absolute top-2 right-2 z-10 bg-white/80 px-2 py-1 rounded shadow-sm">
                                                <p className="text-[10px] sm:text-xs font-bold text-green-600">
                                                    #{service.TypesName}
                                                </p>
                                            </div>

                                            {service.ImageURL ? (
                                                <img
                                                    src={service.ImageURL}
                                                    alt={service.ServiceName}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-gray-400">
                                                    No Image
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3 mb-3">

                                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                                                {service.imageAdvisorUrl ? (
                                                    <img
                                                        src={service.imageAdvisorUrl}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    "👤"
                                                )}
                                            </div>

                                            <div>
                                                <h3 className="font-medium">{service.ServiceName}</h3>
                                                <p className="text-sm text-gray-500">
                                                    {service.Fadvisor} {service.Ladvisor}
                                                </p>

                                                <div className="flex gap-2 text-yellow-500 text-xs">
                                                    {renderStars(service.AvgRating)}
                                                    <span className="text-gray-500">{service.AvgRating}</span>
                                                    <span className="text-gray-500">({service.ReviewCount})</span>
                                                </div>
                                            </div>
                                        </div>

                                        <p className="text-sm text-gray-600 line-clamp-3 wrap-break-word">
                                            {service.Front_Description}
                                        </p>

                                        <div className="mt-auto text-xs text-gray-400 text-right pt-4">
                                            <div>{service.price} บาท</div>
                                            <div>{service.Duration} นาที</div>
                                        </div>

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