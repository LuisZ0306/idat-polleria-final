/**
 * Detecta si hay un solapamiento entre la consulta de horario del usuario y las reservas existentes.
 */
export const estaMesaOcupada = (idMesa, consulta, reservas) => {
  if (!consulta.fecha || !consulta.hora) return false;

  const [hC, mC] = consulta.hora.split(':').map(Number);
  const inicioConsulta = hC * 60 + mC;
  const finConsulta = inicioConsulta + (consulta.duracion * 60);

  return reservas.some(r => {
    if (r.fecha !== consulta.fecha || r.idMesa !== idMesa || r.estado === 'Cancelada') return false;

    const [hR, mR] = r.hora.split(':').map(Number);
    const inicioReserva = hR * 60 + mR;
    const finReserva = inicioReserva + (r.duracion * 60);

    return inicioConsulta < finReserva && finConsulta > inicioReserva;
  });
};
