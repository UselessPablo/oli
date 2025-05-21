import { useState, useEffect } from 'react';
import { ref, onValue, get } from 'firebase/database';
import { database } from './firebase/config';
import { useAuth } from './context/AuthContext';
import ProductCard from './products/ProductCard';
import { Link } from 'react-router-dom';
import Login from './Login';

const Home = () => {
    const { currentUser, showLogin, setShowLogin, logout, loading: authLoading } = useAuth();
    const [products, setProducts] = useState([]);
    const [productsLoading, setProductsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const productsRef = ref(database, 'products');

        const fetchProducts = (snapshot) => {
            try {
                setProductsLoading(true);
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
                setError(null);
            } catch (err) {
                console.error("Error al obtener productos:", err);
                setError("Error al cargar productos");
                setProducts([]);
            } finally {
                setProductsLoading(false);
            }
        };

        const errorCallback = (error) => {
            console.error("Error en el listener:", error);
            setError("Error de conexión con la base de datos");
            setProductsLoading(false);
        };

        // Suscribirse a los cambios
        const unsubscribe = onValue(productsRef, fetchProducts, errorCallback);

        return () => {
            unsubscribe(); // Limpiar la suscripción al desmontar
        };
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            // Forzar una actualización del estado de los productos
            setProductsLoading(true);
            const snapshot = await get(ref(database, 'products'));
            if (snapshot.exists()) {
                setProducts(Object.values(snapshot.val()));
            } else {
                setProducts([]);
            }
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        } finally {
            setProductsLoading(false);
        }
    };

    if (authLoading) {
        return <div className="loading">Verificando autenticación...</div>;
    }

    if (productsLoading) {
        return <div className="loading">Cargando productos...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="home-container">
            <header>
                <h1>Olivia Store</h1>
                {currentUser ? (
                    <div className="user-actions">
                        <span>Bienvenido, {currentUser.email}</span>
                        <Link to="/manage-products">Administrar productos</Link>
                        <button onClick={handleLogout} className="logout-button">
                            Cerrar sesión
                        </button>
                    </div>
                ) : (
                    <button onClick={() => setShowLogin(true)}>Iniciar sesión</button>
                )}
            </header>

            {showLogin && !currentUser && (
                <div className="login-modal">
                    <Login onSuccess={() => setShowLogin(false)} />
                    <button onClick={() => setShowLogin(false)}>Cerrar</button>
                </div>
            )}

            <div className="products-grid">
                {products.length > 0 ? (
                    products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))
                ) : (
                    <p>No hay productos disponibles</p>
                )}
            </div>
        </div>
    );
};

export default Home;