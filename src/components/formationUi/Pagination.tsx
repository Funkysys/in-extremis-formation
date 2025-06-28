interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) return null;

  const pages = [];
  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = startPage + maxVisiblePages - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="join mb-6">
      <button
        className="join-item btn btn-square"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        aria-label="Page précédente"
      >
        «
      </button>
      
      {startPage > 1 && (
        <>
          <button
            className="join-item btn btn-square"
            onClick={() => onPageChange(1)}
          >
            1
          </button>
          {startPage > 2 && <span className="join-item btn btn-square">...</span>}
        </>
      )}
      
      {pages.map((page) => (
        <button
          key={page}
          className={`join-item btn btn-square ${currentPage === page ? 'btn-active' : ''}`}
          onClick={() => onPageChange(page)}
          aria-current={currentPage === page ? 'page' : undefined}
        >
          {page}
        </button>
      ))}
      
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="join-item btn btn-square">...</span>}
          <button
            className="join-item btn btn-square"
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </button>
        </>
      )}
      
      <button
        className="join-item btn btn-square"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        aria-label="Page suivante"
      >
        »
      </button>
    </div>
  );
};

export default Pagination;
