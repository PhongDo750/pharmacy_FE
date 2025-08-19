import React from "react";
import {ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight} from "react-feather";

export const PaginationView = ({pageNumber, totalPages, totalElements, pageRange, onPageChange}) => {
    return (
        <div className="mt-3 mx-0 px-0">
            <div className="flex justify-center items-center flex-col lg:flex-row">
                <div className="flex justify-center items-center space-x-1">
                    {/* First Page Button */}
                    <button
                        className={`flex items-center justify-center w-10 h-10 rounded-md border transition-colors ${
                            pageNumber === 1
                                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                                : "bg-white text-blue-900 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                        }`}
                        disabled={pageNumber === 1}
                        onClick={() => onPageChange(1)}
                    >
                        <ChevronsLeft size={18}/>
                    </button>

                    {/* Previous Page Button */}
                    <button
                        className={`flex items-center justify-center w-10 h-10 rounded-md border transition-colors ${
                            pageNumber === 1
                                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                                : "bg-white text-blue-900 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                        }`}
                        disabled={pageNumber === 1}
                        onClick={() => onPageChange(pageNumber - 1)}
                    >
                        <ChevronLeft size={18}/>
                    </button>

                    {/* Page Numbers */}
                    {pageRange.map((page, index) => (
                        <button
                            key={index}
                            className={`flex items-center justify-center w-10 h-10 rounded-md border transition-colors ${
                                page === "..."
                                    ? "bg-white text-gray-500 border-gray-300 cursor-default"
                                    : page === pageNumber
                                    ? "bg-blue-800 text-white border-blue-800"
                                    : "bg-white text-blue-900 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                            }`}
                            disabled={page === "..."}
                            onClick={() => page !== "..." && onPageChange(page)}
                        >
                            {page}
                        </button>
                    ))}

                    {/* Next Page Button */}
                    <button
                        className={`flex items-center justify-center w-10 h-10 rounded-md border transition-colors ${
                            pageNumber === totalPages
                                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                                : "bg-white text-blue-900 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                        }`}
                        disabled={pageNumber === totalPages}
                        onClick={() => onPageChange(pageNumber + 1)}
                    >
                        <ChevronRight size={18}/>
                    </button>

                    {/* Last Page Button */}
                    <button
                        className={`flex items-center justify-center w-10 h-10 rounded-md border transition-colors ${
                            pageNumber === totalPages
                                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                                : "bg-white text-blue-900 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                        }`}
                        disabled={pageNumber === totalPages}
                        onClick={() => onPageChange(totalPages)}
                    >
                        <ChevronsRight size={18}/>
                    </button>
                </div>

                <div className="mt-4 lg:mt-0 lg:ml-5 p-0 text-gray-600 text-center lg:text-right">
                    <p className="text-sm">
                        Trang {pageNumber}/{totalPages} (Tổng: {totalElements} bản ghi)
                    </p>
                </div>
            </div>
        </div>
    );
};