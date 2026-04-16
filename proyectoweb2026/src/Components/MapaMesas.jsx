import React from 'react';
import { Row, Col, Badge } from 'react-bootstrap';
import { useGlobal } from '../Context/GlobalContext';

const MapaMesas = ({ consulta, mesaSeleccionada, alSeleccionarMesa, numPersonas }) => {
  const { reservas, mesas, tema } = useGlobal();

  const estasOcupada = (idMesa) => {
    if (!consulta.fecha || !consulta.hora) return false;
    const horasRequest = parseFloat(consulta.hora.split(':')[0]) + parseFloat(consulta.hora.split(':')[1])/60;
    const duracionReq = parseFloat(consulta.duracion || 1.5);
    const finRequest = horasRequest + duracionReq;

    return reservas.some(r => {
      if (r.mesa_id !== idMesa || r.fecha !== consulta.fecha || r.estado === 'Cancelada') return false;
      const horasR = parseFloat(r.hora.split(':')[0]) + parseFloat(r.hora.split(':')[1])/60;
      const duracionR = parseFloat(r.duracion || 1.5);
      const finR = horasR + duracionR;
      return (horasRequest < finR && finRequest > horasR);
    });
  };

  const RenderMesa = (mesa) => {
    const ocupada = estasOcupada(mesa.id);
    const enMantenimiento = mesa.estado !== 'Disponible';
    const seleccionada = mesaSeleccionada === mesa.id;
    const capacidadSuficiente = mesa.capacidad >= numPersonas;
    const noDisponible = ocupada || enMantenimiento;

    return (
      <div 
        key={mesa.id}
        onClick={() => !noDisponible && capacidadSuficiente && alSeleccionarMesa(mesa.id)}
        className={`mesa-unit d-flex flex-column align-items-center justify-content-center p-2 rounded-3 border-2 shadow-sm mb-3 ${
          enMantenimiento ? 'bg-dark border-dark text-white opacity-50' :
          ocupada ? 'bg-danger border-danger text-white' : 
          seleccionada ? 'bg-primary border-primary text-white scale-up' :
          !capacidadSuficiente ? 'bg-warning-subtle border-warning text-dark opacity-75' :
          'bg-white border-success text-success cursor-pointer'
        }`}
        style={{ height: '80px', transition: 'all 0.3s ease', cursor: noDisponible ? 'not-allowed' : 'pointer' }}
      >
        <span className="fw-bold small">M-{mesa.numero}</span>
        <div className="small" style={{fontSize: '10px'}}>Cap: {mesa.capacidad}</div>
      </div>
    );
  };

  // Filtrado inteligente por Capacidad y Lado
  const mesasFondoIzquierda = mesas.filter(m => m.capacidad >= 4 && m.lado === 'IZQUIERDA');
  const mesasFondoDerecha = mesas.filter(m => m.capacidad >= 4 && m.lado === 'DERECHA');
  const mesasEntradaIzquierda = mesas.filter(m => m.capacidad < 4 && m.lado === 'IZQUIERDA');
  const mesasEntradaDerecha = mesas.filter(m => m.capacidad < 4 && m.lado === 'DERECHA');

  return (
    <div className={`card p-4 shadow-lg border border-primary border-opacity-10 rounded-4 h-100 ${tema === 'dark' ? 'bg-dark' : 'bg-body'}`}>
      <h4 className={`fw-bold mb-4 ${tema === 'dark' ? 'text-white' : 'text-body'}`} style={{ fontFamily: 'Oswald' }}>🪑 DISTRIBUCIÓN DEL SALÓN</h4>

      <div className="salon-container p-3 rounded-4 bg-light bg-opacity-10 border border-dashed border-secondary border-opacity-25">
        
        {/* ZONA FONDO (4 PERSONAS) */}
        <div className="zona-fondo mb-4">
            <p className="text-center small text-muted text-uppercase fw-bold mb-3" style={{letterSpacing:'2px'}}>--- ZONA FAMILIAR ---</p>
            <div className="d-flex justify-content-between gap-4">
                <div className="flex-fill">{mesasFondoIzquierda.map(m => RenderMesa(m))}</div>
                <div className="pasadizo bg-secondary bg-opacity-10 rounded-pill px-2 d-flex align-items-center"><small className="text-muted fw-bold" style={{writingMode:'vertical-rl'}}>PASILLO</small></div>
                <div className="flex-fill">{mesasFondoDerecha.map(m => RenderMesa(m))}</div>
            </div>
        </div>

        {/* ZONA ENTRADA (2 PERSONAS) */}
        <div className="zona-entrada">
            <div className="d-flex justify-content-between gap-4">
                <div className="flex-fill">{mesasEntradaIzquierda.map(m => RenderMesa(m))}</div>
                <div className="pasadizo bg-secondary bg-opacity-10 rounded-pill px-2 d-flex align-items-end pb-3"><i className="bi bi-arrow-up text-muted fs-4"></i></div>
                <div className="flex-fill">{mesasEntradaDerecha.map(m => RenderMesa(m))}</div>
            </div>
            <p className="text-center small text-muted text-uppercase fw-bold mt-3" style={{letterSpacing:'2px'}}>--- 🚪 ENTRADA ---</p>
        </div>
      </div>

      <div className="mt-4 pt-3 border-top border-secondary border-opacity-25 d-flex flex-wrap gap-2 justify-content-center small fw-bold">
        <Badge bg="success" className="p-2">Libre</Badge>
        <Badge bg="primary" className="p-2">Tu Selección</Badge>
        <Badge bg="danger" className="p-2">Ocupada</Badge>
      </div>

      <style>{`
        .mesa-unit:hover { transform: translateY(-3px); }
        .scale-up { transform: scale(1.05); box-shadow: 0 5px 15px rgba(13, 110, 253, 0.3) !important; }
      `}</style>
    </div>
  );
};

export default MapaMesas;
