import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import reviewService from '../../services/reviewService';
import Button from '../../components/common/Button';

const SubmitTestimonialPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [testimonialData, setTestimonialData] = useState(null); // { proName, clientName }
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const loadRequest = async () => {
      if (!token) {
        setError('Invalid submission link.');
        setLoading(false);
        return;
      }
      setLoading(true); setError(null);
      try {
        const data = await reviewService.getTestimonialByToken(token);
        setTestimonialData(data);
      } catch (err) {
        setError(err.message || 'Failed to load testimonial request. The link might be invalid or expired.');
      } finally {
        setLoading(false);
      }
    };
    loadRequest();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      setSubmitError('Please enter your testimonial.');
      return;
    }
    setSubmitting(true); setSubmitError(null);
    try {
      await reviewService.submitTestimonial(token, comment);
      setSuccess(true);
    } catch (err) {
      setSubmitError(err.message || 'Failed to submit testimonial.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderContent = () => {
    if (loading) return <p className="text-center text-text-secondary">Loading request...</p>;
    if (error) return <p className="text-center text-red-600">{error}</p>;
    if (success) {
      return (
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-primary">Thank You!</h2>
          <p className="text-text-secondary">Your testimonial has been submitted successfully.</p>
          <Button onClick={() => navigate('/')}>Go Home</Button> {/* Or link elsewhere */}
        </div>
      );
    }
    if (!testimonialData) return <p className="text-center text-red-600">Could not load testimonial details.</p>;

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-xl font-semibold text-text-primary">
          Leave a Testimonial for {testimonialData.proName}
        </h2>
        <p className="text-sm text-text-secondary">
          Hi {testimonialData.clientName}, please share your experience working with {testimonialData.proName}. Your feedback is valuable!
        </p>
         {submitError && (
            <div className="text-red-600 text-sm font-medium p-3 bg-red-50 rounded-md border border-red-200">
             {submitError}
            </div>
         )}
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-text-secondary">
            Your Testimonial <span className="text-red-500">*</span>
          </label>
          <textarea
            id="comment"
            name="comment"
            rows={6}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Describe your experience..."
            required
            disabled={submitting}
            className="mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent sm:text-sm"
          />
        </div>
        <div className="text-right pt-2">
          <Button type="submit" variant="primary" disabled={submitting || !comment.trim()}>
            {submitting ? 'Submitting...' : 'Submit Testimonial'}
          </Button>
        </div>
      </form>
    );
  };

  return (
    // Minimal layout for public page
    <div className="min-h-screen flex items-center justify-center bg-background-light py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full space-y-8 bg-white p-8 shadow-md rounded-lg border border-border">
        {renderContent()}
      </div>
    </div>
  );
};

export default SubmitTestimonialPage;