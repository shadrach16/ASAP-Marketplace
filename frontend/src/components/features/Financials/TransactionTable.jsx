import React from 'react';

const TransactionTable = ({ transactions }) => {

    const formatDate = (dateStr) => dateStr ? new Date(dateStr).toLocaleDateString() : 'N/A';
    const formatCurrency = (amount, currency) => {
        const absAmount = Math.abs(amount ?? 0);
        const sign = amount < 0 ? '-' : '+'; // Indicate inflow/outflow
        // Basic formatting, consider using Intl.NumberFormat for better localization
        return `${sign} $${absAmount.toFixed(2)} ${currency}`;
    };

    if (!transactions || transactions.length === 0) {
        return <p className="text-text-secondary text-center py-4">No transactions found.</p>;
    }

    return (
        <div className="overflow-x-auto bg-white shadow rounded-lg border border-border">
            <table className="min-w-full divide-y divide-border-light">
                <thead className="bg-background-light">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Date</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Type</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Description</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">Amount</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Status</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-border-light">
                    {transactions.map((tx) => (
                        <tr key={tx._id || tx.date} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{formatDate(tx.date)}</td>
                             <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{tx.type}</td>
                            <td className="px-6 py-4 text-sm text-text-primary max-w-xs truncate" title={tx.description}>{tx.description}</td>
                            <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {formatCurrency(tx.amount, tx.currency)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary capitalize">{tx.status?.replace('_', ' ')}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TransactionTable;