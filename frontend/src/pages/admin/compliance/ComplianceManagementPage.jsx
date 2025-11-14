import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import adminService from '../../../services/adminService';

const ComplianceManagementPage = () => {
    const [expiringDocs, setExpiringDocs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [daysFilter, setDaysFilter] = useState(30);

    useEffect(() => {
        const fetchExpiring = async () => {
            setLoading(true); setError(null);
            try {
                const data = await adminService.getExpiringCompliance(daysFilter);
                setExpiringDocs(data || []);
            } catch (err) {
                setError(err.message || 'Failed to load expiring compliance data.');
            } finally {
                setLoading(false);
            }
        };
        fetchExpiring();
    }, [daysFilter]);

    const formatDate = (d) => d ? new Date(d).toLocaleDateString() : 'N/A';

    return (
        <div>
            <h1 className="text-2xl font-semibold text-text-primary mb-4">Compliance Management</h1>

            <div className="bg-white p-6 shadow rounded-lg border border-border">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-text-primary">Documents Expiring Soon</h2>
                    <div>
                        <label htmlFor="daysFilter" className="text-sm mr-2">Within:</label>
                        <select
                            id="daysFilter"
                            value={daysFilter}
                            onChange={(e) => setDaysFilter(Number(e.target.value))}
                            className="input-style text-sm py-1" // Use consistent input style
                        >
                            <option value="7">7 Days</option>
                            <option value="14">14 Days</option>
                            <option value="30">30 Days</option>
                            <option value="60">60 Days</option>
                        </select>
                    </div>
                </div>

                {loading && <p>Loading expiring documents...</p>}
                {error && <p className="text-red-600">{error}</p>}

                {!loading && !error && (
                    expiringDocs.length === 0 ? (
                        <p className="text-text-secondary text-center py-4">No documents expiring within {daysFilter} days.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-border-light">
                                <thead className="bg-background-light">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">User</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Email</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Document Type</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Expires On</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-border-light">
                                    {expiringDocs.map(req => (
                                        // Find the specific expiring document(s) within the request
                                        req.documents
                                            .filter(doc => doc.expiresAt && new Date(doc.expiresAt) <= new Date(Date.now() + daysFilter * 24 * 60 * 60 * 1000))
                                            .map((doc, index) => (
                                            <tr key={`${req._id}-${index}`} className="hover:bg-gray-50">
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-text-primary">{req.user?.name || 'N/A'}</td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-text-secondary">{req.user?.email || 'N/A'}</td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-text-secondary">{doc.documentType || 'N/A'}</td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-red-600">{formatDate(doc.expiresAt)}</td>
                                                <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <Link to={`/admin/users/${req.user?._id}`} className="text-primary hover:underline">View User</Link>
                                                    {/* Add button to notify user later */}
                                                </td>
                                            </tr>
                                        ))
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default ComplianceManagementPage;