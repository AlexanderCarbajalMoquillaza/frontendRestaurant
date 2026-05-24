import { useState, useMemo } from 'react';
import ActionButtons from './ActionButtons';
import ExportButtons from './ExportButtons';
import Pagination from './Pagination';
import { usePagination } from '../hooks/usePagination';
import { exportPedidosExcel, exportPedidosPDF } from '../utils/exportData';

const ITEMS_PER_PAGE = 10;

const BADGE_ESTADO = {
    PENDIENTE: 'badge-warning',
    COMPLETADO: 'badge-success',
    CANCELADO: 'badge-error',
};

const PedidoList = ({ pedidos, onEdit, onDelete, onCambiarEstado }) => {
    const [busqueda, setBusqueda] = useState('');
    const [filtroEstado, setFiltroEstado] = useState('TODOS');

    const pedidosFiltrados = useMemo(() => {
        let lista = pedidos;
        if (filtroEstado !== 'TODOS') {
            lista = lista.filter((p) => p.estado === filtroEstado);
        }
        if (busqueda.trim()) {
            const q = busqueda.toLowerCase();
            lista = lista.filter(
                (p) =>
                    p.cliente?.toLowerCase().includes(q) ||
                    p.nombreProducto?.toLowerCase().includes(q) ||
                    p.correoCliente?.toLowerCase().includes(q) ||
                    String(p.id).includes(q)
            );
        }
        return lista;
    }, [pedidos, busqueda, filtroEstado]);

    const resetKey = `${busqueda}-${filtroEstado}`;
    const {
        page,
        setPage,
        totalPages,
        paginatedItems,
        totalItems,
        from,
        to,
    } = usePagination(pedidosFiltrados, ITEMS_PER_PAGE, resetKey);

    if (!pedidos || pedidos.length === 0) {
        return (
            <div className="card bg-base-100 shadow-md border border-base-300">
                <div className="card-body items-center text-center py-16">
                    <p className="text-base-content/60 text-lg">No hay pedidos registrados. ¡Crea uno nuevo!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-3 flex-1">
                    <label className="input input-bordered flex items-center gap-2 flex-1 max-w-md bg-base-100">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 opacity-50 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="search"
                            placeholder="Buscar cliente, producto o ID..."
                            className="grow"
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                    </label>
                    <select
                        className="select select-bordered select-sm sm:w-44 bg-base-100"
                        value={filtroEstado}
                        onChange={(e) => setFiltroEstado(e.target.value)}
                    >
                        <option value="TODOS">Todos los estados</option>
                        <option value="PENDIENTE">Pendientes</option>
                        <option value="COMPLETADO">Completados</option>
                        <option value="CANCELADO">Cancelados</option>
                    </select>
                </div>
                <ExportButtons
                    disabled={pedidosFiltrados.length === 0}
                    onExportExcel={() => exportPedidosExcel(pedidosFiltrados)}
                    onExportPDF={() => exportPedidosPDF(pedidosFiltrados)}
                />
            </div>

            {pedidosFiltrados.length === 0 ? (
                <div className="alert bg-base-100 border border-base-300">
                    <span>No hay pedidos que coincidan con el filtro.</span>
                </div>
            ) : (
                <div className="bg-base-100 shadow-md rounded-box overflow-hidden border border-base-300">
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead className="bg-base-200/80 text-base-content text-sm uppercase">
                                <tr>
                                    <th className="w-14">ID</th>
                                    <th>Cliente</th>
                                    <th className="hidden lg:table-cell">Correo</th>
                                    <th>Producto</th>
                                    <th>Cant.</th>
                                    <th>P. Unit.</th>
                                    <th>Total</th>
                                    <th>Estado</th>
                                    <th className="text-center w-52">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedItems.map((pedido) => (
                                    <tr key={pedido.id} className="hover:bg-base-200/40 border-b border-base-200">
                                        <td className="align-middle font-mono text-sm opacity-70">{pedido.id}</td>
                                        <td className="align-middle font-semibold">{pedido.cliente}</td>
                                        <td className="align-middle text-base-content/70 text-sm hidden lg:table-cell">{pedido.correoCliente}</td>
                                        <td className="align-middle">{pedido.nombreProducto}</td>
                                        <td className="align-middle text-center">{pedido.cantidad}</td>
                                        <td className="align-middle whitespace-nowrap">S/ {Number(pedido.precioUnitario).toFixed(2)}</td>
                                        <td className="align-middle font-bold text-success whitespace-nowrap">
                                            S/ {Number(pedido.total).toFixed(2)}
                                        </td>
                                        <td className="align-middle">
                                            <select
                                                className={`select select-bordered select-sm w-full max-w-[9rem] ${BADGE_ESTADO[pedido.estado] || ''}`}
                                                value={pedido.estado}
                                                onChange={(e) => onCambiarEstado(pedido.id, e.target.value)}
                                            >
                                                <option value="PENDIENTE">PENDIENTE</option>
                                                <option value="COMPLETADO">COMPLETADO</option>
                                                <option value="CANCELADO">CANCELADO</option>
                                            </select>
                                        </td>
                                        <td className="align-middle">
                                            <ActionButtons
                                                onEdit={() => onEdit(pedido)}
                                                onDelete={() => onDelete(pedido.id)}
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

export default PedidoList;
