import EditCard from "../../components/advisor/EditCard";
import NavbarAdvisor from "../../components/NavbarAdvisor";
import { Navigate, useNavigate } from "react-router-dom";


export default function AdvisorServiceList() {
     const Navigate = useNavigate()
    function test() {
        
        Navigate("/")
    }
    
    return (
        <div className="min-h-screen bg-gray-50">
            <NavbarAdvisor />
            <div className="w-full h-64 bg-gray-200 flex justify-center items-center">
                <div className="w-60 h-48 bg-gray-300"></div>
            </div>

            <div className="max-w-8xl mx-auto px-6 -mt-32">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 ">

                    {/* LEFT COLUMN: Profile */}
                    <div className="lg:col-span-1">
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
                            <button type="button" className="bg-red-600 rounded-2xl px-2" onClick={test}> EDIT </button>

                            {/* Stars */}
                            <div className="text-yellow-500 mb-5">
                                {"★★★★★"}
                            </div>

                            {/* Sections */}
                            <div className="text-sm text-gray-700 leading-relaxed">

                                <p className="font-semibold mt-2">ประวัติส่วนตัว</p>
                                <ul className="list-disc ml-5 mt-1">
                                    <li>ชื่อ-นามสกุล : นพ./พญ._________</li>
                                    <li>ชื่อเล่น : _________</li>
                                    <li>เบอร์โทรศัพท์ : _________</li>
                                </ul>

                                <p className="font-semibold mt-4">ประวัติการศึกษา</p>
                                <ul className="list-disc ml-5 mt-1">
                                    <li>คณะแพทยศาสตร์ มหาวิทยาลัย_____</li>
                                    <li>วุฒิบัตรผู้เชี่ยวชาญสาขา________</li>
                                    <li>โรงพยาบาล ________</li>
                                </ul>

                                <p className="font-semibold mt-4">ประสบการณ์การทำงาน</p>
                                <ul className="list-disc ml-5 mt-1">
                                    <li>โรงพยาบาล ________</li>
                                    <li>ดูแลผู้ป่วยด้านสุขภาพจิต</li>
                                    <li>คลินิกสุขภาพจิต</li>
                                </ul>

                                <p className="font-semibold mt-4">ทักษะด้านการบำบัด</p>
                                <ul className="list-disc ml-5 mt-1">
                                    <li>การให้คำปรึกษาทางจิตใจ</li>
                                    <li>การทำจิตบำบัด (Psychotherapy)</li>
                                </ul>

                                <p className="font-semibold mt-4">ภาษา</p>
                                <ul className="list-disc ml-5 mt-1">
                                    <li>ไทย – ระดับดีมาก</li>
                                    <li>อังกฤษ – ระดับดี</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Services */}
                    <div className="lg:col-span-3 mt-40">
                        <EditCard />
                        
                    </div>

                   

                </div>
            </div>
        </div>
    )

}