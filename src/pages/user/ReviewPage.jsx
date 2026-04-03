import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchtopics, createreview } from "../../app/Api";
import { useState } from "react";
import { Star, X, MessageSquare, Send } from "lucide-react";

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
      alert("กรุณาให้คะแนนให้ครบทุกหัวข้อครับ");
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
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Modal Card */}
      <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="px-8 pt-8 pb-4 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-800">ให้คะแนนการบริการ</h2>
            <p className="text-slate-500 text-sm mt-1">ขอบคุณที่ร่วมเป็นส่วนหนึ่งในการพัฒนาบริการ</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-8 pb-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {/* Service Summary (Optional UI) */}
          <div className="bg-blue-50 rounded-2xl p-4 mb-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-xl shadow-sm">
              ⭐
            </div>
            <div>
              <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">กำลังรีวิวบริการของ</p>
              <p className="text-sm font-bold text-slate-700">{booking.AdvisorName}</p>
            </div>
          </div>

          {/* Rating Topics */}
          <div className="space-y-5">
            {topics.map((topic) => (
              <div key={topic.TopicID} className="flex flex-col gap-2">
                <p className="text-sm font-bold text-slate-600 ml-1">{topic.TopicName}</p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() =>
                        setScores({
                          ...scores,
                          [topic.TopicID]: star
                        })
                      }
                      className="transition-all duration-200 active:scale-90"
                    >
                      <Star
                        size={28}
                        className={`transition-colors ${
                          scores[topic.TopicID] >= star
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-200 fill-slate-100"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Review Text */}
          <div className="mt-8">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-600 mb-2 ml-1">
              <MessageSquare size={16} />
              ความเห็นเพิ่มเติม
            </label>
            <textarea
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm text-slate-700 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all outline-none resize-none"
              placeholder="แชร์ความประทับใจของคุณที่นี่..."
              rows="4"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="px-8 py-6 bg-slate-50 flex flex-col sm:flex-row gap-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-slate-200 rounded-xl text-slate-500 font-bold hover:bg-white transition-all text-sm"
          >
            ไว้คราวหลัง
          </button>
          <button
            onClick={handleSubmit}
            disabled={mutation.isLoading}
            className="flex-2 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all disabled:bg-slate-300 disabled:shadow-none"
          >
            {mutation.isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <Send size={16} />
                ส่งความเห็น
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}