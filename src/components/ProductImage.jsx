import { useState } from 'react';

const getFallbackUrl = (nombre, size = 128) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(nombre || 'P')}&background=random&size=${size}`;

const ProductImage = ({
    src,
    alt,
    size = 'md',
    className = '',
    zoomable = false,
}) => {
    const [error, setError] = useState(false);
    const [zoomOpen, setZoomOpen] = useState(false);

    const sizeClasses = {
        sm: 'w-16 h-16',
        md: 'w-24 h-24',
        lg: 'w-36 h-36',
        xl: 'w-44 h-44',
        table: 'w-28 h-28 min-w-[7rem] min-h-[7rem]',
    };

    const imageUrl = !error && src ? src : getFallbackUrl(alt, 256);
    const sizeClass = sizeClasses[size] || sizeClasses.md;

    const handleError = () => setError(true);

    const image = (
        <img
            src={imageUrl}
            alt={alt}
            className={`${sizeClass} rounded-xl object-cover border border-base-300 shadow-sm bg-base-200 ${zoomable ? 'cursor-zoom-in hover:ring-2 hover:ring-primary/40 transition-all' : ''} ${className}`}
            onError={handleError}
            onClick={zoomable ? () => setZoomOpen(true) : undefined}
        />
    );

    return (
        <>
            {image}
            {zoomable && zoomOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                    onClick={() => setZoomOpen(false)}
                >
                    <div className="relative max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
                        <button
                            type="button"
                            className="btn btn-sm btn-circle btn-ghost absolute -top-2 -right-2 bg-base-100 shadow-md z-10"
                            onClick={() => setZoomOpen(false)}
                            aria-label="Cerrar"
                        >
                            ✕
                        </button>
                        <img
                            src={imageUrl}
                            alt={alt}
                            className="w-full max-h-[70vh] object-contain rounded-2xl bg-base-100 shadow-2xl"
                            onError={handleError}
                        />
                        <p className="text-center text-white mt-3 font-medium">{alt}</p>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProductImage;
