import React, { useState } from 'react';
import { Container, Row, Col, Card, Table, Badge, Tab, Nav, Button, Modal } from 'react-bootstrap';
import { useGlobal } from '../Context/GlobalContext';

const PerfilPage = () => {
  const { 
    usuarioActual: usuario, 
    reservas, 
    ventas, 
    eliminarReserva: onCancelarReserva,
    agregarAlCarrito,
    setShowCarrito,
    tema 
  } = useGlobal();

  const esEmpleado = usuario.rol === 'empleado' || usuario.rol === 'admin';
  const [pedidoParaBoleta, setPedidoParaBoleta] = useState(null);

  const misReservas = esEmpleado ? reservas : reservas.filter(r => r.usuario_id == usuario.id);
  const misCompras = esEmpleado ? ventas : ventas.filter(v => v.usuario_id == usuario.id);

  const pagarReserva = (r) => {
    agregarAlCarrito({
        id: `reserva_${r.id}`,
        nombre: `Garantía de Reserva (Mesa ${r.mesa_id})`,
        precio: 15.00,
        cantidad: 1,
        esReserva: true,
        reservaId: r.id,
        img: "https://cdn-icons-png.flaticon.com/512/2612/2612140.png"
    });
    setShowCarrito(true);
    alert("Añadida al carrito. Completa el pago para confirmar tu mesa.");
  };

  const imprimirBoleta = () => { window.print(); };

  return (
    <Container className="py-5 min-vh-100">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .seccion-boleta, .seccion-boleta * { visibility: visible; }
          .seccion-boleta { position: absolute; left: 0; top: 0; width: 100%; color: black !important; background: white !important; }
          .no-print { display: none !important; }
        }
        .boleta-paper {
            background-color: #fff !important;
            color: #000 !important;
            font-family: 'Courier New', Courier, monospace;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        .boleta-paper * {
            color: #000 !important;
        }
      `}</style>

      <Row className="mb-4 no-print">
        <Col>
          <div className="bg-primary text-white p-5 rounded-4 shadow-lg d-flex justify-content-between align-items-center">
            <div>
              <h1 className="fw-bold mb-1" style={{ fontFamily: 'Oswald' }}>MI PERFIL</h1>
              <p className="mb-0 opacity-75">{usuario.nombre} {usuario.apellido} | {usuario.email}</p>
              <p className="small mb-0 mt-2"><Badge bg="light" text="dark">{usuario.tipo_doc}: {usuario.num_doc}</Badge></p>
            </div>
            <Badge bg="warning" text="dark" className="p-2 px-3 fs-6 text-uppercase fw-bold">{usuario.rol}</Badge>
          </div>
        </Col>
      </Row>

      <Tab.Container defaultActiveKey="reservas">
        <Row className="no-print">
          <Col lg={3} className="mb-4">
            <Nav variant="pills" className="flex-column bg-body shadow-sm rounded-4 p-2 border border-secondary border-opacity-25">
              <Nav.Item><Nav.Link eventKey="reservas" className="py-3 fw-bold nav-link-custom">📅 Mis Reservas</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link eventKey="compras" className="py-3 fw-bold nav-link-custom">🍗 Mis Compras</Nav.Link></Nav.Item>
            </Nav>
          </Col>

          <Col lg={9}>
            <Tab.Content>
              <Tab.Pane eventKey="reservas">
                <Card className="border-0 shadow-sm rounded-4 overflow-hidden bg-body">
                  <Card.Header className="bg-body py-3 px-4 border-bottom border-secondary border-opacity-25">
                    <h4 className="fw-bold mb-0 text-body" style={{ fontFamily: 'Oswald' }}>HISTORIAL DE RESERVAS</h4>
                  </Card.Header>
                  <Table responsive hover className="mb-0 align-middle text-body">
                    <thead className="bg-body-tertiary">
                      <tr>
                        <th className="px-4 py-3">Mesa</th>
                        <th className="py-3">Fecha y Hora</th>
                        <th className="py-3">Estado</th>
                        <th className="text-center py-3">Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {misReservas.length === 0 ? <tr><td colSpan="4" className="text-center py-4">No tienes reservas aún.</td></tr> : 
                        [...misReservas].reverse().map((r, i) => (
                        <tr key={i}>
                          <td className="px-4"><Badge bg="dark" className="rounded-pill px-3">Mesa {r.mesa_id}</Badge></td>
                          <td>
                            <div className="fw-bold">{r.fecha}</div>
                            <small className="text-muted">{r.hora} ({r.duracion}h)</small>
                          </td>
                          <td>
                            <Badge bg={
                              r.estado === 'Pendiente' ? 'warning text-dark' : 
                              r.estado === 'Confirmada' ? 'success' : 
                              r.estado === 'Completada' ? 'info' : 
                              'secondary'
                            } className="px-3 py-2 rounded-pill">
                              {r.estado.toUpperCase()}
                            </Badge>
                          </td>
                          <td className="text-center">
                            <div className="d-flex gap-2 justify-content-center">
                                {r.estado === 'Pendiente' && !esEmpleado && (
                                    <Button variant="success" size="sm" className="fw-bold rounded-pill px-3" onClick={() => pagarReserva(r)}>💳 PAGAR</Button>
                                )}
                                {!esEmpleado && r.estado !== 'Cancelada' && r.estado !== 'Completada' && (
                                    <Button variant="outline-danger" size="sm" className="rounded-pill" onClick={() => { if(window.confirm('¿Cancelar reserva?')) onCancelarReserva(r.id) }}>Cancelar</Button>
                                )}
                                {esEmpleado && <small className="text-muted">Gestionar en Admin</small>}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card>
              </Tab.Pane>

              <Tab.Pane eventKey="compras">
                <Card className="border-0 shadow-sm rounded-4 overflow-hidden bg-body">
                  <Card.Header className="bg-body py-3 px-4 border-bottom border-secondary border-opacity-25">
                    <h4 className="fw-bold mb-0 text-body" style={{ fontFamily: 'Oswald' }}>HISTORIAL DE COMPRAS</h4>
                  </Card.Header>
                  <Table responsive hover className="mb-0 align-middle text-body">
                    <thead className="bg-body-tertiary">
                      <tr>
                        <th className="px-4 py-3">ID Venta</th>
                        <th className="py-3">Fecha</th>
                        <th className="py-3">Total</th>
                        <th className="py-3">Pago</th>
                        <th className="text-center py-3">Boleta</th>
                      </tr>
                    </thead>
                    <tbody>
                      {misCompras.length === 0 ? <tr><td colSpan="5" className="text-center py-4">No has realizado compras aún.</td></tr> : 
                        misCompras.map((v, i) => (
                        <tr key={i}>
                          <td className="px-4 fw-bold">#{v.id}</td>
                          <td>{v.fecha ? new Date(v.fecha).toLocaleDateString() : 'Hoy'}</td>
                          <td className="text-danger fw-bold">S/ {parseFloat(v.total).toFixed(2)}</td>
                          <td><Badge bg="info" text="dark">{v.metodo_pago}</Badge></td>
                          <td className="text-center">
                            <Button variant="outline-primary" size="sm" onClick={() => setPedidoParaBoleta(v)}>🧾 Ver Boleta</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card>
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>

      {/* MODAL DE BOLETA CON DATOS REALES DEL FOOTER */}
      <Modal show={!!pedidoParaBoleta} onHide={() => setPedidoParaBoleta(null)} size="md" centered className="no-print">
        <Modal.Header closeButton className={tema === 'dark' ? 'bg-dark text-white border-0' : 'bg-light border-0'}>
          <Modal.Title className="fw-bold">BOLETA ELECTRÓNICA</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0" style={{ backgroundColor: '#f8f9fa' }}>
          {pedidoParaBoleta && (
            <div className="seccion-boleta p-4 boleta-paper mx-auto my-3" style={{ maxWidth: '400px', border: '1px solid #ddd' }}>
              <div className="text-center mb-4 border-bottom border-dark pb-3">
                <h4 className="fw-bold mb-0">POLLERÍA D' ELÍ</h4>
                <p className="small mb-0">RUC: 20600000001</p>
                {/* DATOS REALES DEL FOOTER */}
                <p className="small mb-0">📍 Av. Arenal 123, Nauta</p>
                <p className="small mb-0">📞 (01) 234-5678 | 📱 919723937</p>
                <p className="small mb-0">---------------------------</p>
              </div>
              
              <div className="mb-3 small">
                <p className="mb-1"><strong>N° BOLETA:</strong> 001-000{pedidoParaBoleta.id}</p>
                <p className="mb-1"><strong>FECHA:</strong> {pedidoParaBoleta.fecha ? new Date(pedidoParaBoleta.fecha).toLocaleString() : new Date().toLocaleString()}</p>
                <p className="mb-1"><strong>CLIENTE:</strong> {usuario.nombre.toUpperCase()} {usuario.apellido.toUpperCase()}</p>
                <p className="mb-1"><strong>{usuario.tipo_doc}:</strong> {usuario.num_doc}</p>
                <p className="mb-0">---------------------------</p>
              </div>

              <div className="mb-3 small">
                <div className="d-flex justify-content-between fw-bold mb-1">
                    <span style={{width: '60%'}}>DESCRIPCIÓN</span>
                    <span style={{width: '15%'}} className="text-center">CANT</span>
                    <span style={{width: '25%'}} className="text-end">TOTAL</span>
                </div>
                {pedidoParaBoleta.detalles && pedidoParaBoleta.detalles.map((det, idx) => (
                    <div key={idx} className="d-flex justify-content-between mb-1">
                        <span style={{width: '60%'}} className="text-uppercase">{det.producto?.nombre || 'Producto'}</span>
                        <span style={{width: '15%'}} className="text-center">{det.cantidad}</span>
                        <span style={{width: '25%'}} className="text-end">S/ {(det.precio_unitario * det.cantidad).toFixed(2)}</span>
                    </div>
                ))}
                <p className="mb-0">---------------------------</p>
              </div>

              <div className="text-end pt-2">
                <h5 className="fw-bold mb-0">TOTAL A PAGAR: S/ {parseFloat(pedidoParaBoleta.total).toFixed(2)}</h5>
                <p className="small mb-0">MÉTODO DE PAGO: {pedidoParaBoleta.metodo_pago}</p>
              </div>

              <div className="text-center mt-4 pt-3 border-top border-dark border-dashed small">
                <p className="mb-1">¡Gracias por su compra!</p>
                <p className="mb-0 fw-bold">SABOR QUE TE HACE VOLVER</p>
                <p className="small opacity-75">{usuario.email}</p>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className={tema === 'dark' ? 'bg-dark border-0' : 'bg-light border-0'}>
          <Button variant="secondary" className="rounded-pill px-4" onClick={() => setPedidoParaBoleta(null)}>Cerrar</Button>
          <Button variant="danger" className="rounded-pill px-4 fw-bold" onClick={imprimirBoleta}>🖨️ Imprimir Ticket</Button>
        </Modal.Footer>
      </Modal>

      <style>{`
        .nav-link-custom { color: var(--bs-body-color); opacity: 0.7; }
        .nav-link-custom.active { background-color: var(--primary-color) !important; color: white !important; opacity: 1; }
      `}</style>
    </Container>
  );
};

export default PerfilPage;
