import React, { useState, useEffect } from 'react';
import reviewService from '../../../services/reviewService'; //
import { User } from 'lucide-react'; // For placeholder avatar

// --- Skeleton Loader for Testimonial Item ---
const TestimonialSkeleton = () => (
    <div className="py-4 border-b border-border-light last:border-b-0 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="flex justify-end items-center">
            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            <div className="w-6 h-6 rounded-full bg-gray-200 ml-2"></div>
        </div>
    </div>
);


// --- Updated Testimonial Item ---
const TestimonialItem = ({ testimonial }) => {
     return (
        <blockquote className="py-5 border-b border-border-light last:border-b-0">
            {/* Italicized comment with quote styling */}
            <p className="text-base text-text-primary italic mb-4 relative pl-8 before:content-['\201C'] before:absolute before:left-0 before:top-0 before:text-6xl before:text-primary before:opacity-20 before:font-serif">
                {testimonial.comment}
            </p>
            {/* Footer with client avatar placeholder and name/date */}
            <footer className="flex justify-end items-center text-sm text-text-secondary">
                <span className="mr-2">- {testimonial.client?.name || 'Client'}
                    {testimonial.submittedAt && ` on ${new Date(testimonial.submittedAt).toLocaleDateString()}`}
                </span>
                {/* Placeholder Avatar */}
                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-text-light text-xs">
                    {testimonial.client?.name ? testimonial.client.name.charAt(0).toUpperCase() : <User size={14}/>}
                </div>
            </footer>
        </blockquote>
    );
}

// --- Main section component (Updated Styling & Loader) ---
const TestimonialSection = ({ proId }) => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

   useEffect(() => {
    if (!proId) {
        setLoading(false);
        setError("Pro ID not provided for testimonials.");
        return;
    };
    const fetchTestimonials = async () => {
      setLoading(true); setError(null);
      try {
        const data = await reviewService.getProTestimonials(proId); //
        setTestimonials(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load testimonials:", err);
        setError(err.message || 'Failed to load testimonials.');
        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, [proId]);

   // Return null only if loading is finished, no error, and empty
   if (!loading && !error && testimonials.length === 0) {
    return null;
  }

   return (
    // --- Updated Card Styling ---
    <div className="bg-white p-6 shadow-lg rounded-xl border border-border mt-8">
      <h2 className="text-xl font-semibold text-text-primary mb-4">
        Testimonials ({loading ? '...' : testimonials.length})
      </h2>

      {/* --- Loading State with Skeletons --- */}
      {loading && (
        <div className="space-y-4">
            <TestimonialSkeleton />
            <TestimonialSkeleton />
        </div>
      )}

      {/* --- Error State --- */}
      {error && <p className="text-red-600">⚠️ {error}</p>}

      {/* --- Content Display --- */}
      {!loading && !error && testimonials.length > 0 && (
        <div className="space-y-4">
            {testimonials.map(testimonial => (
                <TestimonialItem key={testimonial._id} testimonial={testimonial} />
            ))}
        </div>
      )}

      {/* --- Empty State (after load) --- */}
       {!loading && !error && testimonials.length === 0 && (
            <p className="text-text-secondary text-center py-4">This professional hasn't received any testimonials yet.</p>
       )}
    </div>
   );
};

export default TestimonialSection;