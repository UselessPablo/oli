import React, { useState } from 'react';

const ProductCard = ({ product }) => {
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [customerMessage, setCustomerMessage] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');

    const truncateDescription = (text, maxLength = 100) => {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return `${text.substring(0, maxLength)}...`;
    };

    const handleOrderClick = () => {
        setShowOrderModal(true);
    };

    const sendWhatsAppMessage = () => {
        const phoneNumber = '5492944895986'; // Número con código de país
        const baseMessage = `¡Hola! Estoy interesado en el producto: ${product.name} ($${product.price.toFixed(2)})`;

        let fullMessage = baseMessage;

        if (selectedColor) fullMessage += `\n*Color:* ${selectedColor}`;
        if (selectedSize) fullMessage += `\n*Talle:* ${selectedSize}`;
        if (customerMessage) fullMessage += `\n*Mis notas:* ${customerMessage}`;

        const encodedMessage = encodeURIComponent(fullMessage);
        window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');

        setShowOrderModal(false);
        setCustomerMessage('');
        setSelectedColor('');
        setSelectedSize('');
    };

    return (
        <>
            <div className="product-card" onClick={handleOrderClick}>
                <div className="product-image-container">
                    <img
                        className='imagen'
                        src={product.imageUrl}
                        alt={product.name}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/placeholder.jpg';
                        }}
                    />
                </div>
                <div className="product-info">
                    <h3>{product.name}</h3>
                    <p className="price">${product.price.toFixed(2)}</p>

                    {product.description && (
                        <div className="product-description">
                            <p>
                                {showFullDescription
                                    ? product.description
                                    : truncateDescription(product.description)}
                            </p>
                            {product.description.length > 100 && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowFullDescription(!showFullDescription);
                                    }}
                                    className="description-toggle"
                                >
                                    {showFullDescription ? 'Ver menos' : 'Ver más'}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de pedido */}
            {showOrderModal && (
                <div className="order-modal-overlay" onClick={() => setShowOrderModal(false)}>
                    <div className="order-modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>¡Quiero este producto!</h3>
                        <p>{product.name} - ${product.price.toFixed(2)}</p>

                        <div className="form-group">
                            <label>Color (opcional):</label>
                            <input
                                type="text"
                                value={selectedColor}
                                onChange={(e) => setSelectedColor(e.target.value)}
                                placeholder="Ej: Rojo, Azul, Negro..."
                            />
                        </div>

                        <div className="form-group">
                            <label>Talle (opcional):</label>
                            <input
                                type="text"
                                value={selectedSize}
                                onChange={(e) => setSelectedSize(e.target.value)}
                                placeholder="Ej: S, M, L, XL..."
                            />
                        </div>

                        <div className="form-group">
                            <label>Notas adicionales:</label>
                            <textarea
                                value={customerMessage}
                                onChange={(e) => setCustomerMessage(e.target.value)}
                                placeholder="Especificaciones especiales, cantidad deseada, etc."
                                rows={4}
                            />
                        </div>

                        <div className="modal-buttons">
                            <button onClick={() => setShowOrderModal(false)}>Cancelar</button>
                            <button
                                onClick={sendWhatsAppMessage}
                                className="whatsapp-button"
                            >
                                Quiero Este !!
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProductCard;