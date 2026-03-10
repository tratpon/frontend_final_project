import { Link, useParams } from "react-router-dom";
import NavbarSwitcher from "../app/NavbarSwitcht.jsx";
import Footer from "../components/Footer.jsx";
import { useQuery } from "@tanstack/react-query";
import {
  fetchDetailService,
  fetchservicerating,
  fetchtopics,
} from "../app/Api.js";
import BookingSidebar from "../components/BookingSidebar.jsx";

export default function DetailServicePage() {
  const { id } = useParams();

  /* SERVICE INFO */
  const { data } = useQuery({
    queryKey: ["service", id],
    queryFn: () => fetchDetailService(id),
  });

  const service = data?.services?.[0];

  /* RATING DATA */
  const { data: ratingData } = useQuery({
    queryKey: ["serviceRating", id],
    queryFn: () => fetchservicerating(id),
  });

  /* TOPICS (master list) */
  const { data: topics } = useQuery({
    queryKey: ["topics"],
    queryFn: fetchtopics,
  });

  const rating = ratingData?.rating;
  const topicRatings = ratingData?.topics || [];
  const reviews = ratingData?.reviews || [];

  /* ถ้าไม่มี rating ให้เอา topics มาแสดง 0 ดาว */
  const topicList =
    topicRatings.length > 0
      ? topicRatings
      : (topics || []).map((t) => ({
          TopicName: t.TopicName,
          AvgScore: 0,
        }));

  /* STAR RENDER */
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

  if (!service) return <div className="p-10">Loading...</div>;

  return (
    <div>
      <NavbarSwitcher />

      <div className="min-h-screen px-6 py-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* LEFT CONTENT */}
          <div className="lg:col-span-2">

            {/* IMAGE */}
            <div>
              <div className="w-full h-90 bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="w-40 h-40 bg-gray-300"></div>
              </div>

              <div className="grid grid-cols-4 gap-4 mt-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-20 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="mt-8 leading-relaxed text-gray-800 text-sm">
              <p>{service?.Full_Description}</p>
            </div>

            {/* RATING SUMMARY */}
            <div className="flex mt-10 mb-10">

              <div className="mt-6 items-center">

                <Link
                  to={`/AdviserProfile/${service.advisorID}`}
                  className="w-20 h-20 flex flex-col justify-center items-center bg-gray-100 rounded-full"
                >
                  <span className="text-xl font-bold">
                    {rating?.AverageScore || "0.0"}
                  </span>

                  <span className="text-xs text-gray-500">
                    จาก {rating?.ReviewCount || 0} รีวิว
                  </span>
                </Link>

                <div className="text-yellow-500 text-xl">
                  {renderStars(rating?.AverageScore || 0)}
                </div>

              </div>

              <div className="border-l mx-20 border-gray-300"></div>

              {/* TOPIC RATINGS */}
              <div className="mt-6 grid grid-cols-2 gap-x-40 gap-y-5">

                {topicList.map((topic) => (
                  <div key={topic.TopicName}>
                    <p className="text-lg text-gray-700">
                      {topic.TopicName}
                    </p>

                    <div className="flex gap-2 text-yellow-500 text-xl mb-2">
                      {renderStars(topic?.AvgScore || 0)}

                      <div className="text-black font-bold">
                        ({topic?.AvgScore || 0})
                      </div>
                    </div>

                  </div>
                ))}

              </div>

            </div>

            {/* REVIEWS */}
            <div className="space-y-8">

              {reviews.length === 0 ? (

                <div className="text-gray-400 text-sm">
                  ยังไม่มีรีวิว
                </div>

              ) : (

                reviews.map((review, index) => (
                  <div key={index} className="text-sm text-gray-600">

                    <div className="flex items-center gap-3 mt-4">
                      <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                      <span>{review.Username}</span>
                    </div>

                    <div className="text-yellow-500 mt-2">
                      {renderStars(review?.AverageScore || 0)}
                    </div>

                    <p>{review.ReviewText}</p>

                    <div className="text-xs text-gray-400 mt-2">
                      {review?.Date
                        ? new Date(review.Date).toLocaleDateString()
                        : ""}
                    </div>

                  </div>
                ))

              )}

            </div>

          </div>

          {/* BOOKING SIDEBAR */}
          <div>
            <BookingSidebar serviceID={service?.ServiceID} />
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}