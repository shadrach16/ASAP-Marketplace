import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import Button from '../../components/common/Button';
import reviewService from '../../services/reviewService';
// import bookingService from '../../services/bookingService'; // Needed to fetch pro's completed bookings

// Mock function - Replace with API call to get pro's completed bookings
const fetchCompletedBookings = async () => {
    await new Promise(res => setTimeout(res, 300));
    return [
        { _id: 'completedBookingId1', job: { title: 'Website Redesign' }, client: { name: 'Client Alpha' }, status: 'completed', testimonialStatus: 'none' }, // none | pending | submitted
        { _id: 'completedBookingId2', job: { title: 'API Integration' }, client: { name: 'Client Beta' }, status: 'completed', testimonialStatus: 'pending_request' },
        { _id: 'completedBookingId3', job: { title: 'Logo Design' }, client: { name: 'Client Gamma' }, status: 'completed', testimonialStatus: 'submitted' },
    ];
}

const ProDashboardPage = () => {
    const [completedBookings, setCompletedBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [requestStates, setRequestStates] = useState({}); // Track request status per booking

    useEffect(() => {
        const loadBookings = async () => {
            setLoading(true); setError(null);
            try {
                // TODO: Replace with API call: const bookings = await bookingService.getMyCompletedBookings('pro');
                const bookings = await fetchCompletedBookings();
                setCompletedBookings(bookings);
            } catch (err) {
                setError(err.message || "Failed to load completed jobs.");
            } finally {
                setLoading(false);
            }
        };
        loadBookings();
    }, []);

    const handleRequestTestimonial = async (bookingId) => {
        setRequestStates(prev => ({ ...prev, [bookingId]: { loading: true, error: null } }));
        try {
            await reviewService.requestTestimonial(bookingId);
            setRequestStates(prev => ({ ...prev, [bookingId]: { loading: false, error: null, success: true } }));
            // Optionally update the main booking list state to reflect 'pending' status
            setCompletedBookings(prev => prev.map(b => b._id === bookingId ? { ...b, testimonialStatus: 'pending_request' } : b));

        } catch (err) {
             setRequestStates(prev => ({ ...prev, [bookingId]: { loading: false, error: err.message || 'Failed to send request.', success: false } }));
        }
    };

    return (
        <MainLayout>
            <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-text-primary mb-6">Pro Dashboard</h1>

                {/* Other dashboard sections go here (active jobs, proposals etc.) */}

                {/* Completed Jobs & Testimonial Requests */}
                <div className="bg-white p-6 shadow rounded-lg border border-border mt-8">
                     <h2 className="text-xl font-semibold text-text-primary mb-4">Completed Projects</h2>
                     {loading && <p>Loading completed projects...</p>}
                     {error && <p className="text-red-500">{error}</p>}
                     {!loading && !error && (
                         completedBookings.length === 0 ? (
                            <p className="text-text-secondary">No completed projects found yet.</p>
                         ) : (
                            <ul className="divide-y divide-border-light">
                                {completedBookings.map(booking => {
                                    const reqState = requestStates[booking._id] || {};
                                    const canRequest = booking.testimonialStatus === 'none'; // Or based on backend logic

                                    return (
                                        <li key={booking._id} className="py-4 flex flex-col md:flex-row justify-between items-start md:items-center">
                                            <div>
                                                <p className="font-medium text-text-primary">{booking.job?.title || 'Project'}</p>
                                                <p className="text-sm text-text-secondary">Client: {booking.client?.name || 'N/A'}</p>
                                                 {reqState.error && <p className="text-xs text-red-500 mt-1">{reqState.error}</p>}
                                            </div>
                                            <div className="mt-2 md:mt-0 flex-shrink-0">
                                                {booking.testimonialStatus === 'pending_request' && <span className="text-xs font-medium text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">Requested</span>}
                                                {booking.testimonialStatus === 'submitted' && <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">Submitted</span>}
                                                {canRequest && !reqState.success && (
                                                    <Button
                                                        size="sm"
                                                        variant="secondary"
                                                        onClick={() => handleRequestTestimonial(booking._id)}
                                                        disabled={reqState.loading}
                                                    >
                                                         {reqState.loading ? 'Sending...' : 'Request Testimonial'}
                                                    </Button>
                                                )}
                                                {reqState.success && <span className="text-xs font-medium text-green-600">Request Sent ✓</span>}
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                         )
                     )}
                </div>

            </div>
        </MainLayout>
    );
};

export default ProDashboardPage; // Ensure filename matches if creating new