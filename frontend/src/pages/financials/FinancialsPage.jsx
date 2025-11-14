import React, { useState, useEffect, useCallback } from 'react';
import TransactionTable from '../../components/features/Financials/TransactionTable';
import TaxDocumentList from '../../components/features/Financials/TaxDocumentList';
import Pagination from '../../components/common/Pagination';
import paymentService from '../../services/paymentService';
import { useAuth } from '../../hooks/useAuth';

const FinancialsPage = () => {
    const { user } = useAuth();
    const [historyData, setHistoryData] = useState({ data: [], totalPages: 1, currentPage: 1 });
    const [taxDocs, setTaxDocs] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(true);
    const [taxLoading, setTaxLoading] = useState(true);
    const [historyError, setHistoryError] = useState(null);
    const [taxError, setTaxError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    const isPro = user?.role === 'pro';

    // Load transaction history
    const loadHistory = useCallback(async (page) => {
        setHistoryLoading(true); setHistoryError(null);
        try {
            const data = await paymentService.getFinancialHistory(page);
            setHistoryData(data);
            setCurrentPage(data.currentPage || 1);
        } catch (err) {
            setHistoryError(err.message || 'Failed to load transaction history.');
        } finally {
            setHistoryLoading(false);
        }
    }, []); // No external dependencies needed if page state is used

    // Load tax documents (only if Pro)
    const loadTaxDocs = useCallback(async () => {
        if (!isPro) {
             setTaxLoading(false); // No need to load for clients
             return;
        };
        setTaxLoading(true); setTaxError(null);
        try {
            const data = await paymentService.getTaxDocuments();
            setTaxDocs(Array.isArray(data) ? data : []);
        } catch (err) {
            setTaxError(err.message || 'Failed to load tax documents.');
        } finally {
            setTaxLoading(false);
        }
    }, [isPro]); // Depend on isPro

    useEffect(() => {
        loadHistory(currentPage);
    }, [currentPage, loadHistory]);

    useEffect(() => {
        loadTaxDocs();
    }, [loadTaxDocs]); // Load tax docs on mount or when user role might change

    const handlePageChange = (newPage) => {
        if (newPage !== currentPage) {
            setCurrentPage(newPage);
        }
    };


    return (
        <>
             <div className="max-w-6xl mx-auto   px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-text-primary mb-8">Financials</h1>

                {/* Transaction History Section */}
                <div className="mb-10">
                    <h2 className="text-xl font-semibold text-text-primary mb-4">Transaction History</h2>
                    {historyError && <p className="text-red-600 mb-4">{historyError}</p>}
                    {historyLoading && historyData.data.length === 0 ? (
                        <p>Loading transactions...</p>
                    ) : (
                        <>
                            <TransactionTable transactions={historyData.data} />
                            <Pagination
                                currentPage={historyData.currentPage}
                                totalPages={historyData.totalPages}
                                onPageChange={handlePageChange}
                                disabled={historyLoading}
                            />
                        </>
                    )}
                </div>

                {/* Tax Documents Section (Only for Pros) */}
                {isPro && (
                     <div>
                        {taxError && <p className="text-red-600 mb-4">{taxError}</p>}
                        {taxLoading ? (
                             <p>Loading tax documents...</p>
                        ) : (
                             <TaxDocumentList documents={taxDocs} />
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default FinancialsPage;