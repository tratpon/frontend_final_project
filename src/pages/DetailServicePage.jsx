import { Link, useParams } from "react-router-dom";
import { useState } from "react";
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
  const [selectedImage, setSelectedImage] = useState(null);
  const [openBooking, setOpenBooking] = useState(false);
  
  /* SERVICE INFO */
  const { data } = useQuery({
    queryKey: ["service", id],
    queryFn: () => fetchDetailService(id),
  });

  const service = data?.services?.[0];
  const images = data?.services || [];

  /* RATING DATA */
  const { data: ratingData } = useQuery({
    queryKey: ["serviceRating", id],
    queryFn: () => fetchservicerating(id),
  });

  /* TOPICS */
  const { data: topics } = useQuery({
    queryKey: ["topics"],
    queryFn: fetchtopics,
  });

  const rating = ratingData?.rating;
  const topicRatings = ratingData?.topics || [];
  const reviews = ratingData?.reviews || [];

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

  const mainImage =
    selectedImage || images?.[0]?.ImageURL;

  return (
    <div>

      <NavbarSwitcher />

      <div className="min-h-screen px-6 py-10 max-w-7xl mx-auto">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* LEFT CONTENT */}
          <div className="lg:col-span-2">

            {/* IMAGE */}
            <div>

              {/* MAIN IMAGE */}
              <div className="w-full h-64 sm:h-80 md:h-96 bg-gray-200 rounded-lg overflow-hidden">

                {mainImage ? (
                  <img
                    src={mainImage}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    No Image
                  </div>
                )}

              </div>

              {/* GALLERY */}
              <div className="grid grid-cols-4 gap-4 mt-4">

                {images.map((img) => (

                  <img
                    key={img.ImageID}
                    src={img.ImageURL}
                    onClick={() => setSelectedImage(img.ImageURL)}
                    className={`h-20 w-full object-cover rounded cursor-pointer
                    ${mainImage === img.ImageURL
                        ? "ring-2 ring-blue-500"
                        : ""}`}
                  />

                ))}

              </div>

            </div>

            {/* DESCRIPTION */}
            <div className="mt-8 leading-relaxed text-gray-800 text-sm">
              <p>{service?.Full_Description}</p>
            </div>

            {/* RATING SUMMARY */}
            <div className="flex flex-col md:flex-row justify-center md:justify-start mt-10 mb-10 text-center md:text-left">

              {/* RATING SUMMARY */}
              <div className="flex flex-col items-center">
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

                <div className="text-yellow-500 text-xl mt-2">
                  {renderStars(rating?.AverageScore || 0)}
                </div>
              </div>

              {/* Divider */}
              <div className="hidden md:block border-l mx-6 h-24 border-gray-300"></div>

              {/* TOPICS */}
              <div className="grid grid-cols-2 gap-4 mt-6 md:mt-0">
                {topicList.map((topic) => (
                  <div key={topic.TopicName} className="text-center md:text-left">
                    <p className="text-gray-700 text-sm">{topic.TopicName}</p>

                    <div className="text-yellow-500 flex items-center justify-center md:justify-start gap-1">
                      {renderStars(topic?.AvgScore || 0)}
                      <span className="text-black font-bold text-sm">
                        ({topic?.AvgScore || 0})
                      </span>
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
          <div className="hidden md:block">
            <BookingSidebar serviceID={id} />
          </div>

        </div>

      </div>

      {/* MOBILE BOOKING BAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 md:hidden z-50">
        <button
          onClick={() => setOpenBooking(true)}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold"
        >
          จองตอนนี้
        </button>
      </div>
      {openBooking && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center">

          <div className="bg-white w-full md:max-w-md p-6 rounded-t-2xl md:rounded-lg">

            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-lg">จองบริการ</h2>
              <button onClick={() => setOpenBooking(false)}>✕</button>
            </div>

            <BookingSidebar serviceID={service?.ServiceID} />

          </div>

        </div>
      )}

      <Footer />

    </div>
  );
}