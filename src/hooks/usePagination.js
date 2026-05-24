import { useState, useMemo, useEffect } from 'react';

export const usePagination = (items, itemsPerPage = 9, resetKey = '') => {
    const [page, setPage] = useState(1);

    const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));

    const paginatedItems = useMemo(() => {
        const start = (page - 1) * itemsPerPage;
        return items.slice(start, start + itemsPerPage);
    }, [items, page, itemsPerPage]);

    useEffect(() => {
        setPage(1);
    }, [resetKey, itemsPerPage]);

    useEffect(() => {
        if (page > totalPages) setPage(totalPages);
    }, [page, totalPages]);

    const goToPage = (p) => setPage(Math.min(Math.max(1, p), totalPages));

    return {
        page,
        setPage: goToPage,
        totalPages,
        paginatedItems,
        itemsPerPage,
        totalItems: items.length,
        from: items.length === 0 ? 0 : (page - 1) * itemsPerPage + 1,
        to: Math.min(page * itemsPerPage, items.length),
    };
};
