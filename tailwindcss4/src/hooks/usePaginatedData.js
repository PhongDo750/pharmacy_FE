import {useState, useEffect} from "react";

export function usePaginatedData({callAPIFunction, queryParams, id}) {
    const [data, setData] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!callAPIFunction) return;

        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await callAPIFunction(queryParams);
                console.log("data : ", response.content);
                setData(response.content);
                setTotalPages(response?.totalPages || 0);
                setTotalElements(response?.totalElements || 0);
            } catch (err) {
                setError(err.message || "Lỗi tải dữ liệu");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [queryParams]);

    return {data, totalPages, totalElements, loading, error};
}