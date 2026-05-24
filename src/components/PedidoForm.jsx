import { useState, useEffect } from 'react';

const PedidoForm = ({ onSubmit, onCancel, pedidoAEditar }) => {
    const [formData, setFormData] = useState({
        cliente: '',
        correoCliente: '',
        productoId: '',
        nombreProducto: '',
        cantidad: '',
        precioUnitario: '',
    });

    const [error, setError] = useState(null);

    useEffect(() => {
        if (pedidoAEditar) {
            setFormData({
                cliente: pedidoAEditar.cliente || '',
                correoCliente: pedidoAEditar.correoCliente || '',
                productoId: pedidoAEditar.productoId || '',
                nombreProducto: pedidoAEditar.nombreProducto || '',
                cantidad: pedidoAEditar.cantidad || '',
                precioUnitario: pedidoAEditar.precioUnitario || '',
            });
        } else {
            setFormData({
                cliente: '',
                correoCliente: '',
                productoId: '',
                nombreProducto: '',
                cantidad: '',
                precioUnitario: '',
            });
        }
    }, [pedidoAEditar]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
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
        if (!formData.productoId || Number(formData.productoId) <= 0) {
            setError('El ID del producto es obligatorio y debe ser mayor a 0.');
            return;
        }
        if (!formData.nombreProducto.trim()) {
            setError('El nombre del producto no puede estar vacío.');
            return;
        }
        if (!formData.cantidad || Number(formData.cantidad) < 1) {
            setError('La cantidad mínima es 1.');
            return;
        }
        if (!formData.precioUnitario || Number(formData.precioUnitario) < 0) {
            setError('El precio unitario debe ser mayor o igual a 0.');
            return;
        }

        const pedidoParseado = {
            ...formData,
            productoId: parseInt(formData.productoId, 10),
            cantidad: parseInt(formData.cantidad, 10),
            precioUnitario: parseFloat(formData.precioUnitario),
        };

        onSubmit(pedidoParseado);
    };

    const totalEstimado = formData.cantidad && formData.precioUnitario
        ? (Number(formData.cantidad) * Number(formData.precioUnitario)).toFixed(2)
        : '0.00';

    return (
        <div className="card bg-base-100 shadow-xl border border-base-200">
            <div className="card-body">
                <h3 className="card-title text-xl mb-4">
                    {pedidoAEditar ? 'Editar Pedido' : 'Nuevo Pedido'}
                </h3>

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

                    <div className="grid grid-cols-2 gap-3">
                        <div className="form-control w-full">
                            <label className="label" htmlFor="productoId">
                                <span className="label-text font-medium">ID Producto</span>
                            </label>
                            <input
                                type="number"
                                id="productoId"
                                name="productoId"
                                className="input input-bordered w-full focus:input-primary"
                                value={formData.productoId}
                                onChange={handleChange}
                                min="1"
                            />
                        </div>

                        <div className="form-control w-full">
                            <label className="label" htmlFor="nombreProducto">
                                <span className="label-text font-medium">Nombre producto</span>
                            </label>
                            <input
                                type="text"
                                id="nombreProducto"
                                name="nombreProducto"
                                className="input input-bordered w-full focus:input-primary"
                                value={formData.nombreProducto}
                                onChange={handleChange}
                                placeholder="Ej. Ceviche"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
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
                            />
                        </div>

                        <div className="form-control w-full">
                            <label className="label" htmlFor="precioUnitario">
                                <span className="label-text font-medium">Precio unit.</span>
                            </label>
                            <input
                                type="number"
                                id="precioUnitario"
                                name="precioUnitario"
                                className="input input-bordered w-full focus:input-primary"
                                value={formData.precioUnitario}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                            />
                        </div>
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
