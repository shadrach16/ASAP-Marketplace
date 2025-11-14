import React, { useState } from 'react';
import Button from '../../common/Button';
import reviewService from '../../../services/reviewService';

// Basic interactive star rating input
const StarRatingInput = ({ rating, setRating, disabled }) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          className={`focus:outline-none ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          onClick={() => setRating(star)}
          onMouseEnter={() => !disabled && setHoverRating(star)}
          onMouseLeave={() => !disabled && setHoverRating(0)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={`w-8 h-8 transition-colors duration-150 ${
              (hoverRating || rating) >= star
                ? 'text-yellow-400'
                : 'text-gray-300 hover:text-yellow-200'
            }`}
          >
            <path
              fillRule="evenodd"
              d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354l-4.597 2.993c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      ))}
    </div>
  );
};


const SubmitReviewForm = ({ bookingId, revieweeName, onClose, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a star rating.');
      return;
    }
     if (!comment.trim()) {
      setError('Please provide a comment.');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      await reviewService.submitReview({ bookingId, rating, comment });
      if(onReviewSubmitted) onReviewSubmitted(); // Notify parent
      onClose(); // Close the modal/form
    } catch (err) {
      setError(err.message || 'Failed to submit review.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Assuming this is within a modal structure provided by the parent
    <form onSubmit={handleSubmit} className="space-y-6 p-1">
      <h2 className="text-xl font-semibold text-text-primary">
        Leave a Review for {revieweeName || 'the other party'}
      </h2>
      {error && (
        <div className="text-red-600 text-sm font-medium p-3 bg-red-50 rounded-md border border-red-200">
          {error}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-2">
          Your Rating
        </label>
        <StarRatingInput rating={rating} setRating={setRating} disabled={loading} />
      </div>
      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-text-secondary">
          Your Comment
        </label>
        <textarea
          id="comment"
          name="comment"
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience..."
          required
          disabled={loading}
          className="mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent sm:text-sm"
        />
      </div>
      <div className="flex justify-end space-x-3 pt-2">
        <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={loading || rating === 0 || !comment.trim()}>
          {loading ? 'Submitting...' : 'Submit Review'}
        </Button>
      </div>
    </form>
  );
};

export default SubmitReviewForm;