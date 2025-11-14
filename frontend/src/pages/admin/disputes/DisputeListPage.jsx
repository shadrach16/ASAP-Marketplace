import React, { useState, useEffect } from 'react';
import adminService from '../../../services/adminService';
import Pagination from '../../../components/common/Pagination';
import { Link } from 'react-router-dom'; // For linking to details

// Placeholder table component for disputes
const DisputeListTable = ({ disputes }) => {
     if (!disputes || disputes.length === 0) {
        return <p className="text-text-secondary text-center py-4">No disputes found matching criteria.</p>;
    }
    const formatDate = (d) => d ? new Date(d).toLocaleDateString() : 'N/A';
    return (
        <div className="overflow-x-auto bg-white shadow rounded-lg border border-border">
            <table className="min-w-full divide-y divide-border-light">
                 <thead className="bg-background-light">
                     <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Booking/Job</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Plaintiff</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Defendant</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Date Raised</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">Actions</th>
                     </tr>
                 </thead>
                  <tbody className="bg-white divide-y divide-border-light">
                      {disputes.map(d => (
                          <tr key={d._id} className="hover:bg-gray-50">
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-text-secondary">{d.booking?.job?.title || d.booking?._id || 'N/A'}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-text-primary">{d.plaintiff?.name || 'N/A'}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-text-secondary">{d.defendant?.name || 'N/A'}</td>
                             <td className="px-4 py-4 whitespace-nowrap text-sm text-text-secondary"><span className={`capitalize px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                 d.status === 'open' ? 'bg-yellow-100 text-yellow-800' :
                                 d.status === 'resolved' ? 'bg-green-100 text-green-800' :
                                 'bg-gray-100 text-gray-800'
                             }`}>{d.status}</span></td>
                             <td className="px-4 py-4 whitespace-nowrap text-sm text-text-secondary">{formatDate(d.createdAt)}</td>
                             <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                                 <Link to={`/admin/disputes/${d._id}`} className="text-primary hover:underline">View/Resolve</Link>
                            </td>
                          </tr>
                      ))}
                  </tbody>
            </table>
        </div>
    );
};


const DisputeListPage = () => {
    const [disputesData, setDisputesData] = useState({ data: [], count: 0, totalPages: 1, currentPage: 1 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();

    const currentPage = parseInt(searchParams.get('page') || '1', 10);
    const statusFilter = searchParams.get('status') || ''; // Example filter

    useEffect(() => {
        const loadDisputes = async () => {
            setLoading(true); setError(null);
            try {
                const params = { page: currentPage };
                if (statusFilter) params.status = statusFilter;
                const data = await adminService.getDisputes(params);
                setDisputesData(data);
            } catch (err) {
                setError(err.message || 'Failed to load disputes.');
            } finally {
                setLoading(false);
            }
        };
        loadDisputes();
    }, [currentPage, statusFilter]); // Reload on page or filter change

     const handlePageChange = (newPage) => {
        setSearchParams({ page: newPage.toString(), status: statusFilter });
    };

    // Add filter change handler later

    return (
        <div>
            <h1 className="text-2xl font-semibold text-text-primary mb-6">Dispute Management</h1>
             {/* TODO: Add Filter UI (Dropdown for status) */}
             {error && <p className="text-red-600 mb-4">{error}</p>}
             {loading ? (
                <p>Loading disputes...</p>
             ) : (
                <>
                    <DisputeListTable disputes={disputesData.data} />
                    <Pagination
                        currentPage={disputesData.currentPage}
                        totalPages={disputesData.totalPages}
                        onPageChange={handlePageChange}
                        disabled={loading}
                    />
                </>
             )}
        </div>
    );
};

export default DisputeListPage;