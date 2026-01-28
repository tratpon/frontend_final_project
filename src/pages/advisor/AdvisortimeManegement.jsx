import ScheduleGrid from "../../components/advisor/ScheduleGrid"
import BookingList from "../../components/advisor/BookingList"
import NavbarAdvisor from "../../components/NavbarAdvisor"
export default function AdvisorTimeManegemet() {
    return (
        <div>
            <NavbarAdvisor />
            <div className="max-w-7xl mx-auto p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* LEFT */}
                    <div className="lg:col-span-2">
                        <ScheduleGrid />
                    </div>

                    {/* RIGHT */}
                    <div>
                        <BookingList />
                    </div>
                </div>
            </div>
            


        </div>
    )
}