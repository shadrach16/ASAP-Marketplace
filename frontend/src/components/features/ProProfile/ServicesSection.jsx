import React, { useState, useEffect } from 'react';
import proService from '../../../services/proService';
import { Link } from 'react-router-dom';
import { Clock, RefreshCw, Briefcase, Plus } from 'lucide-react';
import Button from '../../common/Button'; // Import Button

// --- Skeleton Loader (Keep as is) ---
const ServiceCardSkeleton = () => (
    // ... (skeleton code remains the same)
     <div className="bg-white rounded-lg shadow border border-border overflow-hidden animate-pulse">
        <div className="w-full h-40 bg-gray-200"></div> {/* Image Placeholder */}
        <div className="p-4 space-y-3">
            <div className="h-5 bg-gray-200 rounded w-3/4"></div> {/* Title Placeholder */}
            <div className="h-3 bg-gray-200 rounded w-full"></div> {/* Description Placeholder */}
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            <div className="pt-3 border-t border-border-light flex justify-end">
                 <div className="h-6 bg-gray-200 rounded w-1/3"></div> {/* Price Placeholder */}
            </div>
        </div>
    </div>
);

// --- Service Card (Keep as is) ---
const ServiceCard = ({ service }) => (
 <Link to={`/services/${service._id}`}>
     <div className="bg-white rounded-lg   border border-border overflow-hidden group flex flex-col transition-shadow hover:shadow-md">
        {/* Make image clickable if you add a detail page link later */}
        <div className="relative">
            {service.imageUrl ? (
                 <img
                    src={service.imageUrl}
                    alt={service.title}
                    className="w-full h-40 object-cover group-hover:opacity-90 transition-opacity duration-200"
                    loading="lazy"
                 />
            ): (
                 <div className="w-full h-40 bg-gray-100 flex items-center justify-center text-text-light">
                     {/* Placeholder if no image */}
                     <Briefcase size={40} />
                 </div>
            )}
        </div>
        <div className="p-4 flex flex-col flex-grow">
            <h3 className="font-semibold text-text-primary mb-1 group-hover:text-primary transition-colors line-clamp-2">
                {/* Optional Link: <Link to={`/services/${service._id}`}>{service.title}</Link> */}
                {service.title}
            </h3>
             <p className="text-sm text-text-secondary mb-3 line-clamp-3 flex-grow"> {/* Increased size slightly */}
                {service.description}
             </p>

             {/* Optional: Add details like delivery time/revisions */}
             <div className="flex items-center space-x-4 text-xs text-text-secondary mb-3">
                <span className="flex items-center"><Clock size={12} className="mr-1"/> {service.deliveryTimeDays} Day Delivery</span>
                <span className="flex items-center"><RefreshCw size={12} className="mr-1"/> {service.revisions} Revision{service.revisions !== 1 ? 's' : ''}</span>
             </div>

             {/* Footer with price */}
            <div className="mt-auto pt-3 border-t border-border-light justify-between flex items-center">
                <span className="text-xs text-text-secondary uppercase">Starting At </span>
                <span className="font-bold text-lg text-primary">${service.price.toFixed(2)}  <span className="text-xs text-text-secondary"> {service.currency}</span></span> {/* Use primary color for price */}
               
            </div>
        </div>
     </div>
     </Link>
);

// --- Main section component ---
const ServicesSection = ({ proId, isOwnProfile }) => { // <-- Add isOwnProfile prop
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

   useEffect(() => {
    if (!proId) return;
    const fetchServices = async () => {
      setLoading(true); setError(null);
      try {
        const data = await proService.getProServices(proId);
        setServices(data);
      } catch (err) {
        setError(err.message || 'Failed to load services.');
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [proId]);

   // --- REMOVED the conditional return null ---

   return (
    <div className="bg-white p-6   rounded-xl border border-border mt-8">
      <div className="flex justify-between items-center mb-4 border-b pb-4">
        <h2 className="text-xl font-semibold text-text-primary">
            Services Offered
        </h2>
        {/* --- Conditionally show Add button for owner when NOT loading and NO error --- */}
        {isOwnProfile && !loading && !error && (
            <Link to="/pro/settings/services">
                <Button variant="secondary" size="sm"  className='flex justify-center items-center'>
                    <Plus size={16} className="mr-1"/> Manage Services
                </Button>
            </Link>
        )}
      </div>

      {loading && (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ServiceCardSkeleton />
            <ServiceCardSkeleton />
            <ServiceCardSkeleton />
         </div>
      )}

      {error && <p className="text-red-600 text-center py-4">⚠️ {error}</p>}

      {!loading && !error && services.length > 0 && (
         <div className="grid grid-cols-1 md:grid-cols-2   gap-6">
            {services.map(service => (
                <ServiceCard key={service._id} service={service} />
            ))}
         </div>
      )}

      {/* --- Updated Empty State --- */}
       {!loading && !error && services.length === 0 && (
            <div className="text-center py-6 border border-dashed border-border rounded-lg">
                <Briefcase size={40} className="mx-auto text-text-light mb-2"/>
                <p className="text-text-secondary mb-3">This professional hasn't added any specific services yet.</p>
                {/* --- Button only shown to owner --- */}
                {isOwnProfile && (
                     <div className="flex items-center justify-center w-full">
                     <Link to="/pro/settings/services"  >
                        <Button variant="d" size="sm" className='flex justify-center items-center border' >
                            <Plus size={16} className="mr-1"/> Add Your First Service
                        </Button>
                    </Link>
                    </div>
                )}
            </div>
       )}
    </div>
   );
};

export default ServicesSection;