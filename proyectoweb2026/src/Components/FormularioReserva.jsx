import React, { useState } from 'react';
import { Form, Button, Alert, Col } from 'react-bootstrap';
import { useGlobal } from '../Context/GlobalContext';
import { useNavigate } from 'react-router-dom';

const FormularioReserva = ({ alAgregarReserva, mesaSeleccionada, onCambioConsulta }) => {
  const { usuarioActual, agregarReserva, agregarAlCarrito, setShowCarrito, tema } = useGlobal();
  const navigate = useNavigate();
  const [datos, setDatos] = useState({
    fecha: '',
    hora: '',
    personas: 1,
    duracion: 1.5 
  });

  const [errorTiempo, setErrorTiempo] = useState('');
  const [errorConcierto, setErrorConcierto] = useState('');
  
  // Obtenemos la fecha de HOY en formato YYYY-MM-DD
  const hoy = new Date().toLocaleDateString('en-CA'); 

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    const nuevosDatos = { ...datos, [name]: value };
    setDatos(nuevosDatos);
    
    // LIMPIEZA INICIAL DE ERRORES
    setErrorTiempo('');
    setErrorConcierto('');

    // 1. SIEMPRE ACTUALIZAR EL MAPA (Para que no se bloquee)
    onCambioConsulta({ 
      fecha: nuevosDatos.fecha, 
      hora: nuevosDatos.hora, 
      personas: nuevosDatos.personas,
      duracion: parseFloat(nuevosDatos.duracion)
    });

    // 2. VALIDACIÓN DE HORA (SOLO SI ES HOY)
    if (nuevosDatos.fecha === hoy && nuevosDatos.hora) {
      const ahora = new Date();
      const [h, m] = nuevosDatos.hora.split(':');
      const horaReserva = new Date();
      horaReserva.setHours(parseInt(h), parseInt(m), 0);

      if (horaReserva <= ahora) {
        setErrorTiempo('La hora seleccionada ya pasó. Elige un horario futuro.');
      }
    }
  };

  const enviarFormulario = async (e) => {
    e.preventDefault();
    if (!usuarioActual) {
        alert("Debes iniciar sesión para hacer una reserva.");
        navigate('/login');
        return;
    }
    if (errorTiempo) return;
    if (!mesaSeleccionada) {
      alert("Por favor, selecciona una mesa disponible en el mapa.");
      return;
    }

    const res = await agregarReserva({ ...datos, mesa_id: mesaSeleccionada });
    
    if (res.error) {
        setErrorConcierto(res.error);
    } else {
        // FLUJO DE PAGO: Añadimos la garantía al carrito
        agregarAlCarrito({
            id: `reserva_${res.reservaId}`,
            nombre: `Garantía de Reserva (Mesa ${mesaSeleccionada})`,
            precio: 15.00,
            cantidad: 1,
            esReserva: true,
            reservaId: res.reservaId,
            img: "https://cdn-icons-png.flaticon.com/512/2612/2612140.png"
        });

        // Abrimos el carrito automáticamente
        setShowCarrito(true);

        alert("Por favor, completa el pago de la garantía para confirmarla.");
        
        setDatos({ fecha: '', hora: '', personas: 1, duracion: 1.5 });
        onCambioConsulta({ fecha: '', hora: '' });
    }
  };

  return (
    <div className={`card p-4 shadow-lg border border-primary border-opacity-10 rounded-4 mb-4 hover-lift ${tema === 'dark' ? 'bg-dark' : 'bg-body'}`}>
      <h3 className="fw-bold text-primary mb-4" style={{ fontFamily: 'Oswald' }}>📝 RESERVAR MESA</h3>
      
      {errorConcierto && (
        <Alert variant="danger" className="d-flex align-items-center gap-3 animate__animated animate__shakeX rounded-4 shadow-sm border-0">
            <img src="https://cdn-icons-png.flaticon.com/512/595/595067.png" alt="Alerta" style={{ width: '40px' }} />
            <div>
                <h6 className="fw-bold mb-1">¡Alerta de Seguridad!</h6>
                <p className="mb-0 small">{errorConcierto}</p>
            </div>
        </Alert>
      )}

      <Form onSubmit={enviarFormulario}>
        <div className="row">
          <Col md={6} className="mb-3">
            <Form.Label className={`fw-bold small opacity-75 ${tema === 'dark' ? 'text-light' : 'text-body'}`}>Fecha</Form.Label>
            <Form.Control type="date" name="fecha" min={hoy} value={datos.fecha} onChange={manejarCambio} required className={tema === 'dark' ? 'bg-dark text-white border-secondary' : 'bg-body text-body'} />
          </Col>
          <Col md={6} className="mb-3">
            <Form.Label className={`fw-bold small opacity-75 ${tema === 'dark' ? 'text-light' : 'text-body'}`}>Hora de Inicio (24h)</Form.Label>
            <Form.Select name="hora" value={datos.hora} onChange={manejarCambio} required className={tema === 'dark' ? 'bg-dark text-white border-secondary' : 'bg-body text-body'}>
              <option value="">Seleccione...</option>
              <option value="12:00">12:00</option>
              <option value="13:00">13:00</option>
              <option value="14:00">14:00</option>
              <option value="15:00">15:00</option>
              <option value="16:00">16:00</option>
              <option value="17:00">17:00</option>
              <option value="18:00">18:00</option>
              <option value="19:00">19:00</option>
              <option value="20:00">20:00</option>
              <option value="21:00">21:00</option>
              <option value="22:00">22:00</option>
            </Form.Select>
          </Col>
        </div>

        {errorTiempo && <Alert variant="danger" className="py-2 small mb-3 border-0 shadow-sm">{errorTiempo}</Alert>}

        <div className="row">
          <Col md={6} className="mb-3">
            <Form.Label className={`fw-bold small opacity-75 ${tema === 'dark' ? 'text-light' : 'text-body'}`}>Tiempo de Estancia</Form.Label>
            <Form.Select name="duracion" value={datos.duracion} onChange={manejarCambio} required className={tema === 'dark' ? 'bg-dark text-white border-secondary' : 'bg-body text-body'}>
              <option value="1">1 Hora</option>
              <option value="1.5">1.5 Horas</option>
              <option value="2">2 Horas</option>
            </Form.Select>
          </Col>
          <Col md={6} className="mb-3">
            <Form.Label className={`fw-bold small opacity-75 ${tema === 'dark' ? 'text-light' : 'text-body'}`}>¿Cuántas personas?</Form.Label>
            <Form.Control type="number" name="personas" min="1" max="6" value={datos.personas} onChange={manejarCambio} required className={tema === 'dark' ? 'bg-dark text-white border-secondary' : 'bg-body text-body'} />
          </Col>
        </div>

        <div className={`p-3 rounded-3 mb-4 text-center border border-secondary border-opacity-25 ${tema === 'dark' ? 'bg-secondary bg-opacity-25 text-white' : 'bg-body-tertiary text-body'}`}>
          <span className="fw-bold">Mesa seleccionada: </span>
          {mesaSeleccionada ? (
            <span className="text-primary fs-5 fw-bold">MESA {mesaSeleccionada}</span>
          ) : (
            <span className="text-secondary opacity-50">Toca una mesa en el mapa</span>
          )}
        </div>

        <Button 
          variant="primary" type="submit" 
          className="w-100 py-3 rounded-pill fw-bold shadow-sm"
          style={{ backgroundColor: 'var(--primary-color)', border: 'none' }}
          disabled={!mesaSeleccionada || !!errorTiempo}
        >
          Confirmar Reserva Segura
        </Button>
      </Form>
      <style>{`
        @keyframes shakeX {
          from, to { transform: translate3d(0, 0, 0); }
          10%, 30%, 50%, 70%, 90% { transform: translate3d(-5px, 0, 0); }
          20%, 40%, 60%, 80% { transform: translate3d(5px, 0, 0); }
        }
        .animate__shakeX { animation: shakeX 0.5s; }
      `}</style>
    </div>
  );
};

export default FormularioReserva;
