const fechaArchivo = () => {
    const d = new Date();
    return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
};

const downloadBlob = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
};

const escapeCsv = (val) => `"${String(val ?? '').replace(/"/g, '""')}"`;

const exportRowsToCsv = (headers, rows, filename) => {
    const lines = [
        headers.map(escapeCsv).join(','),
        ...rows.map((row) => row.map(escapeCsv).join(',')),
    ];
    const bom = '\uFEFF';
    const blob = new Blob([bom + lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    downloadBlob(blob, `${filename}.csv`);
};

const openPrintReport = (title, headers, rows, filename) => {
    const tableRows = rows
        .map(
            (row) =>
                `<tr>${row.map((cell) => `<td>${String(cell ?? '').replace(/</g, '&lt;')}</td>`).join('')}</tr>`
        )
        .join('');
    const headerCells = headers.map((h) => `<th>${h}</th>`).join('');
    const fecha = new Date().toLocaleString('es-PE');

    const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <title>${title}</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: system-ui, sans-serif; padding: 24px; color: #1e293b; }
    h1 { font-size: 1.25rem; margin: 0 0 4px; }
    p.meta { color: #64748b; font-size: 0.8rem; margin: 0 0 20px; }
    table { width: 100%; border-collapse: collapse; font-size: 0.8rem; }
    th { background: #3b82f6; color: white; padding: 8px 10px; text-align: left; }
    td { padding: 7px 10px; border-bottom: 1px solid #e2e8f0; }
    tr:nth-child(even) td { background: #f8fafc; }
    @media print { body { padding: 12px; } }
  </style>
</head>
<body>
  <h1>${title}</h1>
  <p class="meta">Generado: ${fecha} · ${rows.length} registro(s)</p>
  <table>
    <thead><tr>${headerCells}</tr></thead>
    <tbody>${tableRows}</tbody>
  </table>
  <script>window.onload = () => { window.print(); };</script>
</body>
</html>`;

    const win = window.open('', '_blank');
    if (!win) throw new Error('popup_blocked');
    win.document.write(html);
    win.document.close();
    win.document.title = filename;
};

/* ---- Productos ---- */

export const exportProductosExcel = (productos) => {
    const headers = ['ID', 'Nombre', 'Descripción', 'Precio', 'Stock', 'Estado', 'URL Imagen'];
    const rows = productos.map((p) => [
        p.id,
        p.nombre,
        p.descripcion || '',
        Number(p.precio).toFixed(2),
        p.stock,
        p.estado ? 'Activo' : 'Inactivo',
        p.imagenUrl || '',
    ]);
    exportRowsToCsv(headers, rows, `productos_${fechaArchivo()}`);
};

export const exportProductosPDF = (productos) => {
    const headers = ['ID', 'Nombre', 'Descripción', 'Precio', 'Stock', 'Estado'];
    const rows = productos.map((p) => [
        p.id,
        p.nombre,
        (p.descripcion || '-').slice(0, 50),
        `S/ ${Number(p.precio).toFixed(2)}`,
        p.stock,
        p.estado ? 'Activo' : 'Inactivo',
    ]);
    openPrintReport('Reporte de Productos', headers, rows, `productos_${fechaArchivo()}`);
};

/* ---- Pedidos ---- */

export const exportPedidosExcel = (pedidos) => {
    const headers = ['ID', 'Cliente', 'Correo', 'Producto', 'Cantidad', 'Precio Unit.', 'Total', 'Estado'];
    const rows = pedidos.map((p) => [
        p.id,
        p.cliente,
        p.correoCliente,
        p.nombreProducto,
        p.cantidad,
        Number(p.precioUnitario).toFixed(2),
        Number(p.total).toFixed(2),
        p.estado,
    ]);
    exportRowsToCsv(headers, rows, `pedidos_${fechaArchivo()}`);
};

export const exportPedidosPDF = (pedidos) => {
    const headers = ['ID', 'Cliente', 'Producto', 'Cant.', 'P. Unit.', 'Total', 'Estado'];
    const rows = pedidos.map((p) => [
        p.id,
        p.cliente,
        p.nombreProducto,
        p.cantidad,
        `S/ ${Number(p.precioUnitario).toFixed(2)}`,
        `S/ ${Number(p.total).toFixed(2)}`,
        p.estado?.replace(/_/g, ' ') ?? '',
    ]);
    openPrintReport('Reporte de Pedidos', headers, rows, `pedidos_${fechaArchivo()}`);
};
