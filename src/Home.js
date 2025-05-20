import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database'; // Importa desde firebase/database
import { database } from './firebase/config'; // Solo la instancia de database
import { useAuth } from './context/AuthContext';
import ProductCard from './products/ProductCard';
import Login from './Login';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const { currentUser } = useAuth();
    const [products, setProducts] = useState([]);
    const [showLogin, setShowLogin] = useState(false);
    const navigate = useNavigate();
    {
        showLogin && !currentUser && (
            <div className="login-modal">
                <Login onSuccess={() => {
                    setShowLogin(false);
                    navigate('/dashboard'); // Redirige al dashboard después de login
                }} />
                <button onClick={() => setShowLogin(false)}>Cerrar</button>
            </div>
        )
    }

    useEffect(() => {
        // Usa ref y onValue correctamente
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

    return (
        <div className="home-container">
            <header>
                <h1>Olivia Store</h1>
                {currentUser ? (
                    <div className="user-actions">
                        <span>Bienvenido, {currentUser.email}</span>
                        <a href="/manage-products">Administrar productos</a>
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
                {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default Home;