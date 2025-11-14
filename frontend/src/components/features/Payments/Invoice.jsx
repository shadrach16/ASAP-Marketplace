import React from 'react';

// Component focused solely on displaying invoice details
const Invoice = ({ invoice }) => {

    // Return null or a placeholder if no invoice data is provided
    if (!invoice) return <p className="text-center text-text-secondary">No invoice details available.</p>;

    // Helper function to format dates
    const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString() : 'N/A';

    return (
        // Styling suitable for modal display
        <div className="bg-white p-4 sm:p-6 rounded-lg max-w-2xl mx-auto text-sm">
            {/* Invoice Header */}
            <div className="md:flex md:justify-between md:items-start mb-6 pb-4 border-b border-border-light">
                <div>
                    <h2 className="text-xl font-semibold text-text-primary mb-1">Invoice #{invoice.invoiceNumber || invoice._id?.slice(-6) || 'N/A'}</h2>
                    {/* Display Booking/Job Title if available */}
                    {invoice.booking?.job?.title && <p className="text-sm text-text-secondary">Project: {invoice.booking.job.title}</p>}
                    <p className="text-sm text-text-secondary">Issued: {formatDate(invoice.createdAt)}</p>
                    {/* Status Badge */}
                    <p className={`text-sm font-medium mt-1 ${
                        invoice.status === 'paid' ? 'text-green-600' :
                        invoice.status === 'overdue' ? 'text-red-600' :
                        invoice.status === 'sent' ? 'text-blue-600' :
                        'text-yellow-600' // draft, cancelled, void etc.
                    }`}>
                        Status: <span className="uppercase">{invoice.status?.replace('_', ' ') || 'N/A'}</span>
                    </p>
                </div>
                <div className="mt-4 md:mt-0 text-left md:text-right">
                    <p className="text-sm text-text-secondary">Due Date: <span className="font-medium text-text-primary">{formatDate(invoice.dueDate)}</span></p>
                    {invoice.paidAt && <p className="text-sm text-text-secondary">Paid On: <span className="font-medium text-text-primary">{formatDate(invoice.paidAt)}</span></p>}
                    {/* Add Pro/Client details if needed and available */}
                    {/* <p className="text-xs text-text-light mt-1">From: {invoice.pro?.name}</p> */}
                    {/* <p className="text-xs text-text-light">To: {invoice.client?.name}</p> */}
                </div>
            </div>

            {/* Invoice Items Table */}
            <div className="overflow-x-auto mb-6">
                <table className="min-w-full divide-y divide-border-light text-sm">
                     <thead className="bg-background-light">
                        <tr>
                            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Description</th>
                            <th scope="col" className="px-3 py-2 text-center text-xs font-medium text-text-secondary uppercase tracking-wider">Qty</th>
                            <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">Unit Price</th>
                            <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">Total</th>
                        </tr>
                    </thead>
                     <tbody className="bg-white divide-y divide-border-light">
                        {invoice.items?.map((item, index) => (
                            <tr key={index}>
                                <td className="px-3 py-2 whitespace-normal text-text-primary">{item.description}</td>
                                <td className="px-3 py-2 text-center text-text-secondary">{item.quantity}</td>
                                <td className="px-3 py-2 text-right text-text-secondary">${item.unitPrice?.toFixed(2) ?? '0.00'}</td>
                                <td className="px-3 py-2 text-right text-text-primary font-medium">${(item.quantity * item.unitPrice).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Totals Section */}
            <div className="flex justify-end mb-6">
                  <div className="w-full max-w-xs space-y-1 text-sm">
                    <div className="flex justify-between">
                        <span className="text-text-secondary">Subtotal:</span>
                        <span className="text-text-primary">${invoice.subTotal?.toFixed(2) ?? '0.00'}</span>
                    </div>
                    {/* Add Tax/Fee lines here if implemented */}
                    <div className="flex justify-between font-semibold text-base pt-1 border-t border-border-light mt-1">
                        <span className="text-text-primary">Total Amount:</span>
                        <span className="text-text-primary">${invoice.totalAmount?.toFixed(2) ?? '0.00'} {invoice.currency}</span>
                    </div>
                </div>
            </div>

            {/* Notes Section */}
            {invoice.notes && (
                 <div className="mb-4 p-3 bg-background-light rounded border border-border-light">
                     <h4 className="font-semibold text-sm text-text-primary mb-1">Notes from Pro:</h4>
                     <p className="text-sm text-text-secondary whitespace-pre-wrap">{invoice.notes}</p>
                 </div>
            )}

            {/* Payment Button and Stripe Elements are handled by the parent modal */}

        </div>
    );
};

export default Invoice;