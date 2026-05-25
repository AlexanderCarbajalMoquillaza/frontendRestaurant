export const parseApiError = async (response, mensajePorDefecto) => {
    try {
        const data = await response.json();
        if (data?.error) return data.error;
        const primerCampo = data && typeof data === 'object' ? Object.values(data)[0] : null;
        if (primerCampo) return String(primerCampo);
    } catch {
        /* respuesta no JSON */
    }
    return mensajePorDefecto;
};
