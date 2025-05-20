import { useState, useEffect } from 'react';
import { ref, onValue, remove, update } from 'firebase/database';
import { database } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import ProductForm from '../products/ProductForm';

const ProductManagement = () => {
    const { currentUser } = useAuth();
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);

    useEffect(() => {
        const productsRef = ref(database, 'products');
        const unsubscribe = onValue(productsRef, (snapshot) => {
            const productsData = snapshot.val();
            if (productsData) {
                const productsList = Object.keys(productsData).map(key => ({
                    id: key,
                    ...productsData[key]
                }));
                setProducts(productsList);
            } else {
                setProducts([]);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleDelete = async (productId) => {
        if (window.confirm('¿Estás seguro de eliminar este producto?')) {
            await remove(ref(database, `products/${productId}`));
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
    };

    const handleUpdate = async (updatedProduct) => {
        await update(ref(database, `products/${updatedProduct.id}`), {
            name: updatedProduct.name,
            price: updatedProduct.price,
            imageUrl: updatedProduct.imageUrl
        });
        setEditingProduct(null);
    };

    return (
        <div className="management-container">
            <h2>Gestión de Productos</h2>
            <ProductForm
                editingProduct={editingProduct}
                onUpdate={handleUpdate}
            />

            <div className="products-list">
                {products.map(product => (
                    <div key={product.id} className="product-item">
                        <img src={product.imageUrl} alt={product.name} />
                        <div>
                            <h3>{product.name}</h3>
                            <p>${product.price.toFixed(2)}</p>
                            <p>Creado: {new Date(product.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="product-actions">
                            <button onClick={() => handleEdit(product)}>Editar</button>
                            <button onClick={() => handleDelete(product.id)}>Eliminar</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductManagement;