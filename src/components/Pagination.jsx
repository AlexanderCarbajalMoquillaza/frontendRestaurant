const Pagination = ({ page, totalPages, totalItems, from, to, onPageChange }) => {
    if (totalItems === 0) return null;

    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    start = Math.max(1, end - maxVisible + 1);

    for (let i = start; i <= end; i++) pages.push(i);

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-base-300">
            <p className="text-sm text-base-content/60">
                Mostrando <span className="font-medium text-base-content">{from}–{to}</span> de{' '}
                <span className="font-medium text-base-content">{totalItems}</span>
            </p>
            <div className="join shadow-sm">
                <button
                    type="button"
                    className="join-item btn btn-sm btn-ghost"
                    disabled={page <= 1}
                    onClick={() => onPageChange(page - 1)}
                    aria-label="Página anterior"
                >
                    «
                </button>
                {start > 1 && (
                    <>
                        <button type="button" className="join-item btn btn-sm btn-ghost" onClick={() => onPageChange(1)}>
                            1
                        </button>
                        {start > 2 && <button type="button" className="join-item btn btn-sm btn-disabled">…</button>}
                    </>
                )}
                {pages.map((p) => (
                    <button
                        key={p}
                        type="button"
                        className={`join-item btn btn-sm ${p === page ? 'btn-primary' : 'btn-ghost'}`}
                        onClick={() => onPageChange(p)}
                    >
                        {p}
                    </button>
                ))}
                {end < totalPages && (
                    <>
                        {end < totalPages - 1 && <button type="button" className="join-item btn btn-sm btn-disabled">…</button>}
                        <button type="button" className="join-item btn btn-sm btn-ghost" onClick={() => onPageChange(totalPages)}>
                            {totalPages}
                        </button>
                    </>
                )}
                <button
                    type="button"
                    className="join-item btn btn-sm btn-ghost"
                    disabled={page >= totalPages}
                    onClick={() => onPageChange(page + 1)}
                    aria-label="Página siguiente"
                >
                    »
                </button>
            </div>
        </div>
    );
};

export default Pagination;
