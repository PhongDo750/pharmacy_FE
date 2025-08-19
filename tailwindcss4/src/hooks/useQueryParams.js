import {useState} from "react";

export const useQueryParams = (initialQueryParams = {}) => {
    const [queryParams, setQueryParams] = useState(initialQueryParams);

    const updateQueryParams = (newParams) => {

        setQueryParams(prev => {
            const updated = {...prev, ...newParams};
            if (JSON.stringify(updated) !== JSON.stringify(prev)) {
                return updated;
            }

            return prev;
        });
    };

    return {queryParams, updateQueryParams};
};