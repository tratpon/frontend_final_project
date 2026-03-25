import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchtopics, createreview } from "../../app/Api";
import { useState } from "react";

export default function ReviewModal({ booking, onClose }) {

  const { data: topics = [] } = useQuery({
    queryKey: ["topics"],
    queryFn: fetchtopics
  });
  const queryClient = useQueryClient();
  const [scores, setScores] = useState({});
  const [reviewText, setReviewText] = useState("");

  const mutation = useMutation({
    mutationFn: createreview,
    onSuccess: () => {
      queryClient.invalidateQueries(["Myhistory"]);
      onClose();
    }
  });

  const handleSubmit = () => {
    if (Object.keys(scores).length !== topics.length) {
      alert("กรอกคะแนนให้ครบ");
      return;
    }

    const scoreArray = Object.entries(scores).map(([topicId, score]) => ({
      topicId: Number(topicId),
      score
    }));

    mutation.mutate({
      bookId: booking.BookID,
      reviewText,
      scores: scoreArray
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">

      <div className="bg-white rounded-xl p-6 w-[500px]">

        <h2 className="text-xl font-bold mb-4">
          Rate your session
        </h2>

        {topics.map((topic) => (

          <div key={topic.TopicID} className="mb-3">

            <p className="font-medium">{topic.TopicName}</p>

            <div className="flex gap-2 mt-1">

              {[1, 2, 3, 4, 5].map((star) => (

                <button
                  key={star}
                  onClick={() =>
                    setScores({
                      ...scores,
                      [topic.TopicID]: star
                    })
                  }
                  className={`text-2xl ${scores[topic.TopicID] >= star
                      ? "text-yellow-500"
                      : "text-gray-300"
                    }`}
                >
                  ★
                </button>

              ))}

            </div>

          </div>

        ))}

        <textarea
          className="w-full border rounded p-2 mt-3"
          placeholder="Write your review..."
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
        />

        <div className="flex justify-end gap-3 mt-4">

          <button
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {mutation.isLoading ? "Submitting..." : "Submit"}
          </button>

        </div>

      </div>

    </div>
  );
}