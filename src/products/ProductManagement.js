import { useState, useEffect } from 'react';
import { ref, onValue, remove, update } from 'firebase/database';
import { database } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import ProductForm from './ProductForm';
import SubirImagen from './SubirImagen'
import {useNavigate} from 'react-router'

const ProductManagement = () => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const productsRef = ref(database, 'products');
        const unsubscribe = onValue(productsRef, (snapshot) => {
            try {
                setLoading(true);
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
            } catch (error) {
                console.error("Error al cargar productos:", error);
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/', { replace: true }); // Añade replace: true
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
      };
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
            description: updatedProduct.description,
            imageUrl: updatedProduct.imageUrl
        });
        setEditingProduct(null);
    };
    const handleUpdateComplete = () => {
        setEditingProduct(null);
        // No necesitas recargar la página, el listener de onValue actualizará automáticamente
    };

    return (
        <div className="management-container">
            <h2>Gestión de Productos</h2>
            <div className="management-header">
                <h2>Gestión de Productos</h2>
                <button onClick={handleLogout} className="logout-button">
                    Cerrar sesión
                </button>
            </div>
             {editingProduct ? (
                <ProductForm
                    editingProduct={editingProduct}
                    onUpdate={(updatedProduct) => {
                        handleUpdate(updatedProduct).then(handleUpdateComplete);
                    }}
                />
            ) : (
                <>
                    <h3>Agregar Nuevo Producto</h3>
                    <ProductForm onUpdate={() => {}} />
                </>
            )}

            <div className="products-list">
                {products.map(product => (
                    <div key={product.id} className="product-item">
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/placeholder.jpg';
                            }}
                        />
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