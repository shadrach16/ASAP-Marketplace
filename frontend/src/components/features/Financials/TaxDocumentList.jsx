import React from 'react';
import Button from '../../common/Button'; // Assuming Button supports 'as="a"' prop or use regular <a>

const TaxDocumentList = ({ documents }) => {
    if (!documents || documents.length === 0) {
        return <p className="text-text-secondary text-center py-4">No tax documents available for the selected period.</p>;
    }

    return (
        <div className="bg-white p-6 shadow rounded-lg border border-border">
             <h2 className="text-xl font-semibold text-text-primary mb-4">Tax Documents</h2>
             <p className="text-sm text-text-secondary mb-4">
                Download your official tax forms provided via Stripe. These forms are typically available early in the year for the previous tax year.
             </p>
             <ul className="divide-y divide-border-light">
                {documents.map((doc) => (
                    <li key={doc.id} className="py-3 flex justify-between items-center">
                        <div>
                            <p className="text-sm font-medium text-text-primary">
                                {doc.type.toUpperCase().replace('US_', '').replace('_', '-')} ({doc.period_start || 'Year N/A'})
                            </p>
                            <p className="text-xs text-text-light">Stripe Form ID: {doc.id}</p>
                        </div>
                        {/* Link directly to Stripe Express dashboard */}
                        <Button
                            as="a" // Use anchor tag for external link
                            href={doc.stripeDashboardLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="secondary"
                            size="sm"
                        >
                            View/Download on Stripe
                        </Button>
                        {/* Alternatively, if Stripe API provided a direct download URL in doc.url */}
                        {/* <Button as="a" href={doc.url} download variant="secondary" size="sm">Download PDF</Button> */}
                    </li>
                ))}
            </ul>
             <p className="text-xs text-text-light mt-4">
                 Need help? Please refer to Stripe's documentation or contact support regarding your tax forms.
             </p>
        </div>
    );
};

export default TaxDocumentList;