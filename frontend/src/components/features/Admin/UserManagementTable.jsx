import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../common/Button';

const UserManagementTable = ({ users, onBanUser, loadingUserId }) => {

    const formatDate = (dateStr) => dateStr ? new Date(dateStr).toLocaleDateString() : 'N/A';

    if (!users || users.length === 0) {
        return <p className="text-text-secondary text-center py-4">No users found.</p>;
    }

    return (
        <div className="overflow-x-auto bg-white shadow rounded-lg border border-border">
            <table className="min-w-full divide-y divide-border-light">
                <thead className="bg-background-light">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Name</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Email</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Role</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Joined</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-border-light">
                    {users.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">{user.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{user.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary capitalize">{user.role}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{formatDate(user.createdAt)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                <Link to={`/admin/users/${user._id}`} className="text-primary hover:underline">View</Link>
                                {user.role !== 'admin' && ( // Prevent banning other admins
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        className="border-red-300 text-red-700 hover:bg-red-50 focus:ring-red-300"
                                        onClick={() => onBanUser(user._id)}
                                        disabled={loadingUserId === user._id}
                                    >
                                        {loadingUserId === user._id ? 'Banning...' : 'Ban'}
                                    </Button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserManagementTable;