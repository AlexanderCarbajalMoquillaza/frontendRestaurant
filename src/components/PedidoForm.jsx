import { useState, useEffect } from 'react';
import ProductImage from './ProductImage';

const PedidoForm = ({ onSubmit, onCancel, pedidoAEditar, productos, inModal = false }) => {
    const [formData, setFormData] = useState({
        cliente: '',
        correoCliente: '',
        productoId: '',
        nombreProducto: '',
        precioUnitario: '',
        cantidad: '',
    });

    const [error, setError] = useState(null);

    const productosActivos = productos ? productos.filter((p) => p.estado === true) : [];

    useEffect(() => {
        if (pedidoAEditar) {
            setFormData({
                cliente: pedidoAEditar.cliente || '',
                correoCliente: pedidoAEditar.correoCliente || '',
                productoId: pedidoAEditar.productoId || '',
                nombreProducto: pedidoAEditar.nombreProducto || '',
                precioUnitario: pedidoAEditar.precioUnitario || '',
                cantidad: pedidoAEditar.cantidad || '',
            });
        } else {
            setFormData({
                cliente: '',
                correoCliente: '',
                productoId: '',
                nombreProducto: '',
                precioUnitario: '',
                cantidad: '',
            });
        }
    }, [pedidoAEditar]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleProductoSeleccionado = (e) => {
        const id = e.target.value;
        if (!id) {
            setFormData({ ...formData, productoId: '', nombreProducto: '', precioUnitario: '' });
            return;
        }
        const producto = productosActivos.find((p) => String(p.id) === String(id));
        if (producto) {
            setFormData({
                ...formData,
                productoId: producto.id,
                nombreProducto: producto.nombre,
                precioUnitario: producto.precio,
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);

        if (!formData.cliente.trim()) {
            setError('El nombre del cliente no puede estar vacío.');
            return;
        }
        if (!formData.correoCliente.trim() || !formData.correoCliente.includes('@')) {
            setError('Ingresa un correo electrónico válido.');
            return;
        }
        if (!formData.productoId) {
            setError('Debes seleccionar un producto.');
            return;
        }
        if (!formData.cantidad || Number(formData.cantidad) < 1) {
            setError('La cantidad mínima es 1.');
            return;
        }

        const pedidoParseado = {
            cliente: formData.cliente,
            correoCliente: formData.correoCliente,
            productoId: parseInt(formData.productoId, 10),
            nombreProducto: formData.nombreProducto,
            cantidad: parseInt(formData.cantidad, 10),
            precioUnitario: parseFloat(formData.precioUnitario),
        };

        onSubmit(pedidoParseado);
    };

    const totalEstimado =
        formData.cantidad && formData.precioUnitario
            ? (Number(formData.cantidad) * Number(formData.precioUnitario)).toFixed(2)
            : '0.00';

    const productoSeleccionado = productosActivos.find(
        (p) => String(p.id) === String(formData.productoId)
    );

    const wrapperClass = inModal ? '' : 'card bg-base-100 shadow-xl border border-base-300';
    const bodyClass = inModal ? '' : 'card-body';

    return (
        <div className={wrapperClass}>
            <div className={bodyClass}>
                {!inModal && (
                    <h3 className="card-title text-xl mb-4">
                        {pedidoAEditar ? 'Editar Pedido' : 'Nuevo Pedido'}
                    </h3>
                )}

                {error && (
                    <div className="alert alert-error shadow-sm p-3 mb-4 text-sm">
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="form-control w-full">
                        <label className="label" htmlFor="cliente">
                            <span className="label-text font-medium">Cliente</span>
                        </label>
                        <input
                            type="text"
                            id="cliente"
                            name="cliente"
                            className="input input-bordered w-full focus:input-primary"
                            value={formData.cliente}
                            onChange={handleChange}
                            placeholder="Ej. Juan Pérez"
                        />
                    </div>

                    <div className="form-control w-full">
                        <label className="label" htmlFor="correoCliente">
                            <span className="label-text font-medium">Correo del cliente</span>
                        </label>
                        <input
                            type="email"
                            id="correoCliente"
                            name="correoCliente"
                            className="input input-bordered w-full focus:input-primary"
                            value={formData.correoCliente}
                            onChange={handleChange}
                            placeholder="Ej. juan@email.com"
                        />
                    </div>

                    <div className="form-control w-full">
                        <label className="label" htmlFor="productoSeleccion">
                            <span className="label-text font-medium">Producto disponible</span>
                        </label>
                        {productosActivos.length === 0 ? (
                            <div className="alert alert-warning text-sm p-3">
                                No hay productos activos disponibles.
                            </div>
                        ) : (
                            <select
                                id="productoSeleccion"
                                className="select select-bordered w-full focus:select-primary"
                                value={formData.productoId}
                                onChange={handleProductoSeleccionado}
                            >
                                <option value="">-- Selecciona un producto --</option>
                                {productosActivos.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.nombre} — S/ {Number(p.precio).toFixed(2)}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    {productoSeleccionado && (
                        <div className="flex items-center gap-4 bg-base-200 rounded-box p-4">
                            <ProductImage
                                src={productoSeleccionado.imagenUrl}
                                alt={productoSeleccionado.nombre}
                                size="md"
                            />
                            <div>
                                <p className="font-semibold">{productoSeleccionado.nombre}</p>
                                <p className="text-sm text-base-content/60">
                                    Stock disponible: {productoSeleccionado.stock} unds.
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="form-control w-full">
                        <label className="label" htmlFor="cantidad">
                            <span className="label-text font-medium">Cantidad</span>
                        </label>
                        <input
                            type="number"
                            id="cantidad"
                            name="cantidad"
                            className="input input-bordered w-full focus:input-primary"
                            value={formData.cantidad}
                            onChange={handleChange}
                            min="1"
                            max={productoSeleccionado ? productoSeleccionado.stock : undefined}
                            placeholder="Ej. 2"
                        />
                        {productoSeleccionado && (
                            <label className="label">
                                <span className="label-text-alt text-base-content/50">
                                    Máximo: {productoSeleccionado.stock} unds.
                                </span>
                            </label>
                        )}
                    </div>

                    <div className="stat bg-base-200 rounded-box py-2 px-4">
                        <div className="stat-title text-xs">Total estimado</div>
                        <div className="stat-value text-primary text-xl">S/ {totalEstimado}</div>
                    </div>

                    <div className="card-actions mt-4">
                        <button type="submit" className="btn btn-primary flex-1">
                            {pedidoAEditar ? 'Guardar Cambios' : 'Crear Pedido'}
                        </button>
                        {onCancel && (
                            <button type="button" onClick={onCancel} className="btn btn-ghost flex-1">
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PedidoForm;
