import React from 'react';
import { Link } from 'react-router-dom'; // Import Link
import { Layers, Plus } from 'lucide-react'; // Import icons
import Button from '../../common/Button'; // Import Button

// --- Skeleton Loader for Portfolio Item ---
const PortfolioItemSkeleton = () => (
    <div className="bg-white rounded-lg   border border-border overflow-hidden animate-pulse">
        <div className="w-full h-48 bg-gray-200"></div> {/* Image Placeholder */}
        <div className="p-4 space-y-2">
            <div className="h-5 bg-gray-200 rounded w-3/4"></div> {/* Title Placeholder */}
            <div className="h-3 bg-gray-200 rounded w-full"></div> {/* Description Placeholder */}
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
        </div>
    </div>
);

// --- Portfolio Item Display (Keep as is) ---
const PortfolioItemDisplay = ({ item }) => (
    // ... (item display code remains the same)
    <div className="bg-white rounded-lg   border border-border overflow-hidden group">
        <a href={item.projectUrl || item.imageUrl} target="_blank" rel="noopener noreferrer">
            <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-48 object-cover group-hover:opacity-90 transition-opacity duration-200"
                loading="lazy" // Add lazy loading
            />
        </a>
        <div className="p-4">
            <h3 className="font-semibold text-text-primary mb-1 truncate group-hover:text-primary transition-colors">
                <a href={item.projectUrl || item.imageUrl} target="_blank" rel="noopener noreferrer">
                    {item.title}
                </a>
            </h3>
            <p className="text-sm text-text-secondary line-clamp-2">{item.description}</p>
        </div>
    </div>
);

// --- Main section component ---
const PortfolioSection = ({ portfolioItems, isOwnProfile }) => { // <-- Add isOwnProfile prop
  // --- REMOVED the conditional return null ---
  const loading = false; // Add loading state if fetching separately
  const error = null; // Add error state if fetching separately

  return (
    // --- Updated Card Styling ---
    <div className="bg-white p-6  g rounded-xl border border-border mt-8">
       <div className="flex justify-between items-center mb-4">
           <h2 className="text-xl font-semibold text-text-primary">Portfolio</h2>
           {/* --- Conditionally show Add button for owner --- */}
           {isOwnProfile && !loading && !error && (
                <Link to="/pro/settings/portfolio">
                    <Button variant="secondary" size="sm" className='flex justify-center items-center' >
                        <Plus size={16} className="mr-1"/> Manage Portfolio
                    </Button>
                </Link>
           )}
       </div>

      {/* Placeholder Loading State (if needed) */}
      {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <PortfolioItemSkeleton />
              <PortfolioItemSkeleton />
              <PortfolioItemSkeleton />
          </div>
      )}

      {/* Placeholder Error State (if needed) */}
      {error && <p className="text-red-600 text-center py-4">⚠️ {error}</p>}

      {!loading && !error && portfolioItems && portfolioItems.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolioItems.map((item) => (
            <PortfolioItemDisplay key={item._id} item={item} />
          ))}
        </div>
      )}

      {/* --- Updated Empty State --- */}
      {!loading && !error && (!portfolioItems || portfolioItems.length === 0) && (
        <div className="text-center py-6 border border-dashed border-border rounded-lg">
            <Layers size={40} className="mx-auto text-text-light mb-2"/>
            <p className="text-text-secondary mb-3">Showcase your best work by adding items to your portfolio.</p>
            {/* --- Button only shown to owner --- */}

                 <div className="flex items-center justify-center w-full">
                     <Link to="/pro/settings/portfolio"  >
                        <Button variant="d" size="sm" className='flex justify-center items-center border' >
                            <Plus size={16} className="mr-1"/> Add Portfolio Item
                        </Button>
                    </Link>
                    </div>


        </div>
      )}
    </div>
  );
};

export default PortfolioSection;