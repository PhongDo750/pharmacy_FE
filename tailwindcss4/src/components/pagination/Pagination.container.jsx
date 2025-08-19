import React from "react";
import {PaginationView} from "./Pagination.view";

export const PaginationContainer = ({ pageNumber, totalPages, totalElements, setPageNumber }) => {
    if (totalPages === 0) return null;

    const getPageRange = () => {
        const range = [];
        const visiblePages = 5;
        const half = Math.floor(visiblePages / 2);

        let start = Math.max(1, pageNumber - half);
        let end = Math.min(totalPages, pageNumber + half);

        if (pageNumber <= half + 1) {
            start = 1;
            end = Math.min(totalPages, visiblePages);
        }

        if (pageNumber >= totalPages - half) {
            end = totalPages;
            start = Math.max(1, totalPages - visiblePages + 1);
        }

        if (start > 1) range.push("...");
        for (let i = start; i <= end; i++) {
            range.push(i);
        }
        if (end < totalPages) range.push("...");

        return range;
    };


    return (
        <PaginationView
            pageNumber={pageNumber}
            totalPages={totalPages}
            totalElements={totalElements}
            pageRange={getPageRange()}
            onPageChange={setPageNumber}
        />
    );
};