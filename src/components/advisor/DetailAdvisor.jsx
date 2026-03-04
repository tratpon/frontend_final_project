

import { fetchDetailAdvisor } from "../../app/Api"
import { useQuery } from "@tanstack/react-query"

export default function DetailAdvisor() {

    const { data, isLoading } = useQuery({
        queryKey: ["advisorProfile"],
        queryFn: fetchDetailAdvisor,
    });

    if (isLoading) return <p>Loading...</p>;

    const { advisor, skills, education, experience } = data;
    return (

        <div className="bg-white p-6 rounded-xl shadow-md">
            {/* Profile Image */}
            <div className="w-full h-48 bg-gray-200 rounded-md flex justify-center items-center mb-5">
                <div className="w-24 h-24 bg-gray-300 rounded-md"></div>
            </div>

            {/* Profile Info */}
            <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                <div>
                    <h3 className="font-semibold text-lg">Jane Doe</h3>
                    <p className="text-sm text-gray-600">Senior Designer</p>
                </div>

            </div>
            <button type="button" className="bg-red-600 rounded-2xl px-2"> EDIT </button>

            {/* Stars */}
            <div className="text-yellow-500 mb-5">
                {"★★★★★"}
            </div>
            <p className="font-semibold mt-2">ประวัติส่วนตัว</p>
            <h3 className="text-xl font-semibold mb-2">
                {advisor.FirstName} {advisor.LastName}
            </h3>

            <p className="text-gray-600 mb-4">{advisor.Bio}</p>

            {/* Skills */}
            <h4 className="font-semibold mt-4">ทักษะ</h4>
            <ul className="list-disc ml-5">
                {skills.map((skill) => (
                    <li key={skill.SkillID}>{skill.Description}</li>
                ))}
            </ul>

            {/* Education */}
            <h4 className="font-semibold mt-4">การศึกษา</h4>
            <ul className="list-disc ml-5">
                {education.map((edu) => (
                    <li key={edu.EducationID}>
                        {edu.Degree} - {edu.University} ({edu.GraduationYear})
                    </li>
                ))}
            </ul>

            {/* Experience */}
            <h4 className="font-semibold mt-4">ประสบการณ์</h4>
            <ul className="list-disc ml-5">
                {experience.map((exp) => (
                    <li key={exp.ExperienceID}>
                        {exp.Organization} ({exp.StartYear} - {exp.EndYear ?? "ปัจจุบัน"})
                    </li>
                ))}
            </ul>

        </div>


    );
}