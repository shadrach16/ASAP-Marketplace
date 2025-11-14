// src/components/features/Services/ServiceCard.jsx (NEW FILE)

import React from 'react';
import { Link } from 'react-router-dom';
import { User, DollarSign } from 'lucide-react';

/**
 * Displays a single service in a browse card.
 * @param {object} props
 * @param {object} props.service - The service object from the API.
 */
const ServiceCard = ({ service }) => {
  const pro = service.pro;

  return (
    <div className="bg-white border border-border rounded-lg shadow-sm overflow-hidden flex flex-col transition-all duration-300 hover:shadow-md">
      {/* Image */}
      <Link to={`/pros/${pro?._id}`} className="block h-40 bg-gray-100">
        {service.imageUrl ? (
          <img 
            src={service.imageUrl} 
            alt={service.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-light">
            {/* Placeholder icon */}
          </div>
        )}
      </Link>
      
      <div className="p-4 flex flex-col flex-grow">
        {/* Pro Info */}
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-text-secondary flex-shrink-0">
            <User className="w-4 h-4" />
          </div>
          <Link to={`/pros/${pro?._id}`} className="text-sm font-medium text-text-secondary hover:text-primary truncate">
            {pro?.name || 'A Professional'}
          </Link>
        </div>
        
        {/* Service Title */}
        <Link to={`/services/${service?._id}?service=${service._id}`} className="block">
          <p className="text-md font-semibold text-text-primary hover:text-primary transition-colors line-clamp-2  ">
            {service.title}
          </p>
        </Link>
        
        {/* Footer (Price) */}
        <div className="mt-3 pt-3 border-t border-border-light">
          <span className="flex items-center text-lg font-bold text-text-primary justify-end">
            <DollarSign size={16} className="mr-1 text-text-secondary" />
            {service.price.toFixed(2)}
            <span className="text-xs font-normal text-text-secondary ml-1">{service.currency}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

/**
 * Skeleton loader component for ServiceCard
 */
ServiceCard.Skeleton = () => (
  <div className="bg-white border border-border rounded-lg shadow-sm overflow-hidden animate-pulse">
    <div className="h-40 bg-gray-200"></div>
    <div className="p-4">
      <div className="flex items-center space-x-2 mb-2">
        <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
      <div className="h-5 bg-gray-200 rounded w-full mb-1"></div>
      <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
      <div className="mt-auto pt-3 border-t border-border-light">
        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
      </div>
    </div>
  </div>
);

export default ServiceCard;