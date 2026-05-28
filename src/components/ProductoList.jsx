import { useState } from 'react';
import ProductImage from './ProductImage';
import ActionButtons from './ActionButtons';
import Pagination from './Pagination';
import { usePagination } from '../hooks/usePagination';

const ITEMS_GRID = 6;
const ITEMS_TABLE = 8;

const ProductoList = ({ productos, onEdit, onDelete }) => {
    const [vista, setVista] = useState('grid');

    const itemsPerPage = vista === 'grid' ? ITEMS_GRID : ITEMS_TABLE;

    const {
        page,
        setPage,
        totalPages,
        paginatedItems,
        totalItems,
        from,
        to,
    } = usePagination(productos, itemsPerPage, vista);

    if (!productos || productos.length === 0) {
        return (
            <div className="card bg-base-100 shadow-md border border-base-300">
                <div className="card-body items-center text-center py-16">
                    <p className="text-base-content/60 text-lg">No hay productos registrados. ¡Crea uno nuevo!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-end items-center">
                <div className="flex flex-wrap gap-2 items-center justify-end">
                    <div className="join shadow-sm">
                        <button
                            type="button"
                            className={`join-item btn btn-sm ${vista === 'grid' ? 'btn-primary' : 'btn-ghost'}`}
                            onClick={() => setVista('grid')}
                        >
                            Tarjetas
                        </button>
                        <button
                            type="button"
                            className={`join-item btn btn-sm ${vista === 'table' ? 'btn-primary' : 'btn-ghost'}`}
                            onClick={() => setVista('table')}
                        >
                            Tabla
                        </button>
                    </div>
                </div>
            </div>

            {vista === 'grid' ? (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                        {paginatedItems.map((producto) => (
                            <div
                                key={producto.id}
                                className="card bg-base-100 shadow-md border border-base-300 hover:shadow-lg transition-shadow overflow-hidden"
                            >
                                <figure className="bg-base-200 px-6 pt-6 pb-2 flex justify-center">
                                    <ProductImage
                                        src={producto.imagenUrl}
                                        alt={producto.nombre}
                                        size="lg"
                                        zoomable
                                    />
                                </figure>
                                <div className="card-body pt-3 gap-3">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <h3 className="font-bold text-lg leading-tight">{producto.nombre}</h3>
                                            <p className="text-xs text-base-content/50">ID #{producto.id}</p>
                                        </div>
                                        <div className={`badge badge-sm ${producto.estado ? 'badge-success' : 'badge-error'}`}>
                                            {producto.estado ? 'Activo' : 'Inactivo'}
                                        </div>
                                    </div>
                                    <p className="text-sm text-base-content/70 line-clamp-2 min-h-[2.5rem]">
                                        {producto.descripcion || 'Sin descripción'}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xl font-bold text-success">
                                            S/ {Number(producto.precio).toFixed(2)}
                                        </span>
                                        <span className={`text-sm font-medium ${producto.stock <= 5 ? 'text-warning' : 'text-base-content/60'}`}>
                                            {producto.stock} unds.
                                            {producto.stock <= 5 && producto.stock > 0 && ' · Stock bajo'}
                                            {producto.stock === 0 && ' · Agotado'}
                                        </span>
                                    </div>
                                <ActionButtons
                                    onEdit={() => onEdit(producto)}
                                    onDelete={() => onDelete(producto.id)}
                                    deleteLabel="Desactivar"
                                    deleteBtnClass="btn-outline btn-warning"
                                />
                                </div>
                            </div>
                        ))}
                    </div>
                    <Pagination
                        page={page}
                        totalPages={totalPages}
                        totalItems={totalItems}
                        from={from}
                        to={to}
                        onPageChange={setPage}
                    />
                </>
            ) : (
                <div className="bg-base-100 shadow-md rounded-box overflow-hidden border border-base-300">
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead className="bg-base-200/80 text-base-content text-sm uppercase">
                                <tr>
                                    <th className="w-36 py-4">Foto</th>
                                    <th className="w-16">ID</th>
                                    <th>Nombre</th>
                                    <th className="hidden md:table-cell">Descripción</th>
                                    <th>Precio</th>
                                    <th>Stock</th>
                                    <th>Estado</th>
                                    <th className="text-center w-52">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedItems.map((producto) => (
                                    <tr key={producto.id} className="hover:bg-base-200/40 border-b border-base-200">
                                        <td className="align-middle py-4">
                                            <div className="flex justify-center">
                                                <ProductImage
                                                    src={producto.imagenUrl}
                                                    alt={producto.nombre}
                                                    size="table"
                                                    zoomable
                                                />
                                            </div>
                                        </td>
                                        <td className="align-middle font-mono text-sm opacity-70">{producto.id}</td>
                                        <td className="align-middle font-semibold">{producto.nombre}</td>
                                        <td className="align-middle text-base-content/70 max-w-xs truncate hidden md:table-cell" title={producto.descripcion}>
                                            {producto.descripcion || '-'}
                                        </td>
                                        <td className="align-middle font-bold text-success whitespace-nowrap">
                                            S/ {Number(producto.precio).toFixed(2)}
                                        </td>
                                        <td className="align-middle">
                                            <span className={producto.stock <= 5 ? 'text-warning font-medium' : ''}>
                                                {producto.stock} unds.
                                            </span>
                                        </td>
                                        <td className="align-middle">
                                            <div className={`badge badge-sm ${producto.estado ? 'badge-success' : 'badge-error'}`}>
                                                {producto.estado ? 'Activo' : 'Inactivo'}
                                            </div>
                                        </td>
                                        <td className="align-middle">
                                <ActionButtons
                                    onEdit={() => onEdit(producto)}
                                    onDelete={() => onDelete(producto.id)}
                                    deleteLabel="Desactivar"
                                    deleteBtnClass="btn-outline btn-warning"
                                />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="px-4 pb-4">
                        <Pagination
                            page={page}
                            totalPages={totalPages}
                            totalItems={totalItems}
                            from={from}
                            to={to}
                            onPageChange={setPage}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductoList;
