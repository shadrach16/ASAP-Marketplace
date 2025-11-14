import React, { useState, useEffect } from 'react';
import reviewService from '../../../services/reviewService';
import StarRating from '../../common/StarRating'; // Import StarRating

const ReviewItem = ({ review }) => {
    return (
        <div className="py-4 border-b border-border-light">
            <div className="flex items-center mb-1">
                <StarRating rating={review.rating} size="sm" />
                <span className="ml-2 font-semibold text-text-primary">{review.rating.toFixed(1)}</span>
            </div>
            <p className="text-sm text-text-primary mb-2">{review.comment}</p>
            <p className="text-xs text-text-secondary">
                by {review.reviewer?.name || 'User'} - {new Date(review.createdAt).toLocaleDateString()}
            </p>
        </div>
    );
}

const ReviewSection = ({ proId,onSummaryUpdate }) => {
  const [reviewsData, setReviewsData] = useState({ reviews: [], count: 0, averageRating: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!proId) return;
    const fetchReviews = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await reviewService.getReviewsForPro(proId);
        setReviewsData(data);
      } catch (err) {
        setError(err.message || 'Failed to load reviews.');
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [proId]);

  return (
    <div className="bg-white p-6   rounded-lg border border-border mt-8">
      <h2 className="text-xl font-semibold text-text-primary mb-4">
        Reviews ({reviewsData.count})
      </h2>

      {loading && <p className="text-text-secondary">Loading reviews...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <>
          {reviewsData.count > 0 ? (
            <div>
               <div className="flex items-center mb-4">
                  <span className="text-2xl font-bold mr-2">{reviewsData.averageRating.toFixed(1)}</span>
                  <StarRating rating={reviewsData.averageRating} size="md" />
                  <span className="ml-2 text-sm text-text-secondary">({reviewsData.count} reviews)</span>
               </div>
               <div className="space-y-4">
                  {reviewsData.reviews.map(review => (
                     <ReviewItem key={review._id} review={review} />
                  ))}
               </div>
            </div>
          ) : (
            <p className="text-text-secondary">No reviews yet.</p>
          )}
        </>
      )}
    </div>
  );
};

export default ReviewSection;