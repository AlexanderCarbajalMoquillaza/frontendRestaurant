const BADGE_ESTADO = {
    PENDIENTE: 'badge-warning',
    COMPLETADO: 'badge-success',
    CANCELADO: 'badge-error',
};

const PedidoList = ({ pedidos, onEdit, onDelete, onCambiarEstado }) => {

    if (!pedidos || pedidos.length === 0) {
        return (
            <div className="card bg-base-100 shadow-md">
                <div className="card-body items-center text-center py-16">
                    <p className="text-base-content/60 text-lg">No hay pedidos registrados. ¡Crea uno nuevo!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-base-100 shadow-md rounded-box overflow-hidden">
            <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                    <thead className="bg-base-200 text-base-content">
                        <tr>
                            <th>ID</th>
                            <th>Cliente</th>
                            <th>Correo</th>
                            <th>Producto</th>
                            <th>Cant.</th>
                            <th>P. Unit.</th>
                            <th>Total</th>
                            <th>Estado</th>
                            <th className="text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pedidos.map((pedido) => (
                            <tr key={pedido.id} className="hover">
                                <td>{pedido.id}</td>
                                <td className="font-semibold">{pedido.cliente}</td>
                                <td className="text-base-content/70 text-sm">{pedido.correoCliente}</td>
                                <td>{pedido.nombreProducto}</td>
                                <td>{pedido.cantidad}</td>
                                <td>S/ {Number(pedido.precioUnitario).toFixed(2)}</td>
                                <td className="font-medium text-success">S/ {Number(pedido.total).toFixed(2)}</td>
                                <td>
                                    <select
                                        className={`select select-bordered select-xs ${BADGE_ESTADO[pedido.estado] || 'badge-neutral'}`}
                                        value={pedido.estado}
                                        onChange={(e) => onCambiarEstado(pedido.id, e.target.value)}
                                    >
                                        <option value="PENDIENTE">PENDIENTE</option>
                                        <option value="COMPLETADO">COMPLETADO</option>
                                        <option value="CANCELADO">CANCELADO</option>
                                    </select>
                                </td>
                                <td className="flex justify-center gap-2">
                                    <button
                                        className="btn btn-sm btn-ghost text-info"
                                        onClick={() => onEdit(pedido)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="btn btn-sm btn-ghost text-error"
                                        onClick={() => onDelete(pedido.id)}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PedidoList;
