import React, { useCallback } from "react";
import "./styles.css";

const Pagination = React.memo(({ currentPage, totalPages, onPageChange }) => {
  const goToPreviousPage = useCallback(() => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  }, [currentPage, onPageChange]);

  const goToNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  }, [currentPage, totalPages, onPageChange]);

  const goToPage = useCallback(
    (page) => {
      onPageChange(page);
    },
    [onPageChange]
  );

  // Define range visibility logic
  const renderPageNumbers = () => {
    const pageNumbers = [];
    const visibleRange = 2; // Number of pages visible around current page

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 || // Always show first page
        i === totalPages || // Always show last page
        (i >= currentPage - visibleRange && i <= currentPage + visibleRange) // Show range around current page
      ) {
        pageNumbers.push(i);
      } else if (
        i === currentPage - visibleRange - 1 || // Left ellipsis
        i === currentPage + visibleRange + 1 // Right ellipsis
      ) {
        pageNumbers.push("...");
      }
    }

    return pageNumbers.map((page, index) =>
      page === "..." ? (
        <span key={`ellipsis-${index}`} className="pagination__ellipsis">...</span>
      ) : (
        <button
          key={`page-${page}`}
          className={`pagination__button ${currentPage === page ? "pagination__button--active" : ""}`}
          onClick={() => goToPage(page)}
        >
          {page}
        </button>
      )
    );
  };

  return (
    <div className="pagination">
      <button 
        className="pagination__button" 
        onClick={goToPreviousPage} 
        disabled={currentPage === 1}
      >
        ◀ Prev
      </button>

      {renderPageNumbers()}

      <button 
        className="pagination__button" 
        onClick={goToNextPage} 
        disabled={currentPage === totalPages}
      >
        Next ▶
      </button>
    </div>
  );
});

export default Pagination;
