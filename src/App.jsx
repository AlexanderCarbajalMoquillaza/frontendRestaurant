import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Swal from 'sweetalert2';

import { getProductos, createProducto, updateProducto, deleteProducto } from './services/api';
import { getPedidos, createPedido, updatePedido, deletePedido, updateEstadoPedido } from './services/pedidosApi';

import ProductoList from './components/ProductoList';
import ProductoForm from './components/ProductoForm';
import PedidoList from './components/PedidoList';
import PedidoForm from './components/PedidoForm';

function App() {
    const [vistaActiva, setVistaActiva] = useState('productos');

    // Estado de Productos
    const [productos, setProductos] = useState([]);
    const [loadingProductos, setLoadingProductos] = useState(true);
    const [errorProductos, setErrorProductos] = useState(null);
    const [productoAEditar, setProductoAEditar] = useState(null);
    const [formProductoVisible, setFormProductoVisible] = useState(false);

    // Estado de Pedidos
    const [pedidos, setPedidos] = useState([]);
    const [loadingPedidos, setLoadingPedidos] = useState(true);
    const [errorPedidos, setErrorPedidos] = useState(null);
    const [pedidoAEditar, setPedidoAEditar] = useState(null);
    const [formPedidoVisible, setFormPedidoVisible] = useState(false);

    useEffect(() => {
        cargarProductos();
        cargarPedidos();
    }, []);

    // ---- Funciones de Productos ----
    const cargarProductos = async () => {
        try {
            setLoadingProductos(true);
            const data = await getProductos();
            setProductos(data);
            setErrorProductos(null);
        } catch (err) {
            setErrorProductos("No se pudieron cargar los productos. Verifica que el backend ms-productos esté en ejecución.");
        } finally {
            setLoadingProductos(false);
        }
    };

    const handleCrearOActualizarProducto = async (producto) => {
        try {
            if (productoAEditar) {
                await updateProducto(productoAEditar.id, producto);
                toast.success('Producto actualizado correctamente.');
            } else {
                await createProducto(producto);
                toast.success('Producto creado correctamente.');
            }
            await cargarProductos();
            setProductoAEditar(null);
            setFormProductoVisible(false);
        } catch (err) {
            toast.error('Ocurrió un error al guardar el producto.');
        }
    };

    const handleEditarProducto = (producto) => {
        setProductoAEditar(producto);
        setFormProductoVisible(true);
    };

    const handleEliminarProducto = async (id) => {
        const resultado = await Swal.fire({
            title: '¿Eliminar producto?',
            text: 'Esta acción no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        });
        if (resultado.isConfirmed) {
            try {
                await deleteProducto(id);
                await cargarProductos();
                toast.success('Producto eliminado correctamente.');
            } catch (err) {
                toast.error('Ocurrió un error al eliminar el producto.');
            }
        }
    };

    // ---- Funciones de Pedidos ----
    const cargarPedidos = async () => {
        try {
            setLoadingPedidos(true);
            const data = await getPedidos();
            setPedidos(data);
            setErrorPedidos(null);
        } catch (err) {
            setErrorPedidos("No se pudieron cargar los pedidos. Verifica que el backend ms-pedidos esté en ejecución.");
        } finally {
            setLoadingPedidos(false);
        }
    };

    const handleCrearOActualizarPedido = async (pedido) => {
        try {
            if (pedidoAEditar) {
                await updatePedido(pedidoAEditar.id, pedido);
                toast.success('Pedido actualizado correctamente.');
            } else {
                await createPedido(pedido);
                toast.success('Pedido creado correctamente.');
            }
            await cargarPedidos();
            setPedidoAEditar(null);
            setFormPedidoVisible(false);
        } catch (err) {
            toast.error('Ocurrió un error al guardar el pedido.');
        }
    };

    const handleEditarPedido = (pedido) => {
        setPedidoAEditar(pedido);
        setFormPedidoVisible(true);
    };

    const handleEliminarPedido = async (id) => {
        const resultado = await Swal.fire({
            title: '¿Eliminar pedido?',
            text: 'Esta acción no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        });
        if (resultado.isConfirmed) {
            try {
                await deletePedido(id);
                await cargarPedidos();
                toast.success('Pedido eliminado correctamente.');
            } catch (err) {
                toast.error('Ocurrió un error al eliminar el pedido.');
            }
        }
    };

    const handleCambiarEstadoPedido = async (id, nuevoEstado) => {
        try {
            await updateEstadoPedido(id, nuevoEstado);
            await cargarPedidos();
            toast.success(`Estado actualizado a ${nuevoEstado}.`);
        } catch (err) {
            toast.error('Error al actualizar el estado del pedido.');
        }
    };

    return (
        <div className="min-h-screen bg-base-200">
            <Toaster position="top-right" />

            {/* Navbar */}
            <div className="navbar bg-base-100 shadow-sm px-4 md:px-8">
                <div className="flex-1">
                    <a className="btn btn-ghost normal-case text-xl font-bold">Panel de Administración</a>
                </div>
                <div className="flex-none gap-2">
                    <button
                        className={`btn btn-sm ${vistaActiva === 'productos' ? 'btn-primary' : 'btn-ghost'}`}
                        onClick={() => { setVistaActiva('productos'); setFormProductoVisible(false); }}
                    >
                        Productos
                    </button>
                    <button
                        className={`btn btn-sm ${vistaActiva === 'pedidos' ? 'btn-primary' : 'btn-ghost'}`}
                        onClick={() => { setVistaActiva('pedidos'); setFormPedidoVisible(false); }}
                    >
                        Pedidos
                    </button>
                </div>
            </div>

            <main className="container mx-auto px-4 md:px-8 py-8 pb-12">

                {/* Vista Productos */}
                {vistaActiva === 'productos' && (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-semibold">Productos</h2>
                            <button
                                className={`btn ${formProductoVisible ? 'btn-neutral' : 'btn-primary'}`}
                                onClick={() => { setProductoAEditar(null); setFormProductoVisible(!formProductoVisible); }}
                            >
                                {formProductoVisible ? 'Cerrar' : '+ Nuevo Producto'}
                            </button>
                        </div>
                        {errorProductos && (
                            <div className="alert alert-error shadow-lg mb-6">
                                <span>{errorProductos}</span>
                            </div>
                        )}
                        <div className="flex flex-col lg:flex-row gap-6 items-start">
                            <div className={`w-full transition-all duration-300 ${formProductoVisible ? 'lg:w-2/3' : 'lg:w-full'}`}>
                                {loadingProductos ? (
                                    <div className="flex justify-center p-12">
                                        <span className="loading loading-spinner loading-lg text-primary"></span>
                                    </div>
                                ) : (
                                    <ProductoList
                                        productos={productos}
                                        onEdit={handleEditarProducto}
                                        onDelete={handleEliminarProducto}
                                    />
                                )}
                            </div>
                            {formProductoVisible && (
                                <div className="w-full lg:w-1/3 sticky top-6">
                                    <ProductoForm
                                        onSubmit={handleCrearOActualizarProducto}
                                        onCancel={() => { setFormProductoVisible(false); setProductoAEditar(null); }}
                                        productoAEditar={productoAEditar}
                                    />
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* Vista Pedidos */}
                {vistaActiva === 'pedidos' && (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-semibold">Pedidos</h2>
                            <button
                                className={`btn ${formPedidoVisible ? 'btn-neutral' : 'btn-primary'}`}
                                onClick={() => { setPedidoAEditar(null); setFormPedidoVisible(!formPedidoVisible); }}
                            >
                                {formPedidoVisible ? 'Cerrar' : '+ Nuevo Pedido'}
                            </button>
                        </div>
                        {errorPedidos && (
                            <div className="alert alert-error shadow-lg mb-6">
                                <span>{errorPedidos}</span>
                            </div>
                        )}
                        <div className="flex flex-col lg:flex-row gap-6 items-start">
                            <div className={`w-full transition-all duration-300 ${formPedidoVisible ? 'lg:w-2/3' : 'lg:w-full'}`}>
                                {loadingPedidos ? (
                                    <div className="flex justify-center p-12">
                                        <span className="loading loading-spinner loading-lg text-primary"></span>
                                    </div>
                                ) : (
                                    <PedidoList
                                        pedidos={pedidos}
                                        onEdit={handleEditarPedido}
                                        onDelete={handleEliminarPedido}
                                        onCambiarEstado={handleCambiarEstadoPedido}
                                    />
                                )}
                            </div>
                            {formPedidoVisible && (
                                <div className="w-full lg:w-1/3 sticky top-6">
                                    <PedidoForm
                                        onSubmit={handleCrearOActualizarPedido}
                                        onCancel={() => { setFormPedidoVisible(false); setPedidoAEditar(null); }}
                                        pedidoAEditar={pedidoAEditar}
                                        productos={productos}
                                    />
                                </div>
                            )}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}

export default App;
