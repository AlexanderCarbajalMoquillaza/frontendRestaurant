const API_URL = import.meta.env.VITE_PEDIDOS_API_URL || 'http://localhost:8081/api/pedidos';

export const getPedidos = async () => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Error al obtener pedidos');
    return await response.json();
};

export const createPedido = async (pedido) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedido),
    });
    if (!response.ok) throw new Error('Error al crear el pedido');
    return await response.json();
};

export const updatePedido = async (id, pedido) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedido),
    });
    if (!response.ok) throw new Error('Error al actualizar el pedido');
    return await response.json();
};

export const updateEstadoPedido = async (id, estado) => {
    const response = await fetch(`${API_URL}/${id}/estado`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado }),
    });
    if (!response.ok) throw new Error('Error al actualizar el estado');
    return await response.json();
};

export const deletePedido = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Error al eliminar el pedido');
};
