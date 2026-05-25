const IconEdit = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
);

const IconDelete = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
    </svg>
);

const ActionButtons = ({
    onEdit,
    onDelete,
    deleteLabel = 'Eliminar',
    deleteBtnClass = 'btn-outline btn-error',
}) => (
    <div className="flex items-center justify-center gap-2">
        <button
            type="button"
            className="btn btn-sm btn-outline btn-info gap-1.5 min-w-[5.5rem]"
            onClick={onEdit}
            title="Editar"
        >
            <IconEdit />
            Editar
        </button>
        <button
            type="button"
            className={`btn btn-sm gap-1.5 min-w-[5.5rem] ${deleteBtnClass}`}
            onClick={onDelete}
            title={deleteLabel}
        >
            <IconDelete />
            {deleteLabel}
        </button>
    </div>
);

export default ActionButtons;
