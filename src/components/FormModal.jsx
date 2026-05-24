import { useEffect } from 'react';

const FormModal = ({ open, onClose, title, children, className = '' }) => {
    useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const onKey = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKey);
        return () => {
            document.body.style.overflow = prev;
            window.removeEventListener('keydown', onKey);
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <dialog className={`modal modal-open z-50 ${className}`} open>
            <div className="modal-box w-11/12 max-w-lg max-h-[90vh] p-0 overflow-hidden flex flex-col">
                <div className="flex items-center justify-between px-5 py-4 border-b border-base-300 bg-base-100 shrink-0">
                    <h3 className="font-bold text-lg">{title}</h3>
                    <button
                        type="button"
                        className="btn btn-sm btn-circle btn-ghost"
                        onClick={onClose}
                        aria-label="Cerrar"
                    >
                        ✕
                    </button>
                </div>
                <div className="overflow-y-auto flex-1 p-4 sm:p-5">
                    {children}
                </div>
            </div>
            <form method="dialog" className="modal-backdrop bg-black/50">
                <button type="button" onClick={onClose} aria-label="Cerrar modal">
                    cerrar
                </button>
            </form>
        </dialog>
    );
};

export default FormModal;
