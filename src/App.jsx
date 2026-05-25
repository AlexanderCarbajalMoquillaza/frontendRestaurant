import { useState, useEffect, useMemo } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Swal from 'sweetalert2';

import { useAuth } from './context/AuthContext';
import Login from './components/Login';
import { getProductos, createProducto, updateProducto, deleteProducto } from './services/api';
import { getPedidos, createPedido, updatePedido, deletePedido, updateEstadoPedido } from './services/pedidosApi';

import ProductoList from './components/ProductoList';
import ProductoForm from './components/ProductoForm';
import PedidoList from './components/PedidoList';
import PedidoForm from './components/PedidoForm';
import StatsCards from './components/StatsCards';
import { pedidoEnCurso, pedidoEntregado } from './constants/estadosPedido';
import ThemeToggle from './components/ThemeToggle';
import FormModal from './components/FormModal';

function App() {
    const { user, loading: authLoading, logout } = useAuth();
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
        if (user) {
            cargarProductos();
            cargarPedidos();
        }
    }, [user]);

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
            title: '¿Desactivar producto?',
            text: 'El producto dejará de estar disponible para pedidos. Puedes reactivarlo editándolo.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f59e0b',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Sí, desactivar',
            cancelButtonText: 'Cancelar',
        });
        if (resultado.isConfirmed) {
            try {
                await deleteProducto(id);
                await cargarProductos();
                toast.success('Producto desactivado correctamente.');
            } catch (err) {
                toast.error('Ocurrió un error al desactivar el producto.');
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
                toast.success('Pedido creado. Stock actualizado.');
            }
            await cargarPedidos();
            await cargarProductos();
            setPedidoAEditar(null);
            setFormPedidoVisible(false);
        } catch (err) {
            toast.error(err.message || 'Ocurrió un error al guardar el pedido.');
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
                await cargarProductos();
                toast.success('Pedido eliminado. Stock restaurado.');
            } catch (err) {
                toast.error(err.message || 'Ocurrió un error al eliminar el pedido.');
            }
        }
    };

    const handleCambiarEstadoPedido = async (id, nuevoEstado) => {
        try {
            await updateEstadoPedido(id, nuevoEstado);
            await cargarPedidos();
            await cargarProductos();
            toast.success(`Estado actualizado a ${nuevoEstado.replace(/_/g, ' ').toLowerCase()}.`);
        } catch (err) {
            toast.error(err.message || 'Error al actualizar el estado del pedido.');
        }
    };

    const statsProductos = useMemo(() => {
        const activos = productos.filter((p) => p.estado).length;
        const stockBajo = productos.filter((p) => p.stock <= 5 && p.stock > 0).length;
        return [
            { label: 'Total productos', value: productos.length, color: 'text-primary' },
            { label: 'Activos', value: activos, color: 'text-success' },
            { label: 'Inactivos', value: productos.length - activos, color: 'text-error' },
            { label: 'Stock bajo', value: stockBajo, color: 'text-warning', desc: '≤ 5 unidades' },
        ];
    }, [productos]);

    const statsPedidos = useMemo(() => {
        const enCurso = pedidos.filter((p) => pedidoEnCurso(p.estado)).length;
        const entregados = pedidos.filter((p) => pedidoEntregado(p.estado)).length;
        const ventas = pedidos
            .filter((p) => pedidoEntregado(p.estado))
            .reduce((sum, p) => sum + Number(p.total || 0), 0);
        return [
            { label: 'Total pedidos', value: pedidos.length, color: 'text-primary' },
            { label: 'En cocina / curso', value: enCurso, color: 'text-warning' },
            { label: 'Entregados', value: entregados, color: 'text-success' },
            { label: 'Ventas', value: `S/ ${ventas.toFixed(2)}`, color: 'text-success', desc: 'Pedidos entregados' },
        ];
    }, [pedidos]);

    const cerrarFormProducto = () => {
        setFormProductoVisible(false);
        setProductoAEditar(null);
    };

    const cerrarFormPedido = () => {
        setFormPedidoVisible(false);
        setPedidoAEditar(null);
    };

    const handleLogout = () => {
        logout();
        toast.success('Sesión cerrada correctamente.');
    };

    if (authLoading) {
        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (!user) {
        return (
            <>
                <Toaster position="top-right" />
                <Login />
            </>
        );
    }

    return (
        <div className="min-h-screen bg-base-200">
            <Toaster position="top-right" />

            {/* Navbar */}
            <div className="navbar bg-base-100 shadow-md px-4 md:px-8 border-b border-base-300 sticky top-0 z-40">
                <div className="flex-1 gap-2">
                    <span className="text-xl font-bold">🍽️ Panel de Administración</span>
                    <span className="badge badge-primary badge-outline badge-sm hidden sm:inline-flex">{user.username}</span>
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
                    <ThemeToggle />
                    <button
                        className="btn btn-sm btn-ghost text-error"
                        onClick={handleLogout}
                    >
                        Cerrar sesión
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
                                className="btn btn-primary"
                                onClick={() => { setProductoAEditar(null); setFormProductoVisible(true); }}
                            >
                                + Nuevo Producto
                            </button>
                        </div>
                        {errorProductos && (
                            <div className="alert alert-error shadow-lg mb-6">
                                <span>{errorProductos}</span>
                            </div>
                        )}
                        {!loadingProductos && productos.length > 0 && (
                            <StatsCards items={statsProductos} />
                        )}
                        <div className="w-full">
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

                        <FormModal
                            open={formProductoVisible}
                            onClose={cerrarFormProducto}
                            title={productoAEditar ? 'Editar Producto' : 'Nuevo Producto'}
                        >
                            <ProductoForm
                                inModal
                                onSubmit={handleCrearOActualizarProducto}
                                onCancel={cerrarFormProducto}
                                productoAEditar={productoAEditar}
                            />
                        </FormModal>
                    </>
                )}

                {/* Vista Pedidos */}
                {vistaActiva === 'pedidos' && (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-semibold">Pedidos</h2>
                            <button
                                className="btn btn-primary"
                                onClick={() => { setPedidoAEditar(null); setFormPedidoVisible(true); }}
                            >
                                + Nuevo Pedido
                            </button>
                        </div>
                        {errorPedidos && (
                            <div className="alert alert-error shadow-lg mb-6">
                                <span>{errorPedidos}</span>
                            </div>
                        )}
                        {!loadingPedidos && pedidos.length > 0 && (
                            <StatsCards items={statsPedidos} />
                        )}
                        <div className="w-full">
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

                        <FormModal
                            open={formPedidoVisible}
                            onClose={cerrarFormPedido}
                            title={pedidoAEditar ? 'Editar Pedido' : 'Nuevo Pedido'}
                        >
                            <PedidoForm
                                inModal
                                onSubmit={handleCrearOActualizarPedido}
                                onCancel={cerrarFormPedido}
                                pedidoAEditar={pedidoAEditar}
                                productos={productos}
                            />
                        </FormModal>
                    </>
                )}
            </main>
        </div>
    );
}

export default App;
