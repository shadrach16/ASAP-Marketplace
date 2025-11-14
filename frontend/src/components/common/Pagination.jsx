import React from 'react';
import Button from './Button';

const Pagination = ({ currentPage, totalPages, onPageChange, disabled }) => {
    if (totalPages <= 1) return null; // Don't render if only one page

    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    return (
        <div className="mt-6 flex justify-center items-center space-x-4">
            <Button
                onClick={handlePrevious}
                disabled={currentPage === 1 || disabled}
                variant="secondary"
                size="sm"
            >
                Previous
            </Button>
            <span className="text-sm text-text-secondary">
                Page {currentPage} of {totalPages}
            </span>
            <Button
                onClick={handleNext}
                disabled={currentPage === totalPages || disabled}
                variant="secondary"
                size="sm"
            >
                Next
            </Button>
        </div>
    );
};

export default Pagination;