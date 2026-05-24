import ProductImage from './ProductImage';

const ProductoList = ({ productos, onEdit, onDelete }) => {

    if (!productos || productos.length === 0) {
        return (
            <div className="card bg-base-100 shadow-md">
                <div className="card-body items-center text-center py-16">
                    <p className="text-base-content/60 text-lg">No hay productos registrados. ¡Crea uno nuevo!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-base-100 shadow-md rounded-box overflow-hidden border border-base-300">
            <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                    <thead className="bg-base-200 text-base-content">
                        <tr>
                            <th className="w-28">Foto</th>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th>Estado</th>
                            <th className="text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productos.map((producto) => (
                            <tr key={producto.id} className="hover">
                                <td className="py-3">
                                    <ProductImage
                                        src={producto.imagenUrl}
                                        alt={producto.nombre}
                                        size="md"
                                        zoomable
                                    />
                                </td>
                                <td>{producto.id}</td>
                                <td className="font-semibold">{producto.nombre}</td>
                                <td className="text-base-content/70 max-w-xs truncate" title={producto.descripcion}>
                                    {producto.descripcion || '-'}
                                </td>
                                <td className="font-medium text-success">
                                    S/ {Number(producto.precio).toFixed(2)}
                                </td>
                                <td>{producto.stock} unds.</td>
                                <td>
                                    <div className={`badge ${producto.estado ? 'badge-success' : 'badge-error'}`}>
                                        {producto.estado ? 'Activo' : 'Inactivo'}
                                    </div>
                                </td>
                                <td className="flex justify-center gap-2">
                                    <button
                                        className="btn btn-sm btn-ghost text-info"
                                        onClick={() => onEdit(producto)}
                                        title="Editar"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="btn btn-sm btn-ghost text-error"
                                        onClick={() => onDelete(producto.id)}
                                        title="Eliminar"
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

export default ProductoList;
