// App.js CORREGIDO
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './Home';
import ProductManagement from './products/ProductManagement';
import PrivateRoute from './Auth/PrivateRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/manage-products" element={
            <PrivateRoute>
              <ProductManagement /> {/* Cambiado de ProductForm a ProductManagement */}
            </PrivateRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;