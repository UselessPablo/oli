import { useState, useEffect } from 'react';
import { ref, push,update } from 'firebase/database'; // Importa desde firebase/database
import { database } from '../firebase/config'; // Solo la instancia de database
import { useAuth } from '../context/AuthContext';

const ProductForm = ({ editingProduct, onUpdate }) => {
    const [name, setName] = useState(editingProduct?.name || '');
    const [price, setPrice] = useState(editingProduct?.price || '');
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const { currentUser } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !price) return;

        setUploading(true);

        try {
            let imageUrl = editingProduct?.imageUrl;

            if (image) {
                // Subir nueva imagen solo si se proporciona una
                const formData = new FormData();
                formData.append('file', image);

                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                const { url } = await response.json();
                imageUrl = url;
            }

            if (editingProduct) {
                // Actualizar producto existente
                const updatedProduct = {
                    id: editingProduct.id,
                    name,
                    price: parseFloat(price),
                    imageUrl,
                    createdAt: editingProduct.createdAt,
                    createdBy: editingProduct.createdBy
                };
                await onUpdate(updatedProduct);
            } else {
                // Crear nuevo producto
                const newProductRef = push(ref(database, 'products'));
                await update(newProductRef, {
                    name,
                    price: parseFloat(price),
                    imageUrl,
                    createdAt: new Date().toISOString(),
                    createdBy: currentUser.uid
                });
            }

            // Resetear formulario si no está en modo edición
            if (!editingProduct) {
                setName('');
                setPrice('');
                setImage(null);
            }
        } catch (error) {
            console.error("Error al procesar el producto:", error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="product-form">
            <input
                type="text"
                placeholder="Nombre del producto"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <input
                type="number"
                placeholder="Precio"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                step="0.01"
                required
            />
            <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
                accept="image/*"
                required={!editingProduct}
            />
            {editingProduct && !image && (
                <img src={editingProduct.imageUrl} alt="Actual" width="100" />
            )}
            <button type="submit" disabled={uploading}>
                {uploading ? 'Procesando...' :
                    editingProduct ? 'Actualizar Producto' : 'Agregar Producto'}
            </button>
            {editingProduct && (
                <button type="button" onClick={() => onUpdate(null)}>
                    Cancelar
                </button>
            )}
        </form>
    );
};

export default ProductForm;