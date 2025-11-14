// src/pages/services/ServiceDetailPage.jsx (NEW FILE)

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner';
import {
  DollarSign,
  Clock,
  RefreshCw,
  User,
  Loader2,
  Briefcase
} from 'lucide-react';

// Import Services
import proService from '../../services/proService'; //

// Import Components
import Button from '../../components/common/Button';
import ServiceCard from '../../components/features/Services/ServiceCard'; // (Re-using this from 'Find Services')

/**
 * A detailed page that displays a single service and info about the Pro.
 */
const ServiceDetailPage = () => {
  const { serviceId } = useParams();
  const [service, setService] = useState(null);
  const [otherServices, setOtherServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Data Fetching ---
  const loadServiceData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 1. Fetch the main service
      // We will add getServiceById to proService.js
      const serviceData = await proService.getServiceById(serviceId);
      if (!serviceData) throw new Error('Service not found.');
      setService(serviceData);

      // 2. Once we have the pro's ID, fetch their other services
      const proId = serviceData.pro._id;
      if (proId) {
        const otherServicesData = await proService.getProServices(proId);
        // Filter out the current service from the "other services" list
        setOtherServices(
          otherServicesData.filter(s => s._id !== serviceId)
        );
      }
    } catch (err) {
      console.error("Error loading service details:", err);
      setError(err.message || 'Failed to load service details.');
    } finally {
      setLoading(false);
    }
  }, [serviceId]);

  // Load data on mount
  useEffect(() => {
    loadServiceData();
  }, [loadServiceData]);

  // --- Render Logic ---
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-lg text-text-secondary animate-pulse ml-3">
          Loading Service...
        </p>
      </div>
    );
  }

  if (error) {
    return <p className="text-center py-10 text-red-600">{error}</p>;
  }

  if (!service) {
    return <p className="text-center py-10">Service not found.</p>;
  }

  const { pro, category } = service;

  return (
    <>
      <Helmet>
        <title>{`${service.title} | ASAP`}</title>
        <meta name="description" content={service.description.slice(0, 160) + '...'} />
      </Helmet>

      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* --- Left Column (Main Content) --- */}
          <main className="lg:col-span-2 space-y-8">
            {/* Service Image */}
            <div className="bg-white border border-border rounded-lg shadow-sm overflow-hidden">
              {service.imageUrl ? (
                <img
                  src={service.imageUrl}
                  alt={service.title}
                  className="w-full h-auto max-h-[400px] object-cover"
                />
              ) : (
                <div className="w-full h-64 bg-gray-100 flex items-center justify-center text-text-light">
                  <Briefcase size={64} />
                </div>
              )}
            </div>

            {/* About this Service */}
            <section className="bg-white border border-border rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-text-primary mb-4">
                About This Service
              </h2>
              <div className="prose prose-sm max-w-none text-text-primary whitespace-pre-wrap">
                {service.description}
              </div>
            </section>
            
            {/* About the Pro */}
            <section className="bg-white border border-border rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-text-primary mb-4">
                About the Professional
              </h2>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-text-secondary flex-shrink-0">
                  <User className="w-8 h-8" />
                </div>
                <div>
                  <Link to={`/pros/${pro._id}`} className="block">
                    <h3 className="text-xl font-semibold text-primary hover:underline">
                      {pro.name}
                    </h3>
                  </Link>
                  <p className="text-md text-text-secondary">{pro.title}</p>
                </div>
              </div>
              <div className="prose prose-sm max-w-none text-text-primary whitespace-pre-wrap">
                {pro.bio}
              </div>
            </section>

            {/* Other Services from this Pro */}
            {otherServices.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-text-primary mb-4">
                  Other Services by {pro.name}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {otherServices.map((s) => (
                    <ServiceCard key={s._id} service={s} />
                  ))}
                </div>
              </section>
            )}
          </main>

          {/* --- Right Column (Sticky Panel) --- */}
          <aside className="lg:col-span-1 lg:sticky lg:top-24 space-y-6">
            <div className="p-6 bg-white border border-border rounded-lg shadow-sm divide-y divide-border-light">
              <div className="pb-4">
                <h3 className="text-lg font-semibold text-text-primary">
                  {service.title}
                </h3>
                <span className="text-2xl font-bold text-text-primary mt-2 flex items-center">
                  <DollarSign size={22} className="mr-1 text-text-secondary" />
                  {service.price.toFixed(2)}
                  <span className="text-sm font-normal text-text-secondary ml-1.5">{service.currency}</span>
                </span>
              </div>
              <div className="py-4 text-sm text-text-primary space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center text-text-secondary">
                    <Clock size={16} className="mr-2" />
                    Delivery Time
                  </span>
                  <span className="font-semibold">{service.deliveryTimeDays} Days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center text-text-secondary">
                    <RefreshCw size={16} className="mr-2" />
                    Revisions
                  </span>
                  <span className="font-semibold">{service.revisions}</span>
                </div>
              </div>
              <div className="pt-4">
                <Link   to={`/pros/${pro._id}`}>

                <Button 
                  as={Link} 
                  to={`/pros/${pro._id}`} // Links to pro profile, can be changed to a contact/message page
                  variant="primary" 
                  className="w-full"
                >
                  Visit {pro.name}
                </Button>
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
};

export default ServiceDetailPage;