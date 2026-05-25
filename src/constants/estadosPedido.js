export const ESTADOS_PEDIDO = [
    { value: 'RECIBIDO', label: 'Recibido', badge: 'badge-info' },
    { value: 'EN_PREPARACION', label: 'En preparación', badge: 'badge-warning' },
    { value: 'LISTO', label: 'Listo para servir', badge: 'badge-accent' },
    { value: 'ENTREGADO', label: 'Entregado', badge: 'badge-success' },
    { value: 'CANCELADO', label: 'Cancelado', badge: 'badge-error' },
];

/** Compatibilidad con pedidos antiguos en base de datos */
export const ESTADOS_LEGACY = {
    PENDIENTE: { label: 'Recibido (antiguo)', badge: 'badge-info' },
    COMPLETADO: { label: 'Entregado (antiguo)', badge: 'badge-success' },
};

export const etiquetaEstado = (estado) => {
    const encontrado = ESTADOS_PEDIDO.find((e) => e.value === estado);
    if (encontrado) return encontrado.label;
    if (ESTADOS_LEGACY[estado]) return ESTADOS_LEGACY[estado].label;
    return estado;
};

export const badgeEstado = (estado) => {
    const encontrado = ESTADOS_PEDIDO.find((e) => e.value === estado);
    if (encontrado) return encontrado.badge;
    if (ESTADOS_LEGACY[estado]) return ESTADOS_LEGACY[estado].badge;
    return 'badge-ghost';
};

export const pedidoEnCurso = (estado) =>
    ['PENDIENTE', 'RECIBIDO', 'EN_PREPARACION', 'LISTO'].includes(estado);

export const pedidoEntregado = (estado) =>
    ['COMPLETADO', 'ENTREGADO'].includes(estado);
