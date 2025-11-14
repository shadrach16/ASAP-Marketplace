import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom'; // For managing query params
import adminService from '../../../services/adminService';
import UserManagementTable from '../../../components/features/Admin/UserManagementTable';
import Pagination from '../../../components/common/Pagination';
import Button from '../../../components/common/Button'; // For potential filter buttons

const UserListPage = () => {
    const [usersData, setUsersData] = useState({ data: [], count: 0, totalPages: 1, currentPage: 1 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionError, setActionError] = useState(null); // For errors during ban etc.
    const [loadingUserId, setLoadingUserId] = useState(null); // Track banning user ID
    const [searchParams, setSearchParams] = useSearchParams(); // Manage page, filters in URL

    const currentPage = parseInt(searchParams.get('page') || '1', 10);
    // Add filter states if needed:
    // const [roleFilter, setRoleFilter] = useState(searchParams.get('role') || '');

    const loadUsers = useCallback(async (page) => {
        setLoading(true); setError(null);
        try {
            const params = { page };
            // Add filters to params if used
            // if (roleFilter) params.role = roleFilter;
            const data = await adminService.getUsers(params);
            setUsersData(data);
        } catch (err) {
            setError(err.message || 'Failed to load users.');
        } finally {
            setLoading(false);
        }
    }, []); // Add filter states to dependency array if used

    useEffect(() => {
        loadUsers(currentPage);
    }, [currentPage, loadUsers]); // Reload when page changes

    const handlePageChange = (newPage) => {
        setSearchParams({ page: newPage.toString() /*, role: roleFilter */ });
    };

    const handleBanUser = async (userId) => {
        if (!window.confirm('Are you sure you want to ban (delete) this user? This action is irreversible.')) return;
        setLoadingUserId(userId); setActionError(null);
        try {
            await adminService.banUser(userId);
            // Refresh the current page after banning
            loadUsers(currentPage);
        } catch (err) {
            setActionError(err.message || 'Failed to ban user.');
        } finally {
             setLoadingUserId(null);
        }
    };


    return (
        <div>
            <h1 className="text-2xl font-semibold text-text-primary mb-6">User Management</h1>

            {/* TODO: Add Filter UI (Dropdown for role, input for email search) */}
            {/* <div className="mb-4 flex space-x-2"> ... filter inputs ... </div> */}

            {actionError && <p className="text-red-600 mb-4">{actionError}</p>}
            {error && <p className="text-red-600 mb-4">{error}</p>}

            {loading ? (
                <p className="text-text-secondary text-center py-4">Loading users...</p>
            ) : (
                <>
                    <UserManagementTable
                        users={usersData.data}
                        onBanUser={handleBanUser}
                        loadingUserId={loadingUserId}
                    />
                    <Pagination
                        currentPage={usersData.currentPage}
                        totalPages={usersData.totalPages}
                        onPageChange={handlePageChange}
                        disabled={loading}
                    />
                </>
            )}
        </div>
    );
};

export default UserListPage;