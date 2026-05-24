import { useState, useEffect } from 'react';
import ProductImage from './ProductImage';

const ProductoForm = ({ onSubmit, onCancel, productoAEditar }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        stock: '',
        estado: true,
        imagenUrl: '',
    });

    const [error, setError] = useState(null);

    useEffect(() => {
        if (productoAEditar) {
            setFormData({
                nombre: productoAEditar.nombre || '',
                descripcion: productoAEditar.descripcion || '',
                precio: productoAEditar.precio !== undefined ? productoAEditar.precio : '',
                stock: productoAEditar.stock !== undefined ? productoAEditar.stock : '',
                estado: productoAEditar.estado !== undefined ? productoAEditar.estado : true,
                imagenUrl: productoAEditar.imagenUrl || '',
            });
        } else {
            setFormData({
                nombre: '',
                descripcion: '',
                precio: '',
                stock: '',
                estado: true,
                imagenUrl: '',
            });
        }
    }, [productoAEditar]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);

        if (!formData.nombre.trim()) {
            setError('El nombre del producto no puede estar vacío.');
            return;
        }
        if (formData.precio === '' || Number(formData.precio) < 0) {
            setError('El precio es obligatorio y debe ser mayor o igual a 0.');
            return;
        }
        if (formData.stock === '' || Number(formData.stock) < 0) {
            setError('El stock es obligatorio y no puede ser negativo.');
            return;
        }

        const productoParseado = {
            nombre: formData.nombre,
            descripcion: formData.descripcion,
            imagenUrl: formData.imagenUrl || null,
            precio: parseFloat(formData.precio),
            stock: parseInt(formData.stock, 10),
            estado: formData.estado,
        };

        onSubmit(productoParseado);
    };

    return (
        <div className="card bg-base-100 shadow-xl border border-base-300">
            <div className="card-body">
                <h3 className="card-title text-xl mb-4">
                    {productoAEditar ? 'Editar Producto' : 'Nuevo Producto'}
                </h3>

                {error && (
                    <div className="alert alert-error shadow-sm p-3 mb-4 text-sm">
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col items-center gap-2 py-2">
                        <ProductImage
                            src={formData.imagenUrl}
                            alt={formData.nombre || 'Producto'}
                            size="xl"
                            zoomable
                        />
                        <p className="text-xs text-base-content/50">Vista previa — haz clic para ampliar</p>
                    </div>

                    <div className="form-control w-full">
                        <label className="label" htmlFor="imagenUrl">
                            <span className="label-text font-medium">URL de imagen</span>
                            <span className="label-text-alt text-base-content/50">Opcional</span>
                        </label>
                        <input
                            type="url"
                            id="imagenUrl"
                            name="imagenUrl"
                            className="input input-bordered w-full focus:input-primary text-sm"
                            value={formData.imagenUrl}
                            onChange={handleChange}
                            placeholder="https://ejemplo.com/imagen.jpg"
                        />
                    </div>

                    <div className="form-control w-full">
                        <label className="label" htmlFor="nombre">
                            <span className="label-text font-medium">Nombre</span>
                        </label>
                        <input
                            type="text"
                            id="nombre"
                            name="nombre"
                            className="input input-bordered w-full focus:input-primary"
                            value={formData.nombre}
                            onChange={handleChange}
                            placeholder="Ej. Ceviche"
                        />
                    </div>

                    <div className="form-control w-full">
                        <label className="label" htmlFor="descripcion">
                            <span className="label-text font-medium">Descripción</span>
                        </label>
                        <textarea
                            id="descripcion"
                            name="descripcion"
                            className="textarea textarea-bordered focus:textarea-primary h-20"
                            value={formData.descripcion}
                            onChange={handleChange}
                            placeholder="Breve descripción del producto"
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="form-control w-full">
                            <label className="label" htmlFor="precio">
                                <span className="label-text font-medium">Precio</span>
                            </label>
                            <input
                                type="number"
                                id="precio"
                                name="precio"
                                className="input input-bordered w-full focus:input-primary"
                                value={formData.precio}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                            />
                        </div>

                        <div className="form-control w-full">
                            <label className="label" htmlFor="stock">
                                <span className="label-text font-medium">Stock</span>
                            </label>
                            <input
                                type="number"
                                id="stock"
                                name="stock"
                                className="input input-bordered w-full focus:input-primary"
                                value={formData.stock}
                                onChange={handleChange}
                                min="0"
                                step="1"
                            />
                        </div>
                    </div>

                    <div className="form-control mt-4">
                        <label className="label cursor-pointer justify-start gap-3" htmlFor="estado">
                            <input
                                type="checkbox"
                                id="estado"
                                name="estado"
                                className="checkbox checkbox-primary"
                                checked={formData.estado}
                                onChange={handleChange}
                            />
                            <span className="label-text">Activo (Disponible para la venta)</span>
                        </label>
                    </div>

                    <div className="card-actions mt-6">
                        <button type="submit" className="btn btn-primary flex-1">
                            {productoAEditar ? 'Guardar Cambios' : 'Crear Producto'}
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

export default ProductoForm;
