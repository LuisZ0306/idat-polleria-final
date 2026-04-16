import React from 'react';

const ListaReservas = ({ reservas }) => {
  return (
    <div className="card p-4 shadow-sm h-100">
      <h3 className="mb-4 text-primary">Vista de Administrador</h3>
      <h5>Total de Reservas: {reservas.length}</h5>
      <hr />
      
      {reservas.length === 0 ? (
        <div className="alert alert-info">No hay reservas registradas por el momento.</div>
      ) : (
        <div className="list-group">
          {reservas.map((reserva, index) => (
            <div key={index} className="list-group-item list-group-item-action">
              <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">{reserva.nombre}</h5>
                <small className="badge bg-primary rounded-pill">Personas: {reserva.personas}</small>
              </div>
              <p className="mb-1">
                <strong>📅 Fecha:</strong> {reserva.fecha} <br />
                <strong>⏰ Hora:</strong> {reserva.hora}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListaReservas;
