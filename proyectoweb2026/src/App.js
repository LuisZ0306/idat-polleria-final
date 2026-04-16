import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// CONTEXTO
import { GlobalProvider, useGlobal } from './Context/GlobalContext';

// UI
import CustomNavbar from './Components/Navbar';
import HeroBanner from './Components/HeroBanner';
import Recomendaciones from './Components/Recomendaciones';
import Footer from './Components/Footer';

// Funcionalidad
import FormularioReserva from './Components/FormularioReserva';
import MapaMesas from './Components/MapaMesas';
import MenuPage from './Components/MenuPage';
import LoginPage from './Components/LoginPage';
import RegisterPage from './Components/RegisterPage';
import AdminDashboard from './Components/AdminDashboard';
import PerfilPage from './Components/PerfilPage';
import ProtectedRoute from './Components/ProtectedRoute';

const Home = () => {
  return (
    <>
      <HeroBanner />
      <Recomendaciones />
    </>
  );
};

const ReservasView = () => {
  const { agregarReserva } = useGlobal();
  const [consulta, setConsulta] = useState({ fecha: '', hora: '', personas: 1, duracion: 1.5 });
  const [mesaSeleccionada, setMesaSeleccionada] = useState(null);

  const manejarCambioConsulta = (datos) => {
    setConsulta({ ...consulta, ...datos });
    setMesaSeleccionada(null);
  };

  const confirmarReserva = (datos) => {
    agregarReserva(datos);
    setMesaSeleccionada(null);
  };

  return (
    <div className="container py-5 min-vh-100">
      <header className="text-center mb-5 mt-4">
        <h2 className="display-4 fw-bold text-danger">Reserva tu Mesa</h2>
        <p className="lead">Sistema de Reservas Pollería D' Elí.</p>
      </header>
      <div className="row g-4">
        <div className="col-lg-5">
          <FormularioReserva 
            alAgregarReserva={confirmarReserva} 
            mesaSeleccionada={mesaSeleccionada}
            onCambioConsulta={manejarCambioConsulta}
          />
        </div>
        <div className="col-lg-7">
          <MapaMesas 
            consulta={consulta} 
            mesaSeleccionada={mesaSeleccionada}
            numPersonas={consulta.personas}
            alSeleccionarMesa={(id) => setMesaSeleccionada(id)}
          />
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <GlobalProvider>
      <Router>
        <div className="d-flex flex-column min-vh-100">
          <AppContent />
          <Footer />
        </div>
      </Router>
    </GlobalProvider>
  );
}

const AppContent = () => {
  const { cargando } = useGlobal();

  if (cargando) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="text-center">
          <div className="spinner-border text-danger mb-3" role="status"></div>
          <h4 className="fw-bold text-dark">Cargando Pollería D' Elí...</h4>
        </div>
      </div>
    );
  }

  return (
    <>
      <CustomNavbar />
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route path="/reservas" element={
            <ProtectedRoute>
              <ReservasView />
            </ProtectedRoute>
          } />
          
          {/* SE ELIMINÓ LA RUTA DE PEDIDOS */}
          
          <Route path="/admin" element={
            <ProtectedRoute adminOnly={false} staffOnly={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/perfil" element={
            <ProtectedRoute>
              <PerfilPage />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
    </>
  );
};

export default App;
