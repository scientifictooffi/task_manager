import React, { useState, useEffect } from "react";

const PaginationControls = ({
  totalTasks,
  defaultPage = 1,
  defaultLimit = 5,
  setPage,
  setLimit,
}) => {
  const [page, setLocalPage] = useState(defaultPage);
  const [limit, setLocalLimit] = useState(defaultLimit);

  useEffect(() => {
    setLocalPage(defaultPage);
    setLocalLimit(defaultLimit);
  }, [defaultPage, defaultLimit]);

  const totalPages = Math.ceil(totalTasks / limit);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setLocalPage(newPage);
      setPage(newPage);
    }
  };

  const handleLimitChange = (e) => {
    const newLimit = parseInt(e.target.value, 10);
    setLocalLimit(newLimit);
    setLimit(newLimit);
    setLocalPage(1);
    setPage(1);
  };

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, totalTasks);

  return (
    <div className="flex justify-end items-center p-4 border-t">
      <div className="flex items-center mr-3">
        <span className="mr-2">Rows per page:</span>
        <select
          className="border p-1 rounded"
          value={limit}
          onChange={handleLimitChange}
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </select>
      </div>

      <div className="flex items-center">
        <span className="mx-4">{`${start}-${end} of ${totalTasks}`}</span>
        <button
          className="px-2 py-1 mx-1 text-gray-700"
          onClick={() => handlePageChange(page - 1)}
          disabled={page <= 1}
        >
          <svg
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5 8.25 12l7.5-7.5"
            />
          </svg>
        </button>
        <button
          className="px-2 py-1 mx-1 text-gray-700"
          onClick={() => handlePageChange(page + 1)}
          disabled={page >= totalPages}
        >
          <svg
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m8.25 4.5 7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default PaginationControls;
