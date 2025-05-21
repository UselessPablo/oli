import { useState } from 'react';
import { ref, push, update } from 'firebase/database';
import { database } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import SubirImagen from './SubirImagen';

const ProductForm = ({ editingProduct, onUpdate }) => {
    const [name, setName] = useState(editingProduct?.name || '');
    const [price, setPrice] = useState(editingProduct?.price || '');
    const [description, setDescription] = useState(editingProduct?.description || ''); // Nuevo estado
    const [imageUrl, setImageUrl] = useState(editingProduct?.imageUrl || '');
    const [uploading, setUploading] = useState(false);
    const { currentUser } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !price || !imageUrl) return;

        setUploading(true);

        try {
            if (editingProduct) {
                const updatedProduct = {
                    id: editingProduct.id,
                    name,
                    price: parseFloat(price),
                    description, // Incluir descripción
                    imageUrl,
                    createdAt: editingProduct.createdAt,
                    createdBy: editingProduct.createdBy
                };
                await onUpdate(updatedProduct);
            } else {
                const newProductRef = push(ref(database, 'products'));
                await update(newProductRef, {
                    name,
                    price: parseFloat(price),
                    description, // Incluir descripción
                    imageUrl,
                    createdAt: new Date().toISOString(),
                    createdBy: currentUser.uid
                });
                // Limpiar formulario después de crear
                setName('');
                setPrice('');
                setDescription('');
                setImageUrl('');
            }
        } catch (error) {
            console.error("Error al procesar el producto:", error);
            alert("Error al guardar el producto: " + error.message);
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

            <textarea
                placeholder="Descripción del producto"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
            />

            <SubirImagen
                onUpload={(urls) => setImageUrl(urls[0] || '')}
                multiple={false}
                initialImages={imageUrl ? [imageUrl] : []}
            />

            <button type="submit" disabled={uploading || !imageUrl}>
                {uploading ? 'Guardando...' :
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