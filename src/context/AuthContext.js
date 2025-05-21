import { createContext, useState, useEffect, useContext } from 'react';
import { auth } from '../firebase/config';
import { onAuthStateChanged, signOut, signInWithEmailAndPassword } from 'firebase/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [showLogin, setShowLogin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
            if (user) {
                console.log("Usuario autenticado:", user.email);
            } else {
                console.log("No hay usuario autenticado");
            }
        });
        return unsubscribe;
    }, []);

    const logout = async () => {
        try {
            setLoading(true); // Añade esto para manejar el estado durante el logout
            await signOut(auth);
            setCurrentUser(null); // Fuerza la actualización del estado
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        } finally {
            setLoading(false);
        }
      };
    const login = async (email, password) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            throw error; // Esto permitirá que el componente Login capture el error
        }
      };
    const value = {
        currentUser,
        showLogin,
        setShowLogin,
        loading,
        logout,
        login
    };
    useEffect(() => {
        let mounted = true;
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (mounted) {
                setCurrentUser(user);
                setLoading(false);
            }
        });
        return () => {
            mounted = false;
            unsubscribe();
        };
    }, []);
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};