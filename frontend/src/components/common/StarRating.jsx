import React from 'react';

// Simple star icon (replace with a proper icon library like react-icons)
const StarIcon = ({ filled, halfFilled }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={`w-5 h-5 ${
      filled || halfFilled ? 'text-yellow-400' : 'text-gray-300'
    }`}
  >
    {/* Basic star path */}
    <path
      fillRule="evenodd"
      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354l-4.597 2.993c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
      clipRule="evenodd"
    />
    {/* TODO: Implement half-star logic if needed */}
  </svg>
);


const StarRating = ({ rating, size = 'md' }) => {
  const totalStars = 5;
  const fullStars = Math.floor(rating);
  // Basic half star check (can be more precise)
  const halfStar = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = totalStars - fullStars - halfStar;

  const starSizeClass = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'; // Example sizes

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <StarIcon key={`full-${i}`} filled />
      ))}
      {/* {halfStar > 0 && <StarIcon key="half" halfFilled />} */}
      {[...Array(emptyStars)].map((_, i) => (
        <StarIcon key={`empty-${i}`} />
      ))}
    </div>
  );
};

export default StarRating;