import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { currentUser } = useAuth();

    return (
        <div className="dashboard-container">
            <h1>Panel de Administración</h1>
            <p>Bienvenido, {currentUser?.email}</p>

            <div className="dashboard-actions">
                <Link to="/manage-products" className="dashboard-button">
                    Gestionar Productos
                </Link>

                <div className="dashboard-stats">
                    <div className="stat-card">
                        <h3>Productos Totales</h3>
                        <p>25</p> {/* Aquí puedes conectar con Firebase */}
                    </div>
                    <div className="stat-card">
                        <h3>Usuarios Registrados</h3>
                        <p>10</p> {/* Aquí puedes conectar con Firebase */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;