import toast from 'react-hot-toast';

const IconExcel = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

const IconPdf = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
);

const ExportButtons = ({ onExportExcel, onExportPDF, disabled = false }) => {
    const handle = (fn, label) => {
        try {
            fn();
            toast.success(
                label === 'PDF'
                    ? 'Abre el diálogo y elige "Guardar como PDF".'
                    : `${label} descargado (abre en Excel).`
            );
        } catch (err) {
            if (err?.message === 'popup_blocked') {
                toast.error('Permite ventanas emergentes para exportar PDF.');
            } else {
                toast.error(`Error al exportar ${label}.`);
            }
        }
    };

    return (
        <div className="join shadow-sm">
            <button
                type="button"
                className="join-item btn btn-sm btn-outline btn-success gap-1"
                disabled={disabled}
                onClick={() => handle(onExportExcel, 'Excel')}
                title="Exportar a Excel"
            >
                <IconExcel />
                Excel
            </button>
            <button
                type="button"
                className="join-item btn btn-sm btn-outline btn-error gap-1"
                disabled={disabled}
                onClick={() => handle(onExportPDF, 'PDF')}
                title="Exportar a PDF"
            >
                <IconPdf />
                PDF
            </button>
        </div>
    );
};

export default ExportButtons;
