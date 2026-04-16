import React, { useState, useEffect } from 'react';

const CalendarioInteractivo = ({ alSeleccionarFecha }) => {
  const [fecha, setFecha] = useState('');
  const [mensajeDisponibilidad, setMensajeDisponibilidad] = useState('Seleccione una fecha para ver disponibilidad');
  const [cargando, setCargando] = useState(false);

  // Principio de Efectos Secundarios (useEffect):
  // Se dispara cada vez que la fecha cambia. Simula una llamada a la base de datos para verificar mesas.
  useEffect(() => {
    if (fecha !== '') {
      setCargando(true);
      setMensajeDisponibilidad('Verificando mesas disponibles en La Pollería...');
      
      const timer = setTimeout(() => {
        // Simulación lógica de disponibilidad: Si es domingo, hay menos disponibilidad.
        const diaSemana = new Date(fecha).getUTCDay();
        if (diaSemana === 0) { // 0 es Domingo
          setMensajeDisponibilidad('🔴 Pocas mesas disponibles para este domingo.');
        } else {
          setMensajeDisponibilidad('🟢 Mesas disponibles para esta fecha.');
        }
        setCargando(false);
      }, 1000); // Simulamos 1 segundo de latencia de red

      // Cleanup: Si el componente se desmonta o la fecha cambia rápido, limpiamos el timer
      return () => clearTimeout(timer);
    }
  }, [fecha]);

  const manejarFecha = (e) => {
    const nuevaFecha = e.target.value;
    setFecha(nuevaFecha);
    alSeleccionarFecha(nuevaFecha); // Notificamos al componente padre
  };

  return (
    <div className="card p-4 mt-3 shadow-sm border-info">
      <h4>Consulta de Disponibilidad</h4>
      <div className="mb-3">
        <input 
          type="date" 
          className="form-control" 
          onChange={manejarFecha} 
          value={fecha}
        />
      </div>
      <div className={`alert ${cargando ? 'alert-warning' : 'alert-light'} border text-center`}>
        {mensajeDisponibilidad}
      </div>
    </div>
  );
};

export default CalendarioInteractivo;
